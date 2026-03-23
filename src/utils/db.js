import { openDB } from 'idb'

const DB_NAME = 'hisaab-pro'
const DB_VERSION = 1

let dbInstance = null

export async function getDB() {
  if (dbInstance) return dbInstance
  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('products')) {
        const products = db.createObjectStore('products', { keyPath: 'id' })
        products.createIndex('user_id', 'user_id')
      }
      if (!db.objectStoreNames.contains('sales')) {
        const sales = db.createObjectStore('sales', { keyPath: 'id' })
        sales.createIndex('user_id', 'user_id')
      }
      if (!db.objectStoreNames.contains('sale_items')) {
        const items = db.createObjectStore('sale_items', { keyPath: 'id' })
        items.createIndex('sale_id', 'sale_id')
      }
      if (!db.objectStoreNames.contains('pending_ops')) {
        db.createObjectStore('pending_ops', { keyPath: 'id', autoIncrement: true })
      }
    }
  })
  return dbInstance
}

export async function cacheProducts(products) {
  const db = await getDB()
  const tx = db.transaction('products', 'readwrite')
  await Promise.all(products.map(p => tx.store.put(p)))
  await tx.done
}

export async function getCachedProducts(userId) {
  const db = await getDB()
  const all = await db.getAllFromIndex('products', 'user_id', userId)
  return all
}

export async function updateCachedProduct(product) {
  const db = await getDB()
  await db.put('products', product)
}

export async function deleteCachedProduct(id) {
  const db = await getDB()
  await db.delete('products', id)
}

export async function cacheSales(sales) {
  const db = await getDB()
  const tx = db.transaction('sales', 'readwrite')
  await Promise.all(sales.map(s => tx.store.put(s)))
  await tx.done
}

export async function getCachedSales(userId) {
  const db = await getDB()
  const all = await db.getAllFromIndex('sales', 'user_id', userId)
  return all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

export async function addPendingOp(op) {
  const db = await getDB()
  await db.add('pending_ops', { ...op, timestamp: Date.now() })
}

export async function getPendingOps() {
  const db = await getDB()
  return db.getAll('pending_ops')
}

export async function clearPendingOp(id) {
  const db = await getDB()
  await db.delete('pending_ops', id)
}
