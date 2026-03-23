import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useProducts } from '../../hooks/useProducts'
import { useToast } from '../../components/ui/Toast'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Header } from '../../components/layout/Header'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/EmptyState'
import { Badge } from '../../components/ui/Badge'
import { Spinner } from '../../components/ui/Loader'
import { AddProductModal } from './AddProductModal'
import { COLORS, CATEGORY_COLORS } from '../../constants/COLORS'
import { formatCurrency } from '../../utils/formatters'

function ProductRow({ product, onEdit, onDelete, onRestock }) {
  const cat = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Other']
  const stockType = product.stock_quantity === 0 ? 'danger' : product.stock_quantity <= 3 ? 'warning' : 'success'

  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '14px',
      padding: '16px',
      display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      <div style={{
        width: '48px', height: '48px', borderRadius: '12px',
        background: cat.bg, border: `1px solid ${cat.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '24px', flexShrink: 0
      }}>{cat.icon}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ color: COLORS.text, fontSize: '15px', fontWeight: 700, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: COLORS.textSecondary, fontSize: '12px' }}>{product.category}</span>
          <Badge type={stockType}>Stock: {product.stock_quantity}</Badge>
        </div>
        <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
          <span style={{ color: COLORS.textSecondary, fontSize: '12px' }}>Buy: {formatCurrency(product.buying_price)}</span>
          <span style={{ color: COLORS.primary, fontSize: '12px', fontWeight: 700 }}>Sell: {formatCurrency(product.selling_price)}</span>
          <span style={{ color: COLORS.success, fontSize: '12px', fontWeight: 700 }}>
            +{formatCurrency(product.selling_price - product.buying_price)}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        <button onClick={() => onRestock(product)} style={{
          background: COLORS.primaryBg, border: `1px solid ${COLORS.primaryBorder}`,
          borderRadius: '8px', padding: '6px 10px',
          color: COLORS.primary, fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit'
        }}>+Stock</button>
        <button onClick={() => onEdit(product)} style={{
          background: COLORS.surfaceElevated, border: `1px solid ${COLORS.border}`,
          borderRadius: '8px', padding: '6px 10px',
          color: COLORS.textSecondary, fontSize: '12px', fontWeight: 700,
          cursor: 'pointer', fontFamily: 'inherit'
        }}>Edit</button>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const location = useLocation()
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts()
  const { show } = useToast()
  const [search, setSearch] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [restockProduct, setRestockProduct] = useState(null)
  const [restockQty, setRestockQty] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (location.search.includes('add=true')) setAddOpen(true)
  }, [location.search])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    )
  }, [products, search])

  async function handleAdd(data) {
    await addProduct(data)
    show('Product added!')
  }

  async function handleEdit(data) {
    await updateProduct(editProduct.id, data)
    show('Product updated!')
    setEditProduct(null)
  }

  async function handleRestock() {
    const qty = parseInt(restockQty)
    if (!qty || qty < 1) return
    await updateProduct(restockProduct.id, {
      stock_quantity: restockProduct.stock_quantity + qty
    })
    show(`Added ${qty} units to stock!`)
    setRestockProduct(null)
    setRestockQty('')
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await deleteProduct(deleteTarget.id)
      show('Product deleted', 'warning')
      setDeleteTarget(null)
    } catch (e) {
      show('Delete failed', 'danger')
    } finally {
      setDeleting(false)
    }
  }

  const totalValue = products.reduce((s, p) => s + p.buying_price * p.stock_quantity, 0)

  return (
    <PageWrapper>
      <Header
        title="Inventory"
        subtitle={`${products.length} products`}
        rightAction={
          <Button size="sm" onClick={() => setAddOpen(true)} icon="➕">Add</Button>
        }
      />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: COLORS.accentBg,
          border: `1px solid rgba(255,159,28,0.25)`,
          borderRadius: '14px', padding: '14px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'
        }}>
          <span style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 600 }}>Total Stock Value</span>
          <span style={{ color: COLORS.accent, fontSize: '18px', fontWeight: 800 }}>{formatCurrency(totalValue)}</span>
        </div>

        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            style={{
              width: '100%', background: COLORS.surface,
              border: `1.5px solid ${COLORS.border}`,
              borderRadius: '12px', padding: '12px 14px 12px 44px',
              color: COLORS.text, fontSize: '15px', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Spinner /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="📦"
          title={search ? 'No products found' : 'No products yet'}
          subtitle={search ? 'Try a different search' : 'Add your first product to get started'}
          action={!search && <Button onClick={() => setAddOpen(true)} icon="➕">Add Product</Button>}
        />
      ) : (
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map(p => (
            <ProductRow
              key={p.id}
              product={p}
              onEdit={setEditProduct}
              onDelete={setDeleteTarget}
              onRestock={setRestockProduct}
            />
          ))}
        </div>
      )}

      <AddProductModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSave={handleAdd} />
      {editProduct && (
        <AddProductModal isOpen={!!editProduct} onClose={() => setEditProduct(null)} onSave={handleEdit} initial={editProduct} />
      )}

      <Modal
        isOpen={!!restockProduct}
        onClose={() => { setRestockProduct(null); setRestockQty('') }}
        title={`Restock: ${restockProduct?.name}`}
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" fullWidth onClick={() => { setRestockProduct(null); setRestockQty('') }}>Cancel</Button>
            <Button fullWidth onClick={handleRestock} disabled={!restockQty}>Add Stock</Button>
          </div>
        }
      >
        <div style={{ padding: '8px 0' }}>
          <div style={{ color: COLORS.textSecondary, fontSize: '14px', marginBottom: '16px' }}>
            Current stock: <strong style={{ color: COLORS.text }}>{restockProduct?.stock_quantity}</strong>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Add Quantity
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={restockQty}
              onChange={e => setRestockQty(e.target.value)}
              placeholder="How many to add?"
              style={{
                width: '100%', background: COLORS.surfaceElevated,
                border: `1.5px solid ${COLORS.border}`,
                borderRadius: '12px', padding: '14px',
                color: COLORS.text, fontSize: '20px', fontFamily: 'inherit',
                outline: 'none', boxSizing: 'border-box', fontWeight: 700, textAlign: 'center'
              }}
            />
          </div>
          {restockQty && (
            <div style={{ background: COLORS.primaryBg, border: `1px solid ${COLORS.primaryBorder}`, borderRadius: '10px', padding: '12px 14px', textAlign: 'center' }}>
              <span style={{ color: COLORS.textSecondary, fontSize: '13px' }}>New stock will be: </span>
              <strong style={{ color: COLORS.primary, fontSize: '18px' }}>{(restockProduct?.stock_quantity || 0) + (parseInt(restockQty) || 0)}</strong>
            </div>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Product?"
        footer={
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="secondary" fullWidth onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" fullWidth onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <span style={{ fontSize: '48px' }}>🗑️</span>
          <p style={{ color: COLORS.text, fontSize: '16px', fontWeight: 600, marginTop: '12px' }}>
            Delete <strong>{deleteTarget?.name}</strong>?
          </p>
          <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>This cannot be undone.</p>
        </div>
      </Modal>
    </PageWrapper>
  )
}
