import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useSales } from '../../hooks/useSales'
import { useProducts } from '../../hooks/useProducts'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Header } from '../../components/layout/Header'
import { Card } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Spinner } from '../../components/ui/Loader'
import { COLORS } from '../../constants/COLORS'
import { formatCurrency, formatDate } from '../../utils/formatters'

const PERIODS = ['Today', 'Week', 'Month', 'All']

function SummaryRow({ label, value, color, large }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${COLORS.border}` }}>
      <span style={{ color: COLORS.textSecondary, fontSize: large ? '15px' : '14px', fontWeight: 600 }}>{label}</span>
      <span style={{ color: color || COLORS.text, fontSize: large ? '18px' : '16px', fontWeight: 800 }}>{value}</span>
    </div>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: '10px', padding: '10px 14px' }}>
      <p style={{ color: COLORS.textSecondary, fontSize: '12px', margin: '0 0 4px' }}>{label}</p>
      <p style={{ color: COLORS.primary, fontSize: '15px', fontWeight: 700, margin: 0 }}>{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function ReportsPage() {
  const { sales, loading, fetchSales, getSummary } = useSales()
  const { products } = useProducts()
  const [period, setPeriod] = useState('Today')

  useEffect(() => { fetchSales(200) }, [])

  const periodKey = period.toLowerCase().replace('all', 'all')
  const summary = getSummary(period === 'All' ? 'all' : periodKey)

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dayStr = d.toDateString()
    const daySales = sales.filter(s => new Date(s.created_at).toDateString() === dayStr)
    return {
      day: d.toLocaleDateString('en-PK', { weekday: 'short' }),
      profit: daySales.reduce((sum, s) => sum + Number(s.total_profit), 0),
    }
  })

  const topProducts = (() => {
    const map = {}
    sales.forEach(sale => {
      sale.sale_items?.forEach(item => {
        const pid = item.product_id
        if (!map[pid]) map[pid] = { qty: 0, profit: 0, name: item.products?.name || 'Unknown' }
        map[pid].qty += item.quantity
        map[pid].profit += Number(item.profit)
      })
    })
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 5)
  })()

  return (
    <PageWrapper>
      <Header title="Reports" subtitle="Profit & loss overview" />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1, padding: '10px 4px',
                background: period === p ? COLORS.primary : COLORS.surface,
                border: `1px solid ${period === p ? COLORS.primary : COLORS.border}`,
                borderRadius: '10px',
                color: period === p ? COLORS.black : COLORS.textSecondary,
                fontSize: '13px', fontWeight: 700,
                cursor: 'pointer', fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
            >{p}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Spinner /></div>
        ) : (
          <>
            <div style={{
              background: summary.profit >= 0 ? COLORS.successBg : COLORS.dangerBg,
              border: `1px solid ${summary.profit >= 0 ? COLORS.successBorder : COLORS.dangerBorder}`,
              borderRadius: '18px', padding: '24px 20px', marginBottom: '16px'
            }}>
              <p style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 700, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {period} Profit
              </p>
              <p style={{ color: summary.profit >= 0 ? COLORS.success : COLORS.danger, fontSize: '38px', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>
                {formatCurrency(summary.profit)}
              </p>
            </div>

            <Card style={{ marginBottom: '12px' }}>
              <SummaryRow label="Total Revenue" value={formatCurrency(summary.revenue)} color={COLORS.text} />
              <SummaryRow label="Total Cost" value={formatCurrency(summary.cost)} color={COLORS.danger} />
              <SummaryRow label="Net Profit" value={formatCurrency(summary.profit)} color={COLORS.success} large />
              <SummaryRow label="Total Sales" value={`${summary.count} sales`} />
              {summary.count > 0 && (
                <SummaryRow
                  label="Avg Profit / Sale"
                  value={formatCurrency(summary.profit / summary.count)}
                  color={COLORS.primary}
                />
              )}
            </Card>

            <Card style={{ marginBottom: '12px' }}>
              <p style={{ color: COLORS.text, fontSize: '15px', fontWeight: 700, margin: '0 0 16px' }}>Last 7 Days</p>
              {sales.length === 0 ? (
                <EmptyState icon="📊" title="No sales data yet" />
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={last7Days} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="day" tick={{ fill: COLORS.textSecondary, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: COLORS.textSecondary, fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="profit" radius={[6, 6, 0, 0]}>
                      {last7Days.map((entry, i) => (
                        <Cell key={i} fill={entry.profit > 0 ? COLORS.primary : COLORS.danger} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>

            {topProducts.length > 0 && (
              <Card style={{ marginBottom: '12px' }}>
                <p style={{ color: COLORS.text, fontSize: '15px', fontWeight: 700, margin: '0 0 16px' }}>Top Selling Products</p>
                {topProducts.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? `1px solid ${COLORS.border}` : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: COLORS.textSecondary, fontSize: '13px', fontWeight: 700, minWidth: '20px' }}>#{i + 1}</span>
                      <span style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600 }}>{p.name}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: COLORS.primary, fontSize: '13px', fontWeight: 700 }}>{p.qty} sold</div>
                      <div style={{ color: COLORS.success, fontSize: '12px' }}>+{formatCurrency(p.profit)}</div>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {sales.length > 0 && (
              <Card>
                <p style={{ color: COLORS.text, fontSize: '15px', fontWeight: 700, margin: '0 0 16px' }}>Recent Transactions</p>
                {sales.slice(0, 10).map(sale => (
                  <div key={sale.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${COLORS.border}` }}>
                    <div>
                      <div style={{ color: COLORS.text, fontSize: '14px', fontWeight: 600 }}>
                        {sale.sale_items?.length || 1} item{(sale.sale_items?.length || 1) !== 1 ? 's' : ''}
                      </div>
                      <div style={{ color: COLORS.textSecondary, fontSize: '12px', marginTop: '2px' }}>
                        {formatDate(sale.created_at)}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: COLORS.success, fontSize: '15px', fontWeight: 700 }}>+{formatCurrency(sale.total_profit)}</div>
                      <div style={{ color: COLORS.textSecondary, fontSize: '12px' }}>{formatCurrency(sale.total_revenue)}</div>
                    </div>
                  </div>
                ))}
              </Card>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}
