// Design tokens for SILENTEC app — 3 theme variants
// Brand: "DISEÑADO PARA DURAR" — industrial, B2B, automotive aftermarket
// Voice: directo, confiable, argentino, orientado al canal

const SILENTEC_THEMES = {
  // 1. Industrial oscuro — piso de taller, negro mate + naranja industrial
  industrial: {
    name: 'Industrial',
    dark: true,
    bg: '#0E0F11',
    surface: '#17191C',
    surface2: '#1F2226',
    surface3: '#2A2D32',
    border: 'rgba(255,255,255,0.08)',
    borderStrong: 'rgba(255,255,255,0.14)',
    text: '#F3F4F5',
    textMuted: '#9A9FA6',
    textDim: '#656A71',
    accent: '#F26722',     // naranja industrial SILENTEC
    accentDim: '#C94F11',
    accentSoft: 'rgba(242,103,34,0.12)',
    success: '#3FB570',
    warn: '#E8B341',
    danger: '#E5484D',
    chip: '#23262B',
    shadow: '0 2px 8px rgba(0,0,0,0.4)',
  },
  // 2. Corporativo claro — colores oficiales SILENTEC (Azul #1834FF + Negro)
  corporate: {
    name: 'Corporativo',
    dark: false,
    bg: '#F5F6F9',
    surface: '#FFFFFF',
    surface2: '#FAFBFD',
    surface3: '#EBEEF4',
    border: 'rgba(0,0,0,0.08)',
    borderStrong: 'rgba(0,0,0,0.14)',
    text: '#000000',
    textMuted: '#5A6075',
    textDim: '#8A90A5',
    accent: '#1834FF',
    accentDim: '#1229D6',
    accentSoft: 'rgba(24,52,255,0.08)',
    success: '#1E8F52',
    warn: '#B07A10',
    danger: '#C62828',
    chip: '#EEF0F6',
    shadow: '0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.04)',
  },
  // 3. Técnico — azul ingeniería + acento ámbar
  engineering: {
    name: 'Ingeniería',
    dark: true,
    bg: '#0A1020',
    surface: '#121A2E',
    surface2: '#1A2440',
    surface3: '#243052',
    border: 'rgba(140,170,220,0.10)',
    borderStrong: 'rgba(140,170,220,0.18)',
    text: '#EAF0FA',
    textMuted: '#8B98B3',
    textDim: '#5A6580',
    accent: '#F4A524',
    accentDim: '#CA8310',
    accentSoft: 'rgba(244,165,36,0.14)',
    success: '#48C78E',
    warn: '#F4A524',
    danger: '#E5484D',
    chip: '#1E2A48',
    shadow: '0 2px 10px rgba(0,0,0,0.35)',
  },
};

// Typography — Gotham (primary, per brand manual) fallback → Montserrat (similar geometry)
// Proxima Nova (secondary) fallback → Inter / Proxima alternative
const SILENTEC_FONT = '"Montserrat", "Proxima Nova", "Inter", -apple-system, system-ui, sans-serif';
const SILENTEC_FONT_DISPLAY = '"Montserrat", "Gotham", "Proxima Nova", sans-serif';
const SILENTEC_FONT_MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

window.SILENTEC_THEMES = SILENTEC_THEMES;
window.SILENTEC_FONT = SILENTEC_FONT;
window.SILENTEC_FONT_DISPLAY = SILENTEC_FONT_DISPLAY;
window.SILENTEC_FONT_MONO = SILENTEC_FONT_MONO;
