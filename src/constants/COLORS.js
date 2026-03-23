export const COLORS = {
  bg: '#0D1117',
  surface: '#161B22',
  surfaceElevated: '#21262D',
  surfaceHover: '#2D333B',

  border: '#30363D',
  borderLight: '#3D444D',

  primary: '#00C896',
  primaryDark: '#00A37A',
  primaryLight: '#33D4A8',
  primaryBg: 'rgba(0, 200, 150, 0.1)',
  primaryBorder: 'rgba(0, 200, 150, 0.25)',

  accent: '#FF9F1C',
  accentDark: '#E8890A',
  accentLight: '#FFB84D',
  accentBg: 'rgba(255, 159, 28, 0.1)',

  success: '#3FB950',
  successDark: '#2E9140',
  successBg: 'rgba(63, 185, 80, 0.1)',
  successBorder: 'rgba(63, 185, 80, 0.25)',

  danger: '#F85149',
  dangerDark: '#D73A2E',
  dangerBg: 'rgba(248, 81, 73, 0.1)',
  dangerBorder: 'rgba(248, 81, 73, 0.25)',

  warning: '#D29922',
  warningBg: 'rgba(210, 153, 34, 0.1)',

  text: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',

  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(1, 4, 9, 0.85)',

  shadow: '0 4px 24px rgba(0,0,0,0.4)',
  shadowLg: '0 8px 40px rgba(0,0,0,0.5)',
}

export const CATEGORY_COLORS = {
  'Charger':     { bg: 'rgba(255, 159, 28, 0.12)', icon: '🔌', border: 'rgba(255, 159, 28, 0.3)' },
  'Case':        { bg: 'rgba(0, 200, 150, 0.12)',  icon: '📱', border: 'rgba(0, 200, 150, 0.3)'  },
  'Earphones':   { bg: 'rgba(99, 102, 241, 0.12)', icon: '🎧', border: 'rgba(99, 102, 241, 0.3)' },
  'Screen Guard':{ bg: 'rgba(248, 81, 73, 0.12)',  icon: '🛡️', border: 'rgba(248, 81, 73, 0.3)'  },
  'Cable':       { bg: 'rgba(16, 185, 129, 0.12)', icon: '🔗', border: 'rgba(16, 185, 129, 0.3)' },
  'Power Bank':  { bg: 'rgba(245, 158, 11, 0.12)', icon: '🔋', border: 'rgba(245, 158, 11, 0.3)' },
  'Speaker':     { bg: 'rgba(139, 92, 246, 0.12)', icon: '🔊', border: 'rgba(139, 92, 246, 0.3)' },
  'Other':       { bg: 'rgba(107, 114, 128, 0.12)',icon: '📦', border: 'rgba(107, 114, 128, 0.3)' },
}

export const CATEGORIES = Object.keys(CATEGORY_COLORS)
