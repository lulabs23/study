// Récupère l'emploi du temps Unicaen (agenda « Emploi du temps » du webmail)
// et l'écrit dans le fichier edt.json du Gist de l'application Études.
//
// Lancé par .github/workflows/edt-unicaen.yml. Secrets du dépôt utilisés :
//   UNICAEN_USER      identifiant de l'ENT (sans ou avec @etu.unicaen.fr)
//   UNICAEN_PASSWORD  mot de passe de l'ENT
//   GIST_TOKEN        token GitHub avec accès aux Gists (le même que dans l'application)
//   GIST_ID           facultatif : identifiant du Gist (sinon recherché automatiquement)
// Rien n'est écrit dans le journal à part des compteurs.

const env = process.env;
const UTILISATEUR = (env.UNICAEN_USER || '').trim();
const MOT_DE_PASSE = env.UNICAEN_PASSWORD || '';
const TOKEN = (env.GIST_TOKEN || '').trim();
let gistId = (env.GIST_ID || '').trim();
const SERVEUR = (env.UNICAEN_SERVEUR || 'https://webmail.unicaen.fr').replace(/\/+$/, '');
const AGENDA = env.UNICAEN_AGENDA || 'Emploi du temps';
const AVANT = Math.max(0, parseInt(env.EDT_SEMAINES_AVANT || '2', 10) || 0);
const APRES = Math.max(1, parseInt(env.EDT_SEMAINES_APRES || '16', 10) || 16);
const FICHIER_DONNEES = 'etudes-data.json';
const FICHIER_EDT = 'edt.json';
const JOURS_CONSERVES = 400;

const echec = (msg) => { console.error(`::error::${msg}`); process.exit(1); };

if (!UTILISATEUR || !MOT_DE_PASSE || !TOKEN) {
  console.log('Secrets UNICAEN_USER, UNICAEN_PASSWORD ou GIST_TOKEN absents : rien à faire.');
  process.exit(0);
}

// ---------- Dates ----------
const pad = (n) => String(n).padStart(2, '0');
const jourUTC = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
const ajouterJours = (d, n) => new Date(d.getTime() + n * 86400000);
const lundiDe = (d) => { const j = jourUTC(d); return ajouterJours(j, -((j.getUTCDay() + 6) % 7)); };
const formatZimbra = (d) => `${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${pad(d.getUTCDate())}`;

// Heure locale de Paris (« 20261124T083000 ») vers instant UTC
const parisVersUTC = (texte) => {
  const m = String(texte).match(/^(\d{4})(\d{2})(\d{2})T?(\d{2})?(\d{2})?(\d{2})?(Z)?$/);
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0', z] = m;
  const naif = Date.UTC(+y, +mo - 1, +d, +h, +mi, +s);
  if (z) return naif;
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const parts = Object.fromEntries(fmt.formatToParts(new Date(naif)).map(p => [p.type, p.value]));
  const vuParis = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return naif - (vuParis - naif);
};
const instant = (x) => {
  if (!x) return null;
  if (typeof x.u === 'number') return x.u;
  if (x.d) return parisVersUTC(x.d);
  return null;
};

// ---------- Webmail Unicaen ----------
const maintenant = new Date();
const debutPlage = ajouterJours(lundiDe(maintenant), -7 * AVANT);
const finPlage = ajouterJours(lundiDe(maintenant), 7 * APRES + 7);

const telecharger = (compte) => fetch(
  `${SERVEUR}/home/${encodeURIComponent(compte).replace(/%40/g, '@')}/${encodeURIComponent(AGENDA)}?auth=ba&fmt=json&start=${formatZimbra(debutPlage)}&end=${formatZimbra(finPlage)}`,
  {
    headers: {
      Authorization: `Basic ${Buffer.from(`${compte}:${MOT_DE_PASSE}`).toString('base64')}`,
      Accept: 'application/json',
      'User-Agent': 'Etudes (GitHub Actions)',
    },
  },
);

