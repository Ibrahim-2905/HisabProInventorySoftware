import { COLORS } from '../../constants/COLORS'
import { OfflineBanner } from '../shared/OfflineBanner'

export function PageWrapper({ children, noPadding }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      paddingBottom: '80px',
      paddingTop: 'env(safe-area-inset-top)',
    }}>
      <OfflineBanner />
      <div style={{ padding: noPadding ? 0 : '0 0' }}>
        {children}
      </div>
    </div>
  )
}
