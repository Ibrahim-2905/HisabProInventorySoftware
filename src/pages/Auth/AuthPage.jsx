import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { COLORS } from '../../constants/COLORS'

export default function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [shopName, setShopName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!email || !password) { setError('Please fill all fields'); return }
    if (mode === 'signup' && !shopName) { setError('Enter your shop name'); return }
    setError(''); setLoading(true)
    try {
      if (mode === 'login') {
        await signIn(email, password)
      } else {
        await signUp(email, password, shopName)
      }
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '20px',
            background: COLORS.primaryBg,
            border: `2px solid ${COLORS.primaryBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '36px', margin: '0 auto 20px'
          }}>🧾</div>
          <h1 style={{
            color: COLORS.text, fontSize: '28px',
            fontWeight: 800, margin: '0 0 4px',
            letterSpacing: '-0.03em'
          }}>Hisaab Pro</h1>
          <p style={{ color: COLORS.textSecondary, fontSize: '14px', margin: 0 }}>
            {mode === 'login' ? 'Sign in to your shop' : 'Create your shop account'}
          </p>
        </div>

        <div style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '20px',
          padding: '28px 24px'
        }}>
          {mode === 'signup' && (
            <Input
              label="Shop Name"
              value={shopName}
              onChange={setShopName}
              placeholder="e.g. Ahmed Mobile Accessories"
              required
            />
          )}
          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            type="email"
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="Enter password"
            required
          />

          {error && (
            <div style={{
              background: COLORS.dangerBg, border: `1px solid ${COLORS.dangerBorder}`,
              borderRadius: '10px', padding: '12px 14px',
              color: COLORS.danger, fontSize: '14px', fontWeight: 500,
              marginBottom: '16px'
            }}>{error}</div>
          )}

          <Button
            fullWidth
            size="lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </div>

        <button
          onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}
          style={{
            width: '100%', marginTop: '16px',
            background: 'none', border: 'none',
            color: COLORS.textSecondary, fontSize: '14px',
            cursor: 'pointer', padding: '12px', fontFamily: 'inherit'
          }}
        >
          {mode === 'login'
            ? <span>New shop? <span style={{ color: COLORS.primary, fontWeight: 700 }}>Create account</span></span>
            : <span>Already have account? <span style={{ color: COLORS.primary, fontWeight: 700 }}>Sign in</span></span>
          }
        </button>
      </div>
    </div>
  )
}
