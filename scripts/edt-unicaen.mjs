// Récupère l'emploi du temps Unicaen (agenda « Emploi du temps » du webmail)
// et l'écrit dans le fichier edt.json du Gist de l'application Études.
//
// Lancé par .github/workflows/edt-unicaen.yml. Secrets du dépôt utilisés :
//   UNICAEN_USER      identifiant de l'ENT (sans ou avec @etu.unicaen.fr)
//   UNICAEN_PASSWORD  mot de passe de l'ENT
//   GIST_TOKEN        token GitHub avec accès aux Gists (le même que dans l'application)
//   GIST_ID           facultatif : identifiant du Gist (sinon recherché automatiquement)
// Envoie aussi les réponses déposées dans la boîte d'envoi de l'application
// et marque comme lus sur le webmail les mails ouverts dans l'application.
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
let anciensMails = [];
let envoyes = [];
let ancienneSignature = '';
let ancienneSignatureHtml = '';
const fichier = gist.files && gist.files[FICHIER_EDT];
if (fichier) {
  try {
    const contenu = JSON.parse(fichier.truncated ? await (await fetch(fichier.raw_url)).text() : fichier.content);
    const limite = ajouterJours(maintenant, -JOURS_CONSERVES).toISOString();
    anciens = (contenu.cours || []).filter(c => c.debut < debutPlage.toISOString() && c.debut >= limite);
    anciensMails = contenu.mails || [];
    envoyes = Array.isArray(contenu.envoyes) ? contenu.envoyes : [];
    ancienneSignature = typeof contenu.signature === 'string' ? contenu.signature : '';
    ancienneSignatureHtml = typeof contenu.signatureHtml === 'string' ? contenu.signatureHtml : '';
  } catch { anciens = []; }
}

// Données de l'application : mails lus et réponses à envoyer
let donnees = {};
const fichierDonnees = gist.files && gist.files[FICHIER_DONNEES];
if (fichierDonnees) {
  try { donnees = JSON.parse(fichierDonnees.truncated ? await (await fetch(fichierDonnees.raw_url)).text() : fichierDonnees.content) || {}; } catch { donnees = {}; }
}

// ---------- Mails (boîte de réception, corps complet) ----------
// Via l'API SOAP de Zimbra, en JSON. Le corps est ramené en texte et plafonné.
// Repli sur l'aperçu (REST) si le SOAP échoue. Expéditeur, objet, date, corps.
const MAILS_ACTIFS = !/^(non|0|false)$/i.test(env.MAILS || '');
const NB_MAILS = Math.min(60, Math.max(5, parseInt(env.MAILS_NB || '40', 10) || 40));
const CORPS_MAX = 8000;

// Entités HTML courantes (accents français compris)
const ENTITES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'",
  eacute: 'é', egrave: 'è', ecirc: 'ê', euml: 'ë', agrave: 'à', acirc: 'â', auml: 'ä', ccedil: 'ç',
  icirc: 'î', iuml: 'ï', ocirc: 'ô', ouml: 'ö', ugrave: 'ù', ucirc: 'û', uuml: 'ü', yuml: 'ÿ',
  Eacute: 'É', Egrave: 'È', Ecirc: 'Ê', Euml: 'Ë', Agrave: 'À', Acirc: 'Â', Ccedil: 'Ç',
  Icirc: 'Î', Iuml: 'Ï', Ocirc: 'Ô', Ugrave: 'Ù', Ucirc: 'Û', Uuml: 'Ü',
  oelig: 'œ', OElig: 'Œ', aelig: 'æ', AElig: 'Æ', laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘',
  ldquo: '“', rdquo: '”', hellip: '…', ndash: '–', mdash: '—', euro: '€', deg: '°', copy: '©',
  reg: '®', trade: '™', middot: '·', bull: '•', times: '×', shy: '', zwnj: '', zwj: '',
};
const decoderEntites = (t) => String(t)
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
  .replace(/&([a-z]+);/gi, (m, nom) => (ENTITES[nom] !== undefined ? ENTITES[nom] : (nom === 'amp' ? '&' : ' ')));

