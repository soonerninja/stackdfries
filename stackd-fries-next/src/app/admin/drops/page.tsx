'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { CurrentDrop } from '@/types/database'
import styles from './drops.module.css'

export default function DropsPage() {
  const supabase = createClient()
  const [drops, setDrops] = useState<CurrentDrop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [teaserText, setTeaserText] = useState('')
  const [availableDate, setAvailableDate] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchDrops()
  }, [])

  async function fetchDrops() {
    const { data, error } = await supabase
      .from('current_drop')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to load drops' })
    } else {
      setDrops(data || [])
    }
    setLoading(false)
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setTeaserText('')
    setAvailableDate('')
    setImageUrl('')
    setIsActive(true)
  }

  function editDrop(drop: CurrentDrop) {
    setEditingId(drop.id)
    setName(drop.name)
    setTeaserText(drop.teaser_text || '')
    setAvailableDate(drop.available_date || '')
    setImageUrl(drop.image_url || '')
    setIsActive(drop.is_active)
    setFeedback(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'Name is required' })
      return
    }
    setSaving(true)
    setFeedback(null)

    const payload = {
      name: name.trim(),
      teaser_text: teaserText.trim() || null,
      available_date: availableDate || null,
      image_url: imageUrl.trim() || null,
      is_active: isActive,
    }

    if (editingId) {
      const { error } = await supabase
        .from('current_drop')
        .update(payload)
        .eq('id', editingId)

      if (error) {
        setFeedback({ type: 'error', message: 'Failed to update drop: ' + error.message })
      } else {
        setFeedback({ type: 'success', message: 'Drop updated' })
        resetForm()
        await fetchDrops()
      }
    } else {
      const { error } = await supabase
        .from('current_drop')
        .insert(payload)

      if (error) {
        setFeedback({ type: 'error', message: 'Failed to create drop: ' + error.message })
      } else {
        setFeedback({ type: 'success', message: 'Drop created' })
        resetForm()
        await fetchDrops()
      }
    }
    setSaving(false)
  }

  if (loading) {
    return <div className={styles.loading}>Loading drops...</div>
  }

  const activeDrop = drops.find((d) => d.is_active)

  return (
    <div>
      <h1 className={styles.heading}>Drops</h1>

      {feedback && (
        <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
          {feedback.message}
        </div>
      )}

      <div className={styles.currentDrop}>
        <div className={styles.currentDropLabel}>Current Active Drop</div>
        {activeDrop ? (
          <div className={styles.currentDropName}>{activeDrop.name}</div>
        ) : (
          <div className={styles.currentDropNone}>No active drop</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formTitle}>
          {editingId ? 'Edit Drop' : 'New Drop'}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Drop name"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Teaser Text</label>
          <textarea
            value={teaserText}
            onChange={(e) => setTeaserText(e.target.value)}
            placeholder="Short teaser description"
            className={styles.textarea}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Available Date</label>
          <input
            type="date"
            value={availableDate}
            onChange={(e) => setAvailableDate(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Image URL</label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
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

        <button type="submit" className={styles.submitBtn} disabled={saving}>
          {saving ? 'Saving...' : editingId ? 'Update Drop' : 'Create Drop'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className={styles.editBtn}
            style={{ width: '100%', marginTop: 8 }}
          >
            Cancel Edit
          </button>
        )}
      </form>

      {drops.length > 0 && (
        <div className={styles.dropsList}>
          <div className={styles.dropsListTitle}>All Drops</div>
          {drops.map((drop) => (
            <div key={drop.id} className={styles.dropItem}>
              <div>
                <div className={styles.dropItemName}>{drop.name}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className={`${styles.dropItemBadge} ${drop.is_active ? styles.dropItemBadgeActive : styles.dropItemBadgeInactive}`}>
                  {drop.is_active ? 'Active' : 'Inactive'}
                </span>
                <button onClick={() => editDrop(drop)} className={styles.editBtn}>
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