let reponse;
try {
  reponse = await telecharger(UTILISATEUR);
  if (reponse.status === 401 || reponse.status === 404) {
    const autre = UTILISATEUR.includes('@') ? UTILISATEUR.split('@')[0] : `${UTILISATEUR}@etu.unicaen.fr`;
    reponse = await telecharger(autre);
  }
} catch (e) {
  echec(`Webmail Unicaen injoignable (${e.cause?.code || e.message}).`);
}
if (reponse.status === 401) echec('Identifiants Unicaen refusés (401). Vérifier UNICAEN_USER et UNICAEN_PASSWORD.');
if (reponse.status === 404) echec(`Agenda « ${AGENDA} » introuvable (404).`);
if (!reponse.ok) echec(`Webmail Unicaen : réponse ${reponse.status}.`);

const texte = await reponse.text();
let corps = {};
if (texte.trim()) {
  try { corps = JSON.parse(texte); } catch { echec('Réponse du webmail illisible (JSON attendu).'); }
}

const cours = [];
for (const a of corps.appt || []) {
  const inv = (a.inv || [])[0];
  const comp = inv && (inv.comp || [])[0];
  if (!comp) continue;
  const titre = comp.name || a.name || '';
  const lieu = comp.loc || a.loc || '';
  const description = (comp.desc && comp.desc[0] && comp.desc[0]._content) || comp.fr || a.fr || '';
  const s = instant(comp.s && comp.s[0]);
  const e = instant(comp.e && comp.e[0]);
  const dureeMs = s !== null && e !== null && e > s ? e - s : (a.dur || 3600000);
  const debuts = Array.isArray(a.inst) && a.inst.some(i => typeof i.s === 'number')
    ? a.inst.filter(i => typeof i.s === 'number').map(i => i.s)
    : (s !== null ? [s] : []);
  const base = a.uid || inv.uid || comp.uid || a.id || inv.id || titre;
  for (const debut of debuts) {
    cours.push({
      id: `${base}_${debut}`,
      debut: new Date(debut).toISOString(),
      fin: new Date(debut + dureeMs).toISOString(),
      titre,
      lieu,
      description,
    });
  }
}

// ---------- Gist ----------
const gh = async (chemin, options = {}) => {
  const res = await fetch(`https://api.github.com${chemin}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (!res.ok) echec(`GitHub : ${options.method || 'GET'} ${chemin.split('?')[0].replace(/[0-9a-f]{20,}/, '…')} → ${res.status}.`);
  return res.json();
};

if (!gistId) {
  for (let page = 1; page <= 5 && !gistId; page++) {
    const liste = await gh(`/gists?per_page=100&page=${page}`);
    const trouve = liste.find(g => g.files && g.files[FICHIER_DONNEES]);
    if (trouve) gistId = trouve.id;
    if (liste.length < 100) break;
  }
  if (!gistId) echec(`Aucun Gist contenant ${FICHIER_DONNEES} : connecter d'abord l'application à GitHub.`);
}

// Les cours passés, hors de la plage téléchargée, sont conservés pour l'historique
const gist = await gh(`/gists/${gistId}`);
let anciens = [];
const fichier = gist.files && gist.files[FICHIER_EDT];
if (fichier) {
  try {
    const contenu = fichier.truncated ? await (await fetch(fichier.raw_url)).text() : fichier.content;
    const limite = ajouterJours(maintenant, -JOURS_CONSERVES).toISOString();
    anciens = (JSON.parse(contenu).cours || []).filter(c => c.debut < debutPlage.toISOString() && c.debut >= limite);
  } catch { anciens = []; }
}

const tous = [...anciens, ...cours].sort((x, y) => x.debut.localeCompare(y.debut));
const edt = {
  version: 1,
  source: 'unicaen',
  majLe: maintenant.toISOString(),
  plage: { debut: debutPlage.toISOString(), fin: finPlage.toISOString() },
  cours: tous,
};

await gh(`/gists/${gistId}`, {
  method: 'PATCH',
  body: JSON.stringify({ files: { [FICHIER_EDT]: { content: JSON.stringify(edt) } } }),
});

console.log(`${cours.length} cours récupérés (${formatZimbra(debutPlage)} → ${formatZimbra(finPlage)}), ${anciens.length} conservés.`);
