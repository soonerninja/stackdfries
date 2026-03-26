'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import styles from './settings.module.css'

export default function SettingsPage() {
  const supabase = createClient()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)

    if (newPassword.length < 6) {
      setFeedback({ type: 'error', message: 'Password must be at least 6 characters' })
      return
    }

    if (newPassword !== confirmPassword) {
      setFeedback({ type: 'error', message: 'Passwords do not match' })
      return
    }

    setSaving(true)

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      setFeedback({ type: 'error', message: error.message })
    } else {
      setFeedback({ type: 'success', message: 'Password updated successfully' })
      setNewPassword('')
      setConfirmPassword('')
    }

    setSaving(false)
  }

  return (
    <div>
      <h1 className={styles.heading}>Settings</h1>

      <form onSubmit={handleChangePassword} className={styles.form}>
        <h2 className={styles.formTitle}>Change Password</h2>

        {feedback && (
          <div className={`${styles.feedback} ${feedback.type === 'success' ? styles.feedbackSuccess : styles.feedbackError}`}>
            {feedback.message}
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" disabled={saving} className={styles.saveBtn}>
          {saving ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  )
}
