import { useState } from 'react'
import { COLORS } from '../../constants/COLORS'

export function Input({ label, value, onChange, type = 'text', placeholder, prefix, required, inputMode }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          color: COLORS.textSecondary,
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}{required && <span style={{ color: COLORS.danger, marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: '14px',
            color: COLORS.textSecondary,
            fontSize: '16px', fontWeight: 600,
            pointerEvents: 'none'
          }}>{prefix}</span>
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            background: COLORS.surfaceElevated,
            border: `1.5px solid ${focused ? COLORS.primary : COLORS.border}`,
            borderRadius: '12px',
            padding: prefix ? '14px 14px 14px 44px' : '14px',
            color: COLORS.text,
            fontSize: '16px',
            fontFamily: 'inherit',
            outline: 'none',
            transition: 'border-color 0.15s ease',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  )
}

export function Select({ label, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label style={{
          display: 'block',
          color: COLORS.textSecondary,
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          {label}{required && <span style={{ color: COLORS.danger, marginLeft: '2px' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: COLORS.surfaceElevated,
          border: `1.5px solid ${focused ? COLORS.primary : COLORS.border}`,
          borderRadius: '12px',
          padding: '14px',
          color: value ? COLORS.text : COLORS.textMuted,
          fontSize: '16px',
          fontFamily: 'inherit',
          outline: 'none',
          transition: 'border-color 0.15s ease',
          cursor: 'pointer',
          appearance: 'none',
        }}
      >
        <option value="">Select category...</option>
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: COLORS.surface, color: COLORS.text }}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
