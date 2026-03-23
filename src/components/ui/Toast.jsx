import { useState, useCallback, useRef } from 'react'
import { COLORS } from '../../constants/COLORS'

let toastFn = null

export function useToast() {
  const show = useCallback((message, type = 'success') => {
    if (toastFn) toastFn(message, type)
  }, [])
  return { show }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])
  const counter = useRef(0)

  toastFn = (message, type) => {
    const id = ++counter.current
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  const icons = { success: '✓', danger: '✕', warning: '⚠' }
  const colors = {
    success: { bg: COLORS.successBg, border: COLORS.successBorder, color: COLORS.success },
    danger:  { bg: COLORS.dangerBg,  border: COLORS.dangerBorder,  color: COLORS.danger  },
    warning: { bg: COLORS.warningBg, border: 'transparent',        color: COLORS.warning  },
  }

  return (
    <div style={{
      position: 'fixed', top: '20px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', flexDirection: 'column',
      gap: '8px', width: 'calc(100% - 32px)', maxWidth: '400px',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => {
        const c = colors[t.type] || colors.success
        return (
          <div key={t.id} style={{
            background: COLORS.surface,
            border: `1px solid ${c.border}`,
            borderLeft: `4px solid ${c.color}`,
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
            animation: 'slideDown 0.25s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: COLORS.shadowLg,
          }}>
            <span style={{
              width: '24px', height: '24px', borderRadius: '50%',
              background: c.bg, color: c.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 800, flexShrink: 0
            }}>{icons[t.type] || icons.success}</span>
            <span style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600 }}>{t.message}</span>
          </div>
        )
      })}
    </div>
  )
}
