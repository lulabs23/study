import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';

// ============================================================
// ICÔNES (tracés lucide dessinés localement : aucune dépendance)
// ============================================================

const Svg = ({ size = 24, strokeWidth = 2, className, style, children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style} aria-hidden="true">{children}</svg>
);
const mk = (paths) => (p) => <Svg {...p}>{paths}</Svg>;

const CalendarDays = mk(<><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></>);
const GraduationCap = mk(<><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></>);
const FileText = mk(<><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></>);
const ListChecks = mk(<><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></>);
const Plus = mk(<><path d="M5 12h14" /><path d="M12 5v14" /></>);
const Upload = mk(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></>);
const Download = mk(<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /><path d="M12 15V3" /></>);
const X = mk(<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>);
const Check = mk(<path d="M20 6 9 17l-5-5" />);
const ChevronLeft = mk(<path d="m15 18-6-6 6-6" />);
const ChevronRight = mk(<path d="m9 18 6-6-6-6" />);
const ChevronDown = mk(<path d="m6 9 6 6 6-6" />);
const Pencil = mk(<><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></>);
const Trash2 = mk(<><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><path d="M10 11v6" /><path d="M14 11v6" /></>);
const Search = mk(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>);
const RefreshCw = mk(<><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M8 16H3v5" /></>);
const AlertCircle = mk(<><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></>);
const Eye = mk(<><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></>);
const EyeOff = mk(<><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></>);
const MapPin = mk(<><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></>);
const UserIcon = mk(<><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>);
const Play = mk(<path d="M6 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L7.5 3.64A1 1 0 0 0 6 4.5z" />);
const RotateCcw = mk(<><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>);
const FolderOpen = mk(<path d="m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2" />);
const Copy = mk(<><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>);
const Pin = mk(<><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></>);
const Layers = mk(<><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" /><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" /></>);
const Heading = mk(<><path d="M6 12h12" /><path d="M6 20V4" /><path d="M18 20V4" /></>);
const Bold = mk(<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />);
const ListIcon = mk(<><path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" /></>);
const TextQuote = mk(<><path d="M17 6H3" /><path d="M21 12H8" /><path d="M21 18H8" /><path d="M3 12v6" /></>);
const TableIcon = mk(<><path d="M12 3v18" /><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="M3 15h18" /></>);
const Highlighter = mk(<><path d="m9 11-6 6v3h9l3-3" /><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" /></>);
const Shuffle = mk(<><path d="m18 14 4 4-4 4" /><path d="m18 2 4 4-4 4" /><path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-7.6a4 4 0 0 1 3.3-1.7H22" /><path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" /><path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" /></>);
const SlidersHorizontal = mk(<><path d="M21 4h-7" /><path d="M10 4H3" /><path d="M21 12h-9" /><path d="M8 12H3" /><path d="M21 20h-5" /><path d="M12 20H3" /><path d="M14 2v4" /><path d="M8 10v4" /><path d="M16 18v4" /></>);
const Mail = mk(<><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></>);
const BookOpen = mk(<><path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" /></>);
const ExternalLink = mk(<><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>);
const Paperclip = mk(<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />);
const ArrowRight = mk(<><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>);
const Headphones = mk(<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />);
const Library = mk(<><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4v16" /></>);
const Reply = mk(<><path d="m9 17-5-5 5-5" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" /></>);
const Send = mk(<><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></>);
const CheckCheck = mk(<><path d="M18 6 7 17l-5-5" /><path d="m22 10-7.5 7.5L13 16" /></>);
const LinkIcon = mk(<><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>);
const Clock = mk(<><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>);
const Sparkles = mk(<><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></>);
const Gem = mk(<><path d="M6 3h12l4 6-10 13L2 9Z" /><path d="M11 3 8 9l4 13 4-13-3-6" /><path d="M2 9h20" /></>);

// Logo : livre ouvert (même construction que le « compte en T » de Finances)
const LOGO_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="15" fill="#1c1917"/><path d="M32 21c-5-3.6-11.5-4.4-18-2.8v24.6c6.5-1.6 13-.8 18 2.8 5-3.6 11.5-4.4 18-2.8V18.2c-6.5-1.6-13-.8-18 2.8zM32 21v24.6" stroke="#fafaf9" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M19.5 28.5h6.5M19.5 35h4.5" stroke="#6ee7b7" stroke-width="3.5" stroke-linecap="round"/><path d="M38 28.5h6.5M40 35h4.5" stroke="#a8a29e" stroke-width="3.5" stroke-linecap="round"/></svg>';
const LogoMark = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className="f-logo" aria-hidden="true">
    <rect width="64" height="64" rx="15" fill="#1c1917" />
    <path d="M32 21c-5-3.6-11.5-4.4-18-2.8v24.6c6.5-1.6 13-.8 18 2.8 5-3.6 11.5-4.4 18-2.8V18.2c-6.5-1.6-13-.8-18 2.8zM32 21v24.6" stroke="#fafaf9" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M19.5 28.5h6.5M19.5 35h4.5" stroke="#6ee7b7" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M38 28.5h6.5M40 35h4.5" stroke="#a8a29e" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    const e = this.state.error;
    return (
      <div style={{ padding: 24, fontFamily: 'system-ui, sans-serif', color: '#1c1917' }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Erreur d'affichage</h1>
        <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13, background: '#f5f5f4', padding: 12, borderRadius: 6 }}>
          {String((e && (e.stack || e.message)) || e)}
        </pre>
        <button onClick={() => window.location.reload()}
          style={{ marginTop: 12, padding: '8px 14px', border: '1px solid #d6d3d1', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
          Recharger
        </button>
      </div>
    );
  }
}

// ============================================================
// UTILITAIRES
// ============================================================

const uid = (p = 'id') => `${p}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
const pad2 = (n) => String(n).padStart(2, '0');
const toISODate = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fromISODate = (iso) => { const [y, m, d] = String(iso).split('-').map(Number); return new Date(y, (m || 1) - 1, d || 1); };
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const startOfWeek = (d) => { const x = startOfDay(d); x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); return x; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const minutesDuJour = (d) => d.getHours() * 60 + d.getMinutes();

const JOURS_COURTS = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
const JOURS_LONGS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
const MOIS_COURTS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const MOIS_LONGS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const jourIdx = (d) => (d.getDay() + 6) % 7;

const heure = (d) => `${d.getHours()}:${pad2(d.getMinutes())}`;
const duree = (min) => {
  const h = Math.floor(min / 60), m = Math.round(min % 60);
  if (!h) return `${m} min`;
  return m ? `${h} h ${pad2(m)}` : `${h} h`;
};
const dateCourte = (d) => `${d.getDate()} ${MOIS_COURTS[d.getMonth()]}`;
const dateLongue = (d) => `${JOURS_LONGS[jourIdx(d)]} ${d.getDate()} ${MOIS_LONGS[d.getMonth()]}`;
const dateCourteISO = (iso) => (iso ? dateCourte(fromISODate(iso)) : '');
const libelleSemaine = (lundi, nbJours) => {
  const fin = addDays(lundi, nbJours - 1);
  return lundi.getMonth() === fin.getMonth()
    ? `${lundi.getDate()} – ${fin.getDate()} ${MOIS_COURTS[fin.getMonth()]}`
    : `${dateCourte(lundi)} – ${dateCourte(fin)}`;
};
const horodatage = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return sameDay(d, new Date())
    ? `aujourd'hui ${heure(d)}`
    : d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
};

const fmtNote = (n, dec = 2) => (n == null || Number.isNaN(n) ? '—' : Number(n).toFixed(dec).replace('.', ','));
const fmtNum = (n) => (n == null || Number.isNaN(n) ? '' : String(Math.round(n * 1000) / 1000).replace('.', ','));
const parseNum = (s) => {
  if (s === null || s === undefined) return null;
  const v = parseFloat(String(s).replace(',', '.').replace(/\s/g, ''));
  return Number.isFinite(v) ? v : null;
};
const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const codeKey = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const pluriel = (n, un, plusieurs) => `${n} ${n > 1 ? (plusieurs || un + 's') : un}`;
const melanger = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
const telecharger = (nom, contenu, type = 'application/json') => {
  const blob = new Blob([contenu], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nom;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
};
const nomFichier = (s) => norm(s).replace(/ /g, '-').slice(0, 60) || 'export';
const lireFichierTexte = (file) => new Promise((resolve, reject) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result || ''));
  r.onerror = () => reject(new Error('Lecture du fichier impossible'));
  r.readAsText(file, 'utf-8');
});

// Stockage local protégé (navigation privée, quotas…)
const LS = {
  get(key, fallback = '') { try { const v = window.localStorage.getItem(key); return v === null ? fallback : v; } catch { return fallback; } },
  set(key, val) { try { if (val === '' || val === null || val === undefined) window.localStorage.removeItem(key); else window.localStorage.setItem(key, val); } catch { /* stockage indisponible */ } },
  getJSON(key) { try { const v = window.localStorage.getItem(key); return v ? JSON.parse(v) : null; } catch { return null; } },
};

// ============================================================
// MAQUETTE PAR DÉFAUT — BUT GEA, semestre 1 (coefficients du relevé ScoDoc)
// ============================================================

const PALETTE = ['#52796f', '#3d5a80', '#b08968', '#6d597a', '#84a98c', '#e07a5f', '#a98467', '#577590', '#bb8588',
  '#b5935a', '#4f6d7a', '#d8a48f', '#7a9e7e', '#81667a', '#c08552', '#8d99ae', '#9c6644', '#a3b18a', '#5e6472', '#9a8c98'];

const RESSOURCES_GEA_S1 = [
  ['R1.01', 'Environnement économique', ['économie', 'economie generale']],
  ['R1.02', 'Environnement juridique', ['droit']],
  ['R1.03', 'Ressources humaines', ['grh']],
  ['R1.04', "Management d'activités", ['management des activites', 'management activites', 'management']],
  ['R1.05', 'Environnement sociologique', ['sociologie']],
  ['R1.06', 'Fiscalité', []],
  ['R1.07', 'Comptabilité', ['compta']],
  ['R1.08', 'Outils mathématiques de gestion', ['mathematiques', 'maths', 'outils statistiques', 'statistiques', 'outils mathematiques']],
  ['R1.09', 'Outils numériques de gestion', ['outils informatiques', 'informatique']],
  ['R1.10', 'Finance', []],
  ['R1.11', 'Gestion de projet', []],
  ['R1.12', 'Psychologie sociale', ['psychologie']],
  ['R1.13', 'Expression, communication et culture générale', ['expression communication', 'culture generale', 'expression']],
  ['R1.14', 'Anglais appliqué aux affaires', ['anglais']],
  ['R1.15', 'Projet Personnel et Professionnel', ['ppp', 'portfolio']],
  ['R1.16_E', 'Langue vivante 2 Espagnol', ['espagnol', 'lv2', 'lv2 espagnol', 'lv2 appliquee aux affaires']],
  ['R1.17', 'Contrôle de gestion', ['controle de gestion']],
  ['SAE1.01', 'Situer une organisation dans son environnement', []],
  ['SAE1.02', 'SI comptable', ['si comptable']],
  ['SAE1.03', 'Pitch pro', ['pitch']],
];

const UES_GEA_S1 = [
  ['UE1.1', "Analyser les processus de l'organisation", [['R1.01', 13], ['R1.02', 22], ['R1.03', 7], ['R1.04', 10], ['R1.05', 6], ['R1.15', 2], ['SAE1.01', 40]]],
  ['UE1.2', 'Aider à la prise de décision', [['R1.06', 5], ['R1.07', 19], ['R1.08', 14], ['R1.09', 6], ['R1.10', 8], ['R1.15', 2], ['R1.17', 6], ['SAE1.02', 40]]],
  ['UE1.3', "Piloter les relations avec les acteurs de l'organisation", [['R1.11', 7], ['R1.12', 7], ['R1.13', 17], ['R1.14', 14], ['R1.15', 2], ['R1.16_E', 13], ['SAE1.03', 40]]],
];

const semestreGEA_S1 = () => ({
  id: uid('sem'),
  nom: 'S1',
  annee: '2026-2027',
  ues: UES_GEA_S1.map(([code, nom, res]) => ({
    id: uid('ue'), code, nom, ects: 10, bonus: 0, malus: 0,
    ressources: res.map(([c, coef]) => ({ code: c, coef })),
  })),
});

const donneesInitiales = () => {
  const s1 = semestreGEA_S1();
  return {
    version: 1,
    savedAt: null,
    ressources: RESSOURCES_GEA_S1.map(([code, nom, alias], i) => ({ code, nom, alias, couleur: PALETTE[i % PALETTE.length] })),
    semestres: [s1],
    semestreActif: s1.id,
    evaluations: [],
    fiches: [],
    qcms: [],
    edtImport: [],
    edtModifs: {},
    examensIgnores: [],
    gea: null,
    moodle: null,
    podcasts: [],
    demandesQcm: [],
    mailsLus: [],
    boiteEnvoi: [],
    obsidian: null,
  };
};

// Complète un jeu de données ancien ou importé
const migrer = (d) => {
  const base = donneesInitiales();
  if (!d || typeof d !== 'object') return base;
  const out = { ...base, ...d };
  ['ressources', 'semestres', 'evaluations', 'fiches', 'qcms', 'edtImport', 'examensIgnores', 'podcasts', 'demandesQcm', 'mailsLus', 'boiteEnvoi'].forEach(k => { if (!Array.isArray(out[k])) out[k] = base[k]; });
  if (!out.edtModifs || typeof out.edtModifs !== 'object') out.edtModifs = {};
  const defauts = Object.fromEntries(RESSOURCES_GEA_S1.map(([code, , alias]) => [code, alias]));
  out.ressources = out.ressources.map(r => (defauts[r.code]
    ? { ...r, alias: Array.from(new Set([...(Array.isArray(r.alias) ? r.alias : []), ...defauts[r.code]])) } : r));
  if (!out.semestres.length) out.semestres = base.semestres;
  if (!out.semestres.some(s => s.id === out.semestreActif)) out.semestreActif = out.semestres[out.semestres.length - 1].id;
  out.qcms = out.qcms.map(q => ({ tentatives: [], ...q, questions: (q.questions || []).map(x => ({ id: x.id || uid('q'), ...x })) }));
  return out;
};

// ============================================================
// CALCULS — moyennes de ressources, d'UE, objectif à viser
// ============================================================

const noteSur20 = (e) => {
  const n = parseNum(e.note);
  if (n === null) return null;
  const sur = parseNum(e.sur) || 20;
  return (n / sur) * 20;
};
const coefEval = (e) => { const c = parseNum(e.coef); return c === null ? 1 : Math.max(0, c); };

const moyenneEvals = (evals) => {
  let s = 0, c = 0;
  for (const e of evals) {
    const v = noteSur20(e);
    if (v === null) continue;
    const w = coefEval(e);
    s += v * w; c += w;
  }
  return c > 0 ? s / c : null;
};

const evalsParRessource = (evaluations, semestreId) => {
  const map = {};
  for (const e of evaluations) {
    if (e.semestreId !== semestreId) continue;
    (map[e.ressource] = map[e.ressource] || []).push(e);
  }
  return map;
};

// Moyenne d'UE et note uniforme à obtenir sur tout ce qui reste à évaluer pour atteindre 10.
// Une ressource sans évaluation prévue compte comme entièrement à venir.
const statsUE = (ue, evalsMap) => {
  const bonus = parseNum(ue.bonus) || 0, malus = parseNum(ue.malus) || 0;
  let s = 0, c = 0, fixe = 0, variable = 0, total = 0;
  for (const r of ue.ressources) {
    const coefR = parseNum(r.coef) || 0;
    if (coefR <= 0) continue;
    total += coefR;
    const evs = evalsMap[r.code] || [];
    const moy = moyenneEvals(evs);
    if (moy !== null) { s += moy * coefR; c += coefR; }
    let wAll = 0, wKnown = 0, known = 0;
    for (const e of evs) {
      const w = coefEval(e);
      wAll += w;
      const v = noteSur20(e);
      if (v !== null) { wKnown += w; known += v * w; }
    }
    if (wAll <= 0) variable += coefR;
    else { fixe += coefR * known / wAll; variable += coefR * (wAll - wKnown) / wAll; }
  }
  const moyenne = c > 0 ? Math.max(0, Math.min(20, s / c + bonus - malus)) : null;
  const objectif = variable > 1e-9 && total > 0 ? ((10 - bonus + malus) * total - fixe) / variable : null;
  return { moyenne, objectif, complet: variable <= 1e-9, partNotee: total > 0 ? 1 - variable / total : 0 };
};

const statutUE = (m) => {
  if (m === null) return null;
  if (m >= 10) return { label: 'Validée', cls: 'f-b-ok' };
  if (m >= 8) return { label: 'Compensable', cls: 'f-b-wait' };
  return { label: 'Non validée', cls: 'f-b-neg' };
};

// ============================================================
// MATIÈRES — correspondance code / nom / alias
// ============================================================

const trouverRessource = (ressources, valeur) => {
  if (!valeur) return null;
  const k = codeKey(valeur);
  const parCode = ressources.find(r => codeKey(r.code) === k);
  if (parCode) return parCode;
  const n = norm(valeur);
  if (!n) return null;
  return ressources.find(r => norm(r.nom) === n)
    || ressources.find(r => (r.alias || []).some(a => norm(a) === n))
    || ressources.find(r => n.length > 3 && norm(r.nom).includes(n))
    || null;
};
// Libellé et couleur d'une matière (code de ressource ou texte libre)
const infoMatiere = (ressources, valeur) => {
  const r = trouverRessource(ressources, valeur);
  if (r) return { cle: r.code, nom: r.nom, code: r.code, couleur: r.couleur };
  const v = String(valeur || '').trim();
  return { cle: v || '_', nom: v || 'Sans matière', code: '', couleur: '#a8a29e' };
};

// ============================================================
// EMPLOI DU TEMPS — fichiers .ics et cours Unicaen
// ============================================================

const icsDate = (val, params) => {
  const m = String(val).match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0', z] = m;
  if (z) return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  if (/VALUE=DATE(?!-)/.test(params || '') || m[4] === undefined) return new Date(+y, +mo - 1, +d);
  return new Date(+y, +mo - 1, +d, +h, +mi, +s);
};
const icsTexte = (v) => String(v || '').replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');

const lireICS = (texte) => {
  const lignes = String(texte).replace(/\r?\n[ \t]/g, '').split(/\r?\n/);
  const out = [];
  let cur = null;
  for (const ligne of lignes) {
    if (ligne === 'BEGIN:VEVENT') { cur = {}; continue; }
    if (ligne === 'END:VEVENT') {
      if (cur && cur.debut && cur.fin) out.push(cur);
      cur = null; continue;
    }
    if (!cur) continue;
    const i = ligne.indexOf(':');
    if (i < 0) continue;
    const [nom, ...params] = ligne.slice(0, i).split(';');
    const val = ligne.slice(i + 1);
    const p = params.join(';');
    if (nom === 'DTSTART') { const d = icsDate(val, p); if (d) cur.debut = d.toISOString(); }
    else if (nom === 'DTEND') { const d = icsDate(val, p); if (d) cur.fin = d.toISOString(); }
    else if (nom === 'SUMMARY') cur.titre = icsTexte(val);
    else if (nom === 'LOCATION') cur.lieu = icsTexte(val);
    else if (nom === 'DESCRIPTION') cur.description = icsTexte(val);
    else if (nom === 'UID') cur.id = 'ics_' + val;
  }
  return out.map(c => ({ ...c, id: c.id || `ics_${c.debut}_${norm(c.titre).slice(0, 24)}` }));
};

const salleCourte = (s) => String(s || '').split(/\s*[,;]\s*/).map(x => {
  if (/travert/i.test(x)) return 'Amphi Travert';
  if (/charpak/i.test(x)) return 'Amphi Charpak';
  const te = x.match(/\bTE\s*-?\s*(\d+[A-Z]?)/i);
  if (te) return te[1];
  return x.replace(/\s*\([^)]*\)\s*/g, ' ').trim();
}).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(', ');

const champDescription = (desc, re) => {
  const m = String(desc || '').match(re);
  return m ? m[1].trim().replace(/\.$/, '') : '';
};

// « S1-C Fiscalité » → « Fiscalité » ; « S1-SAE1.02 SI comptable » → « SAE1.02 SI comptable »
const sansPrefixe = (t) => String(t || '').trim().replace(/^S\d+\s*-\s*(?:[A-Z]{1,6}\d?\s+)?/, '').trim();

// S1-CM : cours magistral ; S1-C : groupe de TD ; S1-C2 : groupe de TP
const typeCours = (titre, groupes) => {
  const t = String(titre || '').trim();
  const g = String(groupes || '').trim();
  const estTP = /^TP/i.test(g) || /^S\d+\s*-\s*[A-Z]{0,3}2\b/.test(t) || /\bTP\b/.test(t);
  if (!estTP && /\bCC\s?\d*\b/.test(t)) return 'CC';
  const m = t.match(/^S\d+\s*-\s*([A-Z]{1,6})(\d?)(?=\s|$)/);
  if (m && ['CM', 'TD', 'TP'].includes(m[1])) return m[1];
  if (/^TP/i.test(g)) return 'TP';
  if (/^TD/i.test(g)) return 'TD';
  if (m) return m[1].length <= 2 ? (m[2] ? 'TP' : 'TD') : '';
  if (/\bCM\b/.test(t)) return 'CM';
  if (/\bTP\b/.test(t)) return 'TP';
  if (/\bTD\b/.test(t)) return 'TD';
  return '';
};

// Examen deviné d'après l'intitulé (le site GEA de l'IUT, lui, l'indique explicitement)
const estExamenTitre = (t) => {
  const brut = String(t || '').trim();
  const n = ` ${norm(brut)} `;
  if (/ (examens?|partiels?) /.test(n)) return true;
  if (/^S\d+\s*-/.test(brut)) return false;
  return /\s[—–]\s/.test(brut) || / (cc\d*|ds\d*|controle (continu|terminal)|rattrapage|soutenance|ecrit|oral) /.test(n);
};

// Ressource d'un intitulé : code [MOD:…], code dans le titre, puis nom ou alias
const ressourceDuTitre = (titre, desc, toutes) => {
  // « S2-… » : seulement les ressources du semestre 2 (aucune si la maquette n'en a pas)
  const semTitre = (String(titre).trim().match(/^S(\d+)\s*-/) || [])[1];
  const ressources = semTitre && toutes.some(r => /^(R|SAE)\d/i.test(r.code))
    ? toutes.filter(r => new RegExp(`^(R|SAE)${semTitre}\\.`, 'i').test(r.code)) : toutes;
  const mod = (titre + ' ' + (desc || '')).match(/\[\s*MOD\s*:\s*([^\]]+)\]/i);
  const code = mod ? mod[1] : ((titre.match(/\b(SAE\s?\d\.?\d{1,2}|R\s?\d\.\d{1,2}(?:_[A-Z])?)\b/i) || [])[1] || '');
  const parCode = code ? trouverRessource(ressources, code) : null;
  if (parCode) return parCode;
  // « CC2 coûts partiels — Contrôle de gestion » : le module est après le tiret
  const parties = String(titre).split(/\s[—–]\s/);
  const cibles = parties.length > 1 ? [parties[parties.length - 1], titre] : [titre];
  for (const cible of cibles) {
    const t = ` ${norm(sansPrefixe(cible))} `;
    let best = null, bestLen = 0;
    for (const r of ressources) {
      for (const cand of [r.nom, ...(r.alias || [])]) {
        const n = norm(cand);
        if (n.length > bestLen && t.includes(` ${n} `)) { best = r; bestLen = n.length; }
      }
    }
    if (best) return best;
  }
  return null;
};

const cleModifTitre = (titre) => `t:${norm(titre)}`;

// Transforme un cours brut (Unicaen, site GEA ou .ics) en cours affichable, modifications comprises
const nettoyerCours = (c, ressources, modifs = {}) => {
  const titre = String(c.titre || '').trim();
  const desc = String(c.description || '');
  const debut = new Date(c.debut), fin = new Date(c.fin);
  const mRegle = modifs[cleModifTitre(titre)] || null;
  const mCours = modifs[`id:${c.id}`] || null;
  const m = { ...(mRegle || {}), ...(mCours || {}) };
  let ressource = ressourceDuTitre(titre, desc, ressources);
  if (m.code !== undefined) ressource = m.code ? ressources.find(r => r.code === m.code) || null : null;
  const groupes = c.groupes || champDescription(desc, /Groupes? d'[ée]tudiants\s*:\s*([^\n]+)/i);
  const nettoye = sansPrefixe(titre.replace(/\[[^\]]*\]/g, ' ').replace(/\s+-\s+Salle\s*:.*$/i, ' ').replace(/\s{2,}/g, ' '));
  const parties = titre.split(/\s[—–]\s/);
  const typeEff = m.type !== undefined ? m.type : typeCours(titre, groupes);
  const examenSource = typeof c.examen === 'boolean' ? c.examen : estExamenTitre(titre);
  const examen = typeof m.examen === 'boolean' ? m.examen : (typeEff === 'CC' || examenSource);
  const lieu = c.lieu || champDescription(desc, /Salles?\s*:\s*([^\n]+)/i);
  return {
    id: c.id || `${c.debut}_${titre}`,
    debut, fin,
    titre: m.titre || (ressource ? ressource.nom : (nettoye || titre || 'Cours')),
    titreBrut: titre,
    libelleExamen: parties.length > 1 ? parties.slice(0, -1).join(' — ').trim() : 'Examen',
    code: ressource ? ressource.code : '',
    couleur: ressource ? ressource.couleur : '#a8a29e',
    type: typeEff,
    salle: m.salle !== undefined ? m.salle : salleCourte(lieu),
    enseignant: c.enseignant || champDescription(desc, /Enseignants?\s*:\s*([^\n]+)/i),
    groupes,
    examen,
    masque: !!m.masque,
    modifie: !!(mRegle || mCours),
    regle: !!mRegle,
    minutes: Math.max(0, (fin - debut) / 60000),
  };
};

// Clé commune à un cours du webmail et au même cours vu sur le site GEA
const minuteISO = (d) => new Date(d).toISOString().slice(0, 16);

// Fusionne webmail, site GEA et .ics : le webmail prime, le site GEA apporte les examens
// et couvre les jours absents du webmail
const fusionnerCours = (zimbra, gea, ics) => {
  const geaParMinute = new Map();
  gea.forEach(c => { const k = minuteISO(c.debut); geaParMinute.set(k, [...(geaParMinute.get(k) || []), c]); });
  const joursZimbra = new Set(zimbra.map(c => toISODate(new Date(c.debut))));
  const apparies = new Set();
  const out = zimbra.map(c => {
    const memes = geaParMinute.get(minuteISO(c.debut)) || [];
    const g = memes.length === 1 ? memes[0] : memes.find(x => norm(sansPrefixe(x.titre)) === norm(sansPrefixe(c.titre)));
    if (g) apparies.add(g.id);
    return g ? { ...c, examen: g.examen, groupes: c.groupes || g.groupes, enseignant: c.enseignant || g.enseignant } : c;
  });
  // Cours du site GEA non appariés : gardés si le jour n'est pas couvert par le webmail, ou si c'est un examen
  gea.forEach(c => { if (!apparies.has(c.id) && (!joursZimbra.has(toISODate(new Date(c.debut))) || c.examen || estExamenTitre(c.titre))) out.push(c); });
  const vus = new Set();
  return [...out, ...ics].filter(c => c && c.debut && c.fin && !vus.has(c.id) && vus.add(c.id));
};

// Évaluations prévues : celles du site GEA (charge de travail) et les examens de l'emploi du temps.
// Renvoie la nouvelle liste d'évaluations, ou null si rien ne change.
const synchroExamens = (d, cours) => {
  const ignores = new Set(d.examensIgnores || []);
  const semPour = (code) => d.semestres.find(s => s.id === d.semestreActif && s.ues.some(u => u.ressources.some(r => r.code === code)))
    || d.semestres.find(s => s.ues.some(u => u.ressources.some(r => r.code === code)));
  const voulues = new Map();
  for (const e of (d.gea && d.gea.evaluations) || []) {
    const r = trouverRessource(d.ressources, e.module) || ressourceDuTitre(e.module || '', '', d.ressources);
    const sem = r && semPour(r.code);
    if (!sem) continue;
    const date = e.date || (e.entre && e.entre[0]) || null;
    voulues.set(e.id, { ressource: r.code, semestreId: sem.id, libelle: e.libelle || 'Évaluation', date: date ? toISODate(new Date(date)) : '' });
  }
  const valeurs = () => [...voulues.values()];
  for (const c of cours) {
    if (!c.examen || c.masque || !c.code) continue;
    if (String(c.id).startsWith('geaeval_')) continue;
    const sem = semPour(c.code);
    if (!sem) continue;
    const jour = toISODate(c.debut);
    if (valeurs().some(v => v.ressource === c.code && v.date === jour)) continue;
    voulues.set(`edt:${c.id}`, { ressource: c.code, semestreId: sem.id, libelle: c.libelleExamen || 'Examen', date: jour });
  }
  let change = false;
  const presentes = new Set();
  const suite = [];
  for (const e of d.evaluations) {
    if (!e.source) { suite.push(e); continue; }
    presentes.add(e.source);
    const v = !ignores.has(e.source) && voulues.get(e.source);
    if (!v) {
      if (parseNum(e.note) !== null) suite.push(e); else change = true;
      continue;
    }
    const maj = { date: v.date, ressource: v.ressource, semestreId: v.semestreId, ...(e.libelleAuto ? { libelle: v.libelle } : {}) };
    if (Object.keys(maj).some(k => e[k] !== maj[k])) { change = true; suite.push({ ...e, ...maj }); } else suite.push(e);
  }
  for (const [source, v] of voulues) {
    if (presentes.has(source) || ignores.has(source)) continue;
    suite.push({ id: `auto_${source}`, source, libelleAuto: true, note: null, sur: 20, coef: 1, ...v });
    change = true;
  }
  return change ? suite : null;
};

// Données envoyées par le favori d'import : #import=<gzip en base64url>
const decoderImport = async (texte) => {
  const b64 = texte.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((texte.length + 3) % 4);
  const bin = atob(b64);
  const octets = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) octets[i] = bin.charCodeAt(i);
  const flux = new Blob([octets]).stream().pipeThrough(new DecompressionStream('gzip'));
  return JSON.parse(await new Response(flux).text());
};

// Code du favori : charge import.js depuis l'adresse de l'application
const codeFavori = () => {
  const base = `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, '')}`;
  return `javascript:(()=>{const s=document.createElement('script');s.src='${base}import.js?v='+Date.now();document.body.appendChild(s)})();`;
};

