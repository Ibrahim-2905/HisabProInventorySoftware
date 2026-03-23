import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Header } from '../../components/layout/Header'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useToast } from '../../components/ui/Toast'
import { Modal } from '../../components/ui/Modal'
import { COLORS } from '../../constants/COLORS'

function SettingRow({ icon, label, value, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
        padding: '16px 0', background: 'none', border: 'none',
        borderBottom: `1px solid ${COLORS.border}`, cursor: 'pointer',
        fontFamily: 'inherit', textAlign: 'left'
      }}
    >
      <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: danger ? COLORS.danger : COLORS.text, fontSize: '15px', fontWeight: 600 }}>{label}</div>
        {value && <div style={{ color: COLORS.textSecondary, fontSize: '13px', marginTop: '2px' }}>{value}</div>}
      </div>
      <span style={{ color: COLORS.textSecondary, fontSize: '18px' }}>›</span>
    </button>
  )
}

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { show } = useToast()
  const [shopNameModal, setShopNameModal] = useState(false)
  const [newShopName, setNewShopName] = useState(user?.user_metadata?.shop_name || '')
  const [savingName, setSavingName] = useState(false)
  const [logoutModal, setLogoutModal] = useState(false)

  const shopName = user?.user_metadata?.shop_name || 'My Shop'
  const email = user?.email || ''

  async function saveShopName() {
    if (!newShopName.trim()) return
    setSavingName(true)
    try {
      await supabase.auth.updateUser({ data: { shop_name: newShopName.trim() } })
      show('Shop name updated!')
      setShopNameModal(false)
    } catch {
      show('Failed to update', 'danger')
    } finally {
      setSavingName(false)
    }
  }

  async function handleLogout() {
    await signOut()
  }

  return (
    <PageWrapper>
      <Header title="Settings" />

      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px',
          display: 'flex', alignItems: 'center', gap: '16px'
        }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px',
            background: COLORS.primaryBg,
            border: `2px solid ${COLORS.primaryBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', flexShrink: 0
          }}>🧾</div>
          <div>
            <div style={{ color: COLORS.text, fontSize: '18px', fontWeight: 800 }}>{shopName}</div>
            <div style={{ color: COLORS.textSecondary, fontSize: '13px', marginTop: '2px' }}>{email}</div>
          </div>
        </div>

        <Card style={{ marginBottom: '12px', padding: '0 16px' }}>
          <SettingRow icon="🏪" label="Shop Name" value={shopName} onClick={() => setShopNameModal(true)} />
          <SettingRow icon="📧" label="Email" value={email} onClick={() => {}} />
          <SettingRow icon="🔒" label="Change Password" onClick={() => show('Check your email for reset link', 'warning')} />
        </Card>

        <Card style={{ marginBottom: '12px', padding: '0 16px' }}>
          <SettingRow icon="💾" label="Data & Sync" value="Auto-syncs when online" onClick={() => {}} />
          <SettingRow icon="📵" label="Offline Mode" value="Works without internet" onClick={() => {}} />
        </Card>

        <Card style={{ marginBottom: '24px', padding: '0 16px' }}>
          <SettingRow icon="🚪" label="Sign Out" danger onClick={() => setLogoutModal(true)} />
        </Card>

        <div style={{ textAlign: 'center', padding: '8px 0 24px' }}>
          <div style={{ color: COLORS.textMuted, fontSize: '12px', fontWeight: 600 }}>Hisaab Pro v1.0.0</div>
          <div style={{ color: COLORS.textMuted, fontSize: '11px', marginTop: '4px' }}>Built for Pakistan's shopkeepers 🇵🇰</div>
        </div>
      </div>

      <Modal
        isOpen={shopNameModal}
        onClose={() => setShopNameModal(false)}
        title="Update Shop Name"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" fullWidth onClick={() => setShopNameModal(false)}>Cancel</Button>
            <Button fullWidth onClick={saveShopName} disabled={savingName}>{savingName ? 'Saving...' : 'Save'}</Button>
          </div>
        }
      >
        <Input label="Shop Name" value={newShopName} onChange={setNewShopName} placeholder="Your shop name" />
      </Modal>

      <Modal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        title="Sign Out?"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" fullWidth onClick={() => setLogoutModal(false)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleLogout}>Sign Out</Button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: '48px' }}>👋</span>
          <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: 600, marginTop: '12px' }}>
            Are you sure you want to sign out?
          </p>
          <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>Your data is safely saved.</p>
        </div>
      </Modal>
    </PageWrapper>
  )
}
