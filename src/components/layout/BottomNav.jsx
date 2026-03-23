import { useLocation, useNavigate } from 'react-router-dom'
import { COLORS } from '../../constants/COLORS'

const TABS = [
  { path: '/',          icon: '🏠', label: 'Home'      },
  { path: '/sell',      icon: '🛒', label: 'Sell'      },
  { path: '/inventory', icon: '📦', label: 'Inventory'  },
  { path: '/reports',   icon: '📊', label: 'Reports'   },
  { path: '/settings',  icon: '⚙️', label: 'Settings'  },
]

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: COLORS.surface,
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {TABS.map(tab => {
        const active = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, padding: '10px 4px 12px',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px',
              background: 'none', border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{
              fontSize: '22px', lineHeight: 1,
              filter: active ? 'none' : 'grayscale(1) opacity(0.5)',
              transform: active ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.15s ease',
            }}>{tab.icon}</span>
            <span style={{
              fontSize: '10px', fontWeight: active ? 700 : 500,
              color: active ? COLORS.primary : COLORS.textMuted,
              letterSpacing: '0.03em',
              transition: 'color 0.15s ease',
            }}>{tab.label}</span>
            {active && (
              <div style={{
                position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom) + 0px)',
                width: '4px', height: '4px', borderRadius: '50%',
                background: COLORS.primary
              }} />
            )}
          </button>
        )
      })}
    </nav>
  )
}