// Ressource d'un cours Moodle : « (RGEA1H) Comptabilité » → ressources du semestre 1
const ressourceMoodle = (nom, ressources) => {
  const sem = (String(nom).match(/\([RS]GEA(\d)/i) || [])[1];
  const propre = String(nom).replace(/^\([^)]*\)\s*/, '');
  const candidates = sem ? ressources.filter(r => new RegExp(`^(R|SAE)${sem}\\.`, 'i').test(r.code)) : ressources;
  return trouverRessource(candidates, propre) || ressourceDuTitre(propre, '', candidates);
};
const nomMoodle = (nom) => String(nom || '').replace(/^\([^)]*\)\s*/, '').replace(/\s{2,}/g, ' ').trim();
const sansEmoji = (t) => String(t || '').replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/\s{2,}/g, ' ').replace(/\s*\|\s*/g, ' · ').trim();

// ============================================================
// GIST — sauvegarde entre appareils
// ============================================================

const GIST_FILENAME = 'etudes-data.json';
const GIST_EDT = 'edt.json';
const GIST_DESCRIPTION = 'Études — synchronisation';

const gh = async (token, url, opts = {}) => {
  const res = await fetch(url.startsWith('http') ? url : `https://api.github.com${url}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
      ...(opts.headers || {}),
    },
  });
  return res;
};

const contenuFichier = async (file) => {
  if (!file) return null;
  const txt = file.truncated && file.raw_url ? await (await fetch(file.raw_url)).text() : file.content;
  try { return JSON.parse(txt); } catch { return null; }
};

const gistApi = {
  async checkToken(token) {
    const res = await gh(token, '/user');
    if (!res.ok) throw new Error('Token invalide ou expiré');
    return res.json();
  },
  async findExisting(token) {
    const res = await gh(token, '/gists?per_page=100');
    if (!res.ok) return [];
    const list = await res.json();
    return list.filter(g => g.files?.[GIST_FILENAME]);
  },
  async create(token, payload) {
    const res = await gh(token, '/gists', {
      method: 'POST',
      body: JSON.stringify({ description: GIST_DESCRIPTION, public: false, files: { [GIST_FILENAME]: { content: JSON.stringify(payload) } } }),
    });
    if (!res.ok) throw new Error('Création du gist échouée');
    return res.json();
  },
  async readAll(token, gistId) {
    const res = await gh(token, `/gists/${gistId}`, { cache: 'no-store' });
    if (res.status === 404) throw new Error('Gist introuvable');
    if (!res.ok) throw new Error('Lecture du gist échouée');
    const g = await res.json();
    return {
      data: await contenuFichier(g.files?.[GIST_FILENAME]),
      edt: await contenuFichier(g.files?.[GIST_EDT]),
      updatedAt: g.updated_at,
    };
  },
  // Ne modifie que le fichier de l'application : edt.json (écrit par GitHub Actions) reste intact
  async update(token, gistId, payload) {
    const res = await gh(token, `/gists/${gistId}`, {
      method: 'PATCH',
      body: JSON.stringify({ files: { [GIST_FILENAME]: { content: JSON.stringify(payload) } } }),
    });
    if (!res.ok) throw new Error('Sauvegarde sur gist échouée');
    return res.json();
  },
  // Relance le workflow de récupération de l'EDT Unicaen
  async lancerEdt(token, repo) {
    const res = await gh(token, `/repos/${repo}/actions/workflows/edt-unicaen.yml/dispatches`, {
      method: 'POST',
      body: JSON.stringify({ ref: 'main' }),
    });
    if (res.status !== 204) throw new Error(res.status === 403 || res.status === 404 ? 'Token sans accès aux Actions du dépôt' : `Lancement refusé (${res.status})`);
  },
};

// Coffre Obsidian publié dans un dépôt GitHub (extension Obsidian Git) : lecture seule
const cheminApi = (chemin) => String(chemin).split('/').map(encodeURIComponent).join('/');
const obsidianApi = {
  async arbre(token, depot) {
    const r = await gh(token, `/repos/${depot}`, { cache: 'no-store' });
    if (r.status === 404 || r.status === 403) throw new Error('Dépôt Obsidian inaccessible avec ce token');
    if (!r.ok) throw new Error(`Dépôt Obsidian : erreur ${r.status}`);
    const info = await r.json();
    const t = await gh(token, `/repos/${depot}/git/trees/${encodeURIComponent(info.default_branch)}?recursive=1`, { cache: 'no-store' });
    if (t.status === 409) return { fichiers: [], le: new Date().toISOString() };
    if (!t.ok) throw new Error(`Dépôt Obsidian : erreur ${t.status}`);
    const j = await t.json();
    const fichiers = (j.tree || [])
      .filter(x => x.type === 'blob' && !/(^|\/)\.(obsidian|trash|git)\//.test(x.path) && !/(^|\/)\./.test(x.path.split('/').pop()))
      .map(x => ({ path: x.path, sha: x.sha, taille: x.size || 0 }));
    return { fichiers, le: new Date().toISOString() };
  },
  async texte(token, depot, chemin) {
    const r = await gh(token, `/repos/${depot}/contents/${cheminApi(chemin)}`, { headers: { Accept: 'application/vnd.github.raw' }, cache: 'no-store' });
    if (!r.ok) throw new Error(`Lecture impossible (${r.status})`);
    return r.text();
  },
  async audio(token, depot, sha, mime) {
    const r = await gh(token, `/repos/${depot}/git/blobs/${sha}`, { headers: { Accept: 'application/vnd.github.raw' } });
    if (!r.ok) throw new Error(`Lecture impossible (${r.status})`);
    const b = await r.blob();
    return URL.createObjectURL(mime ? new Blob([b], { type: mime }) : b);
  },
};

// Dépôt GitHub déduit de l'adresse (lulabs23.github.io/etudes → lulabs23/etudes)
const depotParDefaut = () => {
  try {
    const { hostname, pathname } = window.location;
    const m = hostname.match(/^([^.]+)\.github\.io$/i);
    const seg = pathname.split('/').filter(Boolean)[0];
    return m && seg ? `${m[1]}/${seg}` : '';
  } catch { return ''; }
};

// ============================================================
// RENDU DES FICHES (markdown simple, sans HTML injecté)
// ============================================================

const RE_INLINE = /(\*\*([^*]+?)\*\*|__([^_]+?)__|==([^=]+?)==|`([^`]+?)`|\*([^*\s][^*]*?)\*|\[([^\]]+)\]\((https?:\/\/[^)\s]+)\))/;
const enLigne = (texte, cle = 'i') => {
  const out = [];
  let reste = String(texte);
  let k = 0;
  while (reste) {
    const m = reste.match(RE_INLINE);
    if (!m) { out.push(reste); break; }
    if (m.index) out.push(reste.slice(0, m.index));
    const id = `${cle}.${k++}`;
    if (m[2] || m[3]) out.push(<strong key={id}>{enLigne(m[2] || m[3], id)}</strong>);
    else if (m[4]) out.push(<mark key={id}>{enLigne(m[4], id)}</mark>);
    else if (m[5]) out.push(<code key={id}>{m[5]}</code>);
    else if (m[6]) out.push(<em key={id}>{enLigne(m[6], id)}</em>);
    else if (m[7]) out.push(<a key={id} href={m[8]} target="_blank" rel="noopener noreferrer">{m[7]}</a>);
    reste = reste.slice(m.index + m[0].length);
  }
  return out;
};

const RE_LISTE = /^(\s*)([-*+•]|\d+[.)])\s+(.*)$/;
const cellules = (l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());