const stripHtml = (html) => decoderEntites(String(html || '')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<\/(p|div|tr|li|h[1-6]|br)>/gi, '\n').replace(/<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, ' '))
  .replace(/[ \t]+\n/g, '\n').replace(/\n[ \t]+/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]{2,}/g, ' ').trim();

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
let authToken = null;
if (MAILS_ACTIFS) {
  try {
    const auth = await soap({ AuthRequest: { _jsns: 'urn:zimbraAccount', account: { by: 'name', _content: compte }, password: { _content: MOT_DE_PASSE } } });
    authToken = auth.AuthResponse.authToken[0]._content;
    const rep = await soap({
      SearchRequest: { _jsns: 'urn:zimbraMail', types: 'message', fetch: 'all', html: 0, needExp: 0, limit: NB_MAILS, query: { _content: 'in:inbox' } },
    }, authToken);
    mails = (rep.SearchResponse.m || []).map(m => {
      const exp = (m.e || []).find(x => x.t === 'f') || {};
      const repA = (m.e || []).find(x => x.t === 'r') || {};
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
        repondu: /r/.test(m.f || ''),
        repondreA: repA.a || exp.a || '',
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


// ---------- Signature du webmail (celle des réponses, sinon celle par défaut) ----------
let signature = '';
let signatureHtml = '';
// Nettoyage minimal du HTML de la signature (aucun script ni gestionnaire d'évènement)
const htmlSur = (h) => String(h || '')
  .replace(/<(script|style|iframe|object|embed|form)[\s\S]*?<\/\1>/gi, '')
  .replace(/<(script|iframe|object|embed|form|meta|link)\b[^>]*>/gi, '')
  .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)\s*=\s*(["'])\s*javascript:[^"']*\2/gi, '$1="#"')
  .trim();
// Texte d'une signature HTML : les liens gardent leur adresse (« LinkedIn (https://…) »)
const texteDeSignature = (h) => stripHtml(String(h || '').replace(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, dedans) => {
  const t = stripHtml(dedans);
  if (/^(mailto|tel):/i.test(href)) return t || href.replace(/^\w+:/, '');
  if (!t && /^https?:\/\/(www\.)?mysignature\.io\b/i.test(href)) return '';
  return t && t !== href ? `${t} (${href})` : href;
}));
if (authToken) {
  try {
    const attrsDe = (o) => {
      if (!o) return {};
      if (o._attrs) return o._attrs;
      return Object.fromEntries((o.a || []).map(a => [a.n || a.name, a._content]));
    };
    const [rid, rsig] = await Promise.all([
      soap({ GetIdentitiesRequest: { _jsns: 'urn:zimbraAccount' } }, authToken),
      soap({ GetSignaturesRequest: { _jsns: 'urn:zimbraAccount' } }, authToken),
    ]);
    const identites = (rid.GetIdentitiesResponse && rid.GetIdentitiesResponse.identity) || [];
    const attrs = attrsDe(identites.find(i => i.name === 'DEFAULT') || identites[0]);
    const liste = (rsig.GetSignaturesResponse && rsig.GetSignaturesResponse.signature) || [];
    const choisie = liste.find(x => x.id === attrs.zimbraPrefForwardReplySignatureId)
      || liste.find(x => x.id === attrs.zimbraPrefDefaultSignatureId)
      || liste[0];
    if (choisie) {
      const contenus = Array.isArray(choisie.content) ? choisie.content : (choisie.content ? [choisie.content] : []);
      const txt = contenus.find(x => /text\/plain/i.test(x.type || ''));
      const html = contenus.find(x => /text\/html/i.test(x.type || ''));
      signatureHtml = html && html._content ? htmlSur(html._content) : '';
      signature = (signatureHtml ? texteDeSignature(signatureHtml) : (txt && txt._content) || '').replace(/\r\n?/g, '\n')
        .split('\n').map(l => l.trim()).join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }
  } catch (e) {
    console.log(`::warning::Signature non récupérée (${e.message}).`);
  }
}

// ---------- Actions demandées depuis l'application ----------
// Réponses de la boîte d'envoi (3 essais au plus), puis mails lus marqués comme lus sur le webmail.
if (authToken) {
  const boite = Array.isArray(donnees.boiteEnvoi) ? donnees.boiteEnvoi : [];
  let nbEnvois = 0;
  for (const r of boite) {
    const deja = envoyes.find(x => x.id === r.id);
    if (deja && (deja.ok || (deja.tentatives || 0) >= 3)) continue;
    if (!r || !r.id || !r.a || !String(r.corps || '').trim()) continue;
    const texteFinal = r.citation !== undefined
      ? `${String(r.corps).trim()}${signature ? `\n\n${signature}` : ''}${String(r.citation || '')}`
      : String(r.corps);
    let mp = [{ ct: 'text/plain', content: { _content: texteFinal } }];
    if (r.citation !== undefined && signatureHtml) {
      const echapper = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const enHtml = (t) => echapper(t).replace(/\n/g, '<br>');
      const lignes = String(r.citation || '').trim().split('\n');
      const entete = lignes.filter(l => !/^>/.test(l)).join('\n').trim();
      const cite = lignes.filter(l => /^>/.test(l)).map(l => l.replace(/^> ?/, '')).join('\n');
      const html = `<div style="font-family: arial, helvetica, sans-serif; font-size: 12pt; color: #000000">`
        + `<div>${enHtml(String(r.corps).trim())}</div><br>`
        + `<div>${signatureHtml}</div>`
        + (entete || cite ? `<br><hr><div>${enHtml(entete)}</div><blockquote style="border-left: 2px solid #1010FF; margin-left: 5px; padding-left: 5px; color: #000;">${enHtml(cite)}</blockquote>` : '')
        + `</div>`;
      mp = [{ ct: 'multipart/alternative', mp: [{ ct: 'text/plain', content: { _content: texteFinal } }, { ct: 'text/html', content: { _content: html } }] }];
    }
    const m = { e: [{ t: 't', a: String(r.a) }], su: { _content: String(r.objet || '') }, mp };
    if (r.mailId) { m.origid = String(r.mailId); m.rt = 'r'; }
    try {
      await soap({ SendMsgRequest: { _jsns: 'urn:zimbraMail', m } }, authToken);
      envoyes = [...envoyes.filter(x => x.id !== r.id), { id: r.id, mailId: r.mailId || null, ok: true, le: new Date().toISOString() }];
      nbEnvois++;
      if (mails) mails.forEach(x => { if (x.id === String(r.mailId)) x.repondu = true; });
    } catch (e) {
      envoyes = [...envoyes.filter(x => x.id !== r.id), { id: r.id, mailId: r.mailId || null, ok: false, erreur: e.message, tentatives: ((deja && deja.tentatives) || 0) + 1, le: new Date().toISOString() }];
      console.log(`::warning::Réponse non envoyée (${e.message}).`);
    }
  }
  const enBoite = new Set(boite.map(x => x && x.id));
  envoyes = envoyes.filter((x, i) => enBoite.has(x.id) || i >= envoyes.length - 50);
  if (nbEnvois) console.log(`${nbEnvois} réponse(s) envoyée(s).`);

  const lus = new Set((Array.isArray(donnees.mailsLus) ? donnees.mailsLus : []).map(String));
  const aMarquer = (mails || []).filter(x => x.nonLu && lus.has(x.id)).map(x => x.id);
  if (aMarquer.length) {
    try {
      await soap({ MsgActionRequest: { _jsns: 'urn:zimbraMail', action: { op: 'read', id: aMarquer.join(',') } } }, authToken);
      mails.forEach(x => { if (lus.has(x.id)) x.nonLu = false; });
      console.log(`${aMarquer.length} mail(s) marqué(s) comme lu(s).`);
    } catch (e) {
      console.log(`::warning::Mails non marqués comme lus (${e.message}).`);
    }
  }
}

const tous = [...anciens, ...cours].sort((x, y) => x.debut.localeCompare(y.debut));
const edt = {
  version: 1,
  source: 'unicaen',
  majLe: maintenant.toISOString(),
  plage: { debut: debutPlage.toISOString(), fin: finPlage.toISOString() },
  cours: tous,
  mails: mails || anciensMails,
  envoyes,
  signature: authToken ? signature : ancienneSignature,
  signatureHtml: authToken ? signatureHtml : ancienneSignatureHtml,
};

await gh(`/gists/${gistId}`, {
  method: 'PATCH',
  body: JSON.stringify({ files: { [FICHIER_EDT]: { content: JSON.stringify(edt) } } }),
});

console.log(`${cours.length} cours récupérés (${formatZimbra(debutPlage)} → ${formatZimbra(finPlage)}), ${anciens.length} conservés${mails ? `, ${mails.length} mails` : ''}.`);
