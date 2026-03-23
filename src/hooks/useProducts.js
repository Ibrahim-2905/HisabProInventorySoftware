import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { cacheProducts, getCachedProducts, updateCachedProduct, deleteCachedProduct, addPendingOp } from '../utils/db'
import { generateId } from '../utils/formatters'

export function useProducts() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    if (!user) return
    if (navigator.onLine) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name')
      if (!error && data) {
        setProducts(data)
        await cacheProducts(data)
      }
    } else {
      const cached = await getCachedProducts(user.id)
      setProducts(cached)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  async function addProduct(product) {
    const newProduct = {
      ...product,
      user_id: user.id,
      created_at: new Date().toISOString()
    }
    if (navigator.onLine) {
      const { data, error } = await supabase.from('products').insert(newProduct).select().single()
      if (error) throw error
      setProducts(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
      await updateCachedProduct(data)
      return data
    } else {
      const localProduct = { ...newProduct, id: generateId() }
      setProducts(prev => [...prev, localProduct].sort((a, b) => a.name.localeCompare(b.name)))
      await updateCachedProduct(localProduct)
      await addPendingOp({ type: 'INSERT', table: 'products', data: localProduct })
      return localProduct
    }
  }

  async function updateProduct(id, updates) {
    if (navigator.onLine) {
      const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
      if (error) throw error
      setProducts(prev => prev.map(p => p.id === id ? data : p))
      await updateCachedProduct(data)
    } else {
      const updated = products.find(p => p.id === id)
      if (!updated) return
      const newProduct = { ...updated, ...updates }
      setProducts(prev => prev.map(p => p.id === id ? newProduct : p))
      await updateCachedProduct(newProduct)
      await addPendingOp({ type: 'UPDATE', table: 'products', id, data: updates })
    }
  }

  async function deleteProduct(id) {
    if (navigator.onLine) {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
    } else {
      await addPendingOp({ type: 'DELETE', table: 'products', id })
    }
    setProducts(prev => prev.filter(p => p.id !== id))
    await deleteCachedProduct(id)
  }

  async function adjustStock(id, delta) {
    const product = products.find(p => p.id === id)
    if (!product) return
    const newQty = Math.max(0, product.stock_quantity + delta)
    await updateProduct(id, { stock_quantity: newQty })
  }

  return { products, loading, fetchProducts, addProduct, updateProduct, deleteProduct, adjustStock }
}
