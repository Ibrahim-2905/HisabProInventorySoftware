import { useOffline } from '../../hooks/useOffline'
import { COLORS } from '../../constants/COLORS'

export function OfflineBanner() {
  const { isOnline, syncing } = useOffline()

  if (isOnline && !syncing) return null

  return (
    <div style={{
      background: syncing ? COLORS.primaryBg : COLORS.warningBg,
      borderBottom: `1px solid ${syncing ? COLORS.primaryBorder : 'transparent'}`,
      padding: '8px 16px',
      display: 'flex', alignItems: 'center', gap: '8px',
      fontSize: '13px', fontWeight: 600,
      color: syncing ? COLORS.primary : COLORS.warning,
    }}>
      <span>{syncing ? '🔄' : '📵'}</span>
      <span>{syncing ? 'Syncing data...' : 'You are offline — data saved locally'}</span>
    </div>
  )
}
