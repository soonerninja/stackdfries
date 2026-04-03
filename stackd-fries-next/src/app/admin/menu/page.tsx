'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { MenuItem } from '@/types/database'
import styles from './menu.module.css'

const CATEGORIES = [
  { value: 'stackd_fries', label: "Stack'd Fries" },
  { value: 'sides', label: 'Sides' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'desserts', label: 'Desserts' },
]

export default function MenuPage() {
  const supabase = createClient()
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [sharePrice, setSharePrice] = useState('')
  const [category, setCategory] = useState('stackd_fries')
  const [sortOrder, setSortOrder] = useState('0')
  const [isActive, setIsActive] = useState(true)
  const [imageUrl, setImageUrl] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [additionalImages, setAdditionalImages] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to load menu items' })
    } else {
      setItems(data || [])
    }
    setLoading(false)
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setDescription('')
    setPrice('')
    setSharePrice('')
    setCategory('stackd_fries')
    setSortOrder('0')
    setIsActive(true)
    setImageUrl('')
    setVideoUrl('')
    setAdditionalImages('')
    setShowForm(false)
  }

  function startEdit(item: MenuItem) {
    setEditingId(item.id)
    setName(item.name)
    setDescription(item.description || '')
    setPrice(item.price != null ? String(item.price) : '')
    setSharePrice(item.share_price != null ? String(item.share_price) : '')
    setCategory(item.category)
    setSortOrder(String(item.sort_order))
    setIsActive(item.is_active)
    setImageUrl(item.image_url || '')
    setVideoUrl(item.video_url || '')
    setAdditionalImages(item.images ? item.images.join(', ') : '')
    setShowForm(true)
    setFeedback(null)
  }

  function startAdd() {
    resetForm()
    setShowForm(true)
    setFeedback(null)
  }

  async function handleDelete(item: MenuItem) {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return

    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', item.id)

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to delete: ' + error.message })
    } else {
      setFeedback({ type: 'success', message: `"${item.name}" deleted` })
      await fetchItems()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Name is required' })
      return
    }
    if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
      setFeedback({ type: 'error', message: 'Price must be a valid number' })
      return
    }

    setSaving(true)
    setFeedback(null)

    const imagesArray = additionalImages.trim()
      ? additionalImages.split(',').map((s) => s.trim()).filter(Boolean)
      : null

    const payload = {
      name: name.trim(),
      description: description.trim() || null,
      price: price ? parseFloat(price) : null,
      share_price: sharePrice && !isNaN(parseFloat(sharePrice)) ? parseFloat(sharePrice) : null,
      category,
      sort_order: parseInt(sortOrder) || 0,
      is_active: isActive,
      image_url: imageUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      images: imagesArray,
    }

    if (editingId) {
      const { error } = await supabase
        .from('menu_items')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setFeedback({ type: 'error', message: 'Failed to update: ' + error.message })
      } else {
        setFeedback({ type: 'success', message: 'Item updated' })
        resetForm()
        await fetchItems()
      }
    } else {
      const { error } = await supabase
        .from('menu_items')
        .insert(payload)

      if (error) {
        setFeedback({ type: 'error', message: 'Failed to create: ' + error.message })
      } else {
        setFeedback({ type: 'success', message: 'Item created' })
        resetForm()
        await fetchItems()
      }
    }
    setSaving(false)
  }

  if (loading) {
    return <div className={styles.loading}>Loading menu items...</div>
  }

  return (
    <div>
      <div className={styles.topRow}>
        <h1 className={styles.heading}>Menu</h1>
        {!showForm && (
          <button onClick={startAdd} className={styles.addBtn}>
            Add Item
          </button>
        )}
      </div>

      {feedback && (
        <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
          {feedback.message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formTitle}>
            {editingId ? 'Edit Item' : 'New Item'}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.field}>
              <label className={styles.label}>Price (Full)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Price (Share)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sharePrice}
                onChange={(e) => setSharePrice(e.target.value)}
                placeholder="0.00"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.select}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Video URL</label>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://example.com/teaser.mp4"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Additional Images (comma-separated URLs)</label>
            <input
              type="text"
              value={additionalImages}
              onChange={(e) => setAdditionalImages(e.target.value)}
              placeholder="https://img1.jpg, https://img2.jpg"
              className={styles.input}
            />
          </div>

          <div className={styles.toggleRow}>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`${styles.toggle} ${isActive ? styles.toggleOn : styles.toggleOff}`}
              aria-label="Toggle active"
            />
            <span className={styles.toggleLabel}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? 'Saving...' : editingId ? 'Update Item' : 'Create Item'}
            </button>
            <button type="button" onClick={resetForm} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {items.length === 0 ? (
        <div className={styles.empty}>No menu items yet. Add one above.</div>
      ) : (
        <div className={styles.itemList}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`${styles.item} ${!item.is_active ? styles.itemInactive : ''}`}
            >
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{item.name}</div>
                <div className={styles.itemMeta}>
                  <span>{item.price != null ? `$${item.price.toFixed(2)}` : 'No price'}</span>
                  <span>{CATEGORIES.find((c) => c.value === item.category)?.label || item.category}</span>
                  <span>Order: {item.sort_order}</span>
                  <span>{item.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <div className={styles.itemActions}>
                <button onClick={() => startEdit(item)} className={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(item)} className={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
