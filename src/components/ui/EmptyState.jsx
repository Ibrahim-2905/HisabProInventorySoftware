import { COLORS } from '../../constants/COLORS'

export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', gap: '12px', textAlign: 'center'
    }}>
      <span style={{ fontSize: '56px', lineHeight: 1 }}>{icon}</span>
      <h3 style={{ color: COLORS.text, fontSize: '18px', fontWeight: 700, margin: 0 }}>{title}</h3>
      {subtitle && <p style={{ color: COLORS.textSecondary, fontSize: '14px', margin: 0, maxWidth: '260px', lineHeight: 1.5 }}>{subtitle}</p>}
      {action && <div style={{ marginTop: '8px' }}>{action}</div>}
    </div>
  )
}
