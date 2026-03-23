import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getPendingOps, clearPendingOp } from '../utils/db'

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncing, setSyncing] = useState(false)

  async function syncPending() {
    setSyncing(true)
    try {
      const ops = await getPendingOps()
      for (const op of ops) {
        try {
          if (op.type === 'INSERT') {
            const { id: localId, ...data } = op.data
            await supabase.from(op.table).insert(data)
          } else if (op.type === 'UPDATE') {
            await supabase.from(op.table).update(op.data).eq('id', op.id)
          } else if (op.type === 'DELETE') {
            await supabase.from(op.table).delete().eq('id', op.id)
          } else if (op.type === 'SALE') {
            const { sale, items } = op.data
            const { id: localSaleId, ...saleData } = sale
            const { data: newSale } = await supabase.from('sales').insert(saleData).select().single()
            if (newSale) {
              const cleanItems = items.map(({ id, sale_id, ...rest }) => ({ ...rest, sale_id: newSale.id }))
              await supabase.from('sale_items').insert(cleanItems)
            }
          }
          await clearPendingOp(op.id)
        } catch (_) {}
      }
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      syncPending()
    }
    function handleOffline() {
      setIsOnline(false)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, syncing }
}
