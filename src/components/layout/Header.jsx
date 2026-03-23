import { useAuth } from '../../context/AuthContext'
import { COLORS } from '../../constants/COLORS'

export function Header({ title, subtitle, rightAction }) {
  const { user } = useAuth()
  const shopName = user?.user_metadata?.shop_name || 'My Shop'

  return (
    <div style={{
      padding: '20px 20px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <h1 style={{
          color: COLORS.text,
          fontSize: title ? '22px' : '18px',
          fontWeight: 800,
          margin: 0, lineHeight: 1.2,
          letterSpacing: '-0.02em'
        }}>
          {title || shopName}
        </h1>
        {subtitle && (
          <p style={{ color: COLORS.textSecondary, fontSize: '13px', margin: '2px 0 0', fontWeight: 500 }}>
            {subtitle}
          </p>
        )}
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  )
}
