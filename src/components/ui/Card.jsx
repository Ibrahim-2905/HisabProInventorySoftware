import { COLORS } from '../../constants/COLORS'

export function Card({ children, style = {}, onClick, hoverable }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '16px',
        padding: '16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        ...style
      }}
      onMouseEnter={e => { if (hoverable || onClick) e.currentTarget.style.borderColor = COLORS.borderLight }}
      onMouseLeave={e => { if (hoverable || onClick) e.currentTarget.style.borderColor = COLORS.border }}
    >
      {children}
    </div>
  )
}
