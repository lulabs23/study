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
let compte = UTILISATEUR;
try {
  reponse = await telecharger(UTILISATEUR);
  if (reponse.status === 401 || reponse.status === 404) {
    compte = UTILISATEUR.includes('@') ? UTILISATEUR.split('@')[0] : `${UTILISATEUR}@etu.unicaen.fr`;
    reponse = await telecharger(compte);
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

// ---------- Mails (boîte de réception, corps complet) ----------
// Via l'API SOAP de Zimbra, en JSON. Le corps est ramené en texte et plafonné.
// Repli sur l'aperçu (REST) si le SOAP échoue. Expéditeur, objet, date, corps.
const MAILS_ACTIFS = !/^(non|0|false)$/i.test(env.MAILS || '');
const NB_MAILS = Math.min(60, Math.max(5, parseInt(env.MAILS_NB || '40', 10) || 40));
const CORPS_MAX = 8000;

const stripHtml = (html) => String(html || '')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<\/(p|div|tr|li|h[1-6]|br)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&[a-z]+;/gi, ' ')
  .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();

// Parcourt les parties MIME et en extrait le texte (préférence au text/plain)
const corpsDepuisParties = (parts, prof = 0) => {
  let plain = '', html = '';
  for (const mp of parts || []) {
    if (mp.mp) { const sous = corpsDepuisParties(mp.mp, prof + 1); plain += sous.plain; html += sous.html; }
    const ct = mp.ct || '';
    const contenu = (mp.content && mp.content[0] && mp.content[0]._content) || (typeof mp.content === 'string' ? mp.content : '');
    if (!contenu) continue;
    if (/text\/plain/i.test(ct)) plain += contenu + '\n';
    else if (/text\/html/i.test(ct)) html += contenu + '\n';
  }
  return { plain, html };
};

const soap = async (requete, authToken) => {
  const enveloppe = {
    Header: authToken ? { context: { _jsns: 'urn:zimbra', authToken } } : undefined,
    Body: requete,
  };
  const r = await fetch(`${SERVEUR}/service/soap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Etudes (GitHub Actions)' },
    body: JSON.stringify(enveloppe),
  });
  const j = await r.json();
  if (j.Body && j.Body.Fault) throw new Error(j.Body.Fault.Reason?.Text || 'SOAP Fault');
  return j.Body;
};

let mails = null;
if (MAILS_ACTIFS) {
  try {
    const auth = await soap({ AuthRequest: { _jsns: 'urn:zimbraAccount', account: { by: 'name', _content: compte }, password: { _content: MOT_DE_PASSE } } });
    const authToken = auth.AuthResponse.authToken[0]._content;
    const rep = await soap({
      SearchRequest: { _jsns: 'urn:zimbraMail', types: 'message', fetch: 'all', html: 0, needExp: 0, limit: NB_MAILS, query: { _content: 'in:inbox' } },
    }, authToken);
    mails = (rep.SearchResponse.m || []).map(m => {
      const exp = (m.e || []).find(x => x.t === 'f') || {};
      const { plain, html } = corpsDepuisParties(m.mp);
      const corps = (plain.trim() ? plain : stripHtml(html)).replace(/\n{3,}/g, '\n\n').trim().slice(0, CORPS_MAX);
      return {
        id: String(m.id),
        de: exp.p || exp.d || exp.a || '',
        adresse: exp.a || '',
        sujet: m.su || '',
        date: new Date(Number(m.d) || Date.now()).toISOString(),
        extrait: String(m.fr || corps.slice(0, 200)).slice(0, 300),
        corps,
        nonLu: /u/.test(m.f || ''),
        pj: /a/.test(m.f || ''),
      };
    }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, NB_MAILS);
  } catch (eSoap) {
    // Repli : liste simple sans corps (aperçu uniquement)
    try {
      const r = await fetch(`${SERVEUR}/home/${encodeURIComponent(compte).replace(/%40/g, '@')}/inbox?fmt=json&limit=${NB_MAILS}`, {
        headers: { Authorization: `Basic ${Buffer.from(`${compte}:${MOT_DE_PASSE}`).toString('base64')}`, Accept: 'application/json', 'User-Agent': 'Etudes (GitHub Actions)' },
      });
      if (!r.ok) throw new Error(`REST ${r.status}`);
      const j = JSON.parse((await r.text()) || '{}');
      mails = (j.m || []).map(m => {
        const exp = (m.e || []).find(x => x.t === 'f') || {};
        return { id: String(m.id), de: exp.p || exp.d || exp.a || '', adresse: exp.a || '', sujet: m.su || '',
          date: new Date(Number(m.d) || Date.now()).toISOString(), extrait: String(m.fr || '').slice(0, 300), corps: '',
          nonLu: /u/.test(m.f || ''), pj: /a/.test(m.f || '') };
      }).sort((a, b) => b.date.localeCompare(a.date)).slice(0, NB_MAILS);
      console.log(`::warning::Corps des mails indisponible (SOAP : ${eSoap.message}), aperçu seul.`);
    } catch (eRest) {
      console.log(`::warning::Mails non récupérés (SOAP : ${eSoap.message} ; REST : ${eRest.message}).`);
    }
  }
}

// ---------- Moodle (jeton de service, facultatif) ----------
// Si le secret MOODLE_TOKEN est présent : cours et notes par l'API REST, sans la grille.
const MOODLE_TOKEN = (env.MOODLE_TOKEN || '').trim();
const MOODLE_URL = (env.MOODLE_URL || 'https://ecampus-vert.unicaen.fr').replace(/\/+$/, '');
let moodle = null;
if (MOODLE_TOKEN) {
  const moodleRest = async (fn, params = {}) => {
    const body = new URLSearchParams({ wstoken: MOODLE_TOKEN, wsfunction: fn, moodlewsrestformat: 'json', ...params });
    const r = await fetch(`${MOODLE_URL}/webservice/rest/server.php`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'Etudes (GitHub Actions)' }, body });
    const j = await r.json();
    if (j && j.exception) throw new Error(j.errorcode || j.message || fn);
    return j;
  };
  try {
    const info = await moodleRest('core_webservice_get_site_info');
    const userid = info.userid;
    const fns = new Set((info.functions || []).map(f => f.name));
    let coursListe = [];
    if (fns.has('core_enrol_get_users_courses')) coursListe = await moodleRest('core_enrol_get_users_courses', { userid });
    let notes = [];
    if (fns.has('gradereport_overview_get_course_grades')) {
      const g = await moodleRest('gradereport_overview_get_course_grades');
      notes = (g.grades || []).map(x => ({ coursId: x.courseid, note: x.grade, brut: x.rawgrade }));
    }
    const notesParCours = Object.fromEntries(notes.map(n => [n.coursId, n]));
    moodle = {
      majLe: maintenant.toISOString(),
      source: 'jeton',
      cours: (coursListe || []).map(c => ({ id: c.id, nom: c.fullname, court: c.shortname, progression: typeof c.progress === 'number' ? c.progress : null,
        note: notesParCours[c.id] ? notesParCours[c.id].note : null })),
    };
    console.log(`Moodle : ${moodle.cours.length} cours, ${notes.filter(n => n.note && n.note !== '-').length} notes.`);
  } catch (e) {
    console.log(`::warning::Moodle non récupéré (${e.message}).`);
  }
}

// ---------- Gist ----------// ---------- Gist ----------
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
let anciensMails = [];
let anciensMoodle = null;
const fichier = gist.files && gist.files[FICHIER_EDT];
if (fichier) {
  try {
    const contenu = JSON.parse(fichier.truncated ? await (await fetch(fichier.raw_url)).text() : fichier.content);
    const limite = ajouterJours(maintenant, -JOURS_CONSERVES).toISOString();
    anciens = (contenu.cours || []).filter(c => c.debut < debutPlage.toISOString() && c.debut >= limite);
    anciensMails = contenu.mails || [];
    anciensMoodle = contenu.moodle || null;
  } catch { anciens = []; }
}

const tous = [...anciens, ...cours].sort((x, y) => x.debut.localeCompare(y.debut));
const edt = {
  version: 1,
  source: 'unicaen',
  majLe: maintenant.toISOString(),
  plage: { debut: debutPlage.toISOString(), fin: finPlage.toISOString() },
  cours: tous,
  mails: mails || anciensMails,
  moodle: moodle || anciensMoodle,
};

await gh(`/gists/${gistId}`, {
  method: 'PATCH',
  body: JSON.stringify({ files: { [FICHIER_EDT]: { content: JSON.stringify(edt) } } }),
});

console.log(`${cours.length} cours récupérés (${formatZimbra(debutPlage)} → ${formatZimbra(finPlage)}), ${anciens.length} conservés${mails ? `, ${mails.length} mails` : ''}.`);
