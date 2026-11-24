// Import vers Études, lancé par le favori depuis le site GEA de l'IUT ou depuis Moodle.
// Lit uniquement les pages déjà ouvertes avec la session de l'étudiant, puis ouvre
// l'application avec les données dans l'adresse (#import=…). Rien n'est envoyé ailleurs.
(async () => {
  const script = document.currentScript || [...document.scripts].reverse().find(s => /\/import\.js/.test(s.src));
  const APP = (window.__etudesApp || (script ? script.src : '')).replace(/import\.js.*$/, '');
  const dryRun = !!window.__etudesDryRun;

  const bandeau = (texte, erreur = false) => {
    if (dryRun) return;
    let el = document.getElementById('__etudes_bandeau');
    if (!el) {
      el = document.createElement('div');
      el.id = '__etudes_bandeau';
      el.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;padding:10px 16px;border-radius:8px;font:500 14px/1.4 -apple-system,system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.25);max-width:90vw';
      document.body.appendChild(el);
    }
    el.style.background = erreur ? '#be123c' : '#1c1917';
    el.style.color = '#fafaf9';
    el.textContent = texte;
  };

  const page = async (url) => {
    const r = await fetch(url, { credentials: 'include' });
    if (!r.ok) throw new Error(`${url} : ${r.status}`);
    return new DOMParser().parseFromString(await r.text(), 'text/html');
  };
  const txt = (el) => (el ? el.textContent.replace(/\s+/g, ' ').trim() : '');
  // « 23/11/2026 » + « 15:30 » → ISO
  const dateFR = (d, h = '00:00') => {
    const m = String(d).match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!m) return null;
    const [hh, mm] = String(h).split(':').map(Number);
    return new Date(+m[3], +m[2] - 1, +m[1], hh || 0, mm || 0).toISOString();
  };

  // ---------- Site GEA de l'IUT ----------
  const absences = async (base) => {
    const doc = await page(`${base}/mon-profil/absences`);
    return [...doc.querySelectorAll('table tbody tr')].map(tr => {
      const td = tr.querySelectorAll('td');
      if (td.length < 3) return null;
      const [d, h] = txt(td[0]).split(' ');
      const badge = td[2].querySelector('.badge');
      return {
        date: dateFR(d, h),
        seance: txt(td[1]),
        statut: txt(td[2]),
        niveau: badge ? (/danger/.test(badge.className) ? 'neg' : /warning/.test(badge.className) ? 'wait' : /success/.test(badge.className) ? 'ok' : 'n') : 'n',
      };
    }).filter(Boolean);
  };

  const evaluations = async (base) => {
    const doc = await page(`${base}/charge-travail/`);
    return [...doc.querySelectorAll('form[action*="/charge-travail/revision/"]')].map(f => {
      const id = (f.getAttribute('action').match(/revision\/(\d+)/) || [])[1];
      const bloc = f.querySelector('div');
      const libelle = txt(bloc && bloc.querySelector('strong'));
      const module = txt(bloc && bloc.querySelector('.text-muted'));
      const info = txt(bloc && bloc.querySelector('.mt-1'));
      const fixe = info.match(/Épreuve le\s+(\d{1,2}\/\d{1,2}\/\d{4})(?:\s+à\s+(\d{1,2}:\d{2}))?/i);
      const plage = info.match(/entre le\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+et le\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
      return {
        id: `gea_${id}`,
        libelle,
        module,
        date: fixe ? dateFR(fixe[1], fixe[2] || '00:00') : null,
        heure: !!(fixe && fixe[2]),
        entre: plage ? [dateFR(plage[1]), dateFR(plage[2])] : null,
        passee: /passée/i.test(info),
      };
    }).filter(e => e.libelle || e.module);
  };

  const semaineEdt = async (base, params = '') => {
    const doc = await page(`${base}/emploi-du-temps/${params}`);
    const titre = txt([...doc.querySelectorAll('h1,h2,h3')].find(h => /emploi du temps/i.test(h.textContent)));
    const annees = (titre.match(/\d{1,2}\/\d{1,2}\/(\d{4})/g) || []).map(s => +s.slice(-4));
    const anneeDebut = annees[0] || new Date().getFullYear();
    const moisDebut = +((titre.match(/\d{1,2}\/(\d{1,2})\/\d{4}/) || [])[1] || 1);
    const cours = [];
    doc.querySelectorAll('.card').forEach(card => {
      const tete = txt(card.querySelector('.card-header'));
      const j = tete.match(/(\d{1,2})\/(\d{1,2})/);
      if (!j) return;
      const annee = +j[2] < moisDebut ? anneeDebut + 1 : anneeDebut;
      card.querySelectorAll('.card-body > .border').forEach(bloc => {
        const lignes = [...bloc.children];
        const horaire = txt(lignes[0]).match(/(\d{1,2}:\d{2})\s*[–-]\s*(\d{1,2}:\d{2})/);
        if (!horaire) return;
        const details = bloc.querySelector('.text-muted');
        const apres = (cls) => {
          const i = details && details.querySelector(`i.${cls}`);
          if (!i) return '';
          let t = '', n = i.nextSibling;
          while (n && n.nodeName !== 'BR' && n.nodeName !== 'I') { t += n.textContent; n = n.nextSibling; }
          return t.replace(/\s+/g, ' ').trim();
        };
        const titreCours = txt(lignes.find((l, k) => k > 0 && l !== details));
        const date = `${j[1]}/${j[2]}/${annee}`;
        cours.push({
          id: `gea_${date}_${horaire[1]}_${titreCours}`.replace(/\s+/g, '_'),
          debut: dateFR(date, horaire[1]),
          fin: dateFR(date, horaire[2]),
          titre: titreCours,
          lieu: apres('fa-door-open'),
          enseignant: apres('fa-chalkboard-teacher'),
          groupes: apres('fa-users'),
          examen: /border-danger|bg-danger/.test(bloc.className) || /examen/i.test(txt(lignes[0])),
        });
      });
    });
    return cours;
  };

  // Semaine ISO d'une date : le site attend ?annee=…&semaine=…
  const semaineISO = (d) => {
    const x = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const jour = x.getUTCDay() || 7;
    x.setUTCDate(x.getUTCDate() + 4 - jour);
    const debutAnnee = new Date(Date.UTC(x.getUTCFullYear(), 0, 1));
    return { annee: x.getUTCFullYear(), semaine: Math.ceil(((x - debutAnnee) / 86400000 + 1) / 7) };
  };

  const edt = async (base, avant = 2, apres = 12) => {
    const vus = new Set();
    const tous = [];
    for (let k = -avant; k <= apres; k++) {
      const { annee, semaine } = semaineISO(new Date(Date.now() + k * 7 * 86400000));
      bandeau(`Site GEA : emploi du temps (${k + avant + 1}/${avant + apres + 1})…`);
      for (const c of await semaineEdt(base, `?annee=${annee}&semaine=${semaine}`)) {
        if (!vus.has(c.id)) { vus.add(c.id); tous.push(c); }
      }
    }
    return tous;
  };

  // ---------- Moodle ----------
  const moodle = async () => {
    const appel = async (methodname, args) => {
      const r = await fetch(`${M.cfg.wwwroot}/lib/ajax/service.php?sesskey=${M.cfg.sesskey}&info=${methodname}`, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ index: 0, methodname, args }]),
      });
      const j = (await r.json())[0];
      if (j.error) throw new Error(j.exception && j.exception.message || methodname);
      return j.data;
    };
    const liste = (await appel('core_course_get_enrolled_courses_by_timeline_classification', {
      offset: 0, limit: 0, classification: 'inprogress', sort: 'fullname', customfieldname: '', customfieldvalue: '',
    })).courses || [];
    const cours = [];
    for (const c of liste) {
      bandeau(`Moodle : ${cours.length + 1}/${liste.length} cours…`);
      let sections = [];
      try {
        const etat = JSON.parse(await appel('core_courseformat_get_state', { courseid: c.id }));
        const cms = Object.fromEntries((etat.cm || []).map(m => [String(m.id), m]));
        sections = (etat.section || []).map(s => ({
          titre: s.title || `Section ${s.number}`,
          url: s.sectionurl || '',
          cms: (s.cmlist || []).map(id => cms[String(id)]).filter(m => m && m.uservisible !== false && m.url)
            .map(m => ({ nom: m.name, url: m.url, type: m.module })),
        })).filter(s => s.cms.length);
      } catch { /* cours sans contenu lisible */ }
      cours.push({
        id: c.id, nom: c.fullname, court: c.shortname, categorie: c.coursecategory, url: c.viewurl,
        progression: c.hasprogress ? c.progress : null, favori: !!c.isfavourite, sections,
      });
    }
    const maintenant = Math.floor(Date.now() / 1000);
    const ev = await appel('core_calendar_get_action_events_by_timesort', { timesortfrom: maintenant - 86400 * 14, limitnum: 50 });
    const echeances = (ev.events || []).map(e => ({
      id: e.id, nom: e.activityname || e.name, intitule: e.name, date: new Date(e.timesort * 1000).toISOString(),
      cours: e.course ? e.course.fullname : '', coursId: e.course ? e.course.id : null, url: e.url, type: e.modulename,
      action: e.action ? e.action.name : '', enRetard: !!e.overdue,
    }));
    return { source: 'moodle', majLe: new Date().toISOString(), cours, echeances };
  };

  // ---------- Envoi vers l'application ----------
  const encoder = async (obj) => {
    const flux = new Blob([JSON.stringify(obj)]).stream().pipeThrough(new CompressionStream('gzip'));
    const octets = new Uint8Array(await new Response(flux).arrayBuffer());
    let bin = '';
    for (let i = 0; i < octets.length; i += 0x8000) bin += String.fromCharCode.apply(null, octets.subarray(i, i + 0x8000));
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  try {
    let donnees;
    if (/iutcaen\.unicaen\.fr$/.test(location.hostname) && /^\/gea/.test(location.pathname)) {
      const base = `${location.origin}/gea`;
      bandeau('Site GEA : absences…');
      const abs = await absences(base);
      bandeau('Site GEA : évaluations…');
      const evals = await evaluations(base);
      bandeau('Site GEA : emploi du temps…');
      const cours = await edt(base);
      donnees = { source: 'gea', majLe: new Date().toISOString(), absences: abs, evaluations: evals, edt: cours };
    } else if (window.M && M.cfg && M.cfg.sesskey) {
      donnees = await moodle();
    } else {
      bandeau('Ouvrir le site GEA de l’IUT ou Moodle, connecté, puis relancer le favori', true);
      return;
    }
    if (dryRun) { window.__etudesResultat = donnees; return; }
    bandeau('Ouverture d’Études…');
    location.href = `${APP}#import=${await encoder(donnees)}`;
  } catch (e) {
    if (dryRun) { window.__etudesResultat = { erreur: String(e && e.message || e) }; return; }
    bandeau(`Import impossible : ${e.message || e}`, true);
  }
})();
