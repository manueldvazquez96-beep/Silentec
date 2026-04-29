// SILENTEC logo — uses official PNG from brand manual
// Variants: 'azul' (#1834FF), 'blanco', 'negro'

function SilentecLogo({ size = 120, variant, style = {} }) {
  // Auto-pick variant from active theme if not provided
  const T = window.T;
  const auto = !variant && T ? (T.dark ? 'blanco' : 'azul') : (variant || 'azul');
  const src = `assets/silentec-logo-${auto}.png`;
  return (
    <img src={src} alt="SILENTEC"
      style={{
        width: size, height: 'auto', display: 'block',
        objectFit: 'contain', ...style,
      }}
    />
  );
}

function SilentecSymbol({ size = 40, variant, style = {} }) {
  const T = window.T;
  const auto = !variant && T ? (T.dark ? 'blanco' : 'azul') : (variant || 'azul');
  const src = `assets/silentec-simbolo-${auto}.png`;
  return (
    <img src={src} alt="SILENTEC"
      style={{ width: size, height: size, display: 'block', objectFit: 'contain', ...style }}
    />
  );
}

window.SilentecLogo = SilentecLogo;
window.SilentecSymbol = SilentecSymbol;