const analyserBlocs = (texte) => {
  const lignes = String(texte || '').replace(/\r\n?/g, '\n').split('\n');
  const blocs = [];
  let i = 0;
  while (i < lignes.length) {
    const l = lignes[i];
    if (!l.trim()) { i++; continue; }
    if (/^```/.test(l.trim())) {
      const buf = []; i++;
      while (i < lignes.length && !/^```/.test(lignes[i].trim())) buf.push(lignes[i++]);
      i++;
      blocs.push({ t: 'code', v: buf.join('\n') });
      continue;
    }
    const h = l.match(/^(#{1,4})\s+(.*)$/);
    if (h) { blocs.push({ t: 'h', n: h[1].length, v: h[2].trim() }); i++; continue; }
    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(l)) { blocs.push({ t: 'hr' }); i++; continue; }
    if (/^\s*>/.test(l)) {
      const buf = [];
      while (i < lignes.length && /^\s*>/.test(lignes[i])) buf.push(lignes[i++].replace(/^\s*>\s?/, ''));
      blocs.push({ t: 'quote', v: analyserBlocs(buf.join('\n')) });
      continue;
    }
    if (/^\s*\|/.test(l) && i + 1 < lignes.length && /^\s*\|?\s*:?-{2,}/.test(lignes[i + 1])) {
      const tete = cellules(l); i += 2;
      const rows = [];
      while (i < lignes.length && /^\s*\|/.test(lignes[i])) rows.push(cellules(lignes[i++]));
      blocs.push({ t: 'table', tete, rows });
      continue;
    }
    if (RE_LISTE.test(l)) {
      const items = [];
      const ordonnee = /\d/.test(l.match(RE_LISTE)[2]);
      while (i < lignes.length) {
        const m = lignes[i].match(RE_LISTE);
        if (m) {
          const niveau = m[1].replace(/\t/g, '  ').length >= 2 ? 1 : 0;
          const coche = m[3].match(/^\[( |x|X)\]\s+(.*)$/);
          const item = { v: coche ? coche[2] : m[3], coche: coche ? coche[1] !== ' ' : null, sous: [] };
          if (niveau && items.length) items[items.length - 1].sous.push(item); else items.push(item);
          i++;
        } else if (lignes[i].trim() && /^\s{2,}/.test(lignes[i]) && items.length) {
          const dernier = items[items.length - 1];
          const cible = dernier.sous.length ? dernier.sous[dernier.sous.length - 1] : dernier;
          cible.v += '\n' + lignes[i].trim(); i++;
        } else break;
      }
      blocs.push({ t: ordonnee ? 'ol' : 'ul', items });
      continue;
    }
    const buf = [];
    while (i < lignes.length && lignes[i].trim() && !/^(#{1,4})\s/.test(lignes[i]) && !RE_LISTE.test(lignes[i])
      && !/^\s*>/.test(lignes[i]) && !/^```/.test(lignes[i].trim()) && !/^\s*(-{3,}|\*{3,})\s*$/.test(lignes[i])
      && !(/^\s*\|/.test(lignes[i]) && i + 1 < lignes.length && /^\s*\|?\s*:?-{2,}/.test(lignes[i + 1]))) buf.push(lignes[i++]);
    blocs.push({ t: 'p', v: buf.join('\n') });
  }
  return blocs;
};

const avecSauts = (v, cle) => String(v).split('\n').flatMap((ligne, j) => (j ? [<br key={`${cle}br${j}`} />, ...enLigne(ligne, `${cle}l${j}`)] : enLigne(ligne, `${cle}l${j}`)));

const rendreItems = (items, cle, ordonnee) => {
  const Tag = ordonnee ? 'ol' : 'ul';
  return (
    <Tag>
      {items.map((it, j) => (
        <li key={`${cle}-${j}`} className={it.coche !== null ? 'md-check' : undefined}>
          {it.coche !== null && <span className={`md-box ${it.coche ? 'on' : ''}`}>{it.coche && <Check size={11} strokeWidth={3} />}</span>}
          <span>{avecSauts(it.v, `${cle}-${j}`)}</span>
          {it.sous.length > 0 && rendreItems(it.sous, `${cle}-${j}s`, false)}
        </li>
      ))}
    </Tag>
  );
};

const rendreBloc = (b, cle) => {
  switch (b.t) {
    case 'h': { const Tag = `h${Math.min(4, b.n + 1)}`; return <Tag key={cle}>{enLigne(b.v, cle)}</Tag>; }
    case 'hr': return <hr key={cle} />;
    case 'code': return <pre key={cle}><code>{b.v}</code></pre>;
    case 'quote': return <blockquote key={cle}>{b.v.map((x, j) => rendreBloc(x, `${cle}.${j}`))}</blockquote>;
    case 'table': return (
      <div key={cle} className="md-table">
        <table>
          <thead><tr>{b.tete.map((c, j) => <th key={j}>{enLigne(c, `${cle}h${j}`)}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, ri) => <tr key={ri}>{b.tete.map((_, j) => <td key={j}>{enLigne(r[j] || '', `${cle}r${ri}c${j}`)}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
    case 'ul': case 'ol': return <React.Fragment key={cle}>{rendreItems(b.items, cle, b.t === 'ol')}</React.Fragment>;
    default: return <p key={cle}>{avecSauts(b.v, cle)}</p>;
  }
};

// masquer : chaque bloc sous un titre est flouté jusqu'à ce qu'on le touche
const Markdown = ({ texte, masquer = false }) => {
  const blocs = useMemo(() => analyserBlocs(texte), [texte]);
  const [reveles, setReveles] = useState(() => new Set());
  useEffect(() => { setReveles(new Set()); }, [masquer, texte]);
  return (
    <div className="f-md">
      {blocs.map((b, i) => {
        const el = rendreBloc(b, `b${i}`);
        if (!masquer || b.t === 'h' || b.t === 'hr') return el;
        const vu = reveles.has(i);
        return (
          <div key={`m${i}`} className={`md-cache ${vu ? 'vu' : ''}`}
            onClick={() => setReveles(prev => { const n = new Set(prev); if (n.has(i)) n.delete(i); else n.add(i); return n; })}>
            {el}
          </div>
        );
      })}
    </div>
  );
};

// ============================================================
// COMPOSANTS UI (mêmes classes et variables que Finances)
// ============================================================

const Card = ({ children, className = '', ...rest }) => <div className={`f-panel ${className}`} {...rest}>{children}</div>;

const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled, title, ...rest }) => {
  const variants = { primary: 'f-btn f-btn-p', secondary: 'f-btn', ghost: 'f-btn f-btn-g', danger: 'f-btn f-btn-d' };
  const sizes = { sm: 'f-btn-sm', md: '', lg: 'f-btn-lg' };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={`${variants[variant] || variants.primary} ${sizes[size] || ''} ${className}`} {...rest}>
      {children}
    </button>
  );
};

const IconButton = ({ label, onClick, children, className = '', danger = false, ...rest }) => (
  <button type="button" onClick={onClick} title={label} aria-label={label} className={`f-ibtn ${danger ? 'danger' : ''} ${className}`} {...rest}>
    {children}
  </button>
);

const Input = ({ value, onChange, type = 'text', className = '', ...rest }) => (
  <input type={type} value={value ?? ''} onChange={onChange} className={`f-field ${className}`} {...rest} />
);
const Select = ({ value, onChange, children, className = '', ...rest }) => (
  <select value={value} onChange={onChange} className={`f-field f-select ${className}`} {...rest}>{children}</select>
);
const Field = ({ label, children, className = '', as = 'label', style }) => {
  const Tag = as;
  return (
    <Tag className={`f-fl ${className}`} style={style}>
      <span className="f-label">{label}</span>
      {children}
    </Tag>
  );
};

const Seg = ({ options, value, onChange, label, fill = false, className = '' }) => (
  <div className={`f-seg ${fill ? 'f-seg-fill' : ''} ${className}`} role="group" aria-label={label}>
    {options.map(o => {
      const on = value === o.id;
      return (
        <button key={o.id} type="button" onClick={() => onChange(o.id)} aria-pressed={on}
          className={`no-touch-grow ${on ? 'on' : ''} ${on && o.tone ? 'tone-' + o.tone : ''}`}>
          {o.icon}{o.label}
          {o.count !== undefined && <span className="ct">{o.count}</span>}
        </button>
      );
    })}
  </div>
);

const SearchInput = ({ value, onChange, placeholder = 'Rechercher', style }) => (
  <label className="f-search" style={style}>
    <Search size={15} />
    <input type="search" value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder} className="f-field" />
  </label>
);

const Switch = ({ on, onChange, label }) => (
  <button type="button" onClick={() => onChange(!on)} className={`f-switch no-touch-grow ${on ? 'on' : ''}`} role="switch" aria-checked={on} aria-label={label}>
    <span />
  </button>
);

const Modal = ({ open, onClose, title, children, size = 'md', footer, headExtra }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  const sizes = { sm: 'm-sm', md: 'm-md', lg: 'm-lg', xl: 'm-xl' };
  return (
    <div className="f-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined} className={`f-modal ${sizes[size]}`}>
        <div className="f-modal-h">
          <h3>{title}</h3>
          <div className="flex items-center gap-1">
            {headExtra}
            <IconButton label="Fermer" onClick={onClose}><X size={16} /></IconButton>
          </div>
        </div>
        <div className="f-modal-b">{children}</div>
        {footer && <div className="f-modal-f">{footer}</div>}
      </div>
    </div>
  );
};

const Confirm = ({ open, title, message, label = 'Supprimer', onConfirm, onClose }) => (
  <Modal open={open} onClose={onClose} title={title} size="sm"
    footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button variant="danger" onClick={onConfirm}>{label}</Button></>}>
    <p className="t-ink2">{message}</p>
  </Modal>
);

const PageHeader = ({ title, meta, children }) => (
  <header className="f-page-h">
    <div className="flex items-baseline gap-3 flex-wrap min-w-0">
      <h1>{title}</h1>
      {meta && <span className="t-muted f-num">{meta}</span>}
    </div>
    {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
  </header>
);

const PanelHead = ({ title, children }) => (
  <div className="f-ph">
    <h2>{title}</h2>
    {children}
  </div>
);

const Strip = ({ children, min = 200 }) => (
  <div className="f-panel overflow-hidden">
    <div className="f-strip" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }}>{children}</div>
  </div>
);

const Kpi = ({ label, value, sub, valueClass = '', marker, extra, onClick }) => {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} onClick={onClick} className={`f-kpi ${onClick ? 'f-kpi-btn' : ''}`}>
      <div className="flex items-center justify-between gap-2" style={{ minHeight: 20 }}>
        <span className="f-kpi-l">{marker && <span className="f-sq" style={{ background: marker }} />}{label}</span>
        {extra}
      </div>
      <span className={`f-kpi-v f-num ${valueClass}`}>{value}</span>
      {sub && <span className="f-kpi-s f-num">{sub}</span>}
    </Tag>
  );
};

const Matiere = ({ info, court = false }) => (
  <span className="f-cat min-w-0">
    <span className="f-sq" style={{ background: info.couleur }} />
    <span className="truncate">{court && info.code ? info.code : info.nom}</span>
  </span>
);

const Track = ({ value, max = 20, color = 'var(--ink)' }) => (
  <span className="f-track"><span style={{ width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`, background: color }} /></span>
);

const RowActions = ({ onEdit, onDelete, children }) => (
  <span className="flex justify-end shrink-0" style={{ gap: 2 }}>
    {children}
    {onEdit && <IconButton label="Modifier" onClick={onEdit}><Pencil size={14} /></IconButton>}
    {onDelete && <IconButton label="Supprimer" danger onClick={onDelete}><Trash2 size={14} /></IconButton>}
  </span>
);

const Vide = ({ children, action }) => (
  <div className="f-vide">
    <span>{children}</span>
    {action}
  </div>
);

// Liste déroulante des matières : ressources du semestre puis matières libres déjà utilisées
const SelectMatiere = ({ value, onChange, ressources, libres = [], tout = false, className = '', style }) => (
  <Select value={value} onChange={(e) => onChange(e.target.value)} className={className} style={style} aria-label="Matière">
    {tout && <option value="all">Toutes les matières</option>}
    {!tout && <option value="">Sans matière</option>}
    {ressources.map(r => <option key={r.code} value={r.code}>{r.code} · {r.nom}</option>)}
    {libres.length > 0 && (
      <optgroup label="Autres">
        {libres.map(l => <option key={l} value={l}>{l}</option>)}
      </optgroup>
    )}
  </Select>
);

// Ligne d'une liste à filets (paramètres, détails)
const Ligne = ({ label, children, onClick, icon: Icon }) => {
  const inner = (
    <>
      {Icon && <Icon size={16} className="t-muted shrink-0" />}
      <span className="flex-1 min-w-0 text-left t-ink">{label}</span>
      {children}
    </>
  );
  return onClick
    ? <button type="button" onClick={onClick} className="f-ln f-ln-btn">{inner}</button>
    : <div className="f-ln">{inner}</div>;
};

// ============================================================
// EMPLOI DU TEMPS
// ============================================================

const HEURE_PX = 46;

// Répartit les cours qui se chevauchent sur plusieurs colonnes
const placerCours = (liste) => {
  const tries = liste.slice().sort((a, b) => a.debut - b.debut || b.fin - a.fin);
  const out = [];
  let groupe = [], finGroupe = 0;
  const fermer = () => {
    const lanes = [];
    groupe.forEach(c => {
      let l = lanes.findIndex(f => f <= c.debut.getTime());
      if (l < 0) { l = lanes.length; lanes.push(0); }
      lanes[l] = c.fin.getTime();
      out.push({ c, lane: l });
    });
    const n = lanes.length;
    out.slice(out.length - groupe.length).forEach(o => { o.lanes = n; });
    groupe = []; finGroupe = 0;
  };
  tries.forEach(c => {
    if (groupe.length && c.debut.getTime() >= finGroupe) fermer();
    groupe.push(c);
    finGroupe = Math.max(finGroupe, c.fin.getTime());
  });
  if (groupe.length) fermer();
  return out;
};

const CoursLigne = ({ c, onClick, enCours }) => (
  <button type="button" className={`edt-row ${c.examen ? 'exam' : ''} ${enCours ? 'now' : ''} ${c.masque ? 'masque' : ''}`} style={{ '--c': c.couleur }} onClick={onClick}>
    <span className="edt-h f-num"><b>{heure(c.debut)}</b><span>{heure(c.fin)}</span></span>
    <span className="edt-bar" />
    <span className="edt-c">
      <span className="edt-t">
        <span className="truncate">{c.titre}</span>
        {c.type && <span className="f-badge f-b-n">{c.type}</span>}
        {c.examen && <span className="f-badge f-b-wait">Examen</span>}
      </span>
      {(c.salle || c.enseignant) && (
        <span className="edt-m">
          {c.salle && <span><MapPin size={12} />{c.salle}</span>}
          {c.enseignant && <span className="truncate"><UserIcon size={12} />{c.enseignant}</span>}
        </span>
      )}
    </span>
  </button>
);

const CoursModal = ({ cours: c, onClose, onGoto, compteurs, onEdit }) => {
  if (!c) return null;
  const n = c.code ? compteurs(c.code) : null;
  return (
    <Modal open onClose={onClose} title={c.titre} size="sm"
      footer={<Button variant="secondary" onClick={onEdit}><Pencil size={14} /> Modifier</Button>}>
      <div className="flex flex-col gap-4">
        <div className="f-box">
          <Ligne label="Date"><span className="t-ink3">{dateLongue(c.debut)}</span></Ligne>
          <Ligne label="Horaire"><span className="t-ink3 f-num">{heure(c.debut)} – {heure(c.fin)} · {duree(c.minutes)}</span></Ligne>
          {(c.type || c.examen) && (
            <Ligne label="Type">
              <span className="flex gap-1">
                {c.type && <span className="f-badge f-b-n">{c.type}</span>}
                {c.examen && <span className="f-badge f-b-wait">Examen</span>}
              </span>
            </Ligne>
          )}
          {c.salle && <Ligne label="Salle"><span className="t-ink3">{c.salle}</span></Ligne>}
          {c.enseignant && <Ligne label="Enseignant"><span className="t-ink3 text-right">{c.enseignant}</span></Ligne>}
          {c.groupes && <Ligne label="Groupes"><span className="t-ink3 text-right">{c.groupes}</span></Ligne>}
          {c.code && <Ligne label="Ressource"><span className="t-ink3 f-num">{c.code}</span></Ligne>}
          {c.titreBrut && c.titreBrut !== c.titre && <Ligne label="Intitulé"><span className="t-muted text-right text-xs">{c.titreBrut}</span></Ligne>}
          {(c.modifie || c.masque) && (
            <Ligne label="Modifié">
              <span className="flex gap-1">
                {c.regle && <span className="f-badge f-b-n">Tous les cours de cet intitulé</span>}
                {c.masque && <span className="f-badge f-b-n">Masqué</span>}
              </span>
            </Ligne>
          )}
        </div>
        {n && (
          <div className="edt-liens">
            <button type="button" className="f-chip" onClick={() => onGoto('notes', c.code)}>
              <GraduationCap size={14} /> Notes <span className="t-muted f-num">{fmtNote(n.moyenne)}</span>
            </button>
            <button type="button" className="f-chip" onClick={() => onGoto('fiches', c.code)}>
              <FileText size={14} /> Fiches <span className="t-muted f-num">{n.fiches}</span>
            </button>
            <button type="button" className="f-chip" onClick={() => onGoto('qcm', c.code)}>
              <ListChecks size={14} /> QCM <span className="t-muted f-num">{n.qcms}</span>
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

const TYPES_COURS = [{ id: '', label: '—' }, { id: 'CM', label: 'CM' }, { id: 'TD', label: 'TD' }, { id: 'TP', label: 'TP' }, { id: 'CC', label: 'CC' }];

const CoursEdit = ({ cours: c, ressources, modifs, onSave, onClose }) => {
  const [portee, setPortee] = useState('id');
  const [f, setF] = useState(null);
  useEffect(() => {
    if (!c) return;
    setPortee('id');
    setF({ titre: c.titre, code: c.code, type: c.type, examen: c.examen, salle: c.salle, masque: c.masque });
  }, [c, modifs]);
  if (!c || !f) return null;
  const cle = portee === 'id' ? `id:${c.id}` : cleModifTitre(c.titreBrut);
  const existant = modifs[cle];
  const brut = nettoyerCours({ id: c.id, debut: c.debut.toISOString(), fin: c.fin.toISOString(), titre: c.titreBrut, lieu: c.salle }, ressources, {});
  const enregistrer = () => {
    const ressource = ressources.find(r => r.code === f.code);
    const m = {};
    if (f.code !== brut.code) m.code = f.code;
    const titreDefaut = ressource ? ressource.nom : brut.titre;
    if (f.titre.trim() && f.titre.trim() !== titreDefaut) m.titre = f.titre.trim();
    if (f.type !== brut.type) m.type = f.type;
    if (f.examen !== c.examen || existant?.examen !== undefined) m.examen = f.examen;
    if (portee === 'id' && f.salle !== brut.salle) m.salle = f.salle;
    if (f.masque) m.masque = true;
    onSave(cle, Object.keys(m).length ? m : null, portee === 'titre' ? `id:${c.id}` : null);
  };
  return (
    <Modal open onClose={onClose} title="Modifier le cours" size="sm"
      footer={(
        <>
          {existant && <Button variant="ghost" onClick={() => onSave(cle, null)} style={{ marginRight: 'auto' }}><RotateCcw size={14} /> Rétablir</Button>}
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer}>Enregistrer</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <Field label="Appliquer à" as="div">
          <Seg fill label="Portée" value={portee} onChange={setPortee}
            options={[{ id: 'id', label: 'Ce cours' }, { id: 'titre', label: 'Tous les cours identiques' }]} />
        </Field>
        <p className="t-muted text-xs f-mono">{c.titreBrut}</p>
        <Field label="Matière">
          <Select value={f.code} onChange={(e) => {
            const r = ressources.find(x => x.code === e.target.value);
            setF(p => ({ ...p, code: e.target.value, titre: r ? r.nom : brut.titre }));
          }}>
            <option value="">Aucune</option>
            {ressources.map(r => <option key={r.code} value={r.code}>{r.code} · {r.nom}</option>)}
          </Select>
        </Field>
        <Field label="Intitulé affiché"><Input value={f.titre} onChange={(e) => setF(p => ({ ...p, titre: e.target.value }))} /></Field>
        <Field label="Type" as="div">
          <Seg fill label="Type" value={f.type} onChange={(v) => setF(p => ({ ...p, type: v, examen: v === 'CC' ? true : p.examen }))} options={TYPES_COURS} />
        </Field>
        {portee === 'id' && <Field label="Salle"><Input value={f.salle} onChange={(e) => setF(p => ({ ...p, salle: e.target.value }))} /></Field>}
        <div className="f-box">
          <Ligne label="Examen"><Switch on={f.examen} onChange={(v) => setF(p => ({ ...p, examen: v }))} label="Examen" /></Ligne>
          <Ligne label="Masquer"><Switch on={f.masque} onChange={(v) => setF(p => ({ ...p, masque: v }))} label="Masquer" /></Ligne>
        </div>
      </div>
    </Modal>
  );
};

const EdtView = ({ cours: tousCours, majLe, onRefresh, refreshing, onImportIcs, onOpenSettings, onGoto, compteurs, ressources, modifs, onModif }) => {
  const [lundi, setLundi] = useState(() => { const t = new Date(); return startOfWeek(t.getDay() === 0 ? addDays(t, 1) : t); });
  const [jour, setJour] = useState(() => { const t = new Date(); return t.getDay() === 0 ? 0 : jourIdx(t); });
  const [mode, setMode] = useState(() => LS.get('etudes_edt_mode', typeof window !== 'undefined' && window.innerWidth < 768 ? 'jour' : 'semaine'));
  const [detailId, setDetailId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [voirMasques, setVoirMasques] = useState(false);
  const cours = useMemo(() => (voirMasques ? tousCours : tousCours.filter(c => !c.masque)), [tousCours, voirMasques]);
  const detail = detailId ? tousCours.find(c => c.id === detailId) : null;
  const enEdition = editId ? tousCours.find(c => c.id === editId) : null;
  const setDetail = (c) => setDetailId(c ? c.id : null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { LS.set('etudes_edt_mode', mode); }, [mode]);

  const semaine = useMemo(() => {
    const fin = addDays(lundi, 7);
    return cours.filter(c => c.debut >= lundi && c.debut < fin);
  }, [cours, lundi]);
  const nbJours = semaine.some(c => jourIdx(c.debut) >= 5) ? (semaine.some(c => jourIdx(c.debut) === 6) ? 7 : 6) : 5;
  const jourAff = Math.min(jour, nbJours - 1);
  const jours = Array.from({ length: nbJours }, (_, i) => addDays(lundi, i));
  const parJour = jours.map((_, i) => semaine.filter(c => jourIdx(c.debut) === i).sort((a, b) => a.debut - b.debut));
  const totalMin = semaine.reduce((s, c) => s + c.minutes, 0);
  const aujourdhui = startOfDay(now);

  const allerSemaine = (n) => setLundi(l => addDays(l, 7 * n));
  const allerAujourdhui = () => {
    const t = new Date();
    setLundi(startOfWeek(t.getDay() === 0 ? addDays(t, 1) : t));
    setJour(t.getDay() === 0 ? 0 : jourIdx(t));
  };
  const changerJour = (delta) => {
    let j = jourAff + delta;
    if (j < 0) { allerSemaine(-1); j = 4; } else if (j >= nbJours) { allerSemaine(1); j = 0; }
    setJour(j);
  };

  // Balayage horizontal sur la liste du jour
  const touche = useRef(null);
  const onTouchStart = (e) => { const t = e.touches[0]; touche.current = { x: t.clientX, y: t.clientY }; };
  const onTouchEnd = (e) => {
    if (!touche.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touche.current.x, dy = t.clientY - touche.current.y;
    touche.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) changerJour(dx < 0 ? 1 : -1);
  };

  const nbMasques = useMemo(() => {
    const fin = addDays(lundi, 7);
    return tousCours.filter(c => c.masque && c.debut >= lundi && c.debut < fin).length;
  }, [tousCours, lundi]);

  const examens = useMemo(() => {
    const limite = addDays(now, 60);
    return cours.filter(c => c.examen && c.fin >= now && c.debut <= limite).slice(0, 8);
  }, [cours, now]);

  const titreMaj = `Actualiser · ${horodatage(majLe)}`;

  if (!cours.length) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader title="Emploi du temps">
          <IconButton label={titreMaj} onClick={onRefresh} className="f-ibtn-bd">
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          </IconButton>
        </PageHeader>
        <Card>
          <Vide action={(
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={onImportIcs}><Upload size={15} /> Importer un .ics</Button>
              <Button variant="secondary" onClick={onOpenSettings}><SlidersHorizontal size={15} /> Paramètres</Button>
            </div>
          )}>Aucun cours</Vide>
        </Card>
      </div>
    );
  }

  // Grille semaine : de 8 h à 19 h, élargie si un cours déborde
  const minsSemaine = semaine.flatMap(c => [minutesDuJour(c.debut), sameDay(c.debut, c.fin) ? minutesDuJour(c.fin) : 24 * 60]);
  const debutG = Math.min(8 * 60, ...minsSemaine.filter((_, i) => i % 2 === 0).map(m => Math.floor(m / 60) * 60));
  const finG = Math.max(19 * 60, ...minsSemaine.filter((_, i) => i % 2 === 1).map(m => Math.ceil(m / 60) * 60));
  const heures = [];
  for (let h = debutG / 60; h <= finG / 60; h++) heures.push(h);
  const posNow = (minutesDuJour(now) - debutG) / 60 * HEURE_PX;

  const listeJour = parJour[jourAff] || [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Emploi du temps" meta={totalMin ? duree(totalMin) : null}>
        <div className="edt-nav">
          <IconButton label="Semaine précédente" onClick={() => allerSemaine(-1)} className="f-ibtn-bd"><ChevronLeft size={16} /></IconButton>
          <button type="button" className="edt-sem f-num" onClick={allerAujourdhui} title="Revenir à aujourd'hui">{libelleSemaine(lundi, nbJours)}</button>
          <IconButton label="Semaine suivante" onClick={() => allerSemaine(1)} className="f-ibtn-bd"><ChevronRight size={16} /></IconButton>
        </div>
        <Seg label="Affichage" value={mode} onChange={setMode} options={[{ id: 'jour', label: 'Jour' }, { id: 'semaine', label: 'Semaine' }]} />
        {(nbMasques > 0 || voirMasques) && (
          <IconButton label={voirMasques ? 'Cacher les cours masqués' : `Afficher les cours masqués (${nbMasques})`} onClick={() => setVoirMasques(v => !v)}
            className={`f-ibtn-bd ${voirMasques ? 'f-ibtn-on' : ''}`}>
            {voirMasques ? <Eye size={15} /> : <EyeOff size={15} />}
          </IconButton>
        )}
        <IconButton label={titreMaj} onClick={onRefresh} className="f-ibtn-bd only-desk">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </IconButton>
      </PageHeader>

      {mode === 'jour' ? (
        <>
          <div className="edt-days" style={{ gridTemplateColumns: `repeat(${nbJours}, minmax(0, 1fr))` }}>
            {jours.map((d, i) => {
              const liste = parJour[i];
              return (
                <button key={i} type="button" onClick={() => setJour(i)}
                  className={`edt-day no-touch-grow ${i === jourAff ? 'on' : ''} ${sameDay(d, aujourdhui) ? 'today' : ''}`}>
                  <span className="edt-day-l">{JOURS_COURTS[i]}</span>
                  <b className="f-num">{d.getDate()}</b>
                  <span className="edt-dots">
                    {liste.slice(0, 5).map(c => <i key={c.id} style={{ background: c.examen ? 'var(--m-wait)' : c.couleur }} />)}
                  </span>
                </button>
              );
            })}
          </div>
          <Card className="overflow-hidden" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <div className="f-ph">
              <h2 className="first-up">{dateLongue(jours[jourAff])}</h2>
              <span className="t-muted f-num text-xs">{listeJour.length ? duree(listeJour.reduce((s, c) => s + c.minutes, 0)) : ''}</span>
            </div>
            {listeJour.length === 0 ? <Vide>Aucun cours</Vide> : listeJour.map((c, i) => {
              const pause = i > 0 ? (c.debut - listeJour[i - 1].fin) / 60000 : 0;
              return (
                <React.Fragment key={c.id}>
                  {pause >= 30 && <div className="edt-pause f-num"><span>{duree(pause)}</span></div>}
                  <CoursLigne c={c} enCours={now >= c.debut && now < c.fin} onClick={() => setDetail(c)} />
                </React.Fragment>
              );
            })}
          </Card>
        </>
      ) : (
        <Card className="overflow-hidden">
          <div className="edt-wk" style={{ '--cols': nbJours }}>
            <div className="edt-wh">
              <span />
              {jours.map((d, i) => (
                <button key={i} type="button" className={`edt-wd no-touch-grow ${sameDay(d, aujourdhui) ? 'today' : ''}`}
                  onClick={() => { setJour(i); setMode('jour'); }}>
                  <span>{JOURS_COURTS[i]}</span><b className="f-num">{d.getDate()}</b>
                </button>
              ))}
            </div>
            <div className="edt-wb" style={{ height: (finG - debutG) / 60 * HEURE_PX }}>
              <div className="edt-axis">
                {heures.map(h => <span key={h} className="f-num" style={{ top: (h * 60 - debutG) / 60 * HEURE_PX }}>{h}h</span>)}
              </div>
              {jours.map((d, i) => (
                <div key={i} className={`edt-col ${sameDay(d, aujourdhui) ? 'today' : ''}`}>
                  {placerCours(parJour[i]).map(({ c, lane, lanes }) => {
                    const top = (minutesDuJour(c.debut) - debutG) / 60 * HEURE_PX;
                    const h = Math.max(18, c.minutes / 60 * HEURE_PX - 2);
                    return (
                      <button key={c.id} type="button" onClick={() => setDetail(c)}
                        className={`edt-blk no-touch-grow ${c.examen ? 'exam' : ''} ${c.masque ? 'masque' : ''}`}
                        style={{ '--c': c.couleur, top, height: h, left: `calc(${(lane / lanes) * 100}% + 2px)`, width: `calc(${100 / lanes}% - 4px)` }}>
                        <b>{c.titre}</b>
                        {h > 34 && <span className="f-num">{heure(c.debut)}{c.salle ? ` · ${c.salle}` : ''}</span>}
                        {h > 54 && c.type && <span>{c.examen ? 'Examen' : c.type}</span>}
                      </button>
                    );
                  })}
                  {sameDay(d, aujourdhui) && posNow > 0 && posNow < (finG - debutG) / 60 * HEURE_PX && <span className="edt-now" style={{ top: posNow }} />}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {examens.length > 0 && (
        <Card className="overflow-hidden">
          <PanelHead title="Examens à venir"><span className="t-muted f-num text-xs">{examens.length}</span></PanelHead>
          {examens.map(c => (
            <button key={c.id} type="button" className="edt-ex f-row" onClick={() => setDetail(c)}>
              <span className="f-sq" style={{ background: c.couleur }} />
              <span className="truncate t-ink font-medium">{c.titre}</span>
              <span className="t-muted f-num text-right">{dateCourte(c.debut)} · {heure(c.debut)}</span>
            </button>
          ))}
        </Card>
      )}

      <CoursModal cours={enEdition ? null : detail} onClose={() => setDetail(null)} compteurs={compteurs}
        onEdit={() => setEditId(detail.id)}
        onGoto={(v, code) => { setDetail(null); onGoto(v, code); }} />
      <CoursEdit cours={enEdition} ressources={ressources} modifs={modifs} onClose={() => setEditId(null)}
        onSave={(cle, valeur, aRetirer) => { onModif(cle, valeur, aRetirer); setEditId(null); setDetailId(null); }} />
    </div>
  );
};

// ============================================================
// NOTES
// ============================================================

const clsNote = (m) => (m === null ? 't-faint' : m >= 10 ? 't-ink' : m >= 8 ? 't-warn' : 't-neg');

const texteObjectif = (st) => {
  if (st.complet) return null;
  if (st.objectif === null) return null;
  if (st.objectif <= 0) return 'Acquise';
  if (st.objectif > 20) return 'Hors d’atteinte';
  return `À viser : ${fmtNote(st.objectif)}`;
};

const EvalForm = ({ open, initial, sem, ressources, onSave, onDelete, onClose }) => {
  const [f, setF] = useState(null);
  useEffect(() => {
    if (open) setF({ ...initial,
      libelle: (initial && initial.libelle) || '',
      ressource: (initial && initial.ressource) || '',
      date: (initial && initial.date) || toISODate(new Date()),
      note: initial && initial.note != null && initial.note !== '' ? fmtNum(parseNum(initial.note)) : '',
      sur: initial && initial.sur != null && initial.sur !== '' ? fmtNum(parseNum(initial.sur)) : '20',
      coef: initial && initial.coef != null && initial.coef !== '' ? fmtNum(parseNum(initial.coef)) : '1' });
  }, [open, initial]);
  if (!open || !f) return null;
  const set = (k) => (e) => setF(prev => ({ ...prev, [k]: e.target.value }));
  const note = parseNum(f.note), sur = parseNum(f.sur) || 20, coef = parseNum(f.coef);
  const sansNote = String(f.note ?? '').trim() === '';
  const erreur = !sansNote && (note === null || note < 0 || note > sur) ? `Note entre 0 et ${fmtNum(sur)}` : '';
  const ok = f.ressource && !erreur && (coef === null || coef >= 0);
  const vus = new Set();
  const groupes = sem.ues.map(ue => ({
    ue,
    res: ue.ressources.filter(r => !vus.has(r.code) && vus.add(r.code)).map(r => ressources.find(x => x.code === r.code) || { code: r.code, nom: r.code }),
  })).filter(g => g.res.length);
  const enregistrer = () => {
    if (!ok) return;
    onSave({
      ...(f.source ? { source: f.source, libelleAuto: !!f.libelleAuto && f.libelle.trim() === String(initial.libelle || '').trim() } : {}),
      id: f.id || uid('ev'),
      semestreId: f.semestreId || sem.id,
      ressource: f.ressource,
      libelle: f.libelle.trim(),
      note: sansNote ? null : note,
      sur,
      coef: coef === null ? 1 : coef,
      date: f.date,
    });
  };
  return (
    <Modal open onClose={onClose} title={f.id ? 'Modifier la note' : 'Nouvelle note'} size="sm"
      footer={(
        <>
          {f.id && <Button variant="ghost" onClick={() => onDelete(f)} style={{ color: 'var(--neg)', marginRight: 'auto' }}>Supprimer</Button>}
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer} disabled={!ok}>Enregistrer</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <Field label="Ressource">
          <Select value={f.ressource} onChange={set('ressource')}>
            <option value="">Choisir…</option>
            {groupes.map(g => (
              <optgroup key={g.ue.id} label={`${g.ue.code} · ${g.ue.nom}`}>
                {g.res.map(r => <option key={r.code} value={r.code}>{r.code} · {r.nom}</option>)}
              </optgroup>
            ))}
          </Select>
        </Field>
        <Field label="Évaluation">
          <Input value={f.libelle} onChange={set('libelle')} placeholder="Contrôle continu 1" />
        </Field>
        <div className="f-grid3">
          <Field label="Note">
            <Input value={f.note} onChange={set('note')} inputMode="decimal" placeholder="À venir" />
          </Field>
          <Field label="Sur">
            <Input value={f.sur} onChange={set('sur')} inputMode="decimal" />
          </Field>
          <Field label="Coefficient">
            <Input value={f.coef} onChange={set('coef')} inputMode="decimal" />
          </Field>
        </div>
        {erreur && <p className="text-xs t-neg">{erreur}</p>}
        <Field label="Date">
          <Input type="date" value={f.date} onChange={set('date')} />
        </Field>
      </div>
    </Modal>
  );
};

const NotesView = ({ data, commit, focus, signal }) => {
  const sem = data.semestres.find(s => s.id === data.semestreActif) || data.semestres[0];
  const evalsMap = useMemo(() => evalsParRessource(data.evaluations, sem.id), [data.evaluations, sem.id]);
  const resParCode = useMemo(() => Object.fromEntries(data.ressources.map(r => [r.code, r])), [data.ressources]);
  const stats = sem.ues.map(ue => ({ ue, ...statsUE(ue, evalsMap) }));
  const moyennes = stats.map(s => s.moyenne).filter(m => m !== null);
  const moyGen = moyennes.length ? moyennes.reduce((a, b) => a + b, 0) / moyennes.length : null;
  const validees = stats.filter(s => s.moyenne !== null && s.moyenne >= 10).length;

  const absences = useMemo(() => ((data.gea && data.gea.absences) || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date))), [data.gea]);
  const [ouverts, setOuverts] = useState(() => new Set(focus && focus.view === 'notes' && focus.matiere ? [focus.matiere] : []));
  const [form, setForm] = useState(null);
  const [maquette, setMaquette] = useState(false);
  const [suppr, setSuppr] = useState(null);

  const vu = useRef(signal.n);
  useEffect(() => {
    if (signal.n === vu.current) return;
    vu.current = signal.n;
    if (signal.type === 'add') setForm({});
  }, [signal]);
  useEffect(() => {
    if (focus && focus.view === 'notes' && focus.matiere) {
      const el = document.querySelector(`[data-res="${focus.matiere}"]`);
      if (el) setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 60);
    }
  }, [focus]);

  const basculer = (code) => setOuverts(prev => { const n = new Set(prev); if (n.has(code)) n.delete(code); else n.add(code); return n; });
  const enregistrer = (ev) => {
    commit(d => ({ ...d, evaluations: d.evaluations.some(e => e.id === ev.id) ? d.evaluations.map(e => (e.id === ev.id ? ev : e)) : [...d.evaluations, ev] }));
    setOuverts(prev => new Set(prev).add(ev.ressource));
    setForm(null);
  };
  const supprimer = () => {
    const { id, source } = suppr;
    commit(d => ({
      ...d,
      evaluations: d.evaluations.filter(e => e.id !== id),
      examensIgnores: source ? Array.from(new Set([...(d.examensIgnores || []), source])) : (d.examensIgnores || []),
    }));
    setSuppr(null); setForm(null);
  };
  const choisirSemestre = (id) => commit(d => ({ ...d, semestreActif: id }));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Notes" meta={`${sem.nom}${sem.annee ? ' · ' + sem.annee : ''}`}>
        {data.semestres.length > 1 && (
          <Seg label="Semestre" value={sem.id} onChange={choisirSemestre} options={data.semestres.map(s => ({ id: s.id, label: s.nom }))} />
        )}
        <Button variant="secondary" onClick={() => setMaquette(true)}><Layers size={15} /> Maquette</Button>
        <Button className="only-desk" onClick={() => setForm({})}><Plus size={15} /> Note</Button>
      </PageHeader>

      <Strip min={150}>
        <Kpi label="Moyenne" value={fmtNote(moyGen)} valueClass={clsNote(moyGen)}
          sub={stats.length ? `${validees}/${stats.length} UE ≥ 10` : null} />
        {stats.map(s => {
          const st = s.complet ? statutUE(s.moyenne) : null;
          return (
            <Kpi key={s.ue.id} label={s.ue.code} value={fmtNote(s.moyenne)} valueClass={clsNote(s.moyenne)}
              extra={st && <span className={`f-badge ${st.cls}`}>{st.label}</span>}
              sub={texteObjectif(s)}
              onClick={() => document.getElementById(`ue-${s.ue.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })} />
          );
        })}
      </Strip>

      {stats.length === 0 && (
        <Card><Vide action={<Button variant="secondary" onClick={() => setMaquette(true)}><Layers size={15} /> Maquette</Button>}>Aucune UE</Vide></Card>
      )}

      {stats.map(s => {
        const { ue } = s;
        const st = s.complet ? statutUE(s.moyenne) : null;
        return (
          <Card key={ue.id} id={`ue-${ue.id}`} className="overflow-hidden n-ue">
            <div className="f-ph">
              <h2 className="min-w-0"><span className="t-muted f-num">{ue.code}</span> <span>{ue.nom}</span></h2>
              <span className="flex items-center gap-2 shrink-0">
                {st && <span className={`f-badge ${st.cls}`}>{st.label}</span>}
                <span className={`f-num n-moy ${clsNote(s.moyenne)}`}>{fmtNote(s.moyenne)}</span>
              </span>
            </div>
            {(parseNum(ue.bonus) || parseNum(ue.malus)) ? (
              <div className="n-bm f-num">
                {parseNum(ue.bonus) ? <span>Bonus {fmtNote(parseNum(ue.bonus))}</span> : null}
                {parseNum(ue.malus) ? <span>Malus {fmtNote(parseNum(ue.malus))}</span> : null}
              </div>
            ) : null}
            {ue.ressources.map((r, i) => {
              const res = resParCode[r.code] || { code: r.code, nom: r.code, couleur: '#a8a29e' };
              const evs = (evalsMap[r.code] || []).slice().sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
              const moy = moyenneEvals(evs);
              const ouvert = ouverts.has(r.code);
              const aVenir = evs.filter(e => noteSur20(e) === null).length;
              return (
                <div key={r.code} className={i > 0 ? 'f-line' : ''} data-res={r.code}>
                  <button type="button" className="n-row f-row" onClick={() => basculer(r.code)} aria-expanded={ouvert}>
                    <span className="f-sq" style={{ background: res.couleur }} />
                    <span className="n-lib">
                      <span className="truncate t-ink font-medium">{res.nom}</span>
                      <span className="t-muted text-xs f-num truncate">
                        {res.code} · coef. {fmtNum(parseNum(r.coef))}{evs.length - aVenir ? ` · ${pluriel(evs.length - aVenir, 'note')}` : ''}{aVenir ? ` · ${aVenir} à venir` : ''}
                      </span>
                    </span>
                    <span className="n-track"><Track value={moy || 0} color={res.couleur} /></span>
                    <span className={`f-num font-semibold text-right ${clsNote(moy)}`}>{fmtNote(moy)}</span>
                    <ChevronDown size={15} className={`t-faint n-chev ${ouvert ? 'on' : ''}`} />
                  </button>
                  {ouvert && (
                    <div className="n-evals">
                      {evs.map(e => {
                        const v = parseNum(e.note);
                        return (
                          <div key={e.id} className="n-ev">
                            <span className="min-w-0 flex flex-col">
                              <span className="flex items-center gap-2 min-w-0">
                                {e.source && <CalendarDays size={13} className="t-faint shrink-0" />}
                                <span className="truncate t-ink">{e.libelle || 'Évaluation'}</span>
                              </span>
                              <span className="t-muted text-xs f-num">{dateCourteISO(e.date)}{coefEval(e) !== 1 ? ` · coef. ${fmtNum(coefEval(e))}` : ''}</span>
                            </span>
                            {v === null
                              ? <span className="f-badge f-b-wait">À venir</span>
                              : <span className="f-num font-medium t-ink">{fmtNum(v)}<span className="t-muted">/{fmtNum(parseNum(e.sur) || 20)}</span></span>}
                            <RowActions onEdit={() => setForm(e)} onDelete={() => setSuppr(e)} />
                          </div>
                        );
                      })}
                      <button type="button" className="n-add" onClick={() => setForm({ ressource: r.code })}>
                        <Plus size={14} /> Ajouter une note
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </Card>
        );
      })}

      {absences.length > 0 && (
        <Card className="overflow-hidden">
          <PanelHead title="Absences">
            <span className="flex flex-wrap gap-1 justify-end">
              {Object.entries(absences.reduce((m, a) => { const k = a.statut.split(' ')[0]; m[k] = (m[k] || 0) + 1; return m; }, {}))
                .map(([k, n]) => <span key={k} className="f-badge f-b-n f-num">{k} {n}</span>)}
            </span>
          </PanelHead>
          {absences.map((a, i) => {
            const c = nettoyerCours({ id: `abs${i}`, debut: a.date, fin: a.date, titre: a.seance }, data.ressources);
            return (
              <div key={i} className={`n-abs ${i > 0 ? 'f-line' : ''}`}>
                <span className="f-sq" style={{ background: c.couleur }} />
                <span className="min-w-0 flex flex-col">
                  <span className="truncate t-ink font-medium">{c.titre}</span>
                  <span className="t-muted text-xs f-num">{a.date ? `${dateCourte(new Date(a.date))} · ${heure(new Date(a.date))}` : ''}</span>
                </span>
                <span className={`f-badge ${a.niveau === 'neg' ? 'f-b-neg' : a.niveau === 'ok' ? 'f-b-ok' : a.niveau === 'wait' ? 'f-b-wait' : 'f-b-n'} n-abs-st`} title={a.statut}>
                  {a.statut.length > 28 ? a.statut.split(' ')[0] : a.statut}
                </span>
              </div>
            );
          })}
        </Card>
      )}

      <EvalForm open={!!form} initial={form} sem={sem} ressources={data.ressources}
        onSave={enregistrer} onDelete={(e) => setSuppr(e)} onClose={() => setForm(null)} />
      <Confirm open={!!suppr} title="Supprimer la note" onClose={() => setSuppr(null)} onConfirm={supprimer}
        message={suppr ? `Supprimer « ${suppr.libelle || 'Évaluation'} » ?` : ''} />
      <MaquetteModal open={maquette} data={data} commit={commit} onClose={() => setMaquette(false)} />
    </div>
  );
};

// ============================================================
// MAQUETTE — semestres, UE, ressources et coefficients
// ============================================================

const MaquetteModal = ({ open, data, commit, onClose }) => {
  const [d, setD] = useState(null);
  const [onglet, setOnglet] = useState('ue');
  useEffect(() => {
    if (open) setD({ semestres: JSON.parse(JSON.stringify(data.semestres)), ressources: JSON.parse(JSON.stringify(data.ressources)), actif: data.semestreActif });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  if (!open || !d) return null;
  const sem = d.semestres.find(s => s.id === d.actif) || d.semestres[0];
  const majSem = (fn) => setD(prev => ({ ...prev, semestres: prev.semestres.map(s => (s.id === sem.id ? fn(s) : s)) }));
  const majUE = (ueId, fn) => majSem(s => ({ ...s, ues: s.ues.map(u => (u.id === ueId ? fn(u) : u)) }));
  const majRes = (i, k, v) => setD(prev => ({ ...prev, ressources: prev.ressources.map((r, j) => (j === i ? { ...r, [k]: v } : r)) }));

  const nouveauSemestre = (copie) => {
    const n = d.semestres.length + 1;
    const s = copie
      ? { ...JSON.parse(JSON.stringify(sem)), id: uid('sem'), nom: `S${n}`, ues: sem.ues.map(u => ({ ...JSON.parse(JSON.stringify(u)), id: uid('ue') })) }
      : { id: uid('sem'), nom: `S${n}`, annee: sem.annee || '', ues: [] };
    setD(prev => ({ ...prev, semestres: [...prev.semestres, s], actif: s.id }));
  };
  const supprimerSemestre = () => {
    if (d.semestres.length < 2) return;
    if (!window.confirm(`Supprimer ${sem.nom} et toutes ses notes ?`)) return;
    setD(prev => { const reste = prev.semestres.filter(s => s.id !== sem.id); return { ...prev, semestres: reste, actif: reste[reste.length - 1].id }; });
  };
  const enregistrer = () => {
    const ids = new Set(d.semestres.map(s => s.id));
    const ressources = d.ressources.filter(r => String(r.code || '').trim()).map(r => ({
      ...r, code: r.code.trim(), nom: String(r.nom || '').trim() || r.code.trim(),
      alias: Array.isArray(r.alias) ? r.alias : String(r.alias || '').split(',').map(a => a.trim()).filter(Boolean),
    }));
    commit(x => ({ ...x, semestres: d.semestres, ressources, semestreActif: ids.has(d.actif) ? d.actif : d.semestres[0].id,
      evaluations: x.evaluations.filter(e => ids.has(e.semestreId)) }));
    onClose();
  };
  const aliasTexte = (r) => (Array.isArray(r.alias) ? r.alias.join(', ') : r.alias || '');

  return (
    <Modal open onClose={onClose} title="Maquette" size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button onClick={enregistrer}>Enregistrer</Button></>}>
      <div className="flex flex-col gap-4">
        <div className="f-tabs">
          <button type="button" className={`f-tab ${onglet === 'ue' ? 'on' : ''}`} onClick={() => setOnglet('ue')}>Semestres et UE</button>
          <button type="button" className={`f-tab ${onglet === 'res' ? 'on' : ''}`} onClick={() => setOnglet('res')}>Ressources</button>
        </div>

        {onglet === 'ue' ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <Seg label="Semestre" value={sem.id} onChange={(id) => setD(p => ({ ...p, actif: id }))} options={d.semestres.map(s => ({ id: s.id, label: s.nom || '—' }))} />
              <Button variant="ghost" size="sm" onClick={() => nouveauSemestre(false)}><Plus size={14} /> Semestre</Button>
              <Button variant="ghost" size="sm" onClick={() => nouveauSemestre(true)}><Copy size={14} /> Dupliquer</Button>
              {d.semestres.length > 1 && <Button variant="ghost" size="sm" onClick={supprimerSemestre} style={{ color: 'var(--neg)' }}><Trash2 size={14} /> Supprimer</Button>}
            </div>
            <div className="f-grid2">
              <Field label="Nom"><Input value={sem.nom} onChange={(e) => majSem(s => ({ ...s, nom: e.target.value }))} /></Field>
              <Field label="Année"><Input value={sem.annee || ''} onChange={(e) => majSem(s => ({ ...s, annee: e.target.value }))} placeholder="2026-2027" /></Field>
            </div>
            {sem.ues.map(ue => {
              const somme = ue.ressources.reduce((t, r) => t + (parseNum(r.coef) || 0), 0);
              return (
                <div key={ue.id} className="f-inset">
                  <div className="mq-ue">
                    <Field label="Code"><Input value={ue.code} onChange={(e) => majUE(ue.id, u => ({ ...u, code: e.target.value }))} /></Field>
                    <Field label="Intitulé"><Input value={ue.nom} onChange={(e) => majUE(ue.id, u => ({ ...u, nom: e.target.value }))} /></Field>
                    <Field label="Bonus"><Input value={ue.bonus ?? ''} inputMode="decimal" onChange={(e) => majUE(ue.id, u => ({ ...u, bonus: e.target.value }))} /></Field>
                    <Field label="Malus"><Input value={ue.malus ?? ''} inputMode="decimal" onChange={(e) => majUE(ue.id, u => ({ ...u, malus: e.target.value }))} /></Field>
                    <IconButton label="Supprimer l'UE" danger className="mq-del"
                      onClick={() => { if (window.confirm(`Supprimer ${ue.code || 'cette UE'} ?`)) majSem(s => ({ ...s, ues: s.ues.filter(u => u.id !== ue.id) })); }}>
                      <Trash2 size={14} />
                    </IconButton>
                  </div>
                  <div className="f-box">
                    {ue.ressources.map((r, j) => (
                      <div key={j} className="mq-res">
                        <Select value={r.code} onChange={(e) => majUE(ue.id, u => ({ ...u, ressources: u.ressources.map((x, k) => (k === j ? { ...x, code: e.target.value } : x)) }))} className="f-field-sm">
                          {!d.ressources.some(x => x.code === r.code) && <option value={r.code}>{r.code || 'Choisir…'}</option>}
                          {d.ressources.map(x => <option key={x.code} value={x.code}>{x.code} · {x.nom}</option>)}
                        </Select>
                        <Input value={r.coef ?? ''} inputMode="decimal" className="f-field-sm text-right" aria-label="Coefficient"
                          onChange={(e) => majUE(ue.id, u => ({ ...u, ressources: u.ressources.map((x, k) => (k === j ? { ...x, coef: e.target.value } : x)) }))} />
                        <IconButton label="Retirer" danger onClick={() => majUE(ue.id, u => ({ ...u, ressources: u.ressources.filter((_, k) => k !== j) }))}><X size={14} /></IconButton>
                      </div>
                    ))}
                    <div className="mq-foot">
                      <Button variant="ghost" size="sm" onClick={() => majUE(ue.id, u => ({ ...u, ressources: [...u.ressources, { code: d.ressources[0]?.code || '', coef: 1 }] }))}>
                        <Plus size={14} /> Ressource
                      </Button>
                      <span className="t-muted f-num text-xs">Σ coef. {fmtNum(somme)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <Button variant="secondary" onClick={() => majSem(s => ({ ...s, ues: [...s.ues, { id: uid('ue'), code: `UE${(s.nom || 'S').replace(/\D/g, '') || ''}.${s.ues.length + 1}`, nom: '', ects: 10, bonus: 0, malus: 0, ressources: [] }] }))}>
              <Plus size={15} /> UE
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="f-box">
              {d.ressources.map((r, i) => (
                <div key={i} className="mq-r">
                  <input type="color" value={r.couleur || '#a8a29e'} onChange={(e) => majRes(i, 'couleur', e.target.value)} className="f-color" aria-label="Couleur" />
                  <Input value={r.code} onChange={(e) => majRes(i, 'code', e.target.value)} className="f-field-sm" aria-label="Code" placeholder="R1.01" />
                  <Input value={r.nom} onChange={(e) => majRes(i, 'nom', e.target.value)} className="f-field-sm" aria-label="Intitulé" placeholder="Intitulé" />
                  <Input value={aliasTexte(r)} onChange={(e) => majRes(i, 'alias', e.target.value)} className="f-field-sm mq-alias" aria-label="Alias" placeholder="Alias" />
                  <IconButton label="Supprimer" danger onClick={() => setD(p => ({ ...p, ressources: p.ressources.filter((_, j) => j !== i) }))}><Trash2 size={14} /></IconButton>
                </div>
              ))}
            </div>
            <Button variant="secondary" onClick={() => setD(p => ({ ...p, ressources: [...p.ressources, { code: '', nom: '', alias: [], couleur: PALETTE[p.ressources.length % PALETTE.length] }] }))}>
              <Plus size={15} /> Ressource
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};

// ============================================================
// FICHES DE COURS
// ============================================================

// Matières proposées : ressources du semestre actif, puis matières libres déjà utilisées
const useMatieres = (data) => useMemo(() => {
  const sem = data.semestres.find(s => s.id === data.semestreActif) || data.semestres[0];
  const codes = new Set(sem ? sem.ues.flatMap(u => u.ressources.map(r => r.code)) : []);
  const duSemestre = data.ressources.filter(r => codes.has(r.code));
  const autresRes = data.ressources.filter(r => !codes.has(r.code));
  const liste = [...duSemestre, ...autresRes];
  const libres = Array.from(new Set([...data.fiches, ...data.qcms, ...(data.podcasts || [])].map(x => String(x.matiere || '').trim())
    .filter(v => v && !trouverRessource(data.ressources, v)))).sort((a, b) => a.localeCompare(b, 'fr'));
  return { ressources: liste, libres };
}, [data.semestres, data.semestreActif, data.ressources, data.fiches, data.qcms, data.podcasts]);

// Regroupe des éléments par matière, dans l'ordre des ressources
const grouperParMatiere = (items, ressources) => {
  const groupes = new Map();
  items.forEach(x => {
    const info = infoMatiere(ressources, x.matiere);
    if (!groupes.has(info.cle)) groupes.set(info.cle, { info, items: [] });
    groupes.get(info.cle).items.push(x);
  });
  const ordre = (g) => { const i = ressources.findIndex(r => r.code === g.info.code); return i < 0 ? 999 : i; };
  return Array.from(groupes.values()).sort((a, b) => ordre(a) - ordre(b) || a.info.nom.localeCompare(b.info.nom, 'fr'));
};

const MatiereChamp = ({ value, onChange, matieres }) => {
  const connue = !value || matieres.ressources.some(r => r.code === value) || matieres.libres.includes(value);
  const [libre, setLibre] = useState(!connue);
  if (libre) {
    return (
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Matière" autoFocus />
        <Button variant="secondary" className="f-btn-icon" title="Liste" aria-label="Liste" onClick={() => { setLibre(false); onChange(''); }}><ListIcon size={15} /></Button>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <SelectMatiere value={value || ''} onChange={onChange} ressources={matieres.ressources} libres={matieres.libres} />
      <Button variant="secondary" className="f-btn-icon" title="Autre matière" aria-label="Autre matière" onClick={() => setLibre(true)}><Pencil size={14} /></Button>
    </div>
  );
};

const OUTILS_MD = [
  { label: 'Titre', icon: Heading, avant: '## ', ligne: true },
  { label: 'Gras', icon: Bold, avant: '**', apres: '**' },
  { label: 'Surligner', icon: Highlighter, avant: '==', apres: '==' },
  { label: 'Liste', icon: ListIcon, avant: '- ', ligne: true },
  { label: 'Encadré', icon: TextQuote, avant: '> ', ligne: true },
  { label: 'Tableau', icon: TableIcon, bloc: '\n| Colonne | Colonne |\n| --- | --- |\n|  |  |\n' },
];

const FicheEditor = ({ open, initial, matieres, onSave, onClose }) => {
  const [f, setF] = useState(null);
  const [vue, setVue] = useState('ecrire');
  const zone = useRef(null);
  useEffect(() => {
    if (open) { setF({ titre: '', matiere: '', contenu: '', ...initial }); setVue('ecrire'); }
  }, [open, initial]);
  if (!open || !f) return null;

  const outil = (o) => {
    const ta = zone.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    let v, curseur;
    if (o.bloc) {
      v = value.slice(0, e) + o.bloc + value.slice(e);
      curseur = e + o.bloc.length;
    } else if (o.ligne) {
      const deb = value.lastIndexOf('\n', s - 1) + 1;
      const bloc = value.slice(deb, e).split('\n').map(l => o.avant + l).join('\n');
      v = value.slice(0, deb) + bloc + value.slice(e);
      curseur = deb + bloc.length;
    } else {
      const sel = value.slice(s, e);
      v = value.slice(0, s) + o.avant + sel + o.apres + value.slice(e);
      curseur = sel ? s + o.avant.length + sel.length + o.apres.length : s + o.avant.length;
    }
    setF(p => ({ ...p, contenu: v }));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(curseur, curseur); });
  };

  const ok = f.titre.trim() || f.contenu.trim();
  const enregistrer = () => {
    if (!ok) return;
    const maintenant = new Date().toISOString();
    const titre = f.titre.trim() || (f.contenu.match(/^#{1,3}\s+(.+)$/m) || [])[1] || f.contenu.trim().split('\n')[0].slice(0, 60);
    onSave({ ...f, id: f.id || uid('fiche'), titre, creeLe: f.creeLe || maintenant, modifieLe: maintenant });
  };

  return (
    <Modal open onClose={onClose} title={f.id ? 'Modifier la fiche' : 'Nouvelle fiche'} size="lg"
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button onClick={enregistrer} disabled={!ok}>Enregistrer</Button></>}>
      <div className="flex flex-col gap-4 fe">
        <div className="f-grid2">
          <Field label="Titre"><Input value={f.titre} onChange={(e) => setF(p => ({ ...p, titre: e.target.value }))} placeholder="Titre" /></Field>
          <Field label="Matière" as="div"><MatiereChamp value={f.matiere} onChange={(v) => setF(p => ({ ...p, matiere: v }))} matieres={matieres} /></Field>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Seg label="Mode" value={vue} onChange={setVue} options={[{ id: 'ecrire', label: 'Écrire' }, { id: 'apercu', label: 'Aperçu' }]} />
          {vue === 'ecrire' && (
            <div className="flex flex-wrap" style={{ gap: 2 }}>
              {OUTILS_MD.map(o => { const Ic = o.icon; return <IconButton key={o.label} label={o.label} onClick={() => outil(o)} className="no-touch-grow fe-tool"><Ic size={15} /></IconButton>; })}
            </div>
          )}
        </div>
        {vue === 'ecrire' ? (
          <textarea ref={zone} className="f-field fe-zone" value={f.contenu} onChange={(e) => setF(p => ({ ...p, contenu: e.target.value }))}
            placeholder="## Notion&#10;- Point clé" spellCheck />
        ) : (
          <div className="fe-apercu">{f.contenu.trim() ? <Markdown texte={f.contenu} /> : <Vide>Fiche vide</Vide>}</div>
        )}
      </div>
    </Modal>
  );
};

const FicheLecteur = ({ fiche, ressources, onEdit, onDelete, onTogglePin, onClose, onGenererQcm }) => {
  const [masquer, setMasquer] = useState(false);
  if (!fiche) return null;
  const info = infoMatiere(ressources, fiche.matiere);
  return (
    <Modal open onClose={onClose} title={fiche.titre} size="lg"
      headExtra={(
        <>
          <IconButton label={masquer ? 'Tout afficher' : 'Masquer pour réviser'} onClick={() => setMasquer(m => !m)} className={masquer ? 'f-ibtn-on' : ''}>
            {masquer ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
          <IconButton label={fiche.epinglee ? 'Désépingler' : 'Épingler'} onClick={onTogglePin} className={fiche.epinglee ? 'f-ibtn-on' : ''}><Pin size={15} /></IconButton>
        </>
      )}
      footer={(
        <>
          <Button variant="ghost" onClick={onDelete} style={{ color: 'var(--neg)', marginRight: 'auto' }}><Trash2 size={14} /> Supprimer</Button>
          <Button variant="secondary" onClick={() => telecharger(`${nomFichier(fiche.titre)}.md`, `# ${fiche.titre}\n\n${fiche.contenu}`, 'text/markdown')}><Download size={14} /> .md</Button>
          {onGenererQcm && fiche.contenu.trim().length > 80 && (
            <Button variant="secondary" onClick={() => onGenererQcm({ titre: fiche.titre, matiere: fiche.matiere, contenu: fiche.contenu, source: `fiche:${fiche.id}` })}><Sparkles size={14} /> QCM</Button>
          )}
          <Button onClick={onEdit}><Pencil size={14} /> Modifier</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Matiere info={info} />
          <span className="t-muted f-num">{fiche.modifieLe ? dateCourte(new Date(fiche.modifieLe)) : ''}</span>
        </div>
        {fiche.contenu.trim() ? <Markdown texte={fiche.contenu} masquer={masquer} /> : <Vide>Fiche vide</Vide>}
      </div>
    </Modal>
  );
};

// Fiches à importer : markdown (une fiche par fichier) ou JSON (objet ou liste)
const lireFiches = (texte, nomFich = '') => {
  const t = String(texte || '').trim();
  if (!t) return [];
  if (/^[[{]/.test(t)) {
    try {
      const obj = JSON.parse(t);
      const liste = Array.isArray(obj) ? obj : (obj.fiches || [obj]);
      return liste.map(x => ({
        titre: String(x.titre || x.title || x.nom || '').trim(),
        matiere: String(x.matiere || x['matière'] || x.subject || '').trim(),
        contenu: String(x.contenu || x.content || x.markdown || x.texte || x.text || '').trim(),
      })).filter(x => x.titre || x.contenu);
    } catch { /* pas du JSON : traité comme texte */ }
  }
  const h1 = t.match(/^#\s+(.+)$/m);
  const titre = h1 ? h1[1].trim() : (nomFich.replace(/\.[^.]+$/, '') || t.split('\n')[0].replace(/^#+\s*/, '').slice(0, 80));
  const contenu = h1 && t.indexOf(h1[0]) < 3 ? t.replace(h1[0], '').trim() : t;
  return [{ titre, matiere: '', contenu }];
};

const ImportFiches = ({ open, matieres, ressources, onImport, onClose }) => {
  const [texte, setTexte] = useState('');
  const [fichiers, setFichiers] = useState([]);
  const [matiere, setMatiere] = useState('');
  useEffect(() => { if (open) { setTexte(''); setFichiers([]); setMatiere(''); } }, [open]);
  if (!open) return null;
  const fiches = [...fichiers, ...lireFiches(texte)];
  const choisir = async (e) => {
    const liste = Array.from(e.target.files || []);
    e.target.value = '';
    const lues = [];
    for (const f of liste) lues.push(...lireFiches(await lireFichierTexte(f), f.name));
    setFichiers(prev => [...prev, ...lues]);
  };
  const importer = () => {
    const maintenant = new Date().toISOString();
    onImport(fiches.map(x => {
      const r = trouverRessource(ressources, x.matiere);
      return { id: uid('fiche'), titre: x.titre || 'Fiche', contenu: x.contenu, matiere: matiere || (r ? r.code : x.matiere), creeLe: maintenant, modifieLe: maintenant };
    }));
  };
  return (
    <Modal open onClose={onClose} title="Importer des fiches" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button onClick={importer} disabled={!fiches.length}>Importer {fiches.length || ''}</Button></>}>
      <div className="flex flex-col gap-4">
        <label className="f-drop">
          <FolderOpen size={16} /> Fichiers .md, .txt ou .json
          <input type="file" accept=".md,.markdown,.txt,.json,text/markdown,text/plain,application/json" multiple onChange={choisir} hidden />
        </label>
        <Field label="Texte">
          <textarea className="f-field" rows={8} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="# Titre de la fiche" />
        </Field>
        <Field label="Matière" as="div">
          <SelectMatiere value={matiere} onChange={setMatiere} ressources={matieres.ressources} libres={matieres.libres} />
        </Field>
        {fiches.length > 0 && (
          <div className="f-box">
            {fiches.map((x, i) => (
              <div key={i} className="f-ln">
                <FileText size={15} className="t-muted shrink-0" />
                <span className="flex-1 min-w-0 truncate t-ink">{x.titre || 'Fiche'}</span>
                <span className="t-muted f-num text-xs">{pluriel(x.contenu.split(/\s+/).filter(Boolean).length, 'mot')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const FichesView = ({ data, commit, focus, signal, embedded = false, onGenererQcm }) => {
  const matieres = useMatieres(data);
  const [q, setQ] = useState('');
  const [filtre, setFiltre] = useState(() => (focus && focus.view === 'fiches' && focus.matiere) || 'all');
  const [lue, setLue] = useState(null);
  const [edit, setEdit] = useState(null);
  const [imp, setImp] = useState(false);
  const [suppr, setSuppr] = useState(null);

  const vu = useRef(signal.n);
  useEffect(() => {
    if (signal.n === vu.current) return;
    vu.current = signal.n;
    if (signal.type === 'add') setEdit({ matiere: filtre !== 'all' ? filtre : '' });
    if (signal.type === 'import') setImp(true);
  }, [signal, filtre]);

  const filtrees = data.fiches
    .filter(f => filtre === 'all' || infoMatiere(data.ressources, f.matiere).cle === infoMatiere(data.ressources, filtre).cle)
    .filter(f => { if (!q.trim()) return true; const n = norm(q); return norm(f.titre).includes(n) || norm(f.contenu).includes(n); })
    .sort((a, b) => (b.epinglee ? 1 : 0) - (a.epinglee ? 1 : 0) || String(b.modifieLe || '').localeCompare(String(a.modifieLe || '')));
  const groupes = grouperParMatiere(filtrees, data.ressources);
  const ficheLue = lue ? data.fiches.find(f => f.id === lue) : null;

  const enregistrer = (fiche) => {
    commit(d => ({ ...d, fiches: d.fiches.some(f => f.id === fiche.id) ? d.fiches.map(f => (f.id === fiche.id ? fiche : f)) : [...d.fiches, fiche] }));
    setEdit(null);
    setLue(fiche.id);
  };

  return (
    <div className="flex flex-col gap-4">
      {!embedded && (
        <PageHeader title="Fiches" meta={pluriel(filtrees.length, 'fiche')}>
          <Button variant="secondary" className="only-desk" onClick={() => setImp(true)}><Upload size={15} /> Importer</Button>
          <Button className="only-desk" onClick={() => setEdit({ matiere: filtre !== 'all' ? filtre : '' })}><Plus size={15} /> Fiche</Button>
        </PageHeader>
      )}

      <Card className="overflow-hidden">
        <div className="f-toolbar">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans les fiches" style={{ flex: '1 1 220px' }} />
          <SelectMatiere tout value={filtre} onChange={setFiltre} ressources={matieres.ressources} libres={matieres.libres} style={{ flex: '1 1 180px' }} />
        </div>
        {filtrees.length === 0 ? (
          <Vide action={!data.fiches.length && (
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => setImp(true)}><Upload size={15} /> Importer</Button>
              <Button onClick={() => setEdit({})}><Plus size={15} /> Fiche</Button>
            </div>
          )}>Aucune fiche</Vide>
        ) : groupes.map(g => (
          <div key={g.info.cle}>
            <div className="f-group-h">
              <Matiere info={g.info} />
              <span className="t-muted f-num text-xs">{g.items.length}</span>
            </div>
            {g.items.map((f, i) => (
              <button key={f.id} type="button" className={`l-row f-row ${i > 0 ? 'f-line' : ''}`} onClick={() => setLue(f.id)}>
                <span className="l-lib">
                  <span className="flex items-center gap-2 min-w-0">
                    {f.epinglee && <Pin size={13} className="t-muted shrink-0" />}
                    <span className="truncate t-ink font-medium">{f.titre}</span>
                  </span>
                  <span className="t-muted text-xs truncate">{apercuFiche(f.contenu)}</span>
                </span>
                <span className="t-muted f-num text-xs shrink-0">{f.modifieLe ? dateCourte(new Date(f.modifieLe)) : ''}</span>
                <ChevronRight size={15} className="t-faint shrink-0" />
              </button>
            ))}
          </div>
        ))}
      </Card>

      <FicheLecteur fiche={ficheLue} ressources={data.ressources} onClose={() => setLue(null)} onGenererQcm={onGenererQcm ? (d) => { onGenererQcm(d); setLue(null); } : null}
        onEdit={() => { setEdit(ficheLue); setLue(null); }}
        onDelete={() => setSuppr(ficheLue)}
        onTogglePin={() => commit(d => ({ ...d, fiches: d.fiches.map(f => (f.id === ficheLue.id ? { ...f, epinglee: !f.epinglee } : f)) }))} />
      <FicheEditor open={!!edit} initial={edit} matieres={matieres} onSave={enregistrer} onClose={() => setEdit(null)} />
      <ImportFiches open={imp} matieres={matieres} ressources={data.ressources} onClose={() => setImp(false)}
        onImport={(liste) => { commit(d => ({ ...d, fiches: [...d.fiches, ...liste] })); setImp(false); }} />
      <Confirm open={!!suppr} title="Supprimer la fiche" onClose={() => setSuppr(null)}
        message={suppr ? `Supprimer « ${suppr.titre} » ?` : ''}
        onConfirm={() => { const id = suppr.id; commit(d => ({ ...d, fiches: d.fiches.filter(f => f.id !== id) })); setSuppr(null); setLue(null); }} />
    </div>
  );
};

// Première ligne de texte d'une fiche, sans syntaxe
const apercuFiche = (contenu) => {
  const l = String(contenu || '').split('\n').map(x => x.replace(/^[#>\-*+\s|]+|\*\*|==|`/g, '').trim()).find(x => x && !/^[-:| ]+$/.test(x));
  return l ? l.slice(0, 140) : '';
};

// ============================================================
// RESSOURCES — fiches, QCM, podcasts et coffre Obsidian
// ============================================================

const EXT_AUDIO = { mp3: 'audio/mpeg', m4a: 'audio/mp4', aac: 'audio/aac', wav: 'audio/wav', ogg: 'audio/ogg', oga: 'audio/ogg', opus: 'audio/ogg', flac: 'audio/flac', webm: 'audio/webm' };
const extension = (chemin) => { const m = String(chemin || '').split(/[?#]/)[0].match(/\.([a-z0-9]+)$/i); return m ? m[1].toLowerCase() : ''; };
const estAudio = (chemin) => !!EXT_AUDIO[extension(chemin)];
const nomSansExt = (chemin) => String(chemin || '').split('/').pop().replace(/\.[a-z0-9]+$/i, '');
const dossierDe = (chemin) => { const p = String(chemin || '').split('/'); p.pop(); return p.join('/'); };

// Liens de partage courants → lien de lecture directe
const lienLecture = (url) => {
  const u = String(url || '').trim();
  const drive = u.match(/drive\.google\.com\/file\/d\/([^/?#]+)/) || u.match(/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([^&#]+)/);
  if (drive) return `https://drive.google.com/uc?export=download&id=${drive[1]}`;
  if (/^https:\/\/www\.dropbox\.com\//.test(u)) return u.replace('www.dropbox.com', 'dl.dropboxusercontent.com').replace(/([?&])dl=0&?/, '$1').replace(/[?&]$/, '');
  return u;
};
const lisibleEnDirect = (url) => estAudio(url) || lienLecture(url) !== String(url || '').trim();

// Syntaxe propre à Obsidian ramenée au markdown des fiches
const depuisObsidian = (texte) => String(texte || '')
  .replace(/^﻿?---\n[\s\S]*?\n---\n?/, '')
  .replace(/%%[\s\S]*?%%/g, '')
  .replace(/!\[\[[^\]]*\]\]/g, '')
  .replace(/\[\[([^\]|#]+)(?:#[^\]|]*)?\|([^\]]+)\]\]/g, '$2')
  .replace(/\[\[([^\]|#]+)(?:#([^\]|]*))?\]\]/g, (_, a, h) => (h ? `${a} › ${h}` : a))
  .replace(/^(\s*>\s*)\[!(\w+)\][+-]?\s*(.*)$/gm, (_, q, type, titre) => `${q}**${titre || type.charAt(0).toUpperCase() + type.slice(1)}**`)
  .trim();

const posLecture = {
  get: (id) => Number(LS.get(`etudes_pod_${id}`, '0')) || 0,
  set: (id, t) => LS.set(`etudes_pod_${id}`, t > 5 ? String(Math.floor(t)) : ''),
};

// ---------- Lecteur audio ----------
const PodcastLecteur = ({ podcast: p, ressources, token, depot, onClose, onEcoute, onEdit }) => {
  const [src, setSrc] = useState(p && !p.obsidian ? lienLecture(p.url) : '');
  const [erreur, setErreur] = useState('');
  const ref = useRef(null);
  const dernier = useRef(0);
  useEffect(() => {
    if (!p || !p.obsidian) return undefined;
    let url = '';
    let actif = true;
    obsidianApi.audio(token, depot, p.sha, EXT_AUDIO[extension(p.path)])
      .then(u => { url = u; if (actif) setSrc(u); else URL.revokeObjectURL(u); })
      .catch(e => actif && setErreur(e.message));
    return () => { actif = false; if (url) URL.revokeObjectURL(url); };
  }, [p, token, depot]);
  if (!p) return null;
  const direct = p.obsidian || lisibleEnDirect(p.url);
  const info = infoMatiere(ressources, p.matiere);
  return (
    <Modal open onClose={onClose} title={p.titre} size="md"
      headExtra={!p.obsidian && onEdit && <IconButton label="Modifier" onClick={onEdit}><Pencil size={15} /></IconButton>}
      footer={(
        <>
          {!p.obsidian && p.url && <LienBouton href={p.url}><ExternalLink size={14} /> Ouvrir le lien</LienBouton>}
          {!p.obsidian && <Button variant={p.ecoute ? 'secondary' : 'primary'} onClick={() => onEcoute(!p.ecoute)}>{p.ecoute ? 'Marquer non écouté' : <><Check size={14} /> Écouté</>}</Button>}
        </>
      )}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {p.matiere && <Matiere info={info} />}
          {p.obsidian && <span className="t-muted text-xs">{p.path}</span>}
        </div>
        {direct ? (
          erreur ? <p className="text-xs t-neg">{erreur}</p>
            : src ? (
              <audio ref={ref} className="pd-audio" controls autoPlay preload="auto" src={src}
                onLoadedMetadata={() => { const t = posLecture.get(p.id); if (ref.current && t && t < (ref.current.duration || Infinity) - 5) ref.current.currentTime = t; }}
                onTimeUpdate={() => { const t = ref.current?.currentTime || 0; if (Math.abs(t - dernier.current) > 5) { dernier.current = t; posLecture.set(p.id, t); } }}
                onEnded={() => { posLecture.set(p.id, 0); if (!p.obsidian && !p.ecoute) onEcoute(true); }}
                onError={() => setErreur('Lecture impossible ici : ouvrir le lien.')} />
            ) : <p className="t-muted text-xs">Chargement…</p>
        ) : (
          <Vide action={p.url && <LienBouton href={p.url} variant="primary"><Play size={14} /> Écouter</LienBouton>}>Lecture sur le site d’origine</Vide>
        )}
      </div>
    </Modal>
  );
};

const PodcastEditeur = ({ open, initial, matieres, onSave, onDelete, onClose }) => {
  const [f, setF] = useState(null);
  useEffect(() => { if (open) setF({ titre: '', matiere: '', url: '', ...initial }); }, [open, initial]);
  if (!open || !f) return null;
  const ok = f.titre.trim() && /^https?:\/\//i.test(f.url.trim());
  const enregistrer = () => {
    if (!ok) return;
    onSave({ ...f, id: f.id || uid('pod'), titre: f.titre.trim(), url: f.url.trim(), ajouteLe: f.ajouteLe || new Date().toISOString() });
  };
  return (
    <Modal open onClose={onClose} title={f.id ? 'Modifier le podcast' : 'Nouveau podcast'} size="sm"
      footer={(
        <>
          {f.id && <Button variant="ghost" onClick={() => onDelete(f)} style={{ color: 'var(--neg)', marginRight: 'auto' }}>Supprimer</Button>}
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer} disabled={!ok}>Enregistrer</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <Field label="Titre"><Input value={f.titre} onChange={(e) => setF(p => ({ ...p, titre: e.target.value }))} placeholder="Comptabilité · chapitre 3" /></Field>
        <Field label="Matière" as="div">
          <MatiereChamp value={f.matiere} onChange={(v) => setF(p => ({ ...p, matiere: v }))} matieres={matieres} />
        </Field>
        <Field label="Lien"><Input value={f.url} onChange={(e) => setF(p => ({ ...p, url: e.target.value }))} inputMode="url" placeholder="https://" /></Field>
      </div>
    </Modal>
  );
};

// ---------- Coffre Obsidian : arbre mis en cache, actualisé à chaque ouverture ----------
const useObsidian = (token, conf) => {
  const depot = conf && conf.depot;
  const cle = depot ? `etudes_obs_${depot}` : null;
  const [etat, setEtat] = useState(() => (cle && LS.getJSON(cle)) || null);
  const [charge, setCharge] = useState(false);
  const [erreur, setErreur] = useState('');
  const actualiser = useCallback(async () => {
    if (!token || !depot) return;
    setCharge(true); setErreur('');
    try {
      const a = await obsidianApi.arbre(token, depot);
      setEtat(a);
      try { window.localStorage.setItem(cle, JSON.stringify(a)); } catch { /* cache plein */ }
    } catch (e) { setErreur(e.message); }
    finally { setCharge(false); }
  }, [token, depot, cle]);
  useEffect(() => {
    setEtat((cle && LS.getJSON(cle)) || null);
    actualiser();
    const onVisible = () => { if (document.visibilityState === 'visible') actualiser(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [actualiser, cle]);
  const prefixe = String((conf && conf.dossier) || '').replace(/^\/+|\/+$/g, '');
  const fichiers = ((etat && etat.fichiers) || [])
    .filter(x => !prefixe || x.path === prefixe || x.path.startsWith(prefixe + '/'))
    .map(x => ({ ...x, rel: prefixe ? x.path.slice(prefixe.length + 1) : x.path }));
  return { depot, fichiers, le: etat && etat.le, charge, erreur, actualiser };
};

const ObsidianConfig = ({ initial, onSave, onClose }) => {
  const [depot, setDepot] = useState((initial && initial.depot) || '');
  const [dossier, setDossier] = useState((initial && initial.dossier) || '');
  const propre = depot.trim().replace(/^https?:\/\/github\.com\//i, '').replace(/\.git$/i, '').replace(/\/+$/, '');
  const ok = /^[\w.-]+\/[\w.-]+$/.test(propre);
  return (
    <Modal open onClose={onClose} title="Coffre Obsidian" size="sm"
      footer={(
        <>
          {initial && initial.depot && <Button variant="ghost" onClick={() => onSave(null)} style={{ color: 'var(--neg)', marginRight: 'auto' }}>Retirer</Button>}
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button disabled={!ok} onClick={() => onSave({ depot: propre, dossier: dossier.trim().replace(/^\/+|\/+$/g, '') })}>Enregistrer</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <Field label="Dépôt GitHub"><Input value={depot} onChange={(e) => setDepot(e.target.value)} placeholder="compte/coffre" autoCapitalize="off" autoCorrect="off" spellCheck={false} /></Field>
        <Field label="Dossier"><Input value={dossier} onChange={(e) => setDossier(e.target.value)} placeholder="Tout le coffre" autoCapitalize="off" autoCorrect="off" spellCheck={false} /></Field>
      </div>
    </Modal>
  );
};

const ObsidianView = ({ obs, token, ressources, matieres, onConfigurer, onEnFiche, onGenererQcm }) => {
  const [q, setQ] = useState('');
  const [ouvert, setOuvert] = useState(null);
  const [texte, setTexte] = useState('');
  const [erreur, setErreur] = useState('');
  const cache = useRef({});
  const notes = obs.fichiers.filter(x => /\.md$/i.test(x.path));
  const n = norm(q);
  const filtrees = notes.filter(x => !n || norm(x.rel).includes(n) || norm(cache.current[x.sha] || '').includes(n))
    .sort((a, b) => a.rel.localeCompare(b.rel, 'fr', { numeric: true }));
  const groupes = [];
  filtrees.forEach(x => {
    const d = dossierDe(x.rel) || 'Racine';
    let g = groupes.find(y => y.d === d);
    if (!g) { g = { d, items: [] }; groupes.push(g); }
    g.items.push(x);
  });
  const ouvrir = async (x) => {
    setOuvert(x); setErreur('');
    if (cache.current[x.sha] !== undefined) { setTexte(cache.current[x.sha]); return; }
    setTexte('');
    try { const t = await obsidianApi.texte(token, obs.depot, x.path); cache.current[x.sha] = t; setTexte(t); }
    catch (e) { setErreur(e.message); }
  };

  if (!obs.depot) {
    return (
      <Card><Vide action={<Button onClick={onConfigurer}><Gem size={15} /> Relier un coffre</Button>}>Aucun coffre Obsidian</Vide></Card>
    );
  }
  return (
    <>
      <Card className="overflow-hidden">
        <div className="f-toolbar">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher dans le coffre" style={{ flex: '1 1 220px' }} />
          <span className="flex items-center gap-1 ml-auto">
            <span className="t-muted text-xs f-num">{horodatage(obs.le)}</span>
            <IconButton label="Actualiser" onClick={obs.actualiser}><RefreshCw size={15} className={obs.charge ? 'animate-spin' : ''} /></IconButton>
            <IconButton label="Coffre" onClick={onConfigurer}><SlidersHorizontal size={15} /></IconButton>
          </span>
        </div>
        {obs.erreur && <p className="text-xs t-neg" style={{ padding: '10px 16px 0' }}>{obs.erreur}</p>}
        {filtrees.length === 0 ? <Vide>{obs.charge ? 'Chargement…' : 'Aucune note'}</Vide> : groupes.map(g => (
          <div key={g.d}>
            <div className="f-group-h">
              <span className="f-cat min-w-0"><FolderOpen size={14} className="t-muted shrink-0" /><span className="truncate">{g.d}</span></span>
              <span className="t-muted f-num text-xs">{g.items.length}</span>
            </div>
            {g.items.map((x, i) => (
              <button key={x.path} type="button" className={`l-row f-row ${i > 0 ? 'f-line' : ''}`} onClick={() => ouvrir(x)}>
                <span className="l-lib"><span className="truncate t-ink font-medium">{nomSansExt(x.path)}</span></span>
                <span />
                <ChevronRight size={15} className="t-faint shrink-0" />
              </button>
            ))}
          </div>
        ))}
      </Card>
      {ouvert && (
        <Modal open onClose={() => setOuvert(null)} title={nomSansExt(ouvert.path)} size="lg"
          headExtra={texte && (
            <>
              {onGenererQcm && depuisObsidian(texte).length > 80 && (
                <IconButton label="Générer un QCM" onClick={() => { onGenererQcm({ titre: nomSansExt(ouvert.path), matiere: dossierDe(ouvert.rel).split('/').pop() || '', contenu: depuisObsidian(texte), source: `obsidian:${ouvert.path}` }); setOuvert(null); }}><Sparkles size={15} /></IconButton>
              )}
              <IconButton label="Copier en fiche" onClick={() => onEnFiche({ titre: nomSansExt(ouvert.path), contenu: depuisObsidian(texte), matiere: '' })}><Copy size={15} /></IconButton>
            </>
          )}>
          {erreur ? <p className="text-xs t-neg">{erreur}</p>
            : texte ? <Markdown texte={depuisObsidian(texte)} /> : <p className="t-muted text-xs">Chargement…</p>}
        </Modal>
      )}
    </>
  );
};

// ---------- Podcasts ----------
const PodcastsView = ({ data, commit, signal, focus, obs, token }) => {
  const matieres = useMatieres(data);
  const [q, setQ] = useState('');
  const [filtre, setFiltre] = useState(() => (focus && focus.view === 'podcasts' && focus.matiere) || 'all');
  const [lu, setLu] = useState(null);
  const [edit, setEdit] = useState(null);
  const [suppr, setSuppr] = useState(null);

  const vu = useRef(signal.n);
  useEffect(() => {
    if (signal.n === vu.current) return;
    vu.current = signal.n;
    if (signal.type === 'add') setEdit({ matiere: filtre !== 'all' ? filtre : '' });
  }, [signal, filtre]);

  const duCoffre = obs.fichiers.filter(x => estAudio(x.path))
    .map(x => ({ id: `obs:${x.sha}`, titre: nomSansExt(x.path), matiere: dossierDe(x.rel).split('/').pop() || 'Obsidian', path: x.path, sha: x.sha, obsidian: true }));
  const tous = [...(data.podcasts || []), ...duCoffre];
  const n = norm(q);
  const filtres = tous
    .filter(p => filtre === 'all' || infoMatiere(data.ressources, p.matiere).cle === infoMatiere(data.ressources, filtre).cle)
    .filter(p => !n || norm(p.titre).includes(n))
    .sort((a, b) => (a.ecoute ? 1 : 0) - (b.ecoute ? 1 : 0) || String(b.ajouteLe || '').localeCompare(String(a.ajouteLe || '')) || a.titre.localeCompare(b.titre, 'fr', { numeric: true }));
  const groupes = grouperParMatiere(filtres, data.ressources);
  const courant = lu ? tous.find(p => p.id === lu) : null;

  const enregistrer = (p) => {
    commit(d => ({ ...d, podcasts: (d.podcasts || []).some(x => x.id === p.id) ? d.podcasts.map(x => (x.id === p.id ? p : x)) : [...(d.podcasts || []), p] }));
    setEdit(null);
  };
  const marquer = (id, v) => commit(d => ({ ...d, podcasts: (d.podcasts || []).map(x => (x.id === id ? { ...x, ecoute: v } : x)) }));

  return (
    <>
      <Card className="overflow-hidden">
        <div className="f-toolbar">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un podcast" style={{ flex: '1 1 220px' }} />
          <SelectMatiere tout value={filtre} onChange={setFiltre} ressources={matieres.ressources} libres={matieres.libres} style={{ flex: '1 1 180px' }} />
        </div>
        {filtres.length === 0 ? (
          <Vide action={!tous.length && <Button onClick={() => setEdit({})}><Plus size={15} /> Podcast</Button>}>Aucun podcast</Vide>
        ) : groupes.map(g => (
          <div key={g.info.cle}>
            <div className="f-group-h">
              <Matiere info={g.info} />
              <span className="t-muted f-num text-xs">{g.items.length}</span>
            </div>
            {g.items.map((p, i) => {
              const pos = posLecture.get(p.id);
              return (
                <div key={p.id} className={`q-row f-row ${i > 0 ? 'f-line' : ''} ${p.ecoute ? 'pd-ecoute' : ''}`}>
                  <button type="button" className="q-play no-touch-grow" onClick={() => setLu(p.id)} aria-label={`Écouter ${p.titre}`}><Play size={14} /></button>
                  <button type="button" className="l-lib text-left" onClick={() => setLu(p.id)}>
                    <span className="truncate t-ink font-medium">{p.titre}</span>
                    <span className="t-muted text-xs f-num truncate">
                      {p.obsidian ? 'Obsidian' : (p.url || '').replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                      {pos ? ` · reprise à ${Math.floor(pos / 60)} min ${String(Math.floor(pos % 60)).padStart(2, '0')}` : ''}
                    </span>
                  </button>
                  {p.ecoute ? <span className="f-badge f-b-ok">Écouté</span> : <span />}
                  {p.obsidian ? <span /> : <RowActions onEdit={() => setEdit(p)} onDelete={() => setSuppr(p)} />}
                </div>
              );
            })}
          </div>
        ))}
      </Card>
      {courant && (
        <PodcastLecteur key={courant.id} podcast={courant} ressources={data.ressources} token={token} depot={obs.depot}
          onClose={() => setLu(null)} onEcoute={(v) => marquer(courant.id, v)} onEdit={() => { setEdit(courant); setLu(null); }} />
      )}
      <PodcastEditeur open={!!edit} initial={edit} matieres={matieres} onSave={enregistrer} onDelete={(p) => setSuppr(p)} onClose={() => setEdit(null)} />
      <Confirm open={!!suppr} title="Supprimer le podcast" onClose={() => setSuppr(null)}
        message={suppr ? `Supprimer « ${suppr.titre} » ?` : ''}
        onConfirm={() => { const id = suppr.id; commit(d => ({ ...d, podcasts: (d.podcasts || []).filter(x => x.id !== id) })); posLecture.set(id, 0); setSuppr(null); setEdit(null); }} />
    </>
  );
};

// ---------- Espace Ressources ----------
const ONGLETS_RESSOURCES = [
  { id: 'fiches', label: 'Fiches', icon: FileText },
  { id: 'qcm', label: 'QCM', icon: ListChecks },
  { id: 'podcasts', label: 'Podcasts', icon: Headphones },
];

const RessourcesView = ({ data, commit, focus, signal, onglet, onOnglet, envoyer, token, onGenererQcm }) => {
  const obs = useObsidian(token, data.obsidian);
  const nbPod = (data.podcasts || []).length + obs.fichiers.filter(x => estAudio(x.path)).length;
  const comptes = { fiches: data.fiches.length, qcm: data.qcms.length + (data.demandesQcm || []).length, podcasts: nbPod };
  const boutons = {
    fiches: <><Button variant="secondary" className="only-desk" onClick={() => envoyer('import')}><Upload size={15} /> Importer</Button><Button className="only-desk" onClick={() => envoyer('add')}><Plus size={15} /> Fiche</Button></>,
    qcm: <><Button variant="secondary" className="only-desk" onClick={() => envoyer('import')}><Upload size={15} /> Importer</Button><Button className="only-desk" onClick={() => envoyer('add')}><Plus size={15} /> QCM</Button></>,
    podcasts: <Button className="only-desk" onClick={() => envoyer('add')}><Plus size={15} /> Podcast</Button>,
  }[onglet];
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Ressources">{boutons}</PageHeader>
      <Seg fill className="res-seg" label="Ressources" value={onglet} onChange={onOnglet}
        options={ONGLETS_RESSOURCES.map(o => { const Ic = o.icon; return { id: o.id, label: o.label, icon: <Ic size={15} />, count: comptes[o.id] || undefined }; })} />
      {onglet === 'fiches' && <FichesView embedded key={focus?.n || 'fiches'} data={data} commit={commit} focus={focus} signal={signal} onGenererQcm={onGenererQcm} />}
      {onglet === 'qcm' && <QcmView embedded key={focus?.n || 'qcm'} data={data} commit={commit} focus={focus} signal={signal} />}
      {onglet === 'podcasts' && <PodcastsView key={focus?.n || 'podcasts'} data={data} commit={commit} focus={focus} signal={signal} obs={obs} token={token} />}
    </div>
  );
};

// ---------- Rubrique Obsidian ----------
const ObsidianRubrique = ({ data, commit, token, montrer, onGenererQcm }) => {
  const obs = useObsidian(token, data.obsidian);
  const matieres = useMatieres(data);
  const [config, setConfig] = useState(false);
  const nbNotes = obs.fichiers.filter(x => /\.md$/i.test(x.path)).length;
  const enFiche = (f) => {
    const maintenant = new Date().toISOString();
    commit(d => ({ ...d, fiches: [...d.fiches, { id: uid('fiche'), ...f, creeLe: maintenant, modifieLe: maintenant }] }));
    montrer('Fiche créée');
  };
  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Obsidian" meta={obs.depot ? pluriel(nbNotes, 'note') : null} />
      <ObsidianView obs={obs} token={token} ressources={data.ressources} matieres={matieres}
        onConfigurer={() => setConfig(true)} onEnFiche={enFiche} onGenererQcm={onGenererQcm} />
      {config && (
        <ObsidianConfig initial={data.obsidian} onClose={() => setConfig(false)}
          onSave={(c) => { commit(d => ({ ...d, obsidian: c })); setConfig(false); }} />
      )}
    </div>
  );
};

// ============================================================
// QCM
// ============================================================

const LETTRES = 'ABCDEFGHIJ';

// Lecture tolérante d'un QCM JSON (format { titre, matiere, questions: [{ enonce, propositions, reponses, explication, theme }] })
const extraireJSON = (texte) => {
  const t = String(texte || '').trim();
  const bloc = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const src = bloc ? bloc[1] : t;
  try { return JSON.parse(src); } catch { /* on tente d'isoler le JSON */ }
  const debut = src.search(/[[{]/);
  const fin = Math.max(src.lastIndexOf('}'), src.lastIndexOf(']'));
  if (debut >= 0 && fin > debut) return JSON.parse(src.slice(debut, fin + 1));
  throw new Error('JSON illisible');
};

const normaliserQuestion = (x) => {
  const enonce = String(x.enonce ?? x['énoncé'] ?? x.question ?? x.intitule ?? x.texte ?? x.text ?? '').trim();
  let props = x.propositions ?? x.choix ?? x.options ?? x.choices ?? x.answers ?? x.reponses_possibles ?? [];
  let objCorrects = [];
  if (props && !Array.isArray(props) && typeof props === 'object') props = Object.values(props);
  props = (props || []).map((p, i) => {
    if (p && typeof p === 'object') {
      if (p.correct || p.bonne || p.vrai || p.isCorrect) objCorrects.push(i);
      return String(p.texte ?? p.text ?? p.label ?? p.proposition ?? '').trim();
    }
    return String(p).trim();
  });
  let rep = x.reponses ?? x['réponses'] ?? x.bonnes_reponses ?? x.bonnesReponses ?? x.correct ?? x.answer ?? x.reponse ?? x.bonne_reponse ?? x.solution;
  if (rep === undefined || rep === null) rep = objCorrects;
  if (!Array.isArray(rep)) rep = [rep];
  let idx = rep.map(r => {
    if (typeof r === 'number') return r;
    const s = String(r).trim();
    if (/^\d+$/.test(s)) return parseInt(s, 10);
    if (/^[A-J]$/i.test(s)) return LETTRES.indexOf(s.toUpperCase());
    const i = props.findIndex(p => norm(p) === norm(s));
    return i;
  }).filter(i => i >= 0);
  // Indices comptés à partir de 1 ?
  if (idx.length && idx.every(i => i >= 1) && idx.some(i => i === props.length)) idx = idx.map(i => i - 1);
  idx = Array.from(new Set(idx.filter(i => i < props.length))).sort((a, b) => a - b);
  return {
    id: uid('q'),
    enonce,
    propositions: props,
    reponses: idx,
    explication: String(x.explication ?? x.explanation ?? x.justification ?? x.correction ?? '').trim(),
    theme: String(x.theme ?? x['thème'] ?? x.chapitre ?? x.notion ?? '').trim(),
  };
};

const lireQcms = (texte) => {
  const obj = extraireJSON(texte);
  let liste;
  if (Array.isArray(obj)) liste = obj.length && obj[0] && Array.isArray(obj[0].questions) ? obj : [{ titre: 'QCM importé', questions: obj }];
  else if (obj && Array.isArray(obj.qcms)) liste = obj.qcms;
  else liste = [obj];
  return liste.map(q => ({
    titre: String(q.titre ?? q.title ?? q.nom ?? 'QCM').trim(),
    matiere: String(q.matiere ?? q['matière'] ?? q.subject ?? '').trim(),
    questions: (q.questions || []).map(normaliserQuestion).filter(x => x.enonce && x.propositions.length >= 2 && x.reponses.length),
  })).filter(q => q.questions.length);
};

const exporterQcm = (q) => JSON.stringify({
  titre: q.titre, matiere: q.matiere,
  questions: q.questions.map(({ enonce, propositions, reponses, explication, theme }) => ({ enonce, propositions, reponses, explication, theme })),
}, null, 2);

const meilleurScore = (q) => {
  const t = q.tentatives || [];
  if (!t.length) return null;
  return Math.max(...t.map(x => (x.total ? x.score / x.total : 0)));
};
const aRevoir = (q) => q.questions.filter(x => q.stats?.[x.id] && q.stats[x.id].dernier === false);
const toneScore = (r) => (r === null ? 'f-b-n' : r >= 0.75 ? 'f-b-ok' : r >= 0.5 ? 'f-b-n' : 'f-b-wait');
const pct = (r) => `${Math.round(r * 100)} %`;

const QcmJoueur = ({ qcm, ressources, onFinish, onClose }) => {
  const [etape, setEtape] = useState('depart');
  const [choixQ, setChoixQ] = useState('toutes');
  const [ordre, setOrdre] = useState(() => LS.get('etudes_qcm_ordre', 'melange'));
  const [serie, setSerie] = useState([]);
  const [pos, setPos] = useState(0);
  const [sel, setSel] = useState([]);
  const [valide, setValide] = useState(false);
  const [resultats, setResultats] = useState([]);
  useEffect(() => { LS.set('etudes_qcm_ordre', ordre); }, [ordre]);
  if (!qcm) return null;
  const info = infoMatiere(ressources, qcm.matiere);
  const revoir = aRevoir(qcm);
  const best = meilleurScore(qcm);

  const lancer = (questions) => {
    const base = ordre === 'melange' ? melanger(questions) : questions;
    setSerie(base.map(q => ({ q, perm: ordre === 'melange' ? melanger(q.propositions.map((_, i) => i)) : q.propositions.map((_, i) => i) })));
    setPos(0); setSel([]); setValide(false); setResultats([]); setEtape('jeu');
  };
  const courant = serie[pos];
  const multiple = courant && courant.q.reponses.length > 1;
  const basculer = (i) => {
    if (valide) return;
    setSel(prev => (multiple ? (prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]) : [i]));
  };
  const valider = () => {
    const bonnes = new Set(courant.q.reponses);
    const juste = sel.length === bonnes.size && sel.every(i => bonnes.has(i));
    setResultats(r => [...r, { q: courant.q, juste, sel }]);
    setValide(true);
  };
  const suivante = () => {
    if (pos + 1 < serie.length) { setPos(pos + 1); setSel([]); setValide(false); return; }
    const score = resultats.filter(r => r.juste).length;
    onFinish({ date: new Date().toISOString(), score, total: resultats.length }, resultats.map(r => ({ id: r.q.id, juste: r.juste })));
    setEtape('fin');
  };

  let corps, pied;
  if (etape === 'depart') {
    corps = (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Matiere info={info} />
          <span className="t-muted f-num">{pluriel(qcm.questions.length, 'question')}</span>
          {best !== null && <span className={`f-badge ${toneScore(best)}`}>Meilleur {pct(best)}</span>}
        </div>
        <div className="f-box">
          <Ligne label="Questions">
            <Seg label="Questions" value={choixQ} onChange={setChoixQ}
              options={[{ id: 'toutes', label: 'Toutes', count: qcm.questions.length }, ...(revoir.length ? [{ id: 'revoir', label: 'À revoir', count: revoir.length }] : [])]} />
          </Ligne>
          <Ligne label="Ordre">
            <Seg label="Ordre" value={ordre} onChange={setOrdre} options={[{ id: 'melange', label: 'Mélangé' }, { id: 'original', label: 'Original' }]} />
          </Ligne>
        </div>
        {(qcm.tentatives || []).length > 0 && (
          <div className="f-box">
            {qcm.tentatives.slice(-5).reverse().map((t, i) => (
              <div key={i} className="f-ln">
                <span className="flex-1 t-ink3 f-num">{horodatage(t.date)}</span>
                <span className="f-num t-ink font-medium">{t.score}/{t.total}</span>
                <span className={`f-badge ${toneScore(t.total ? t.score / t.total : 0)}`}>{pct(t.total ? t.score / t.total : 0)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
    pied = <Button size="lg" onClick={() => lancer(choixQ === 'revoir' ? revoir : qcm.questions)}><Play size={15} /> Commencer</Button>;
  } else if (etape === 'jeu' && courant) {
    const bonnes = new Set(courant.q.reponses);
    corps = (
      <div className="flex flex-col gap-4 qz">
        <div className="flex items-center gap-3">
          <span className="f-num t-muted text-xs shrink-0">{pos + 1} / {serie.length}</span>
          <span className="flex-1"><Track value={pos + (valide ? 1 : 0)} max={serie.length} /></span>
        </div>
        {(courant.q.theme || multiple) && (
          <div className="flex flex-wrap gap-2">
            {courant.q.theme && <span className="f-badge f-b-n">{courant.q.theme}</span>}
            {multiple && <span className="f-badge f-b-wait">{courant.q.reponses.length} réponses</span>}
          </div>
        )}
        <p className="qz-q">{enLigne(courant.q.enonce, 'qe')}</p>
        <div className="flex flex-col gap-2">
          {courant.perm.map((i, k) => {
            const choisi = sel.includes(i);
            const etat = !valide ? (choisi ? 'sel' : '') : bonnes.has(i) ? (choisi ? 'ok' : 'manque') : (choisi ? 'ko' : 'off');
            return (
              <button key={i} type="button" className={`qz-opt ${etat}`} onClick={() => basculer(i)} aria-pressed={choisi}>
                <span className="qz-l">{valide && bonnes.has(i) ? <Check size={13} strokeWidth={3} /> : valide && choisi ? <X size={13} strokeWidth={3} /> : LETTRES[k]}</span>
                <span className="qz-t">{enLigne(courant.q.propositions[i], `p${i}`)}</span>
              </button>
            );
          })}
        </div>
        {valide && (
          <div className={`qz-exp ${resultats[resultats.length - 1]?.juste ? 'ok' : 'ko'}`}>
            <b>{resultats[resultats.length - 1]?.juste ? 'Bonne réponse' : 'Mauvaise réponse'}</b>
            {courant.q.explication && <span>{enLigne(courant.q.explication, 'qx')}</span>}
          </div>
        )}
      </div>
    );
    pied = valide
      ? <Button size="lg" onClick={suivante}>{pos + 1 < serie.length ? <>Suivante <ArrowRight size={15} /></> : 'Résultat'}</Button>
      : <Button size="lg" onClick={valider} disabled={!sel.length}>Valider</Button>;
  } else {
    const score = resultats.filter(r => r.juste).length;
    const total = resultats.length || 1;
    const erreurs = resultats.filter(r => !r.juste);
    corps = (
      <div className="flex flex-col gap-4">
        <div className="qz-score">
          <span className="f-num"><b>{score}</b>/{resultats.length}</span>
          <span className={`f-badge ${toneScore(score / total)}`}>{pct(score / total)}</span>
        </div>
        <Track value={score} max={total} color={score / total >= 0.75 ? 'var(--m-ok)' : score / total >= 0.5 ? 'var(--ink)' : 'var(--m-wait)'} />
        {erreurs.length > 0 && (
          <div className="f-box">
            {erreurs.map(r => (
              <div key={r.q.id} className="qz-err">
                <span className="t-ink font-medium">{enLigne(r.q.enonce, `e${r.q.id}`)}</span>
                {r.q.reponses.map(i => <span key={i} className="t-pos"><Check size={12} strokeWidth={3} /> {enLigne(r.q.propositions[i], `e${r.q.id}${i}`)}</span>)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
    pied = (
      <>
        <Button variant="secondary" onClick={onClose}>Fermer</Button>
        <Button variant="secondary" onClick={() => lancer(serie.map(s => s.q))}><RotateCcw size={14} /> Recommencer</Button>
        {erreurs.length > 0 && <Button onClick={() => lancer(erreurs.map(r => r.q))}>Refaire les erreurs</Button>}
      </>
    );
  }

  return (
    <Modal open onClose={onClose} title={qcm.titre} size="lg" footer={pied}>
      {corps}
    </Modal>
  );
};

const qVide = () => ({ id: uid('q'), enonce: '', propositions: ['', ''], reponses: [], explication: '', theme: '' });

const QcmEditeur = ({ open, initial, matieres, onSave, onClose }) => {
  const [f, setF] = useState(null);
  const [erreur, setErreur] = useState('');
  useEffect(() => {
    if (open) {
      setF({ titre: '', matiere: '', tentatives: [], stats: {}, ...initial, questions: initial?.questions?.length ? JSON.parse(JSON.stringify(initial.questions)) : [qVide()] });
      setErreur('');
    }
  }, [open, initial]);
  if (!open || !f) return null;
  const majQ = (i, fn) => setF(p => ({ ...p, questions: p.questions.map((q, j) => (j === i ? fn(q) : q)) }));
  const enregistrer = () => {
    const questions = f.questions.map(q => {
      const garde = q.propositions.map((p, i) => ({ p: p.trim(), i })).filter(x => x.p);
      return { ...q, enonce: q.enonce.trim(), propositions: garde.map(x => x.p), reponses: garde.map((x, k) => (q.reponses.includes(x.i) ? k : -1)).filter(k => k >= 0) };
    }).filter(q => q.enonce || q.propositions.length);
    const invalides = questions.map((q, i) => (!q.enonce || q.propositions.length < 2 || !q.reponses.length ? i + 1 : 0)).filter(Boolean);
    if (!f.titre.trim()) { setErreur('Titre manquant'); return; }
    if (!questions.length) { setErreur('Aucune question'); return; }
    if (invalides.length) { setErreur(`Question${invalides.length > 1 ? 's' : ''} ${invalides.join(', ')} : énoncé, deux propositions et une bonne réponse`); return; }
    onSave({ ...f, id: f.id || uid('qcm'), titre: f.titre.trim(), questions, modifieLe: new Date().toISOString(), creeLe: f.creeLe || new Date().toISOString() });
  };
  return (
    <Modal open onClose={onClose} title={f.id ? 'Modifier le QCM' : 'Nouveau QCM'} size="lg"
      footer={(
        <>
          {erreur && <span className="text-xs t-neg" style={{ marginRight: 'auto' }}>{erreur}</span>}
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={enregistrer}>Enregistrer</Button>
        </>
      )}>
      <div className="flex flex-col gap-4">
        <div className="f-grid2">
          <Field label="Titre"><Input value={f.titre} onChange={(e) => setF(p => ({ ...p, titre: e.target.value }))} placeholder="Titre" /></Field>
          <Field label="Matière" as="div"><MatiereChamp value={f.matiere} onChange={(v) => setF(p => ({ ...p, matiere: v }))} matieres={matieres} /></Field>
        </div>
        {f.questions.map((q, i) => (
          <div key={q.id} className="f-inset">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold t-ink f-num">Question {i + 1}</span>
              <IconButton label="Supprimer la question" danger onClick={() => setF(p => ({ ...p, questions: p.questions.filter((_, j) => j !== i) }))}><Trash2 size={14} /></IconButton>
            </div>
            <textarea className="f-field" rows={2} value={q.enonce} placeholder="Énoncé" onChange={(e) => majQ(i, x => ({ ...x, enonce: e.target.value }))} />
            <div className="flex flex-col gap-2">
              {q.propositions.map((p, k) => {
                const juste = q.reponses.includes(k);
                return (
                  <div key={k} className="qe-prop">
                    <button type="button" className={`qe-ok no-touch-grow ${juste ? 'on' : ''}`} aria-pressed={juste} title={juste ? 'Bonne réponse' : 'Marquer comme bonne réponse'}
                      onClick={() => majQ(i, x => ({ ...x, reponses: juste ? x.reponses.filter(r => r !== k) : [...x.reponses, k].sort((a, b) => a - b) }))}>
                      {juste ? <Check size={13} strokeWidth={3} /> : LETTRES[k]}
                    </button>
                    <Input value={p} placeholder={`Proposition ${LETTRES[k]}`} onChange={(e) => majQ(i, x => ({ ...x, propositions: x.propositions.map((y, j) => (j === k ? e.target.value : y)) }))} />
                    <IconButton label="Retirer" danger disabled={q.propositions.length <= 2}
                      onClick={() => majQ(i, x => ({ ...x, propositions: x.propositions.filter((_, j) => j !== k), reponses: x.reponses.filter(r => r !== k).map(r => (r > k ? r - 1 : r)) }))}>
                      <X size={14} />
                    </IconButton>
                  </div>
                );
              })}
              {q.propositions.length < LETTRES.length && (
                <Button variant="ghost" size="sm" className="self-start" onClick={() => majQ(i, x => ({ ...x, propositions: [...x.propositions, ''] }))}><Plus size={14} /> Proposition</Button>
              )}
            </div>
            <div className="f-grid2">
              <Field label="Explication"><textarea className="f-field" rows={2} value={q.explication || ''} onChange={(e) => majQ(i, x => ({ ...x, explication: e.target.value }))} /></Field>
              <Field label="Thème"><Input value={q.theme || ''} onChange={(e) => majQ(i, x => ({ ...x, theme: e.target.value }))} /></Field>
            </div>
          </div>
        ))}
        <Button variant="secondary" onClick={() => setF(p => ({ ...p, questions: [...p.questions, qVide()] }))}><Plus size={15} /> Question</Button>
      </div>
    </Modal>
  );
};

const ImportQcm = ({ open, matieres, ressources, onImport, onClose }) => {
  const [texte, setTexte] = useState('');
  const [matiere, setMatiere] = useState('');
  useEffect(() => { if (open) { setTexte(''); setMatiere(''); } }, [open]);
  const analyse = useMemo(() => {
    if (!texte.trim()) return { qcms: [], erreur: '' };
    try { const qcms = lireQcms(texte); return { qcms, erreur: qcms.length ? '' : 'Aucune question exploitable' }; } catch (e) { return { qcms: [], erreur: e.message }; }
  }, [texte]);
  if (!open) return null;
  const choisir = async (e) => {
    const liste = Array.from(e.target.files || []);
    e.target.value = '';
    const textes = [];
    for (const f of liste) textes.push(await lireFichierTexte(f));
    if (textes.length === 1) setTexte(textes[0]);
    else {
      const tous = textes.flatMap(t => { try { const o = extraireJSON(t); return Array.isArray(o) && o[0]?.questions ? o : (o.qcms || [o]); } catch { return []; } });
      setTexte(JSON.stringify(tous));
    }
  };
  const importer = () => {
    const maintenant = new Date().toISOString();
    onImport(analyse.qcms.map(q => {
      const r = trouverRessource(ressources, q.matiere);
      return { ...q, id: uid('qcm'), matiere: matiere || (r ? r.code : q.matiere), tentatives: [], stats: {}, creeLe: maintenant, modifieLe: maintenant };
    }));
  };
  const nbQ = analyse.qcms.reduce((s, q) => s + q.questions.length, 0);
  return (
    <Modal open onClose={onClose} title="Importer des QCM" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Annuler</Button><Button onClick={importer} disabled={!analyse.qcms.length}>Importer {nbQ ? pluriel(nbQ, 'question') : ''}</Button></>}>
      <div className="flex flex-col gap-4">
        <label className="f-drop">
          <FolderOpen size={16} /> Fichiers .json
          <input type="file" accept=".json,application/json,.txt" multiple onChange={choisir} hidden />
        </label>
        <Field label="JSON">
          <textarea className="f-field f-mono" rows={9} value={texte} onChange={(e) => setTexte(e.target.value)} placeholder='{ "titre": "…", "questions": [ … ] }' style={{ fontSize: 12 }} />
        </Field>
        {analyse.erreur && <p className="text-xs t-neg">{analyse.erreur}</p>}
        <Field label="Matière" as="div">
          <SelectMatiere value={matiere} onChange={setMatiere} ressources={matieres.ressources} libres={matieres.libres} />
        </Field>
        {analyse.qcms.length > 0 && (
          <div className="f-box">
            {analyse.qcms.map((q, i) => (
              <div key={i} className="f-ln">
                <ListChecks size={15} className="t-muted shrink-0" />
                <span className="flex-1 min-w-0 truncate t-ink">{q.titre}</span>
                <span className="t-muted f-num text-xs">{pluriel(q.questions.length, 'question')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

const QcmView = ({ data, commit, focus, signal, embedded = false }) => {
  const matieres = useMatieres(data);
  const [filtre, setFiltre] = useState(() => (focus && focus.view === 'qcm' && focus.matiere) || 'all');
  const [q, setQ] = useState('');
  const [joue, setJoue] = useState(null);
  const [edit, setEdit] = useState(null);
  const [imp, setImp] = useState(false);
  const [suppr, setSuppr] = useState(null);

  const vu = useRef(signal.n);
  useEffect(() => {
    if (signal.n === vu.current) return;
    vu.current = signal.n;
    if (signal.type === 'add') setEdit({ matiere: filtre !== 'all' ? filtre : '' });
    if (signal.type === 'import') setImp(true);
  }, [signal, filtre]);

  const filtres = data.qcms
    .filter(x => filtre === 'all' || infoMatiere(data.ressources, x.matiere).cle === infoMatiere(data.ressources, filtre).cle)
    .filter(x => !q.trim() || norm(x.titre).includes(norm(q)) || x.questions.some(y => norm(y.theme).includes(norm(q))))
    .sort((a, b) => String(b.modifieLe || '').localeCompare(String(a.modifieLe || '')));
  const groupes = grouperParMatiere(filtres, data.ressources);
  const qcmJoue = joue ? data.qcms.find(x => x.id === joue) : null;
  const nbQuestions = filtres.reduce((s, x) => s + x.questions.length, 0);

  const terminer = (tentative, details) => {
    const id = joue;
    commit(d => ({
      ...d,
      qcms: d.qcms.map(x => {
        if (x.id !== id) return x;
        const stats = { ...(x.stats || {}) };
        details.forEach(r => { const s = stats[r.id] || { vu: 0, ok: 0 }; stats[r.id] = { vu: s.vu + 1, ok: s.ok + (r.juste ? 1 : 0), dernier: r.juste }; });
        return { ...x, stats, tentatives: [...(x.tentatives || []), tentative].slice(-30) };
      }),
    }));
  };
  const enregistrer = (qcm) => {
    commit(d => ({ ...d, qcms: d.qcms.some(x => x.id === qcm.id) ? d.qcms.map(x => (x.id === qcm.id ? qcm : x)) : [...d.qcms, qcm] }));
    setEdit(null);
  };

  return (
    <div className="flex flex-col gap-4">
      {!embedded && (
        <PageHeader title="QCM" meta={`${pluriel(filtres.length, 'QCM', 'QCM')} · ${pluriel(nbQuestions, 'question')}`}>
          <Button variant="secondary" className="only-desk" onClick={() => setImp(true)}><Upload size={15} /> Importer</Button>
          <Button className="only-desk" onClick={() => setEdit({ matiere: filtre !== 'all' ? filtre : '' })}><Plus size={15} /> QCM</Button>
        </PageHeader>
      )}

      <Card className="overflow-hidden">
        <div className="f-toolbar">
          <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un QCM ou un thème" style={{ flex: '1 1 220px' }} />
          <SelectMatiere tout value={filtre} onChange={setFiltre} ressources={matieres.ressources} libres={matieres.libres} style={{ flex: '1 1 180px' }} />
        </div>
        {(data.demandesQcm || []).map(d => (
          <div key={d.id} className="q-row f-row f-line q-attente">
            <span className="q-play"><Sparkles size={14} /></span>
            <span className="l-lib">
              <span className="truncate t-ink font-medium">{d.titre}</span>
              <span className="t-muted text-xs">QCM en préparation</span>
            </span>
            <span />
            <span />
          </div>
        ))}
        {filtres.length === 0 ? (
          <Vide action={!data.qcms.length && (
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="secondary" onClick={() => setImp(true)}><Upload size={15} /> Importer</Button>
              <Button onClick={() => setEdit({})}><Plus size={15} /> QCM</Button>
            </div>
          )}>Aucun QCM</Vide>
        ) : groupes.map(g => (
          <div key={g.info.cle}>
            <div className="f-group-h">
              <Matiere info={g.info} />
              <span className="t-muted f-num text-xs">{g.items.length}</span>
            </div>
            {g.items.map((x, i) => {
              const best = meilleurScore(x);
              const rv = aRevoir(x).length;
              const derniere = (x.tentatives || []).slice(-1)[0];
              return (
                <div key={x.id} className={`q-row f-row ${i > 0 ? 'f-line' : ''}`}>
                  <button type="button" className="q-play no-touch-grow" onClick={() => setJoue(x.id)} aria-label={`Lancer ${x.titre}`}><Play size={14} /></button>
                  <button type="button" className="l-lib text-left" onClick={() => setJoue(x.id)}>
                    <span className="truncate t-ink font-medium">{x.titre}</span>
                    <span className="t-muted text-xs f-num truncate">
                      {pluriel(x.questions.length, 'question')}{derniere ? ` · ${dateCourte(new Date(derniere.date))}` : ''}{rv ? ` · ${rv} à revoir` : ''}
                    </span>
                  </button>
                  {best !== null ? <span className={`f-badge f-num ${toneScore(best)}`}>{pct(best)}</span> : <span />}
                  <RowActions onEdit={() => setEdit(x)} onDelete={() => setSuppr(x)}>
                    <IconButton label="Exporter" onClick={() => telecharger(`${nomFichier(x.titre)}.json`, exporterQcm(x))} className="only-desk-i"><Download size={14} /></IconButton>
                  </RowActions>
                </div>
              );
            })}
          </div>
        ))}
      </Card>

      {qcmJoue && <QcmJoueur key={qcmJoue.id} qcm={qcmJoue} ressources={data.ressources} onFinish={terminer} onClose={() => setJoue(null)} />}
      <QcmEditeur open={!!edit} initial={edit} matieres={matieres} onSave={enregistrer} onClose={() => setEdit(null)} />
      <ImportQcm open={imp} matieres={matieres} ressources={data.ressources} onClose={() => setImp(false)}
        onImport={(liste) => { commit(d => ({ ...d, qcms: [...d.qcms, ...liste] })); setImp(false); }} />
      <Confirm open={!!suppr} title="Supprimer le QCM" onClose={() => setSuppr(null)}
        message={suppr ? `Supprimer « ${suppr.titre} » ?` : ''}
        onConfirm={() => { const id = suppr.id; commit(d => ({ ...d, qcms: d.qcms.filter(x => x.id !== id) })); setSuppr(null); }} />
    </div>
  );
};

// ============================================================
// LIENS UNICAEN
// ============================================================

const MOODLE_URL = 'https://ecampus-vert.unicaen.fr/my/';
const WEBMAIL_URL = 'https://webmail.unicaen.fr/';
const GEA_URL = 'https://www.iutcaen.unicaen.fr/gea/';

const LienBouton = ({ href, children, variant = 'secondary', className = '' }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`f-btn ${variant === 'primary' ? 'f-btn-p' : variant === 'ghost' ? 'f-btn-g' : ''} ${className}`}>{children}</a>
);

// ============================================================
// MAILS — boîte de réception du webmail (récupérée par GitHub Actions)
// ============================================================

const dateMail = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  if (sameDay(d, new Date())) return heure(d);
  if (sameDay(d, addDays(new Date(), -1))) return 'hier';
  return dateCourte(d);
};


// Adresses web et mails cliquables dans le texte brut
const RE_LIEN = /(https?:\/\/[^\s<>"]*[^\s<>".,;:!?)\]'»]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const avecLiens = (texte) => {
  const t = String(texte || '');
  const out = [];
  let i = 0;
  for (const m of t.matchAll(RE_LIEN)) {
    if (m.index > i) out.push(t.slice(i, m.index));
    const v = m[0];
    const href = v.includes('@') && !/^https?:/.test(v) ? `mailto:${v}` : v;
    out.push(<a key={m.index} href={href} target="_blank" rel="noopener noreferrer">{v}</a>);
    i = m.index + v.length;
  }
  if (i < t.length) out.push(t.slice(i));
  return out;
};

// Signature HTML du webmail affichée telle quelle, sans script ni gestionnaire d'évènement
const BALISES_SIG = new Set(['DIV', 'P', 'BR', 'SPAN', 'B', 'STRONG', 'I', 'EM', 'U', 'A', 'IMG', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'FONT', 'HR', 'UL', 'OL', 'LI', 'SMALL', 'SUB', 'SUP', 'CENTER']);
const ATTRS_SIG = new Set(['href', 'src', 'alt', 'title', 'width', 'height', 'style', 'color', 'size', 'face', 'align', 'valign', 'colspan', 'rowspan', 'border', 'cellpadding', 'cellspacing']);
const signatureSure = (html) => {
  try {
    const doc = new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html');
    const racine = doc.body.firstChild;
    const nettoyer = (el) => {
      [...el.children].forEach(c => {
        if (!BALISES_SIG.has(c.tagName)) { c.remove(); return; }
        [...c.attributes].forEach(a => {
          const n = a.name.toLowerCase();
          if (!ATTRS_SIG.has(n) || ((n === 'href' || n === 'src') && /^\s*javascript:/i.test(a.value))) c.removeAttribute(a.name);
        });
        if (c.tagName === 'A') { c.setAttribute('target', '_blank'); c.setAttribute('rel', 'noopener noreferrer'); }
        nettoyer(c);
      });
    };
    nettoyer(racine);
    return racine.innerHTML;
  } catch { return ''; }
};

const citer = (mail) => {
  const d = new Date(mail.date);
  const quand = isNaN(d) ? '' : d.toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const texte = String(mail.corps || mail.extrait || '').slice(0, 4000);
  return `\n\nLe ${quand}, ${mail.de || mail.adresse} a écrit :\n${texte.split('\n').map(l => `> ${l}`).join('\n')}`;
};

const MailsView = ({ mails: brut, data, commit, majLe, onRefresh, refreshing, envoyes, signature, signatureHtml, onRepondre, onAnnulerEnvoi }) => {
  const sigHtml = useMemo(() => (signatureHtml ? signatureSure(signatureHtml) : ''), [signatureHtml]);
  const mails = brut || [];
  const [ouvert, setOuvert] = useState(null);
  const [q, setQ] = useState('');
  const [filtre, setFiltre] = useState('tous');
  const [rep, setRep] = useState(null);
  const lus = useMemo(() => new Set(data.mailsLus || []), [data.mailsLus]);
  const estNonLu = (m) => m.nonLu && !lus.has(m.id);
  const nbNonLus = mails.filter(estNonLu).length;
  const attente = data.boiteEnvoi || [];
  const resultats = envoyes || [];
  const n = norm(q);
  const liste = mails
    .filter(m => filtre === 'tous' || estNonLu(m))
    .filter(m => !n || norm(`${m.de} ${m.adresse} ${m.sujet} ${m.corps || m.extrait}`).includes(n));
  const mail = ouvert ? mails.find(m => m.id === ouvert) : null;

  const marquerLus = (ids) => commit(d => {
    const serveur = new Set(mails.filter(m => m.nonLu).map(m => m.id));
    return { ...d, mailsLus: Array.from(new Set([...(d.mailsLus || []).filter(id => serveur.has(id)), ...ids])) };
  });
  const ouvrir = (m) => { setOuvert(m.id); setRep(null); if (estNonLu(m)) marquerLus([m.id]); };
  const repondre = () => setRep({ objet: /^re\s*:/i.test(mail.sujet || '') ? mail.sujet : `Re: ${mail.sujet || ''}`.trim(), corps: '' });
  const envoyer = () => {
    if (!rep.corps.trim()) return;
    onRepondre({ id: uid('rep'), mailId: mail.id, a: mail.repondreA || mail.adresse, objet: rep.objet.trim(), corps: rep.corps.trim(), citation: citer(mail), creeLe: new Date().toISOString() });
    setRep(null);
  };
  const etatRep = (m) => {
    const enAttente = attente.filter(x => x.mailId === m.id && !resultats.some(r => r.id === x.id && r.ok));
    if (enAttente.some(x => resultats.some(r => r.id === x.id && !r.ok))) return 'echec';
    if (enAttente.length) return 'attente';
    if (m.repondu || resultats.some(r => r.mailId === m.id && r.ok)) return 'ok';
    return null;
  };
  const suivi = mail ? [
    ...attente.filter(x => x.mailId === mail.id).map(x => ({ ...x, res: resultats.find(r => r.id === x.id) })),
    ...resultats.filter(r => r.mailId === mail.id && r.ok && !attente.some(x => x.id === r.id)).map(r => ({ id: r.id, res: r })),
  ] : [];

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="Mails" meta={nbNonLus ? `${nbNonLus} non lu${nbNonLus > 1 ? 's' : ''}` : null}>
        {nbNonLus > 0 && <Button variant="secondary" onClick={() => marquerLus(mails.filter(estNonLu).map(m => m.id))}><CheckCheck size={15} /> Tout lu</Button>}
        <IconButton label={`Actualiser · ${horodatage(majLe)}`} onClick={onRefresh} className="f-ibtn-bd only-desk">
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
        </IconButton>
        <LienBouton href={WEBMAIL_URL} className="only-desk"><ExternalLink size={14} /> Webmail</LienBouton>
      </PageHeader>
      <Card className="overflow-hidden">
        {mails.length > 0 && (
          <div className="f-toolbar">
            <SearchInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher un mail" style={{ flex: '1 1 220px' }} />
            <Seg label="Filtre" value={filtre} onChange={setFiltre}
              options={[{ id: 'tous', label: 'Tous' }, { id: 'nonlus', label: 'Non lus', count: nbNonLus || undefined }]} />
          </div>
        )}
        {liste.length === 0 ? <Vide>{filtre === 'nonlus' && mails.length ? 'Tout est lu' : 'Aucun mail'}</Vide> : liste.map((m, i) => {
          const r = etatRep(m);
          return (
            <button key={m.id} type="button" className={`ml-row f-row ${i > 0 ? 'f-line' : ''} ${estNonLu(m) ? 'nonlu' : ''}`} onClick={() => ouvrir(m)}>
              <span className="ml-dot" />
              <span className="min-w-0 flex flex-col" style={{ gap: 2 }}>
                <span className="flex items-baseline gap-2 min-w-0">
                  <span className="truncate ml-de">{m.de || m.adresse}</span>
                  <span className="ml-auto t-muted f-num text-xs shrink-0">{dateMail(m.date)}</span>
                </span>
                <span className="flex items-center gap-1 min-w-0">
                  <span className="truncate ml-su">{m.sujet || '(sans objet)'}</span>
                  {m.pj && <Paperclip size={12} className="t-faint shrink-0" />}
                  {r === 'ok' && <Reply size={13} className="t-faint shrink-0" />}
                  {r === 'attente' && <Clock size={13} className="t-faint shrink-0" />}
                  {r === 'echec' && <AlertCircle size={13} className="t-neg shrink-0" />}
                </span>
                <span className="truncate t-muted text-xs">{m.extrait}</span>
              </span>
            </button>
          );
        })}
      </Card>
      {mail && (
        <Modal open onClose={() => { setOuvert(null); setRep(null); }} title={mail.sujet || '(sans objet)'} size="lg"
          footer={rep ? (
            <>
              <Button variant="secondary" onClick={() => setRep(null)}>Annuler</Button>
              <Button onClick={envoyer} disabled={!rep.corps.trim()}><Send size={14} /> Envoyer</Button>
            </>
          ) : (
            <>
              <LienBouton href={WEBMAIL_URL}><ExternalLink size={14} /> Webmail</LienBouton>
              {(mail.repondreA || mail.adresse) && <Button onClick={repondre}><Reply size={15} /> Répondre</Button>}
            </>
          )}>
          <div className="flex flex-col gap-4">
            <div className="f-box">
              <Ligne label="De"><span className="t-ink3 text-right truncate">{mail.de}{mail.adresse && mail.de !== mail.adresse ? ` · ${mail.adresse}` : ''}</span></Ligne>
              <Ligne label="Date"><span className="t-ink3 f-num">{new Date(mail.date).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}</span></Ligne>
            </div>
            {suivi.map(x => (
              <div key={x.id} className={`ml-suivi ${x.res && !x.res.ok ? 'echec' : ''}`}>
                {x.res && x.res.ok ? <Check size={14} /> : x.res ? <AlertCircle size={14} /> : <Clock size={14} />}
                <span className="flex-1 min-w-0">
                  {x.res && x.res.ok ? `Réponse envoyée · ${horodatage(x.res.le)}`
                    : x.res ? `Échec de l’envoi${x.res.erreur ? ` : ${x.res.erreur}` : ''}`
                      : 'Réponse en attente d’envoi'}
                </span>
                {!(x.res && x.res.ok) && <Button variant="ghost" size="sm" onClick={() => onAnnulerEnvoi(x.id)}>Annuler</Button>}
              </div>
            ))}
            {rep && (
              <div className="flex flex-col gap-3 ml-compose">
                <div className="f-box">
                  <Ligne label="À"><span className="t-ink3 text-right truncate">{mail.repondreA || mail.adresse}</span></Ligne>
                </div>
                <Field label="Objet"><Input value={rep.objet} onChange={(e) => setRep(p => ({ ...p, objet: e.target.value }))} /></Field>
                <textarea className="f-field" rows={7} autoFocus value={rep.corps} placeholder="Votre réponse"
                  onChange={(e) => setRep(p => ({ ...p, corps: e.target.value }))} />
                {sigHtml ? <div className="ml-sig ml-sig-html" dangerouslySetInnerHTML={{ __html: sigHtml }} />
                  : signature && <div className="ml-sig">{signature}</div>}
              </div>
            )}
            {(mail.corps || mail.extrait)
              ? <div className={`t-ink2 ml-texte ${rep ? 'ml-cite' : ''}`}>{avecLiens(mail.corps || mail.extrait)}</div>
              : <p className="t-muted text-xs">Contenu complet dans le webmail.</p>}
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// FEUILLE DE STYLE — variables et classes f-* reprises de Finances
// ============================================================

const APP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap');

:root {
  --bg: #fafaf9; --side: #f5f5f4; --surface: #ffffff; --surface-2: #fafaf9;
  --line: #e7e5e4; --line-soft: #f0eeec; --line-strong: #d6d3d1;
  --ink: #1c1917; --ink-2: #44403c; --ink-3: #57534e; --muted: #78716c; --faint: #a8a29e;
  --hover: #f5f5f4; --hover-2: #ecebe9; --seg: #ecebe9; --seg-on: #ffffff;
  --pos: #047857; --neg: #be123c; --warn: #b45309;
  --warn-bg: #fef3c7; --warn-ink: #92400e; --ok-bg: #d1fae5; --ok-ink: #065f46; --n-bg: #f0eeec; --n-ink: #57534e;
  --neg-bg: #ffe4e6; --neg-ink: #9f1239; --mark: rgba(252, 211, 77, 0.55);
  --m-ok: #059669; --m-wait: #f59e0b; --m-wait-2: #d97706;
  --primary: #1c1917; --primary-h: #292524; --on-primary: #fafaf9;
  --overlay: rgba(28, 25, 23, 0.36); --shadow: 0 16px 40px rgba(28, 25, 23, 0.14);
}
html.dark {
  color-scheme: dark;
  --bg: #1c1917; --side: #181513; --surface: #262220; --surface-2: #211d1b;
  --line: #3d3835; --line-soft: #322e2b; --line-strong: #57534e;
  --ink: #fafaf9; --ink-2: #e7e5e4; --ink-3: #d6d3d1; --muted: #a8a29e; --faint: #78716c;
  --hover: #2f2a27; --hover-2: #36312e; --seg: #171412; --seg-on: #36312e;
  --pos: #6ee7b7; --neg: #fda4af; --warn: #fcd34d;
  --warn-bg: rgba(180, 83, 9, 0.24); --warn-ink: #fde68a; --ok-bg: rgba(5, 150, 105, 0.24); --ok-ink: #a7f3d0; --n-bg: #36312e; --n-ink: #d6d3d1;
  --neg-bg: rgba(190, 18, 60, 0.24); --neg-ink: #fecdd3; --mark: rgba(252, 211, 77, 0.28);
  --m-ok: #10b981; --m-wait: #f59e0b; --m-wait-2: #f59e0b;
  --primary: #fafaf9; --primary-h: #e7e5e4; --on-primary: #1c1917;
  --overlay: rgba(0, 0, 0, 0.6); --shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
}

*, *::before, *::after { box-sizing: border-box; }
body, html { margin: 0; font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif; background: var(--bg); }
.f-app { min-height: 100vh; color: var(--ink); font-size: 13px; line-height: 1.45; -webkit-font-smoothing: antialiased; font-feature-settings: 'cv11' 1; }
.f-app button { cursor: pointer; font-family: inherit; }
.f-app button:disabled { cursor: not-allowed; }
.f-app h1, .f-app h2, .f-app h3, .f-app h4, .f-app p { margin: 0; }
.f-app :focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.f-num { font-variant-numeric: tabular-nums; }
.f-mono { font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace; }

/* Utilitaires */
.flex { display: flex; } .grid { display: grid; } .relative { position: relative; }
.flex-col { flex-direction: column; } .flex-wrap { flex-wrap: wrap; } .flex-1 { flex: 1 1 0%; }
.items-center { align-items: center; } .items-end { align-items: flex-end; } .items-baseline { align-items: baseline; } .self-start { align-self: flex-start; }
.justify-between { justify-content: space-between; } .justify-end { justify-content: flex-end; } .justify-center { justify-content: center; }
.gap-1 { gap: 4px; } .gap-2 { gap: 8px; } .gap-3 { gap: 12px; } .gap-4 { gap: 16px; } .gap-6 { gap: 24px; }
.min-w-0 { min-width: 0; } .shrink-0 { flex-shrink: 0; } .mt-auto { margin-top: auto; } .ml-auto { margin-left: auto; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text-right { text-align: right; } .text-left { text-align: left; } .text-xs { font-size: 12px; }
.font-medium { font-weight: 500; } .font-semibold { font-weight: 600; } .overflow-hidden { overflow: hidden; }
.first-up::first-letter { text-transform: uppercase; }
.animate-spin { animation: f-spin 1s linear infinite; }
@keyframes f-spin { to { transform: rotate(360deg); } }
.t-ink { color: var(--ink); } .t-ink2 { color: var(--ink-2); } .t-ink3 { color: var(--ink-3); }
.t-muted { color: var(--muted); } .t-faint { color: var(--faint); }
.t-pos { color: var(--pos); } .t-neg { color: var(--neg); } .t-warn { color: var(--warn); }

/* Structure */
.f-shell { display: flex; min-height: 100vh; }
.f-side {
  position: sticky; top: 0; height: 100vh; width: 232px; flex: none; overflow-y: auto;
  display: flex; flex-direction: column; gap: 18px; padding: 16px 12px;
  background: var(--side); border-right: 1px solid var(--line);
}
.f-brand { padding: 4px 8px; }
.f-logo { flex: none; display: block; border-radius: 27%; }
html.dark .f-logo { box-shadow: 0 0 0 1px var(--line); }
.f-nav {
  display: flex; align-items: center; gap: 10px; width: 100%; height: 32px; padding: 0 10px; border: 0; border-radius: 6px;
  background: transparent; color: var(--ink-3); font-size: 13px; font-weight: 500; text-align: left; transition: background-color .12s, color .12s;
}
.f-nav:hover { background: var(--hover-2); color: var(--ink); }
.f-nav.on, .f-nav.on:hover { background: var(--line); color: var(--ink); }
.f-nav-sync { font-weight: 400; font-size: 12px; }
.f-ic16 { width: 16px; display: flex; justify-content: center; flex: none; }
.f-dot { width: 7px; height: 7px; border-radius: 50%; flex: none; display: inline-block; }
.f-main { flex: 1; min-width: 0; padding: 24px 32px 56px; }
.f-wrap { max-width: 1180px; margin: 0 auto; }
.f-topbar {
  display: none; position: sticky; top: 0; z-index: 30; align-items: center; gap: 8px; min-height: 56px;
  padding: calc(6px + env(safe-area-inset-top, 0px)) max(8px, env(safe-area-inset-right, 0px)) 6px max(16px, env(safe-area-inset-left, 0px));
  background: var(--bg); border-bottom: 1px solid var(--line);
}
.f-bottom {
  display: none; position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; gap: 0;
  padding: 6px max(4px, env(safe-area-inset-right, 0px)) calc(6px + env(safe-area-inset-bottom, 0px)) max(4px, env(safe-area-inset-left, 0px));
  background: var(--bg); border-top: 1px solid var(--line);
}
.f-tb {
  flex: 1 1 0; min-width: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  height: 60px; padding: 0; border: 0; border-radius: 14px; background: transparent; color: var(--ink-3);
  font-size: clamp(8.5px, 2.6vw, 12px); font-weight: 500; letter-spacing: -0.02em; line-height: 1.1;
}
.f-tb.on { background: var(--primary); color: var(--on-primary); }
.f-tb-l { display: none; max-width: 100%; overflow: hidden; white-space: nowrap; }
@media (min-width: 640px) { .f-tb { height: 64px; } .f-tb-l { display: block; } }
@media (max-width: 1023px) {
  .f-side, .only-desk, .only-desk-i { display: none !important; }
  .f-topbar, .f-bottom { display: flex; }
  .f-main { padding: 16px max(16px, env(safe-area-inset-right, 0px)) calc(112px + env(safe-area-inset-bottom, 0px)) max(16px, env(safe-area-inset-left, 0px)); }
}
.f-ibtn-lg { width: 40px; height: 40px; border-radius: 10px; }
.f-add { background: var(--primary); color: var(--on-primary); }
.f-add:hover { background: var(--primary-h); color: var(--on-primary); }
.f-toast {
  position: fixed; left: 50%; transform: translateX(-50%); bottom: calc(92px + env(safe-area-inset-bottom, 0px)); z-index: 70;
  max-width: calc(100vw - 32px); padding: 9px 14px; border-radius: 8px; background: var(--primary); color: var(--on-primary);
  font-weight: 500; box-shadow: var(--shadow); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
@media (min-width: 1024px) { .f-toast { bottom: 24px; } }

/* En-têtes et panneaux */
.f-page-h { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; min-height: 36px; }
.f-page-h h1 { font-size: 20px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); }
.f-panel { background: var(--surface); border: 1px solid var(--line); border-radius: 8px; }
.f-ph { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 48px; padding: 10px 16px; border-bottom: 1px solid var(--line); }
.f-ph h2 { font-size: 13px; font-weight: 600; color: var(--ink); }
.f-strip { display: grid; gap: 1px; background: var(--line); }
.f-kpi { display: flex; flex-direction: column; gap: 4px; padding: 16px 18px; background: var(--surface); min-width: 0; border: 0; text-align: left; font: inherit; color: inherit; }
.f-kpi-btn { transition: background-color .12s; }
.f-kpi-btn:hover { background: var(--surface-2); }
.f-kpi-l { display: inline-flex; align-items: center; gap: 8px; color: var(--ink-3); }
.f-kpi-v { font-size: 22px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); line-height: 1.25; }
.f-kpi-v.t-faint { color: var(--faint); } .f-kpi-v.t-warn { color: var(--warn); } .f-kpi-v.t-neg { color: var(--neg); }
.f-kpi-s { font-size: 12px; color: var(--muted); }
.f-group-h {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 2px 12px;
  padding: 9px 16px; background: var(--surface-2); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line-soft);
}
.f-toolbar + div > .f-group-h, .f-toolbar + .f-vide { border-top: 0; }
.f-line, .f-app .f-line { border-top: 1px solid var(--line-soft); }
a.f-btn, a.f-ibtn, a.f-row { text-decoration: none; }
.f-row { transition: background-color .12s; }
.f-row:hover { background: var(--surface-2); }
.f-sec-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 30px; margin-bottom: 6px; }
.f-sec-h h4 { font-size: 13px; font-weight: 600; color: var(--ink); }
.f-box { border: 1px solid var(--line); border-radius: 8px; padding: 0 14px; background: var(--surface); }
.f-ln { display: flex; align-items: center; gap: 12px; min-height: 46px; width: 100%; padding: 6px 0; }
.f-ln-btn { border: 0; background: transparent; font: inherit; color: inherit; text-align: left; }
.f-ln-btn:hover { opacity: .7; }
.f-ln + .f-ln, .f-box > * + * { border-top: 1px solid var(--line-soft); }
.f-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px; border-bottom: 1px solid var(--line); }
@media (min-width: 768px) { .f-toolbar { padding: 12px 16px; } .f-toolbar select { max-width: 320px; } }
.f-vide { display: flex; flex-direction: column; align-items: center; gap: 14px; padding: 40px 16px; color: var(--muted); text-align: center; }
.f-grid2 { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
@media (min-width: 560px) { .f-grid2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
.f-grid3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }

/* Boutons */
.f-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 12px;
  border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); color: var(--ink);
  font-size: 13px; font-weight: 500; white-space: nowrap; transition: background-color .12s, border-color .12s, color .12s, opacity .12s;
}
.f-btn:hover { background: var(--hover); }
.f-btn:disabled { opacity: .45; }
.f-btn-p { background: var(--primary); border-color: var(--primary); color: var(--on-primary); }
.f-btn-p:hover { background: var(--primary-h); border-color: var(--primary-h); }
.f-btn-g { background: transparent; border-color: transparent; color: var(--ink-3); padding: 0 8px; }
.f-btn-g:hover { background: var(--hover); color: var(--ink); }
.f-btn-d { background: #be123c; border-color: #be123c; color: #fff; }
.f-btn-d:hover { background: #9f1239; border-color: #9f1239; }
.f-btn-sm { height: 28px; padding: 0 10px; font-size: 12.5px; }
.f-btn-lg { height: 38px; padding: 0 16px; font-size: 14px; min-width: 132px; }
.f-btn-icon { width: 34px; padding: 0; flex: none; }
.f-ibtn {
  display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; flex: none; padding: 0;
  border: 0; border-radius: 6px; background: transparent; color: var(--muted); transition: background-color .12s, color .12s;
}
.f-ibtn:hover { background: var(--hover-2); color: var(--ink); }
.f-ibtn:disabled { opacity: .35; background: transparent; }
.f-ibtn.danger:hover { color: var(--neg); }
.f-ibtn-bd { width: 32px; height: 32px; border: 1px solid var(--line); background: var(--surface); color: var(--ink); }
.f-ibtn-on, .f-ibtn-on:hover { background: var(--seg); color: var(--ink); }
.f-eye { position: absolute; right: 4px; }
.f-chip {
  display: inline-flex; align-items: center; gap: 6px; height: 30px; padding: 0 10px; border: 1px solid var(--line);
  border-radius: 6px; background: var(--surface); color: var(--ink); font-size: 12.5px; font-weight: 500; white-space: nowrap;
  transition: border-color .12s, background-color .12s;
}
.f-chip:hover { border-color: var(--line-strong); background: var(--hover); }
.f-switch { position: relative; width: 36px; height: 20px; flex: none; border: 0; border-radius: 10px; padding: 0; background: var(--line-strong); transition: background-color .15s; }
.f-switch > span { position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(28, 25, 23, 0.25); transition: transform .15s; }
.f-switch.on { background: var(--primary); }
.f-switch.on > span { transform: translateX(16px); background: var(--on-primary); }
.f-lien { font-size: 12.5px; color: var(--ink-3); text-decoration: underline; text-underline-offset: 2px; }
.f-lien:hover { opacity: .7; }
.f-copy { display: inline-flex; align-items: center; gap: 6px; height: 26px; padding: 0 8px; border: 0; border-radius: 6px; background: transparent; color: var(--ink-3); font-size: 12px; }
.f-copy:hover { background: var(--hover); }

/* Champs */
.f-fl { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.f-label { font-size: 12.5px; font-weight: 500; color: var(--ink-2); }
.f-field {
  width: 100%; height: 34px; padding: 0 10px; border: 1px solid var(--line-strong); border-radius: 6px;
  background: var(--surface); color: var(--ink); font: inherit; font-size: 13px; transition: border-color .12s, box-shadow .12s;
}
.f-field::placeholder { color: var(--faint); }
.f-field:focus { outline: none; border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
textarea.f-field { height: auto; padding: 8px 10px; line-height: 1.5; resize: vertical; }
.f-field-sm { height: 30px; padding: 0 8px; font-size: 12.5px; }
.f-select {
  appearance: none; -webkit-appearance: none; padding-right: 28px; text-overflow: ellipsis;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 8px center; background-size: 14px;
}
.f-search { position: relative; display: flex; align-items: center; min-width: 0; }
.f-search > svg { position: absolute; left: 10px; color: var(--muted); pointer-events: none; }
.f-search > input { padding-left: 32px; }
.f-color { width: 34px; height: 30px; flex: none; padding: 2px; border: 1px solid var(--line-strong); border-radius: 6px; background: var(--surface); cursor: pointer; }
.f-inset { display: flex; flex-direction: column; gap: 14px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); }
.f-drop {
  display: flex; align-items: center; justify-content: center; gap: 8px; height: 44px; border: 1px dashed var(--line-strong);
  border-radius: 8px; background: var(--surface); color: var(--ink-3); font-weight: 500; cursor: pointer; transition: border-color .12s, color .12s;
}
.f-drop:hover { border-color: var(--muted); color: var(--ink); }

/* Contrôle segmenté, onglets, badges */
.f-seg { display: inline-flex; gap: 2px; padding: 2px; border-radius: 7px; background: var(--seg); max-width: 100%; overflow-x: auto; scrollbar-width: none; }
.f-seg::-webkit-scrollbar { display: none; }
.f-seg > button {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px; flex: none; height: 28px; padding: 0 10px;
  border: 0; border-radius: 5px; background: transparent; color: var(--ink-3); font-size: 12.5px; font-weight: 500; white-space: nowrap;
  transition: background-color .12s, color .12s;
}
.f-seg > button:hover { color: var(--ink); }
.f-seg > button.on { background: var(--seg-on); color: var(--ink); box-shadow: 0 1px 2px rgba(28, 25, 23, 0.08), 0 0 0 1px var(--line); }
.f-seg.f-seg-fill { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); width: 100%; }
.f-seg .ct { font-size: 11.5px; color: var(--muted); font-variant-numeric: tabular-nums; }
.f-tabs { display: flex; gap: 24px; overflow-x: auto; border-bottom: 1px solid var(--line); scrollbar-width: none; }
.f-tabs::-webkit-scrollbar { display: none; }
.f-tab { height: 40px; padding: 0 2px; margin-bottom: -1px; border: 0; border-bottom: 2px solid transparent; background: transparent; color: var(--ink-3); font-size: 13px; font-weight: 500; white-space: nowrap; }
.f-tab:hover { color: var(--ink); }
.f-tab.on { color: var(--ink); border-bottom-color: var(--ink); }
.f-badge { display: inline-flex; align-items: center; gap: 4px; height: 20px; padding: 0 6px; border-radius: 4px; font-size: 11.5px; font-weight: 500; white-space: nowrap; flex: none; }
.f-b-wait { background: var(--warn-bg); color: var(--warn-ink); }
.f-b-ok { background: var(--ok-bg); color: var(--ok-ink); }
.f-b-n { background: var(--n-bg); color: var(--n-ink); }
.f-b-neg { background: var(--neg-bg); color: var(--neg-ink); }
.f-sq { display: inline-block; width: 8px; height: 8px; border-radius: 2px; flex: none; }
.f-cat { display: inline-flex; align-items: center; gap: 6px; color: var(--ink-3); white-space: nowrap; }
.f-group-h .f-cat { color: var(--ink); font-weight: 600; }
.f-track { display: block; height: 6px; border-radius: 3px; background: var(--line-soft); overflow: hidden; }
.f-track > span { display: block; height: 100%; border-radius: 3px; transition: width .3s; }

/* Fenêtres */
.f-overlay {
  position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 16px;
  background: var(--overlay); backdrop-filter: blur(2px); -webkit-backdrop-filter: blur(2px);
}
.f-modal { display: flex; flex-direction: column; width: 100%; max-height: 90vh; background: var(--surface); border: 1px solid var(--line); border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.m-sm { max-width: 448px; } .m-md { max-width: 576px; } .m-lg { max-width: 780px; } .m-xl { max-width: 1024px; }
.f-modal-h { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 12px 12px 20px; border-bottom: 1px solid var(--line); }
.f-modal-h h3 { font-size: 15px; font-weight: 600; color: var(--ink); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.f-modal-h h3::first-letter { text-transform: uppercase; }
.f-modal-b { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 20px; }
.f-modal-f { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid var(--line); background: var(--surface-2); }

/* Emploi du temps */
.edt-nav { display: flex; align-items: center; gap: 4px; }
.edt-sem { height: 32px; min-width: 132px; padding: 0 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--surface); color: var(--ink); font-size: 13px; font-weight: 600; }
.edt-sem:hover { background: var(--hover); }
.edt-days { display: grid; gap: 6px; }
.edt-day {
  display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 7px 0 6px; min-width: 0;
  border: 1px solid var(--line); border-radius: 10px; background: var(--surface); color: var(--muted);
}
.edt-day-l { font-size: 11.5px; }
.edt-day b { font-size: 17px; font-weight: 600; color: var(--ink); line-height: 1.2; }
.edt-day.today .edt-day-l { color: var(--ink); font-weight: 600; }
.edt-day.today b { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 4px; }
.edt-day.on { background: var(--primary); border-color: var(--primary); }
.edt-day.on b, .edt-day.on .edt-day-l { color: var(--on-primary); }
.edt-dots { display: flex; gap: 2px; height: 5px; }
.edt-dots i { width: 5px; height: 5px; border-radius: 2px; }
.edt-row {
  display: grid; grid-template-columns: 44px 3px minmax(0, 1fr); column-gap: 12px; width: 100%; padding: 11px 16px;
  border: 0; border-top: 1px solid var(--line-soft); background: transparent; color: inherit; font: inherit; text-align: left; transition: background-color .12s;
}
.f-ph + .edt-row, .edt-pause + .edt-row { border-top: 0; }
.edt-row:hover { background: var(--surface-2); }
.edt-row.exam { background: var(--warn-bg); }
.edt-row.exam:hover { background: var(--warn-bg); opacity: .9; }
.edt-h { display: flex; flex-direction: column; gap: 2px; padding-top: 1px; font-size: 12px; color: var(--muted); }
.edt-h b { font-size: 13.5px; font-weight: 600; color: var(--ink); }
.edt-row.now .edt-h b { color: var(--pos); }
.edt-bar { border-radius: 2px; background: var(--c); }
.edt-c { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.edt-t { display: flex; align-items: center; gap: 6px; min-width: 0; font-size: 14px; font-weight: 600; color: var(--ink); }
.edt-m { display: flex; flex-wrap: wrap; gap: 3px 14px; font-size: 12.5px; color: var(--ink-3); min-width: 0; }
.edt-m > span { display: inline-flex; align-items: center; gap: 5px; min-width: 0; }
.edt-m svg { color: var(--faint); flex: none; }
.edt-pause { display: flex; align-items: center; gap: 10px; padding: 3px 16px 3px 72px; border-top: 1px dashed var(--line); color: var(--faint); font-size: 11.5px; }
.edt-wk { --hh: 46px; }
.edt-wh, .edt-wb { display: grid; grid-template-columns: 40px repeat(var(--cols), minmax(0, 1fr)); }
.edt-wh { border-bottom: 1px solid var(--line); background: var(--surface-2); }
.edt-wd {
  display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 4px; border: 0; border-left: 1px solid var(--line-soft);
  background: transparent; color: var(--muted); font-size: 12px;
}
.edt-wd b { display: inline-flex; align-items: center; justify-content: center; min-width: 24px; height: 24px; border-radius: 50%; font-size: 13px; font-weight: 600; color: var(--ink); }
.edt-wd.today b { background: var(--primary); color: var(--on-primary); }
.edt-wb { position: relative; }
.edt-axis { position: relative; }
.edt-axis span { position: absolute; right: 6px; transform: translateY(-50%); font-size: 10.5px; color: var(--faint); }
.edt-axis span:first-child { transform: translateY(2px); }
.edt-axis span:last-child { transform: translateY(-100%); }
.edt-col {
  position: relative; border-left: 1px solid var(--line-soft);
  background-image: repeating-linear-gradient(to bottom, var(--line-soft) 0, var(--line-soft) 1px, transparent 1px, transparent var(--hh));
}
.edt-col.today { background-color: var(--surface-2); }
.edt-blk {
  position: absolute; display: flex; flex-direction: column; gap: 1px; padding: 4px 6px; overflow: hidden;
  border: 0; border-left: 3px solid var(--c); border-radius: 5px; background: var(--surface-2); color: var(--ink);
  background: color-mix(in srgb, var(--c) 17%, var(--surface)); font-size: 11px; line-height: 1.25; text-align: left;
}
.edt-blk:hover { filter: brightness(0.97); }
.edt-blk b { font-size: 11.5px; font-weight: 600; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.edt-blk span { color: var(--ink-3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.edt-blk.exam {
  border-left-color: var(--m-wait);
  background: repeating-linear-gradient(135deg, var(--warn-bg) 0 6px, var(--surface) 6px 12px);
}
.edt-now { position: absolute; left: 0; right: 0; height: 2px; background: var(--neg); z-index: 3; pointer-events: none; }
.edt-now::before { content: ''; position: absolute; left: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--neg); }
@media (max-width: 640px) {
  .edt-wh, .edt-wb { grid-template-columns: 28px repeat(var(--cols), minmax(0, 1fr)); }
  .edt-wd { flex-direction: column; gap: 0; padding: 6px 0; font-size: 10.5px; }
  .edt-wd b { min-width: 22px; height: 22px; font-size: 12px; }
  .edt-axis span { right: 3px; font-size: 9.5px; }
  .edt-blk { padding: 3px 3px 3px 4px; border-left-width: 2px; }
  .edt-blk b { font-size: 10px; -webkit-line-clamp: 3; }
  .edt-blk span { font-size: 9.5px; }
}
.edt-ex {
  display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; column-gap: 12px; width: 100%; min-height: 44px;
  padding: 6px 16px; border: 0; border-top: 1px solid var(--line-soft); background: transparent; color: inherit; font: inherit; text-align: left;
}
.f-ph + .edt-ex { border-top: 0; }
.edt-liens { display: flex; flex-wrap: wrap; gap: 8px; }

/* Notes */
.n-ue .f-ph h2 { line-height: 1.35; }
.n-moy { min-width: 44px; text-align: right; font-size: 15px; font-weight: 600; }
.n-bm { display: flex; gap: 14px; padding: 7px 16px; font-size: 12px; color: var(--muted); background: var(--surface-2); border-bottom: 1px solid var(--line-soft); }
.n-row {
  display: grid; grid-template-columns: 8px minmax(0, 1fr) 96px 48px 16px; align-items: center; column-gap: 12px; width: 100%;
  min-height: 54px; padding: 8px 16px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left;
}
.n-lib { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.n-chev { transition: transform .15s; }
.n-chev.on { transform: rotate(180deg); }
@media (max-width: 520px) {
  .n-row { grid-template-columns: 8px minmax(0, 1fr) 46px 14px; column-gap: 10px; padding: 8px 12px; }
  .n-track { display: none; }
}
.n-evals { display: flex; flex-direction: column; padding: 0 16px 12px 36px; background: var(--surface-2); border-top: 1px solid var(--line-soft); }
.n-ev { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; column-gap: 12px; min-height: 48px; border-bottom: 1px solid var(--line-soft); }
.n-add {
  display: inline-flex; align-items: center; gap: 6px; align-self: flex-start; margin-top: 10px; height: 30px; padding: 0 10px;
  border: 1px dashed var(--line-strong); border-radius: 6px; background: transparent; color: var(--ink-3); font-size: 12.5px; font-weight: 500;
}
.n-add:hover { border-color: var(--muted); color: var(--ink); }
@media (max-width: 520px) { .n-evals { padding-left: 30px; padding-right: 12px; } }

/* Maquette */
.mq-ue { display: grid; grid-template-columns: 96px minmax(0, 1fr) 72px 72px 28px; gap: 10px; align-items: end; }
.mq-del { margin-bottom: 3px; }
.mq-res { display: grid; grid-template-columns: minmax(0, 1fr) 72px 28px; gap: 8px; align-items: center; padding: 7px 0; }
.mq-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 0; margin-left: -8px; }
.mq-r { display: grid; grid-template-columns: 34px 92px minmax(0, 1fr) minmax(0, 170px) 28px; gap: 8px; align-items: center; padding: 7px 0; }
@media (max-width: 560px) {
  .mq-ue { grid-template-columns: repeat(3, minmax(0, 1fr)) 28px; }
  .mq-ue > :nth-child(2) { grid-column: 1 / -1; order: -1; }
  .mq-r { grid-template-columns: 34px 84px minmax(0, 1fr) 28px; }
  .mq-alias { grid-column: 2 / 4; }
}

/* Listes de fiches et de QCM */
.l-row {
  display: grid; grid-template-columns: minmax(0, 1fr) auto 16px; align-items: center; column-gap: 12px; width: 100%; min-height: 58px;
  padding: 8px 16px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left;
}
.l-lib { display: flex; flex-direction: column; gap: 2px; min-width: 0; border: 0; background: transparent; padding: 0; color: inherit; font: inherit; }
.q-row { display: grid; grid-template-columns: 34px minmax(0, 1fr) auto auto; align-items: center; column-gap: 12px; min-height: 60px; padding: 8px 10px 8px 16px; }
.q-play { display: inline-flex; align-items: center; justify-content: center; width: 34px; height: 34px; padding: 0 0 0 2px; border: 0; border-radius: 50%; background: var(--primary); color: var(--on-primary); }
.q-play:hover { background: var(--primary-h); }

/* Fiches */
.fe-zone { min-height: 46vh; padding: 12px; font-size: 14px; line-height: 1.6; }
.fe-apercu { min-height: 46vh; }
.fe-tool { width: 32px; height: 32px; color: var(--ink-3); }
.f-md { max-width: 74ch; font-size: 15px; line-height: 1.65; color: var(--ink-2); overflow-wrap: anywhere; }
.f-md > * + * { margin-top: 10px; }
.f-md h2 { margin-top: 26px; padding-bottom: 6px; border-bottom: 1px solid var(--line); font-size: 19px; font-weight: 600; letter-spacing: -0.01em; color: var(--ink); line-height: 1.3; }
.f-md h3 { margin-top: 22px; font-size: 16px; font-weight: 600; color: var(--ink); line-height: 1.35; }
.f-md h4 { margin-top: 16px; font-size: 14.5px; font-weight: 600; color: var(--ink); }
.f-md > :first-child { margin-top: 0; }
.f-md p { margin: 0; }
.f-md ul, .f-md ol { margin-bottom: 0; padding-left: 1.35em; }
.f-md li + li { margin-top: 4px; }
.f-md li > ul, .f-md li > ol { margin-top: 4px; }
.f-md li::marker { color: var(--faint); }
.f-md strong { font-weight: 600; color: var(--ink); }
.f-md mark { padding: 0 2px; border-radius: 2px; background: var(--mark); color: inherit; }
.f-md code { padding: 1px 5px; border-radius: 4px; background: var(--n-bg); color: var(--ink); font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: .86em; }
.f-md pre { padding: 12px 14px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface-2); overflow-x: auto; }
.f-md pre code { padding: 0; background: none; }
.f-md blockquote { margin-left: 0; margin-right: 0; padding: 10px 14px; border-left: 3px solid var(--ink); border-radius: 0 8px 8px 0; background: var(--surface-2); color: var(--ink-2); }
.f-md blockquote > * + * { margin-top: 8px; }
.f-md hr { margin: 20px 0; border: 0; border-top: 1px solid var(--line); }
.f-md a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; }
.md-table { overflow-x: auto; border: 1px solid var(--line); border-radius: 8px; }
.md-table table { width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.45; }
.md-table th { background: var(--surface-2); color: var(--ink); font-weight: 600; text-align: left; }
.md-table th, .md-table td { padding: 7px 10px; border-bottom: 1px solid var(--line-soft); vertical-align: top; }
.md-table th + th, .md-table td + td { border-left: 1px solid var(--line-soft); }
.md-table tr:last-child td { border-bottom: 0; }
.md-check { display: flex; gap: 8px; margin-left: -1.35em; list-style: none; }
.md-box { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 16px; height: 16px; margin-top: 4px; border: 1.5px solid var(--line-strong); border-radius: 4px; }
.md-box.on { background: var(--ink); border-color: var(--ink); color: var(--on-primary); }
.md-cache { border-radius: 6px; cursor: pointer; transition: filter .15s, opacity .15s; }
.md-cache:not(.vu) { filter: blur(6px); opacity: .65; user-select: none; -webkit-user-select: none; }
.md-cache:not(.vu) * { pointer-events: none; }

/* QCM */
.qz-q { font-size: 17px; font-weight: 600; line-height: 1.45; color: var(--ink); }
.qz-opt {
  display: flex; align-items: flex-start; gap: 12px; width: 100%; padding: 12px 14px; border: 1px solid var(--line-strong); border-radius: 10px;
  background: var(--surface); color: var(--ink); font-size: 14.5px; line-height: 1.45; text-align: left; transition: border-color .12s, background-color .12s;
}
.qz-opt:hover { background: var(--hover); }
.qz-l { display: inline-flex; align-items: center; justify-content: center; flex: none; width: 24px; height: 24px; border-radius: 6px; background: var(--seg); color: var(--ink-3); font-size: 12px; font-weight: 600; }
.qz-t { padding-top: 2px; min-width: 0; }
.qz-opt.sel { border-color: var(--ink); box-shadow: 0 0 0 1px var(--ink); }
.qz-opt.sel .qz-l { background: var(--primary); color: var(--on-primary); }
.qz-opt.ok, .qz-opt.ok:hover { border-color: var(--m-ok); background: var(--ok-bg); }
.qz-opt.ok .qz-l { background: var(--m-ok); color: #fff; }
.qz-opt.manque, .qz-opt.manque:hover { border-color: var(--m-ok); border-style: dashed; background: var(--surface); }
.qz-opt.manque .qz-l { background: var(--ok-bg); color: var(--ok-ink); }
.qz-opt.ko, .qz-opt.ko:hover { border-color: #be123c; background: var(--neg-bg); }
.qz-opt.ko .qz-l { background: #be123c; color: #fff; }
.qz-opt.off { opacity: .5; }
.qz-exp { display: flex; flex-direction: column; gap: 4px; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--surface-2); line-height: 1.55; color: var(--ink-2); }
.qz-exp.ok b { color: var(--pos); } .qz-exp.ko b { color: var(--neg); }
.qz-score { display: flex; align-items: baseline; gap: 12px; }
.qz-score > span:first-child { font-size: 18px; color: var(--muted); }
.qz-score b { font-size: 40px; font-weight: 600; letter-spacing: -0.02em; color: var(--ink); }
.qz-err { display: flex; flex-direction: column; gap: 4px; padding: 10px 0; }
.qz-err .t-pos { display: inline-flex; align-items: flex-start; gap: 6px; }
.qz-err .t-pos svg { margin-top: 3px; flex: none; }
.qe-prop { display: grid; grid-template-columns: 32px minmax(0, 1fr) 28px; gap: 8px; align-items: center; }
.qe-ok { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 1px solid var(--line-strong); border-radius: 7px; background: var(--surface); color: var(--muted); font-size: 12px; font-weight: 600; }
.qe-ok.on { background: var(--m-ok); border-color: var(--m-ok); color: #fff; }
.f-inset .f-box { background: var(--surface); }

/* Cours masqués, absences */
.edt-row.masque, .edt-blk.masque { opacity: .45; }
.n-abs { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; column-gap: 12px; min-height: 52px; padding: 8px 16px; }
.n-abs-st { max-width: 46vw; overflow: hidden; text-overflow: ellipsis; }

/* Moodle */
.mo-ech, .mo-cm {
  display: grid; align-items: center; column-gap: 12px; min-height: 54px; padding: 8px 16px; color: inherit; text-decoration: none;
}
.mo-ech { grid-template-columns: 8px minmax(0, 1fr) auto; border-top: 1px solid var(--line-soft); }
.f-ph + .mo-ech { border-top: 0; }
.mo-cm { grid-template-columns: 16px minmax(0, 1fr) 14px; }
.mo-note { display: grid; grid-template-columns: 8px minmax(0, 1fr) auto; align-items: center; column-gap: 12px; min-height: 46px; padding: 8px 16px; }
.mo-lien { color: inherit; text-decoration: none; }

/* Mails */
.ml-row { display: grid; grid-template-columns: 8px minmax(0, 1fr); column-gap: 10px; width: 100%; padding: 10px 16px; border: 0; background: transparent; color: inherit; font: inherit; text-align: left; }
.ml-dot { width: 7px; height: 7px; margin-top: 6px; border-radius: 50%; background: transparent; }
.ml-row.nonlu .ml-dot { background: var(--m-ok); }
.ml-de { color: var(--ink-3); font-weight: 500; }
.ml-row.nonlu .ml-de { color: var(--ink); font-weight: 600; }
.ml-texte { font-size: 14px; line-height: 1.6; white-space: pre-wrap; overflow-wrap: anywhere; }
.ml-texte a { color: var(--ink); text-decoration: underline; text-underline-offset: 2px; text-decoration-color: var(--line-strong); }
.ml-su { color: var(--ink-3); }
.ml-row.nonlu .ml-su { color: var(--ink); font-weight: 500; }
.ml-cite { padding-left: 12px; border-left: 2px solid var(--line); color: var(--muted); font-size: 13px; max-height: 260px; overflow-y: auto; }
.ml-suivi { display: flex; align-items: center; gap: 10px; min-height: 40px; padding: 4px 6px 4px 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--surface); color: var(--ink-3); font-size: 13px; }
.ml-suivi.echec { color: var(--neg); }
.ml-compose textarea { min-height: 150px; }
.ml-sig { padding: 2px 2px 0; color: var(--muted); font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
.ml-sig-html { white-space: normal; padding: 10px 12px; border: 1px solid var(--line); border-radius: 8px; background: #fff; color: #1c1917; overflow-x: auto; }
.ml-sig-html img { max-width: 100%; height: auto; display: inline-block; vertical-align: middle; }
.ml-sig-html a { color: inherit; }
.ml-sig-html table { border-collapse: collapse; }

/* Podcasts */
.pd-audio { width: 100%; }
.q-attente { pointer-events: none; }
.q-attente .q-play { opacity: .6; animation: pulse 1.6s ease-in-out infinite; }
@keyframes pulse { 50% { opacity: .25; } }
@media (max-width: 520px) { .res-seg .ct { display: none; } .res-seg > button { padding: 0 4px; gap: 5px; } }
.pd-ecoute .l-lib .t-ink { color: var(--ink-3); }

/* Navigation : compteurs */
.f-nav .ct { margin-left: auto; font-size: 12px; font-weight: 500; color: var(--muted); font-variant-numeric: tabular-nums; }
.f-tb-dot { position: absolute; top: -2px; right: -4px; width: 8px; height: 8px; border-radius: 50%; background: var(--m-ok); box-shadow: 0 0 0 2px var(--bg); }
.f-tb.on .f-tb-dot { box-shadow: 0 0 0 2px var(--primary); }
.f-tb-ic { position: relative; display: inline-flex; }

/* Mobile : pas d'effet élastique, pas de zoom */
html, body { overscroll-behavior: none; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
.f-app { overflow-x: clip; }
html[data-touch="1"], html[data-touch="1"] body, html[data-touch="1"] .f-app * { touch-action: pan-x pan-y; }
html[data-touch="1"] .f-app * { -webkit-tap-highlight-color: transparent; }
html[data-touch="1"] *:hover { transition: none !important; }
html[data-touch="1"] .f-btn:not(.no-touch-grow) { min-height: 40px; }
html[data-touch="1"] .f-ibtn { width: 40px; height: 40px; }
html[data-touch="1"] .f-ibtn-bd { width: 40px; height: 40px; }
html[data-touch="1"] .edt-sem { height: 40px; }
html[data-touch="1"] .f-seg > button { height: 34px; }
html[data-touch="1"] .f-chip { height: 36px; }
html[data-touch="1"] input, html[data-touch="1"] select, html[data-touch="1"] textarea { font-size: 16px !important; }
html[data-touch="1"] .f-field { height: auto; min-height: 42px; padding-top: 8px; padding-bottom: 8px; }
html[data-touch="1"] .f-field-sm { min-height: 38px; }
html[data-touch="1"] .f-overlay:has(> .f-modal:not(.m-sm)) { padding: 0; }
html[data-touch="1"] .f-overlay > .f-modal:not(.m-sm) {
  max-width: none; max-height: 100dvh; height: 100dvh; border: 0; border-radius: 0;
  padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px);
}
html[data-touch="1"] .f-modal-f .f-btn { flex: 1 1 auto; }
`;

// ============================================================
// PARAMÈTRES
// ============================================================

const SettingsModal = ({
  open, onClose,
  gistId, gistUser, isConnected, syncStatus, syncError, lastSyncAt, onConnect, onDisconnect, onForceSync,
  themePref, onThemeChange, bgEnabled, onBgToggle,
  repo, onRepoChange, edtMaj, nbImport, onImportIcs, onClearIcs, geaMaj, onCopierFavori,
  onExport, onImportClick, compte,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState('');
  const [copie, setCopie] = useState(false);
  useEffect(() => { if (!open) { setTokenInput(''); setShowToken(false); setLocalError(''); setCopie(false); } }, [open]);

  const connecter = async () => {
    if (!tokenInput.trim()) return;
    setBusy(true); setLocalError('');
    try { await onConnect(tokenInput.trim()); setTokenInput(''); } catch (err) { setLocalError(err.message); } finally { setBusy(false); }
  };
  const copierId = async () => {
    try { await navigator.clipboard.writeText(gistId); setCopie(true); setTimeout(() => setCopie(false), 1500); } catch { /* presse-papiers indisponible */ }
  };
  const Titre = ({ children, action }) => <div className="f-sec-h"><h4>{children}</h4>{action}</div>;
  const synchroLabel = syncStatus === 'saving' ? 'Sauvegarde…' : syncStatus === 'loading' ? 'Chargement…' : syncStatus === 'error' ? 'Erreur' : horodatage(lastSyncAt);
  const synchroColor = syncStatus === 'error' ? 'var(--neg)' : (syncStatus === 'saving' || syncStatus === 'loading') ? 'var(--m-wait-2)' : 'var(--m-ok)';

  return (
    <Modal open={open} onClose={onClose} title="Paramètres" size="md">
      <div className="flex flex-col gap-6">
        <section className="flex flex-col">
          <Titre>Apparence</Titre>
          <div className="f-box">
            <Ligne label="Thème">
              <Seg label="Thème" value={themePref} onChange={onThemeChange}
                options={[{ id: 'auto', label: 'Auto' }, { id: 'light', label: 'Clair' }, { id: 'dark', label: 'Sombre' }]} />
            </Ligne>
            <Ligne label="Fond animé"><Switch on={bgEnabled} onChange={onBgToggle} label="Fond animé" /></Ligne>
          </div>
        </section>

        <section className="flex flex-col">
          <Titre action={!isConnected && (
            <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer" className="f-lien">Créer un token</a>
          )}>Synchronisation Gist</Titre>
          {!isConnected ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <label className="relative flex-1 flex items-center min-w-0">
                  <input type={showToken ? 'text' : 'password'} value={tokenInput} onChange={(e) => setTokenInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') connecter(); }} placeholder="Token GitHub" aria-label="Token GitHub"
                    className="f-field f-mono" style={{ paddingRight: 40, fontSize: 12.5 }} autoComplete="off" />
                  <IconButton label={showToken ? 'Masquer' : 'Afficher'} onClick={() => setShowToken(v => !v)} className="f-eye no-touch-grow">
                    {showToken ? <EyeOff size={15} /> : <Eye size={15} />}
                  </IconButton>
                </label>
                <Button onClick={connecter} disabled={busy || !tokenInput.trim()}>{busy ? 'Connexion…' : 'Connecter'}</Button>
              </div>
              {(localError || syncError) && <p className="text-xs t-neg">{localError || syncError}</p>}
            </div>
          ) : (
            <div className="f-box">
              <Ligne label="Compte"><span className="truncate t-ink3">{gistUser || '—'}</span></Ligne>
              <Ligne label="Gist">
                <button type="button" className="f-copy f-mono no-touch-grow" onClick={copierId} title="Copier l'identifiant">
                  {copie ? <Check size={13} /> : <Copy size={13} />}{gistId.slice(0, 8)}…
                </button>
              </Ligne>
              <Ligne label="Dernière synchronisation">
                <span className="flex items-center gap-2 f-num" style={{ color: syncStatus === 'error' ? 'var(--neg)' : 'var(--ink-3)' }}>
                  <span className="f-dot" style={{ background: synchroColor }} />{synchroLabel}
                </span>
              </Ligne>
              {syncError && <p className="text-xs t-neg f-ln">{syncError}</p>}
              <div className="f-ln" style={{ marginLeft: -8 }}>
                <Button variant="ghost" onClick={onForceSync} disabled={syncStatus === 'loading' || syncStatus === 'saving'} className="no-touch-grow t-ink">
                  <RefreshCw size={14} className={syncStatus === 'loading' ? 'animate-spin' : ''} /> Recharger
                </Button>
                <Button variant="ghost" onClick={() => { if (window.confirm('Déconnecter la synchronisation ?')) onDisconnect(); }} className="no-touch-grow" style={{ color: 'var(--neg)' }}>
                  Déconnecter
                </Button>
              </div>
            </div>
          )}
        </section>

        <section className="flex flex-col">
          <Titre>Unicaen</Titre>
          <div className="f-box">
            <Ligne label="EDT et mails"><span className="t-ink3 f-num">{horodatage(edtMaj)}</span></Ligne>
            <Ligne label="Site GEA">
              <span className="t-ink3 f-num">{horodatage(geaMaj)}</span>
              <a href={GEA_URL} target="_blank" rel="noopener noreferrer" className="f-ibtn" aria-label="Ouvrir le site GEA" title="Ouvrir le site GEA"><ExternalLink size={14} /></a>
            </Ligne>
            <Ligne label="Favori d'import" icon={Copy} onClick={onCopierFavori}><span className="t-muted text-xs">Copier</span></Ligne>
            <Ligne label="Dépôt GitHub">
              <input value={repo} onChange={(e) => onRepoChange(e.target.value.trim())} placeholder="compte/etudes"
                className="f-field f-field-sm f-mono" style={{ maxWidth: 190, fontSize: 12.5 }} aria-label="Dépôt GitHub" autoCapitalize="off" autoCorrect="off" />
            </Ligne>
            <Ligne label="Importer un fichier .ics" icon={CalendarDays} onClick={onImportIcs}><ChevronRight size={15} className="t-faint" /></Ligne>
            {nbImport > 0 && (
              <Ligne label="Cours importés">
                <span className="t-muted f-num">{nbImport}</span>
                <Button variant="ghost" size="sm" onClick={onClearIcs} style={{ color: 'var(--neg)' }}>Effacer</Button>
              </Ligne>
            )}
          </div>
        </section>

        <section className="flex flex-col">
          <Titre action={<span className="text-xs f-num t-muted">{compte}</span>}>Données</Titre>
          <div className="f-box">
            <Ligne label="Importer mes données" icon={FolderOpen} onClick={onImportClick}><ChevronRight size={15} className="t-faint" /></Ligne>
            <Ligne label="Exporter mes données" icon={Download} onClick={onExport}><ChevronRight size={15} className="t-faint" /></Ligne>
          </div>
        </section>
      </div>
    </Modal>
  );
};

// ============================================================
// FOND ANIMÉ — vague de particules (identique à Finances)
// ============================================================

const ParticleWaveBackground = ({ isDark }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const particleColor = isDark ? (a) => `rgba(168,162,158,${a})` : (a) => `rgba(120,113,108,${a})`;
    const bgColor = isDark ? '#1c1917' : '#fafaf9';
    const COUNT = Math.min(350, Math.round(window.innerWidth * window.innerHeight / 5000));
    const pts = Array.from({ length: COUNT }, () => ({
      x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
      phase: Math.random() * Math.PI * 2, speed: 0.008 + Math.random() * 0.012,
      ampX: 6 + Math.random() * 10, ampY: 4 + Math.random() * 7, r: 0.8 + Math.random() * 1.4,
    }));
    pts.forEach(p => { p.ox = p.x; p.oy = p.y; });
    let t = 0;
    const draw = () => {
      if (document.hidden) { animRef.current = requestAnimationFrame(draw); return; }
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        p.x = p.ox + Math.sin(t * p.speed + p.phase) * p.ampX;
        p.y = p.oy + Math.cos(t * p.speed * 0.7 + p.phase) * p.ampY;
        ctx.fillStyle = particleColor(0.15 + Math.sin(t * p.speed + p.phase) * 0.15);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      t++;
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); };
  }, [isDark]);
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} aria-hidden="true" />;
};

// ============================================================
// APPLICATION
// ============================================================

const NAV = [
  { id: 'edt', label: 'Emploi du temps', court: 'EDT', icon: CalendarDays },
  { id: 'mails', label: 'Mails', court: 'Mails', icon: Mail },
  { id: 'notes', label: 'Notes', court: 'Notes', icon: GraduationCap },
  { id: 'ressources', label: 'Ressources', court: 'Ressources', icon: Library },
  { id: 'obsidian', label: 'Obsidian', court: 'Obsidian', icon: Gem },
];
const SOUS_RESSOURCES = ['fiches', 'qcm', 'podcasts'];

function AppInner() {
  // Mobile : pas de zoom, plein écran
  useEffect(() => {
    let meta = document.querySelector('meta[name="viewport"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'viewport'); document.head.appendChild(meta); }
    meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no, viewport-fit=cover');
    if (!document.querySelector('link[rel~="icon"]')) {
      const icon = document.createElement('link');
      icon.setAttribute('rel', 'icon'); icon.setAttribute('type', 'image/svg+xml');
      icon.setAttribute('href', 'data:image/svg+xml,' + encodeURIComponent(LOGO_SVG));
      document.head.appendChild(icon);
    }
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (!coarse) return undefined;
    const stop = (e) => e.preventDefault();
    const stopPinch = (e) => { if (e.touches && e.touches.length > 1) e.preventDefault(); };
    document.addEventListener('gesturestart', stop, { passive: false });
    document.addEventListener('gesturechange', stop, { passive: false });
    document.addEventListener('touchmove', stopPinch, { passive: false });
    return () => {
      document.removeEventListener('gesturestart', stop);
      document.removeEventListener('gesturechange', stop);
      document.removeEventListener('touchmove', stopPinch);
    };
  }, []);

  // ===== Données =====
  const [data, setDataRaw] = useState(() => migrer(LS.getJSON('etudes_data')));
  const commit = useCallback((fn) => setDataRaw(prev => ({ ...(typeof fn === 'function' ? fn(prev) : fn), savedAt: new Date().toISOString() })), []);
  useEffect(() => {
    const t = setTimeout(() => LS.set('etudes_data', JSON.stringify(data)), 250);
    return () => clearTimeout(t);
  }, [data]);

  const [edtDistant, setEdtDistant] = useState(() => LS.getJSON('etudes_edt'));
  useEffect(() => { if (edtDistant) LS.set('etudes_edt', JSON.stringify(edtDistant)); }, [edtDistant]);

  // ===== Navigation =====
  const [view, setView] = useState(() => {
    const v = LS.get('etudes_view', 'edt');
    if (SOUS_RESSOURCES.includes(v) || v === 'moodle') return 'ressources';
    return NAV.some(n => n.id === v) ? v : 'edt';
  });
  const [ongletRes, setOngletRes] = useState(() => { const o = LS.get('etudes_res_onglet', 'fiches'); return SOUS_RESSOURCES.includes(o) ? o : 'fiches'; });
  const choisirOnglet = (o) => { setOngletRes(o); LS.set('etudes_res_onglet', o); };
  const [focus, setFocus] = useState(null);
  const [signal, setSignal] = useState({ type: null, n: 0 });
  const envoyer = (type) => setSignal(s => ({ type, n: s.n + 1 }));
  const goTo = (cible, matiere = null) => {
    const sous = SOUS_RESSOURCES.includes(cible);
    const id = sous ? 'ressources' : cible;
    if (sous) choisirOnglet(cible);
    setFocus(matiere ? { view: cible, matiere, n: Date.now() } : null);
    setView(id); LS.set('etudes_view', id);
    window.scrollTo(0, 0);
  };

  // ===== Apparence =====
  const [themePref, setThemePref] = useState(() => LS.get('etudes_theme', 'auto'));
  const [bgEnabled, setBgEnabled] = useState(() => LS.get('etudes_bg', '1') !== '0');
  const [systemDark, setSystemDark] = useState(() => !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches));
  const [isTouch, setIsTouch] = useState(() => window.innerWidth <= 768 || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches));
  useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const onScheme = (e) => setSystemDark(e.matches);
    const onResize = () => setIsTouch(window.innerWidth <= 768 || !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches));
    mq?.addEventListener?.('change', onScheme);
    window.addEventListener('resize', onResize);
    return () => { mq?.removeEventListener?.('change', onScheme); window.removeEventListener('resize', onResize); };
  }, []);
  const isDark = themePref === 'dark' || (themePref === 'auto' && systemDark);
  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle('dark', isDark);
    if (isTouch) html.setAttribute('data-touch', '1'); else html.removeAttribute('data-touch');
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#1c1917' : '#fafaf9');
  }, [isDark, isTouch]);
  useEffect(() => { LS.set('etudes_theme', themePref); }, [themePref]);
  useEffect(() => { LS.set('etudes_bg', bgEnabled ? '1' : '0'); }, [bgEnabled]);

  // ===== Gist =====
  const [gistToken, setGistToken] = useState(() => LS.get('etudes_gist_token'));
  const [gistId, setGistId] = useState(() => LS.get('etudes_gist_id'));
  const [gistUser, setGistUser] = useState(() => LS.get('etudes_gist_user'));
  const [repo, setRepo] = useState(() => LS.get('etudes_repo', depotParDefaut()));
  useEffect(() => { LS.set('etudes_repo', repo); }, [repo]);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [syncError, setSyncError] = useState('');
  const [lastSyncAt, setLastSyncAt] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [edtBusy, setEdtBusy] = useState(false);
  const [toast, setToast] = useState('');
  const chargeRef = useRef(false);
  const [pret, setPret] = useState(() => !(LS.get('etudes_gist_token') && LS.get('etudes_gist_id')));
  const dejaEnvoye = useRef(null);
  const saveTimer = useRef(null);
  const isGistConnected = !!(gistToken && gistId);
  const dataRef = useRef(data);
  dataRef.current = data;

  const montrer = (msg) => { setToast(msg); setTimeout(() => setToast(t => (t === msg ? '' : t)), 3200); };

  // Le plus récent des deux l'emporte (champ savedAt)
  const adopter = (distant) => {
    if (!distant) return false;
    const local = dataRef.current;
    if (!local.savedAt || (distant.savedAt && distant.savedAt >= local.savedAt)) {
      const d = migrer(distant);
      dejaEnvoye.current = d.savedAt;
      setDataRaw(d);
      return true;
    }
    return false;
  };

  const chargerGist = async (token = gistToken, id = gistId) => {
    setSyncStatus('loading'); setSyncError('');
    try {
      const { data: distant, edt, updatedAt } = await gistApi.readAll(token, id);
      const pris = adopter(distant);
      if (edt) setEdtDistant(edt);
      setLastSyncAt(updatedAt);
      chargeRef.current = true;
      setSyncStatus('saved');
      if (!pris) { dejaEnvoye.current = null; setDataRaw(d => ({ ...d })); }
      setPret(true);
      return edt;
    } catch (err) {
      setSyncStatus('error'); setSyncError(err.message);
      setPret(true);
      return null;
    }
  };

  // Relance discrète du robot quand les données datent de plus de 20 min (ouverture ou retour sur l'appli)
  const autoLance = useRef(false);
  const relancerSiAncien = async (edt) => {
    if (!repo || !gistToken || !gistId || autoLance.current) return;
    const age = edt?.majLe ? Date.now() - new Date(edt.majLe).getTime() : Infinity;
    const dernier = Number(LS.get('etudes_auto_lance', '0')) || 0;
    if (age < 20 * 60000 || Date.now() - dernier < 10 * 60000) return;
    autoLance.current = true;
    LS.set('etudes_auto_lance', String(Date.now()));
    const avant = edt?.majLe || '';
    try {
      await gistApi.lancerEdt(gistToken, repo);
      for (let i = 0; i < 10; i++) {
        await new Promise(r => setTimeout(r, 15000));
        const { edt: frais } = await gistApi.readAll(gistToken, gistId);
        if (frais?.majLe && frais.majLe !== avant) { setEdtDistant(frais); break; }
      }
    } catch { /* l'actualisation manuelle reste disponible */ }
    finally { autoLance.current = false; }
  };

  useEffect(() => {
    if (isGistConnected) chargerGist().then(relancerSiAncien);
    const onVisible = () => { if (document.visibilityState === 'visible' && isGistConnected && chargeRef.current) chargerGist().then(relancerSiAncien); };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gistToken, gistId]);

  // Sauvegarde automatique 1,5 s après la dernière modification
  useEffect(() => {
    if (!isGistConnected || !chargeRef.current) return undefined;
    if (data.savedAt && data.savedAt === dejaEnvoye.current) return undefined;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      setSyncStatus('saving');
      const envoi = dataRef.current;
      gistApi.update(gistToken, gistId, envoi)
        .then(g => { dejaEnvoye.current = envoi.savedAt; setSyncStatus('saved'); setLastSyncAt(g.updated_at || new Date().toISOString()); setSyncError(''); })
        .catch(err => { setSyncStatus('error'); setSyncError(err.message); });
    }, 1500);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gistToken, gistId]);

  const connectGist = async (token) => {
    setSyncStatus('loading'); setSyncError('');
    try {
      const user = await gistApi.checkToken(token);
      const existants = await gistApi.findExisting(token);
      let id;
      if (existants.length) {
        id = existants[0].id;
        const { data: distant, edt, updatedAt } = await gistApi.readAll(token, id);
        if (!adopter(distant)) dejaEnvoye.current = null;
        if (edt) setEdtDistant(edt);
        setLastSyncAt(updatedAt);
      } else {
        const g = await gistApi.create(token, { ...dataRef.current, savedAt: dataRef.current.savedAt || new Date().toISOString() });
        id = g.id;
        dejaEnvoye.current = dataRef.current.savedAt;
        setLastSyncAt(g.updated_at);
      }
      setGistToken(token); setGistId(id); setGistUser(user.login);
      LS.set('etudes_gist_token', token); LS.set('etudes_gist_id', id); LS.set('etudes_gist_user', user.login);
      chargeRef.current = true;
      setSyncStatus('saved');
      // Données locales plus récentes que le Gist : on les envoie
      if (dejaEnvoye.current === null) setDataRaw(d => ({ ...d }));
    } catch (err) {
      setSyncStatus('error'); setSyncError(err.message);
      throw err;
    }
  };
  const disconnectGist = () => {
    setGistToken(''); setGistId(''); setGistUser('');
    LS.set('etudes_gist_token', ''); LS.set('etudes_gist_id', ''); LS.set('etudes_gist_user', '');
    setSyncStatus('idle'); setSyncError(''); chargeRef.current = false;
  };

  // ===== Emploi du temps =====
  const ressources = data.ressources;
  const cours = useMemo(() => {
    const modifs = data.edtModifs || {};
    const base = fusionnerCours(edtDistant?.cours || [], (data.gea && data.gea.edt) || [], data.edtImport || [])
      .map(c => nettoyerCours(c, ressources, modifs)).filter(c => !Number.isNaN(c.debut.getTime()));
    // Examens datés du site GEA (« charge de travail ») absents de l'emploi du temps
    const examensGea = ((data.gea && data.gea.evaluations) || []).filter(e => e.date && e.heure).map(e => {
      const r = trouverRessource(ressources, e.module) || ressourceDuTitre(e.module || e.libelle || '', '', ressources);
      const code = r ? r.code : '';
      const debut = new Date(e.date);
      return nettoyerCours({ id: `geaeval_${e.id}`, debut: debut.toISOString(), fin: new Date(debut.getTime() + 2 * 3600000).toISOString(),
        titre: code ? `${e.libelle} [MOD:${code}]` : e.libelle }, ressources, modifs);
    }).map(c => ({ ...c, examen: !c.masque, sourceEval: true }));
    const fusion = [...base];
    for (const ex of examensGea) {
      if (!Number.isNaN(ex.debut.getTime()) && !fusion.some(c => c.examen && c.code && c.code === ex.code && sameDay(c.debut, ex.debut))) fusion.push(ex);
    }
    return fusion.sort((a, b) => a.debut - b.debut);
  }, [edtDistant, data.gea, data.edtImport, data.edtModifs, ressources]);

  const modifierCours = (cle, valeur, aRetirer) => commit(d => {
    const m = { ...(d.edtModifs || {}) };
    if (valeur) m[cle] = valeur; else delete m[cle];
    if (aRetirer) delete m[aRetirer];
    return { ...d, edtModifs: m };
  });

  // Examens de l'EDT et évaluations du site GEA → notes à venir
  useEffect(() => {
    if (!pret) return;
    if (synchroExamens(dataRef.current, cours)) {
      commit(d => ({ ...d, evaluations: synchroExamens(d, cours) || d.evaluations }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, cours, data.gea, data.semestres, data.ressources, data.examensIgnores]);

  // Import envoyé par le favori (#import=…), appliqué une fois les données à jour
  const [importRecu, setImportRecu] = useState(null);
  useEffect(() => {
    const lire = () => {
      const h = window.location.hash || '';
      if (!h.startsWith('#import=')) return;
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
      decoderImport(h.slice(8)).then(setImportRecu).catch(() => montrer('Import illisible'));
    };
    lire();
    window.addEventListener('hashchange', lire);
    return () => window.removeEventListener('hashchange', lire);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!pret || !importRecu) return;
    const imp = importRecu;
    setImportRecu(null);
    if (imp.source === 'gea') {
      commit(d => ({ ...d, gea: { majLe: imp.majLe, absences: imp.absences || [], evaluations: imp.evaluations || [], edt: imp.edt || [] } }));
      montrer(`Site GEA : ${pluriel((imp.evaluations || []).length, 'évaluation')}, ${pluriel((imp.absences || []).length, 'absence')}, ${(imp.edt || []).length} cours`);
      goTo('notes');
    } else if (imp.source === 'moodle') {
      commit(d => ({ ...d, moodle: { majLe: imp.majLe, cours: imp.cours || [], echeances: imp.echeances || [] } }));
      montrer(`Moodle : ${pluriel((imp.cours || []).length, 'cours', 'cours')}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, importRecu]);

  // Réponses aux mails : déposées dans la boîte d'envoi du Gist, envoyées par le robot
  const repondreMail = (item) => {
    commit(d => ({ ...d, boiteEnvoi: [...(d.boiteEnvoi || []), item] }));
    montrer('Réponse en attente d’envoi');
    relancerRobot();
  };

  // Lance le robot après l'enregistrement du Gist, puis recharge son résultat dès qu'il change
  const attenteRobot = useRef(false);
  const relancerRobot = async () => {
    if (!repo || !gistToken || !gistId || attenteRobot.current) return;
    attenteRobot.current = true;
    const avant = edtDistant?.majLe || '';
    try {
      await new Promise(r => setTimeout(r, 4000));
      await gistApi.lancerEdt(gistToken, repo);
      for (let i = 0; i < 18; i++) {
        await new Promise(r => setTimeout(r, 10000));
        const { edt } = await gistApi.readAll(gistToken, gistId);
        if (edt && edt.majLe && edt.majLe !== avant) { setEdtDistant(edt); break; }
      }
    } catch { /* le robot passera de toute façon dans les 30 minutes */ }
    finally { attenteRobot.current = false; }
  };

  // QCM générés par l'IA à partir d'une fiche ou d'une note Obsidian (traités par le robot)
  const genererQcm = ({ titre, matiere, contenu, source }) => {
    const texte = String(contenu || '').trim();
    const id = uid('ia');
    commit(d => ({ ...d, demandesQcm: [...(d.demandesQcm || []), { id, titre: titre || 'Fiche', matiere: matiere || '', source: source || '', contenu: texte.slice(0, 20000), nb: texte.length < 1500 ? 6 : 10, creeLe: new Date().toISOString() }] }));
    montrer('QCM en préparation');
    relancerRobot();
  };
  useEffect(() => {
    const resultats = (edtDistant && edtDistant.qcmsIA) || [];
    const demandes = data.demandesQcm || [];
    const finies = demandes.filter(dm => resultats.some(r => r.id === dm.id));
    if (!finies.length) return;
    const maintenant = new Date().toISOString();
    const nouveaux = [];
    const erreurs = [];
    finies.forEach(dm => {
      const r = resultats.find(x => x.id === dm.id);
      const qs = r.ok && r.qcm && Array.isArray(r.qcm.questions) ? r.qcm.questions.map(normaliserQuestion).filter(q => q.enonce && q.propositions.length >= 2 && q.reponses.length) : [];
      if (qs.length) {
        nouveaux.push({ id: `qcm_${dm.id}`, titre: (r.qcm.titre || `QCM · ${dm.titre}`).trim(), matiere: dm.matiere || '', questions: qs, tentatives: [], stats: {}, ia: true, creeLe: maintenant, modifieLe: maintenant });
      } else erreurs.push(r.erreur ? String(r.erreur).replace(/^[\w.-]+ : /, '').slice(0, 120) : dm.titre);
    });
    commit(d => ({
      ...d,
      qcms: [...d.qcms, ...nouveaux.filter(n => !d.qcms.some(x => x.id === n.id))],
      demandesQcm: (d.demandesQcm || []).filter(dm => !finies.some(f => f.id === dm.id)),
    }));
    if (nouveaux.length) montrer(nouveaux.length > 1 ? `${nouveaux.length} QCM prêts` : `QCM prêt : ${nouveaux[0].titre}`);
    else if (erreurs.length) montrer(`QCM non généré : ${erreurs[0]}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edtDistant, data.demandesQcm]);
  const annulerEnvoi = (id) => commit(d => ({ ...d, boiteEnvoi: (d.boiteEnvoi || []).filter(x => x.id !== id) }));
  useEffect(() => {
    const ok = new Set(((edtDistant && edtDistant.envoyes) || []).filter(r => r.ok).map(r => r.id));
    if (ok.size && (data.boiteEnvoi || []).some(x => ok.has(x.id))) {
      commit(d => ({ ...d, boiteEnvoi: (d.boiteEnvoi || []).filter(x => !ok.has(x.id)) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edtDistant, data.boiteEnvoi]);

  const actualiserEdt = async () => {
    if (edtBusy) return;
    if (!isGistConnected) { setShowSettings(true); return; }
    setEdtBusy(true);
    const avant = edtDistant?.majLe || '';
    try {
      if (repo) {
        try {
          await gistApi.lancerEdt(gistToken, repo);
          montrer('Mise à jour lancée');
          for (let i = 0; i < 12; i++) {
            await new Promise(r => setTimeout(r, 10000));
            const { edt } = await gistApi.readAll(gistToken, gistId);
            if (edt && edt.majLe && edt.majLe !== avant) { setEdtDistant(edt); montrer('Emploi du temps à jour'); return; }
          }
          montrer('Mise à jour toujours en cours');
          return;
        } catch (err) {
          montrer(err.message);
        }
      }
      const edt = await chargerGist();
      if (edt && edt.majLe !== avant) montrer('Emploi du temps à jour');
    } finally {
      setEdtBusy(false);
    }
  };

  const icsRef = useRef(null);
  const importerIcs = async (file) => {
    try {
      const liste = lireICS(await lireFichierTexte(file));
      if (!liste.length) { montrer('Aucun cours dans ce fichier'); return; }
      commit(d => {
        const ids = new Set(liste.map(c => c.id));
        return { ...d, edtImport: [...(d.edtImport || []).filter(c => !ids.has(c.id)), ...liste] };
      });
      montrer(`${pluriel(liste.length, 'cours importé', 'cours importés')}`);
      setShowSettings(false);
      goTo('edt');
    } catch (err) { montrer(err.message); }
  };

  // Compteurs par ressource pour le détail d'un cours
  const compteurs = useCallback((code) => {
    const sem = data.semestres.find(s => s.id === data.semestreActif) || data.semestres[0];
    const evs = data.evaluations.filter(e => e.semestreId === sem.id && e.ressource === code);
    const cle = infoMatiere(ressources, code).cle;
    return {
      moyenne: moyenneEvals(evs),
      fiches: data.fiches.filter(f => infoMatiere(ressources, f.matiere).cle === cle).length,
      qcms: data.qcms.filter(q => infoMatiere(ressources, q.matiere).cle === cle).length,
    };
  }, [data, ressources]);

  const copierFavori = async () => {
    try { await navigator.clipboard.writeText(codeFavori()); montrer('Favori copié'); } catch { montrer('Copie impossible'); }
  };

  // ===== Import / export =====
  const jsonRef = useRef(null);
  const exporter = () => telecharger(`etudes-${toISODate(new Date())}.json`, JSON.stringify(data, null, 2));
  const importerDonnees = async (file) => {
    try {
      const obj = JSON.parse(await lireFichierTexte(file));
      if (!obj || !Array.isArray(obj.semestres)) throw new Error('Fichier non reconnu');
      if (!window.confirm('Remplacer toutes les données par ce fichier ?')) return;
      commit(() => migrer(obj));
      montrer('Données importées');
    } catch (err) { montrer(err.message); }
  };

  // ===== Barre du haut : actions selon la rubrique =====
  const syncBusy = syncStatus === 'saving' || syncStatus === 'loading';
  const syncColor = syncStatus === 'error' ? 'var(--neg)' : syncBusy ? 'var(--m-wait-2)' : syncStatus === 'saved' ? 'var(--m-ok)' : 'var(--faint)';
  const syncTitle = syncStatus === 'saving' ? 'Sauvegarde…' : syncStatus === 'loading' ? 'Chargement…' : syncStatus === 'error' ? `Erreur : ${syncError}` : `Synchronisé · ${horodatage(lastSyncAt)}`;
  const syncIcon = (size) => (syncBusy
    ? <RefreshCw size={size} className="animate-spin" style={{ color: syncColor }} />
    : syncStatus === 'error' ? <AlertCircle size={size} style={{ color: syncColor }} /> : <span className="f-dot" style={{ background: syncColor }} />);

  const actions = {
    edt: [{ label: 'Actualiser', icon: <RefreshCw size={18} className={edtBusy ? 'animate-spin' : ''} />, fn: actualiserEdt }],
    notes: [{ label: 'Ajouter une note', icon: <Plus size={19} />, fn: () => envoyer('add'), main: true }],
    ressources: {
      fiches: [{ label: 'Importer', icon: <Upload size={18} />, fn: () => envoyer('import') }, { label: 'Nouvelle fiche', icon: <Plus size={19} />, fn: () => envoyer('add'), main: true }],
      qcm: [{ label: 'Importer', icon: <Upload size={18} />, fn: () => envoyer('import') }, { label: 'Nouveau QCM', icon: <Plus size={19} />, fn: () => envoyer('add'), main: true }],
      podcasts: [{ label: 'Nouveau podcast', icon: <Plus size={19} />, fn: () => envoyer('add'), main: true }],
    }[ongletRes] || [],
    obsidian: [],
    mails: [{ label: 'Actualiser', icon: <RefreshCw size={18} className={edtBusy ? 'animate-spin' : ''} />, fn: actualiserEdt }],
  }[view];
  const mails = (edtDistant && edtDistant.mails) || [];
  const lusLocaux = new Set(data.mailsLus || []);
  const nonLus = mails.filter(m => m.nonLu && !lusLocaux.has(m.id)).length;

  const compte = `${pluriel(data.evaluations.length, 'note')} · ${pluriel(data.fiches.length, 'fiche')} · ${pluriel(data.qcms.length, 'QCM', 'QCM')}`;

  return (
    <div className="f-app" style={{ backgroundColor: bgEnabled ? 'transparent' : 'var(--bg)' }}>
      {bgEnabled && <ParticleWaveBackground isDark={isDark} />}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <style>{APP_CSS}</style>
        <div className="f-shell">
          <aside className="f-side" aria-label="Navigation principale">
            <div className="flex items-center gap-2 f-brand">
              <LogoMark size={26} />
              <span className="t-ink font-semibold" style={{ fontSize: 14 }}>Études</span>
            </div>
            <nav className="flex flex-col" style={{ gap: 2 }} aria-label="Rubriques">
              {NAV.map(item => {
                const Icon = item.icon;
                const on = view === item.id;
                return (
                  <button key={item.id} type="button" onClick={() => goTo(item.id)} aria-current={on ? 'page' : undefined} className={`f-nav no-touch-grow ${on ? 'on' : ''}`}>
                    <Icon size={16} strokeWidth={on ? 2.1 : 1.8} />{item.label}
                    {item.id === 'mails' && nonLus > 0 && <span className="ct">{nonLus}</span>}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto flex flex-col" style={{ gap: 2 }}>
              {isGistConnected && (
                <button type="button" onClick={() => setShowSettings(true)} title={syncTitle} className="f-nav f-nav-sync no-touch-grow">
                  <span className="f-ic16">{syncIcon(13)}</span>
                  <span className="truncate" style={syncStatus === 'error' ? { color: 'var(--neg)' } : undefined}>
                    {syncStatus === 'error' ? 'Erreur de synchro' : syncBusy ? 'Synchronisation…' : 'Synchronisé'}
                  </span>
                </button>
              )}
              <button type="button" onClick={() => setShowSettings(true)} className="f-nav no-touch-grow">
                <SlidersHorizontal size={16} strokeWidth={1.8} /> Paramètres
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0 flex flex-col">
            <header className="f-topbar">
              <LogoMark size={28} />
              <span className="t-ink font-semibold" style={{ fontSize: 15 }}>Études</span>
              <div className="ml-auto flex items-center" style={{ gap: 2 }}>
                {isGistConnected && <IconButton label={syncTitle} onClick={() => setShowSettings(true)} className="f-ibtn-lg">{syncIcon(17)}</IconButton>}
                <IconButton label="Paramètres" onClick={() => setShowSettings(true)} className="f-ibtn-lg"><SlidersHorizontal size={18} /></IconButton>
                {actions.map(a => (
                  <IconButton key={a.label} label={a.label} onClick={a.fn} className={`f-ibtn-lg ${a.main ? 'f-add' : ''}`}>{a.icon}</IconButton>
                ))}
              </div>
            </header>

            <main className="f-main">
              <div className="f-wrap">
                {view === 'edt' && (
                  <EdtView cours={cours} majLe={edtDistant?.majLe} onRefresh={actualiserEdt} refreshing={edtBusy}
                    onImportIcs={() => icsRef.current?.click()} onOpenSettings={() => setShowSettings(true)}
                    onGoto={goTo} compteurs={compteurs} ressources={ressources} modifs={data.edtModifs || {}} onModif={modifierCours} />
                )}
                {view === 'notes' && <NotesView key={focus?.n || 'notes'} data={data} commit={commit} focus={focus} signal={signal} />}
                {view === 'ressources' && (
                  <RessourcesView data={data} commit={commit} focus={focus} signal={signal} envoyer={envoyer}
                    onglet={ongletRes} onOnglet={choisirOnglet} token={gistToken} onGenererQcm={genererQcm} />
                )}
                {view === 'obsidian' && <ObsidianRubrique data={data} commit={commit} token={gistToken} montrer={montrer} onGenererQcm={genererQcm} />}
                {view === 'mails' && (
                  <MailsView mails={mails} data={data} commit={commit} majLe={edtDistant?.majLe} onRefresh={actualiserEdt} refreshing={edtBusy}
                    envoyes={edtDistant?.envoyes} signature={edtDistant?.signature} signatureHtml={edtDistant?.signatureHtml} onRepondre={repondreMail} onAnnulerEnvoi={annulerEnvoi} />
                )}
              </div>
            </main>
          </div>
        </div>

        <nav className="f-bottom" aria-label="Rubriques">
          {NAV.map(item => {
            const Icon = item.icon;
            const on = view === item.id;
            return (
              <button key={item.id} type="button" onClick={() => goTo(item.id)} aria-label={item.label} title={item.label}
                aria-current={on ? 'page' : undefined} className={`f-tb no-touch-grow ${on ? 'on' : ''}`}>
                <span className="f-tb-ic">
                  <Icon size={25} strokeWidth={on ? 2.1 : 1.8} />
                  {item.id === 'mails' && nonLus > 0 && <i className="f-tb-dot" />}
                </span>
                <span className="f-tb-l">{item.court}</span>
              </button>
            );
          })}
        </nav>

        {toast && <div className="f-toast" role="status">{toast}</div>}

        <input ref={jsonRef} type="file" accept="application/json,.json" hidden
          onChange={(e) => { if (e.target.files[0]) importerDonnees(e.target.files[0]); e.target.value = ''; }} />
        <input ref={icsRef} type="file" accept=".ics,text/calendar" hidden
          onChange={(e) => { if (e.target.files[0]) importerIcs(e.target.files[0]); e.target.value = ''; }} />

        <SettingsModal
          open={showSettings} onClose={() => setShowSettings(false)}
          gistId={gistId} gistUser={gistUser} isConnected={isGistConnected}
          syncStatus={syncStatus} syncError={syncError} lastSyncAt={lastSyncAt}
          onConnect={connectGist} onDisconnect={disconnectGist} onForceSync={() => chargerGist()}
          themePref={themePref} onThemeChange={setThemePref} bgEnabled={bgEnabled} onBgToggle={() => setBgEnabled(v => !v)}
          repo={repo} onRepoChange={setRepo} edtMaj={edtDistant?.majLe} nbImport={(data.edtImport || []).length}
          geaMaj={data.gea?.majLe} onCopierFavori={copierFavori}
          onImportIcs={() => icsRef.current?.click()}
          onClearIcs={() => { if (window.confirm('Effacer les cours importés ?')) commit(d => ({ ...d, edtImport: [] })); }}
          onExport={exporter} onImportClick={() => jsonRef.current?.click()} compte={compte}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppInner />
    </ErrorBoundary>
  );
}
