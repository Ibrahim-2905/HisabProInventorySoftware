import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSales } from '../../hooks/useSales'
import { useProducts } from '../../hooks/useProducts'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { COLORS } from '../../constants/COLORS'
import { formatCurrency } from '../../utils/formatters'

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: '16px',
      padding: '18px 16px',
      flex: 1,
    }}>
      <div style={{ fontSize: '22px', marginBottom: '8px' }}>{icon}</div>
      <div style={{ color, fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{ color: COLORS.textSecondary, fontSize: '12px', fontWeight: 600, marginTop: '2px' }}>{label}</div>
    </div>
  )
}

function BigActionButton({ icon, label, sublabel, onClick, color, bg, border }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: bg || COLORS.surface,
        border: `1.5px solid ${border || COLORS.border}`,
        borderRadius: '20px',
        padding: '24px 16px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '10px', cursor: 'pointer',
        transition: 'all 0.15s ease',
        flex: 1, minHeight: '130px',
        fontFamily: 'inherit',
      }}
      onMouseDown={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
      onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
      onTouchStart={e => { e.currentTarget.style.transform = 'scale(0.96)' }}
      onTouchEnd={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <span style={{ fontSize: '38px', lineHeight: 1 }}>{icon}</span>
      <div>
        <div style={{ color: color || COLORS.text, fontSize: '16px', fontWeight: 800, letterSpacing: '-0.01em' }}>{label}</div>
        {sublabel && <div style={{ color: COLORS.textSecondary, fontSize: '11px', fontWeight: 500, marginTop: '2px' }}>{sublabel}</div>}
      </div>
    </button>
  )
}

export default function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { sales, fetchSales, getSummary } = useSales()
  const { products } = useProducts()

  useEffect(() => { fetchSales(100) }, [])

  const today = getSummary('today')
  const month = getSummary('month')
  const shopName = user?.user_metadata?.shop_name || 'My Shop'
  const lowStock = products.filter(p => p.stock_quantity <= 3 && p.stock_quantity > 0)
  const outOfStock = products.filter(p => p.stock_quantity === 0)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <PageWrapper>
      <div style={{ padding: '24px 20px 16px' }}>
        <p style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 600, margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {greeting} 👋
        </p>
        <h1 style={{ color: COLORS.text, fontSize: '24px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
          {shopName}
        </h1>
      </div>

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          background: COLORS.primaryBg,
          border: `1px solid ${COLORS.primaryBorder}`,
          borderRadius: '18px',
          padding: '20px',
        }}>
          <p style={{ color: COLORS.primary, fontSize: '12px', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Today's Profit</p>
          <p style={{ color: COLORS.primary, fontSize: '36px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
            {formatCurrency(today.profit)}
          </p>
          <p style={{ color: COLORS.textSecondary, fontSize: '13px', margin: '4px 0 0' }}>
            {today.count} sale{today.count !== 1 ? 's' : ''} · Revenue {formatCurrency(today.revenue)}
          </p>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', gap: '10px' }}>
        <StatCard icon="📅" label="This Month" value={formatCurrency(month.profit)} color={COLORS.success} />
        <StatCard icon="🛒" label="Sales Today" value={today.count} color={COLORS.accent} />
        <StatCard icon="📦" label="Products" value={products.length} color={COLORS.textSecondary} />
      </div>

      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div style={{ padding: '0 20px 20px' }}>
          {outOfStock.length > 0 && (
            <div style={{
              background: COLORS.dangerBg, border: `1px solid ${COLORS.dangerBorder}`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px'
            }}>
              <span style={{ fontSize: '20px' }}>🚨</span>
              <div>
                <div style={{ color: COLORS.danger, fontSize: '14px', fontWeight: 700 }}>Out of Stock</div>
                <div style={{ color: COLORS.textSecondary, fontSize: '12px' }}>
                  {outOfStock.map(p => p.name).join(', ')}
                </div>
              </div>
            </div>
          )}
          {lowStock.length > 0 && (
            <div style={{
              background: COLORS.warningBg, border: `1px solid transparent`,
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <span style={{ fontSize: '20px' }}>⚠️</span>
              <div>
                <div style={{ color: COLORS.warning, fontSize: '14px', fontWeight: 700 }}>Low Stock</div>
                <div style={{ color: COLORS.textSecondary, fontSize: '12px' }}>
                  {lowStock.map(p => `${p.name} (${p.stock_quantity})`).join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '0 20px 12px' }}>
        <p style={{ color: COLORS.textSecondary, fontSize: '12px', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Actions</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <BigActionButton
            icon="🛒" label="Sell" sublabel="Record a sale"
            onClick={() => navigate('/sell')}
            color={COLORS.primary}
            bg={COLORS.primaryBg}
            border={COLORS.primaryBorder}
          />
          <BigActionButton
            icon="📦" label="Add Stock" sublabel="Restock items"
            onClick={() => navigate('/inventory')}
            color={COLORS.accent}
            bg={COLORS.accentBg}
            border="rgba(255,159,28,0.25)"
          />
          <BigActionButton
            icon="➕" label="Add Item" sublabel="New product"
            onClick={() => navigate('/inventory?add=true')}
          />
          <BigActionButton
            icon="📊" label="Reports" sublabel="Profit & loss"
            onClick={() => navigate('/reports')}
          />
        </div>
      </div>

      {sales.length > 0 && (
        <div style={{ padding: '8px 20px 20px' }}>
          <p style={{ color: COLORS.textSecondary, fontSize: '12px', fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Recent Sales</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sales.slice(0, 5).map(sale => (
              <div key={sale.id} style={{
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: '12px',
                padding: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600 }}>
                    {sale.sale_items?.length || 1} item{(sale.sale_items?.length || 1) !== 1 ? 's' : ''}
                  </div>
                  <div style={{ color: COLORS.textSecondary, fontSize: '12px', marginTop: '2px' }}>
                    {new Date(sale.created_at).toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: COLORS.success, fontSize: '15px', fontWeight: 700 }}>+{formatCurrency(sale.total_profit)}</div>
                  <div style={{ color: COLORS.textSecondary, fontSize: '12px' }}>{formatCurrency(sale.total_revenue)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageWrapper>
  )
}
