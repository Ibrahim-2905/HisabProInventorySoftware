import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { cacheSales, getCachedSales, addPendingOp } from '../utils/db'
import { generateId } from '../utils/formatters'

export function useSales() {
  const { user } = useAuth()
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchSales = useCallback(async (limit = 50) => {
    if (!user) return
    setLoading(true)
    if (navigator.onLine) {
      const { data, error } = await supabase
        .from('sales')
        .select('*, sale_items(*, products(name, category))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)
      if (!error && data) {
        setSales(data)
        await cacheSales(data)
      }
    } else {
      const cached = await getCachedSales(user.id)
      setSales(cached)
    }
    setLoading(false)
  }, [user])

  async function recordSale(cartItems, products, adjustStock) {
    const saleId = generateId()
    const now = new Date().toISOString()
    let totalRevenue = 0
    let totalCost = 0

    const saleItems = cartItems.map(item => {
      const product = products.find(p => p.id === item.productId)
      const revenue = product.selling_price * item.qty
      const cost = product.buying_price * item.qty
      totalRevenue += revenue
      totalCost += cost
      return {
        id: generateId(),
        sale_id: saleId,
        product_id: item.productId,
        quantity: item.qty,
        buying_price: product.buying_price,
        selling_price: product.selling_price,
        profit: revenue - cost
      }
    })

    const totalProfit = totalRevenue - totalCost

    const saleData = {
      id: saleId,
      user_id: user.id,
      total_revenue: totalRevenue,
      total_cost: totalCost,
      total_profit: totalProfit,
      created_at: now
    }

    if (navigator.onLine) {
      const { data: sale, error: saleErr } = await supabase
        .from('sales')
        .insert({ ...saleData, id: undefined })
        .select()
        .single()
      if (saleErr) throw saleErr

      const itemsToInsert = saleItems.map(si => ({ ...si, sale_id: sale.id, id: undefined }))
      const { error: itemErr } = await supabase.from('sale_items').insert(itemsToInsert)
      if (itemErr) throw itemErr

      for (const item of cartItems) {
        await adjustStock(item.productId, -item.qty)
      }

      setSales(prev => [{ ...sale, sale_items: saleItems }, ...prev])
    } else {
      for (const item of cartItems) {
        await adjustStock(item.productId, -item.qty)
      }
      setSales(prev => [{ ...saleData, sale_items: saleItems }, ...prev])
      await addPendingOp({ type: 'SALE', data: { sale: saleData, items: saleItems } })
    }

    return { totalRevenue, totalCost, totalProfit }
  }

  function getSummary(period = 'today') {
    const now = new Date()
    const filtered = sales.filter(s => {
      const d = new Date(s.created_at)
      if (period === 'today') {
        return d.toDateString() === now.toDateString()
      }
      if (period === 'week') {
        const weekAgo = new Date(now)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return d >= weekAgo
      }
      if (period === 'month') {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      }
      return true
    })

    return {
      revenue: filtered.reduce((s, r) => s + Number(r.total_revenue), 0),
      cost: filtered.reduce((s, r) => s + Number(r.total_cost), 0),
      profit: filtered.reduce((s, r) => s + Number(r.total_profit), 0),
      count: filtered.length
    }
  }

  return { sales, loading, fetchSales, recordSale, getSummary }
}
