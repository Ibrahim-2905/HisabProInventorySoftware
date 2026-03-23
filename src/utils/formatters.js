export function formatCurrency(amount) {
  return `Rs. ${Number(amount || 0).toLocaleString('en-PK')}`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' })
}

export function todayStart() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function weekStart() {
  const d = new Date()
  d.setDate(d.getDate() - d.getDay())
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function monthStart() {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export function calcProfit(buyPrice, sellPrice, qty = 1) {
  return (sellPrice - buyPrice) * qty
}

export function generateId() {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}
