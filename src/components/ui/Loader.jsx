import { COLORS } from '../../constants/COLORS'

export function Spinner({ size = 32, color = COLORS.primary }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid ${COLORS.border}`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
      flexShrink: 0
    }} />
  )
}

export function PageLoader() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: COLORS.bg, flexDirection: 'column', gap: '16px'
    }}>
      <Spinner size={40} />
      <span style={{ color: COLORS.textSecondary, fontSize: '14px' }}>Loading...</span>
    </div>
  )
}
