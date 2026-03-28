'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { TrackerStatus } from '@/types/database'
import styles from './tracker.module.css'

export default function TrackerPage() {
  const supabase = createClient()
  const [tracker, setTracker] = useState<TrackerStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form fields for going live
  const [locationName, setLocationName] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')

  useEffect(() => {
    fetchStatus()
  }, [])

  async function fetchStatus() {
    const { data, error } = await supabase
      .from('tracker_status')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to load tracker status' })
    } else {
      setTracker(data)
      if (data.location_name) setLocationName(data.location_name)
      if (data.latitude) setLat(String(data.latitude))
      if (data.longitude) setLng(String(data.longitude))
    }
    setLoading(false)
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      setFeedback({ type: 'error', message: 'Geolocation not supported by your browser' })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(String(pos.coords.latitude))
        setLng(String(pos.coords.longitude))
        setFeedback({ type: 'success', message: 'Location captured' })
      },
      () => {
        setFeedback({ type: 'error', message: 'Could not get your location' })
      }
    )
  }

  async function goLive() {
    if (!tracker) return
    if (!locationName.trim()) {
      setFeedback({ type: 'error', message: 'Location name is required' })
      return
    }
    setSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from('tracker_status')
      .update({
        is_live: true,
        location_name: locationName.trim(),
        latitude: lat ? parseFloat(lat) : null,
        longitude: lng ? parseFloat(lng) : null,
        went_live_at: new Date().toISOString(),
      })
      .eq('id', tracker.id)

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to go live: ' + error.message })
    } else {
      setFeedback({ type: 'success', message: 'You are now LIVE!' })
      await fetchStatus()
    }
    setSaving(false)
  }

  async function goOffline() {
    if (!tracker) return
    setSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from('tracker_status')
      .update({
        is_live: false,
        went_offline_at: new Date().toISOString(),
      })
      .eq('id', tracker.id)

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to go offline: ' + error.message })
    } else {
      setFeedback({ type: 'success', message: 'You are now OFFLINE' })
      await fetchStatus()
    }
    setSaving(false)
  }

  async function markTemporarilyClosed() {
    if (!tracker) return
    setSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from('tracker_status')
      .update({
        is_live: false,
        location_name: 'TEMPORARILY CLOSED',
        went_offline_at: new Date().toISOString(),
      })
      .eq('id', tracker.id)

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to mark as closed: ' + error.message })
    } else {
      setFeedback({ type: 'success', message: 'Marked as TEMPORARILY CLOSED' })
      await fetchStatus()
    }
    setSaving(false)
  }

  async function clearTemporarilyClosed() {
    if (!tracker) return
    setSaving(true)
    setFeedback(null)

    const { error } = await supabase
      .from('tracker_status')
      .update({
        location_name: null,
      })
      .eq('id', tracker.id)

    if (error) {
      setFeedback({ type: 'error', message: 'Failed to clear closed status: ' + error.message })
    } else {
      setFeedback({ type: 'success', message: 'Temporarily closed status removed' })
      await fetchStatus()
    }
    setSaving(false)
  }

  if (loading) {
    return <div className={styles.loading}>Loading tracker status...</div>
  }

  if (!tracker) {
    return <div className={styles.loading}>No tracker status found. Please create a row in tracker_status.</div>
  }

  const isLive = tracker.is_live
  const isTempClosed = !isLive && tracker.location_name === 'TEMPORARILY CLOSED'

  return (
    <div>
      <h1 className={styles.heading}>Truck Tracker</h1>

      {feedback && (
        <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
          {feedback.message}
        </div>
      )}

      <div className={`${styles.statusBanner} ${isLive ? styles.statusBannerLive : isTempClosed ? styles.statusBannerClosed : styles.statusBannerOffline}`}>
        <div className={`${styles.statusText} ${isLive ? styles.statusTextLive : isTempClosed ? styles.statusTextClosed : styles.statusTextOffline}`}>
          {isLive ? 'LIVE' : isTempClosed ? 'TEMPORARILY CLOSED' : 'OFFLINE'}
        </div>
        {isLive && tracker.location_name && (
          <div className={styles.locationInfo}>
            {tracker.location_name}
          </div>
        )}
        {isTempClosed && (
          <div className={styles.locationInfo}>
            Public site shows a &ldquo;taking a break&rdquo; message instead of the schedule.
          </div>
        )}
      </div>

      {!isLive && (
        <div className={styles.form}>
          <div className={styles.formTitle}>Go Live Details</div>
          <div className={styles.field}>
            <label className={styles.label}>Location Name *</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Downtown Main St"
              className={styles.input}
            />
          </div>
          <button type="button" onClick={handleUseMyLocation} className={styles.geoBtn}>
            Use My Location
          </button>
          <p className={styles.mapNote}>
            Tap &lsquo;Use My Location&rsquo; to set your position, or enter coordinates manually below.
          </p>
          <div className={styles.mapPreview}>
            <iframe
              src={`https://maps.google.com/maps?q=${lat || '35.2226'},${lng || '-97.4395'}&z=15&output=embed`}
              title="Location preview"
              allowFullScreen
            />
          </div>
          <div className={styles.coordRow}>
            <div className={styles.field}>
              <label className={styles.label}>Latitude</label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Optional"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Longitude</label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Optional"
                className={styles.input}
              />
            </div>
          </div>
        </div>
      )}

      {isLive ? (
        <button
          onClick={goOffline}
          disabled={saving}
          className={`${styles.bigBtn} ${styles.bigBtnOffline}`}
        >
          {saving ? 'Going Offline...' : 'Go Offline'}
        </button>
      ) : (
        <>
          <button
            onClick={goLive}
            disabled={saving}
            className={`${styles.bigBtn} ${styles.bigBtnLive}`}
          >
            {saving ? 'Going Live...' : 'Go Live'}
          </button>
          {isTempClosed ? (
            <button
              onClick={clearTemporarilyClosed}
              disabled={saving}
              className={`${styles.bigBtn} ${styles.bigBtnClearClosed}`}
            >
              {saving ? 'Clearing...' : 'Remove Temporarily Closed'}
            </button>
          ) : (
            <button
              onClick={markTemporarilyClosed}
              disabled={saving}
              className={`${styles.bigBtn} ${styles.bigBtnClosed}`}
            >
              {saving ? 'Updating...' : 'Mark Temporarily Closed'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
