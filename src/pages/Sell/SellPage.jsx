import { useState, useEffect, useMemo } from 'react'
import { useProducts } from '../../hooks/useProducts'
import { useSales } from '../../hooks/useSales'
import { useToast } from '../../components/ui/Toast'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Loader'
import { COLORS, CATEGORY_COLORS } from '../../constants/COLORS'
import { formatCurrency } from '../../utils/formatters'

function ProductCard({ product, onAdd }) {
  const cat = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Other']
  const outOfStock = product.stock_quantity === 0

  return (
    <button
      onClick={() => !outOfStock && onAdd(product)}
      style={{
        background: outOfStock ? COLORS.surface : cat.bg,
        border: `1.5px solid ${outOfStock ? COLORS.border : cat.border}`,
        borderRadius: '16px',
        padding: '18px 12px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: '8px',
        cursor: outOfStock ? 'not-allowed' : 'pointer',
        opacity: outOfStock ? 0.5 : 1,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
        width: '100%',
      }}
      onMouseDown={e => { if (!outOfStock) e.currentTarget.style.transform = 'scale(0.95)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      onTouchStart={e => { if (!outOfStock) e.currentTarget.style.transform = 'scale(0.95)' }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <span style={{ fontSize: '32px', lineHeight: 1 }}>{cat.icon}</span>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: COLORS.text, fontSize: '13px', fontWeight: 700, lineHeight: 1.3 }}>{product.name}</div>
        <div style={{ color: COLORS.primary, fontSize: '14px', fontWeight: 800, marginTop: '4px' }}>
          {formatCurrency(product.selling_price)}
        </div>
        <div style={{ color: outOfStock ? COLORS.danger : COLORS.textMuted, fontSize: '11px', fontWeight: 600, marginTop: '2px' }}>
          {outOfStock ? 'Out of stock' : `Stock: ${product.stock_quantity}`}
        </div>
      </div>
    </button>
  )
}

function CartItem({ item, product, onQtyChange, onRemove }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '12px 0', borderBottom: `1px solid ${COLORS.border}`
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>{product?.name}</div>
        <div style={{ color: COLORS.textSecondary, fontSize: '12px' }}>{formatCurrency(product?.selling_price)} each</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => onQtyChange(item.productId, -1)} style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: COLORS.surfaceElevated, border: `1px solid ${COLORS.border}`,
          color: COLORS.text, fontSize: '18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit'
        }}>−</button>
        <span style={{ color: COLORS.text, fontSize: '16px', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
        <button onClick={() => onQtyChange(item.productId, 1)} style={{
          width: '32px', height: '32px', borderRadius: '8px',
          background: COLORS.surfaceElevated, border: `1px solid ${COLORS.border}`,
          color: COLORS.primary, fontSize: '18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit'
        }}>+</button>
      </div>
      <div style={{ textAlign: 'right', minWidth: '72px' }}>
        <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 700 }}>
          {formatCurrency((product?.selling_price || 0) * item.qty)}
        </div>
        <button onClick={() => onRemove(item.productId)} style={{
          background: 'none', border: 'none', color: COLORS.danger,
          fontSize: '12px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, padding: 0
        }}>Remove</button>
      </div>
    </div>
  )
}

