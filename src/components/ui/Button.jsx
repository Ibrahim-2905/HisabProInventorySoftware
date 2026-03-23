import { COLORS } from '../../constants/COLORS'

const variants = {
  primary: {
    background: COLORS.primary,
    color: COLORS.black,
    border: 'none',
  },
  secondary: {
    background: COLORS.surfaceElevated,
    color: COLORS.text,
    border: `1px solid ${COLORS.border}`,
  },
  danger: {
    background: COLORS.dangerBg,
    color: COLORS.danger,
    border: `1px solid ${COLORS.dangerBorder}`,
  },
  ghost: {
    background: 'transparent',
    color: COLORS.textSecondary,
    border: 'none',
  },
  accent: {
    background: COLORS.accent,
    color: COLORS.black,
    border: 'none',
  }
}

export function Button({ children, variant = 'primary', size = 'md', onClick, disabled, fullWidth, style = {}, icon }) {
  const v = variants[variant] || variants.primary
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px', borderRadius: '10px', minHeight: '36px' },
    md: { padding: '14px 24px', fontSize: '16px', borderRadius: '14px', minHeight: '52px' },
    lg: { padding: '18px 32px', fontSize: '18px', borderRadius: '16px', minHeight: '62px' },
  }
  const s = sizes[size] || sizes.md

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        ...s,
        width: fullWidth ? '100%' : 'auto',
        fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
        letterSpacing: '0.01em',
        ...style
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {icon && <span style={{ fontSize: size === 'lg' ? '22px' : '18px' }}>{icon}</span>}
      {children}
    </button>
  )
}
