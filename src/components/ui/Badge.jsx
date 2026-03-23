import { COLORS } from '../../constants/COLORS'

const types = {
  success: { bg: COLORS.successBg, color: COLORS.success, border: COLORS.successBorder },
  danger:  { bg: COLORS.dangerBg,  color: COLORS.danger,  border: COLORS.dangerBorder  },
  warning: { bg: COLORS.warningBg, color: COLORS.warning, border: 'transparent'        },
  primary: { bg: COLORS.primaryBg, color: COLORS.primary, border: COLORS.primaryBorder },
  muted:   { bg: COLORS.surfaceElevated, color: COLORS.textSecondary, border: COLORS.border },
}

export function Badge({ children, type = 'muted' }) {
  const t = types[type] || types.muted
  return (
    <span style={{
      background: t.bg,
      color: t.color,
      border: `1px solid ${t.border}`,
      borderRadius: '8px',
      padding: '3px 10px',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '0.03em',
    }}>
      {children}
    </span>
  )
}
