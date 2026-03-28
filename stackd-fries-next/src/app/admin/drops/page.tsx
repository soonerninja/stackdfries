'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { CurrentDrop } from '@/types/database'
import { showToast } from '@/components/admin/Toast'
import styles from './drops.module.css'

function formatDateShort(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function isExpired(endDate: string | null): boolean {
  if (!endDate) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(endDate + 'T00:00:00')
  return end < today
}

export default function DropsPage() {
  const supabase = createClient()
  const [drops, setDrops] = useState<CurrentDrop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Form state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [teaserText, setTeaserText] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
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
      showToast('Failed to load drops', 'error')
    } else {
      setDrops(data || [])
    }
    setLoading(false)
  }

  function resetForm() {
    setEditingId(null)
    setName('')
    setTeaserText('')
    setStartDate('')
    setEndDate('')
    setImageUrl('')
    setIsActive(true)
  }

  function editDrop(drop: CurrentDrop) {
    setEditingId(drop.id)
    setName(drop.name)
    setTeaserText(drop.teaser_text || '')
    setStartDate(drop.start_date || drop.available_date || '')
    setEndDate(drop.end_date || '')
    setImageUrl(drop.image_url || '')
    setIsActive(drop.is_active)
  }

  async function handleDelete(drop: CurrentDrop) {
    if (!confirm(`Delete "${drop.name}"? This cannot be undone.`)) return

    const { error } = await supabase
      .from('current_drop')
      .delete()
      .eq('id', drop.id)

    if (error) {
      showToast('Failed to delete drop: ' + error.message, 'error')
    } else {
      showToast('Drop deleted', 'success')
      await fetchDrops()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Name is required', 'error')
      return
    }
    setSaving(true)

    // Base payload without date columns (they may not exist yet)
    const basePayload: Record<string, unknown> = {
      name: name.trim(),
      teaser_text: teaserText.trim() || null,
      available_date: startDate || null,
      image_url: imageUrl.trim() || null,
      is_active: isActive,
    }

    // Try with date columns first, fall back without them
    const fullPayload = {
      ...basePayload,
      start_date: startDate || null,
      end_date: endDate || null,
    }

    async function trySubmit(payload: Record<string, unknown>): Promise<{ error: { message: string } | null }> {
      if (editingId) {
        return await supabase.from('current_drop').update(payload).eq('id', editingId)
      } else {
        return await supabase.from('current_drop').insert(payload)
      }
    }

    let { error } = await trySubmit(fullPayload)

    // If date columns don't exist, retry without them
    if (error?.message?.includes('end_date') || error?.message?.includes('start_date')) {
      const retryResult = await trySubmit(basePayload)
      error = retryResult.error
      if (!error) {
        showToast((editingId ? 'Drop updated' : 'Drop created') + ' (run SQL migration to enable date fields)', 'success')
        resetForm()
        await fetchDrops()
        setSaving(false)
        return
      }
    }

    if (error) {
      showToast(`Failed to ${editingId ? 'update' : 'create'} drop: ` + error.message, 'error')
    } else {
      showToast(editingId ? 'Drop updated' : 'Drop created', 'success')
      resetForm()
      await fetchDrops()
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

        <div className={styles.dateRow}>
          <div className={styles.field}>
            <label className={styles.label}>Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={styles.input}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={styles.input}
            />
          </div>
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
          <span className={styles.imagePreviewNote}>Paste an image URL to preview below</span>
          {imageUrl.trim() && (
            <div className={styles.imagePreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl.trim()} alt="Drop preview" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} onLoad={(e) => { (e.target as HTMLImageElement).style.display = 'block' }} />
            </div>
          )}
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
          {drops.map((drop) => {
            const expired = isExpired(drop.end_date)
            const dateRange = (drop.start_date || drop.end_date)
              ? `${formatDateShort(drop.start_date || drop.available_date)}${drop.end_date ? ' \u2013 ' + formatDateShort(drop.end_date) : ''}`
              : ''

            return (
              <div key={drop.id} className={`${styles.dropItem} ${expired ? styles.dropItemExpired : ''}`}>
                <div>
                  <div className={styles.dropItemName}>{drop.name}</div>
                  {dateRange && <div className={styles.dropItemDates}>{dateRange}</div>}
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {expired ? (
                    <span className={`${styles.dropItemBadge} ${styles.dropItemBadgeExpired}`}>
                      Expired
                    </span>
                  ) : (
                    <span className={`${styles.dropItemBadge} ${drop.is_active ? styles.dropItemBadgeActive : styles.dropItemBadgeInactive}`}>
                      {drop.is_active ? 'Active' : 'Inactive'}
                    </span>
                  )}
                  <button onClick={() => editDrop(drop)} className={styles.editBtn}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(drop)} className={styles.deleteBtn}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
