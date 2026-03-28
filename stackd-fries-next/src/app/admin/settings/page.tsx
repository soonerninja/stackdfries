'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import styles from './settings.module.css'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

// Generate time options from 10:00 AM to 3:00 AM
function getTimeOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = []
  for (let h = 10; h <= 27; h++) {
    for (const m of [0, 30]) {
      const hour24 = h % 24
      const val = `${String(hour24).padStart(2, '0')}:${String(m).padStart(2, '0')}`
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      const ampm = hour24 >= 12 && hour24 < 24 ? 'pm' : 'am'
      const label = `${hour12}:${String(m).padStart(2, '0')} ${ampm}`
      options.push({ value: val, label })
    }
  }
  return options
}

const TIME_OPTIONS = getTimeOptions()

type DayHours = { open: string; close: string }
type HoursData = Record<string, DayHours>

const DEFAULT_HOURS: HoursData = {
  thu: { open: '17:00', close: '22:00' },
  fri: { open: '17:00', close: '23:00' },
  sat: { open: '12:00', close: '23:00' },
  sun: { open: '12:00', close: '20:00' },
}

export default function SettingsPage() {
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Hours state
  const [hours, setHours] = useState<HoursData>(DEFAULT_HOURS)
  const [closedDays, setClosedDays] = useState<Record<string, boolean>>({ mon: true, tue: true, wed: true })
  const [hoursSaving, setHoursSaving] = useState(false)
  const [hoursFeedback, setHoursFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [hoursLoaded, setHoursLoaded] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setUserEmail(user.email)
    }
    fetchUser()
  }, [supabase.auth])

  useEffect(() => {
    async function fetchHours() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'hours')
          .limit(1)
          .single()
        if (data?.value) {
          const saved = data.value as HoursData
          setHours(saved)
          // Check for closed days (days missing from saved data)
          const closed: Record<string, boolean> = {}
          DAYS.forEach(d => { if (!saved[d]) closed[d] = true })
          setClosedDays(closed)
        }
      } catch {
        // Table doesn't exist yet — use defaults
      }
      setHoursLoaded(true)
    }
    fetchHours()
  }, [supabase])

  function updateHour(day: string, field: 'open' | 'close', value: string) {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  function toggleClosed(day: string) {
    setClosedDays(prev => ({ ...prev, [day]: !prev[day] }))
  }

  async function saveHours() {
    setHoursSaving(true)
    setHoursFeedback(null)

    // Build hours object, omitting closed days
    const hoursToSave: HoursData = {}
    DAYS.forEach(d => {
      if (!closedDays[d]) {
        hoursToSave[d] = hours[d] || DEFAULT_HOURS[d]
      }
    })

    const { error } = await supabase
      .from('site_settings')
      .upsert({ key: 'hours', value: hoursToSave, updated_at: new Date().toISOString() })

    if (error) {
      if (error.message?.includes('site_settings')) {
        setHoursFeedback({ type: 'error', message: 'Run the SQL migration to enable this feature (see below)' })
      } else {
        setHoursFeedback({ type: 'error', message: 'Failed to save: ' + error.message })
      }
    } else {
      setHoursFeedback({ type: 'success', message: 'Hours updated!' })
    }
    setHoursSaving(false)
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    if (!userEmail) {
      setFeedback({ type: 'error', message: 'Unable to verify user. Please refresh and try again.' })
      return
    }
    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match' })
      return
    }
    setSaving(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail,
      password: currentPassword,
    })
    if (signInError) {
      setFeedback({ type: 'error', message: 'Current password is incorrect' })
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setFeedback({ type: 'error', message: error.message })
    } else {
      setFeedback({ type: 'success', message: 'Password updated successfully' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(false)
  }

  return (
    <div>
      <h1 className={styles.heading}>Settings</h1>

      <div className={styles.form} style={{ marginBottom: 24 }}>
        <h2 className={styles.formTitle}>Business Hours</h2>

        {hoursFeedback && (
          <div className={`${styles.feedback} ${hoursFeedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
            {hoursFeedback.message}
          </div>
        )}

        {hoursLoaded && DAYS.map(day => (
          <div key={day} className={styles.hourRow}>
            <div className={styles.hourDay}>{DAY_LABELS[day]}</div>
            <div className={styles.hourControls}>
              {closedDays[day] ? (
                <span className={styles.closedLabel}>Closed</span>
              ) : (
                <>
                  <select
                    value={hours[day]?.open || '17:00'}
                    onChange={e => updateHour(day, 'open', e.target.value)}
                    className={styles.timeSelect}
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <span className={styles.hourDash}>–</span>
                  <select
                    value={hours[day]?.close || '22:00'}
                    onChange={e => updateHour(day, 'close', e.target.value)}
                    className={styles.timeSelect}
                  >
                    {TIME_OPTIONS.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </>
              )}
              <button
                type="button"
                onClick={() => toggleClosed(day)}
                className={`${styles.closedToggle} ${closedDays[day] ? styles.closedToggleActive : ''}`}
              >
                {closedDays[day] ? 'Open' : 'Close'}
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={saveHours}
          disabled={hoursSaving}
          className={styles.saveBtn}
          style={{ marginTop: 16 }}
        >
          {hoursSaving ? 'Saving...' : 'Save Hours'}
        </button>
      </div>

      <form onSubmit={handleChangePassword} className={styles.form}>
        <h2 className={styles.formTitle}>Change Password</h2>

        {feedback && (
          <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
            {feedback.message}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Current Password</label>
          <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className={styles.input} placeholder="Enter current password" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={styles.input} placeholder="Enter new password" required minLength={6} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={styles.input} placeholder="Confirm new password" required minLength={6} />
        </div>
        <button type="submit" disabled={saving} className={styles.saveBtn}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
