'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import type { EmailSignup } from '@/types/database'
import styles from './emails.module.css'

export default function EmailsPage() {
  const supabase = createClient()
  const [emails, setEmails] = useState<EmailSignup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEmails()
  }, [])

  async function fetchEmails() {
    const { data, error: fetchError } = await supabase
      .from('email_signups')
      .select('*')
      .order('signed_up_at', { ascending: false })

    if (fetchError) {
      setError('Failed to load email signups')
    } else {
      setEmails(data || [])
    }
    setLoading(false)
  }

  function exportCSV() {
    if (emails.length === 0) return

    const header = 'email,signed_up_at'
    const rows = emails.map(
      (e) => `"${e.email.replace(/"/g, '""')}","${e.signed_up_at}"`
    )
    const csv = [header, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `email-signups-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading email signups...</div>
  }

  return (
    <div>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.heading}>Email Signups</h1>
          <div className={styles.count}>{emails.length} total signups</div>
        </div>
        <button
          onClick={exportCSV}
          className={styles.exportBtn}
          disabled={emails.length === 0}
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className={`${styles.feedback} ${styles.feedbackError}`}>
          {error}
        </div>
      )}

      {emails.length === 0 ? (
        <div className={styles.empty}>No email signups yet.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email</th>
                <th>Signed Up</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((signup) => (
                <tr key={signup.id}>
                  <td>{signup.email}</td>
                  <td>{formatDate(signup.signed_up_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