export default function SellPage() {
  const { products, loading, adjustStock } = useProducts()
  const { recordSale } = useSales()
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [cartOpen, setCartOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selling, setSelling] = useState(false)
  const [successData, setSuccessData] = useState(null)

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id)
      const maxQty = product.stock_quantity
      if (existing) {
        if (existing.qty >= maxQty) { show('Not enough stock', 'warning'); return prev }
        return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { productId: product.id, qty: 1 }]
    })
  }

  function changeQty(productId, delta) {
    setCart(prev => {
      return prev.map(i => {
        if (i.productId !== productId) return i
        const product = products.find(p => p.id === productId)
        const newQty = i.qty + delta
        if (newQty < 1) return i
        if (newQty > product.stock_quantity) { show('Not enough stock', 'warning'); return i }
        return { ...i, qty: newQty }
      })
    })
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.productId !== productId))
  }

  const cartTotal = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.productId)
    return sum + (p?.selling_price || 0) * item.qty
  }, 0)

  const cartProfit = cart.reduce((sum, item) => {
    const p = products.find(pr => pr.id === item.productId)
    return sum + ((p?.selling_price || 0) - (p?.buying_price || 0)) * item.qty
  }, 0)

  async function confirmSale() {
    setSelling(true)
    try {
      const result = await recordSale(cart, products, adjustStock)
      setCart([])
      setConfirmOpen(false)
      setCartOpen(false)
      setSuccessData(result)
    } catch (e) {
      show('Sale failed: ' + e.message, 'danger')
    } finally {
      setSelling(false)
    }
  }

  return (
    <PageWrapper>
      <Header
        title="Sell"
        subtitle={cart.length > 0 ? `${cart.length} item${cart.length !== 1 ? 's' : ''} in cart` : 'Tap a product to add'}
        rightAction={
          cart.length > 0 ? (
            <button onClick={() => setCartOpen(true)} style={{
              background: COLORS.primary, border: 'none',
              borderRadius: '12px', padding: '10px 16px',
              color: COLORS.black, fontSize: '14px', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'inherit'
            }}>
              🛒 {cart.length} · {formatCurrency(cartTotal)}
            </button>
          ) : null
        }
      />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: '100%', background: COLORS.surface,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px', padding: '14px 14px 14px 44px',
              color: COLORS.text, fontSize: '16px', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon="📦" title="No products" subtitle="Add products from the Inventory tab first" />
      ) : (
        <div style={{ padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {filtered.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
        </div>
      )}

      <Modal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        title={`Cart (${cart.length} items)`}
        footer={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: COLORS.textSecondary, fontSize: '14px', fontWeight: 600 }}>Total</span>
              <span style={{ color: COLORS.text, fontSize: '18px', fontWeight: 800 }}>{formatCurrency(cartTotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
              <span style={{ color: COLORS.textSecondary, fontSize: '14px', fontWeight: 600 }}>Profit</span>
              <span style={{ color: COLORS.success, fontSize: '16px', fontWeight: 800 }}>{formatCurrency(cartProfit)}</span>
            </div>
            <Button fullWidth size="lg" onClick={() => { setCartOpen(false); setConfirmOpen(true) }}>
              Confirm Sale
            </Button>
          </div>
        }
      >
        {cart.map(item => (
          <CartItem
            key={item.productId}
            item={item}
            product={products.find(p => p.id === item.productId)}
            onQtyChange={changeQty}
            onRemove={removeFromCart}
          />
        ))}
        {cart.length === 0 && <EmptyState icon="🛒" title="Cart is empty" />}
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Sale?"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button fullWidth onClick={confirmSale} disabled={selling}>
              {selling ? 'Processing...' : '✓ Confirm'}
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
          <div style={{ color: COLORS.text, fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>
            {formatCurrency(cartTotal)}
          </div>
          <div style={{ color: COLORS.success, fontSize: '16px', fontWeight: 700 }}>
            Profit: {formatCurrency(cartProfit)}
          </div>
          <div style={{ color: COLORS.textSecondary, fontSize: '13px', marginTop: '8px' }}>
            {cart.length} item{cart.length !== 1 ? 's' : ''} · Sale will be recorded
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        title="Sale Complete!"
      >
        {successData && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <div style={{ color: COLORS.success, fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>
              {formatCurrency(successData.totalProfit)}
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '24px' }}>Profit from this sale</div>
            <div style={{ background: COLORS.surfaceElevated, borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: COLORS.textSecondary }}>Revenue</span>
                <span style={{ color: COLORS.text, fontWeight: 700 }}>{formatCurrency(successData.totalRevenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: COLORS.textSecondary }}>Cost</span>
                <span style={{ color: COLORS.text, fontWeight: 700 }}>{formatCurrency(successData.totalCost)}</span>
              </div>
            </div>
            <Button fullWidth size="lg" style={{ marginTop: '20px' }} onClick={() => setSuccessData(null)}>
              Done
            </Button>
          </div>
        )}
      </Modal>
    </PageWrapper>
  )
}
