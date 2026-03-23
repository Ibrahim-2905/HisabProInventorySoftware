import { useState } from 'react'
import { Modal } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { COLORS, CATEGORIES, CATEGORY_COLORS } from '../../constants/COLORS'
import { formatCurrency } from '../../utils/formatters'

const EMPTY = { name: '', category: '', buying_price: '', selling_price: '', stock_quantity: '' }

export function AddProductModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(initial || EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(key, val) { setForm(prev => ({ ...prev, [key]: val })) }

  const profit = form.selling_price && form.buying_price
    ? Number(form.selling_price) - Number(form.buying_price)
    : null

  async function handleSave() {
    if (!form.name || !form.category || !form.buying_price || !form.selling_price || !form.stock_quantity) {
      setError('Please fill all fields'); return
    }
    if (Number(form.selling_price) <= 0 || Number(form.buying_price) <= 0) {
      setError('Prices must be greater than 0'); return
    }
    setError(''); setSaving(true)
    try {
      await onSave({
        name: form.name.trim(),
        category: form.category,
        buying_price: Number(form.buying_price),
        selling_price: Number(form.selling_price),
        stock_quantity: Number(form.stock_quantity),
      })
      setForm(EMPTY)
      onClose()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initial ? 'Edit Product' : 'Add New Product'}
      footer={
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : initial ? 'Save Changes' : 'Add Product'}
          </Button>
        </div>
      }
    >
      <Input label="Product Name" value={form.name} onChange={v => set('name', v)} placeholder="e.g. iPhone Charger 20W" required />
      <Select label="Category" value={form.category} onChange={v => set('category', v)} options={CATEGORIES} required />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <Input label="Buying Price" value={form.buying_price} onChange={v => set('buying_price', v)} prefix="Rs." inputMode="numeric" required />
        <Input label="Selling Price" value={form.selling_price} onChange={v => set('selling_price', v)} prefix="Rs." inputMode="numeric" required />
      </div>

      {profit !== null && (
        <div style={{
          background: profit > 0 ? COLORS.successBg : COLORS.dangerBg,
          border: `1px solid ${profit > 0 ? COLORS.successBorder : COLORS.dangerBorder}`,
          borderRadius: '10px', padding: '10px 14px', marginBottom: '12px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <span style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 600 }}>Profit per item</span>
          <span style={{ color: profit > 0 ? COLORS.success : COLORS.danger, fontSize: '16px', fontWeight: 800 }}>
            {formatCurrency(profit)}
          </span>
        </div>
      )}

      <Input label="Stock Quantity" value={form.stock_quantity} onChange={v => set('stock_quantity', v)} placeholder="0" inputMode="numeric" required />

      {error && (
        <div style={{
          background: COLORS.dangerBg, border: `1px solid ${COLORS.dangerBorder}`,
          borderRadius: '10px', padding: '12px 14px',
          color: COLORS.danger, fontSize: '14px', fontWeight: 500
        }}>{error}</div>
      )}
    </Modal>
  )
}
