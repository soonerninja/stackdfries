'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import styles from './catering.module.css'

export const dynamic = 'force-dynamic'

interface CateringInquiry {
  id: string
  name: string
  email: string
  phone: string | null
  event_date: string
  headcount: number
  event_type: string
  message: string | null
  status: string
  created_at: string
}

const STATUS_OPTIONS = ['new', 'contacted', 'confirmed', 'declined']

function badgeClass(status: string): string {
  switch (status) {
    case 'contacted': return styles.badgeContacted
    case 'confirmed': return styles.badgeConfirmed
    case 'declined': return styles.badgeDeclined
    default: return styles.badgeNew
  }
}

export default function CateringPage() {
  const supabase = createClient()
  const [inquiries, setInquiries] = useState<CateringInquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  async function fetchInquiries() {
    const { data, error: fetchError } = await supabase
      .from('catering_inquiries')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Failed to load catering inquiries')
    } else {
      setInquiries(data || [])
    }
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const { error: updateError } = await supabase
      .from('catering_inquiries')
      .update({ status: newStatus })
      .eq('id', id)

    if (!updateError) {
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      )
    }
  }

  function formatDate(dateStr: string) {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  function formatDateTime(dateStr: string) {
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

  function exportCSV() {
    if (inquiries.length === 0) return

    const header = 'name,email,phone,event_date,headcount,event_type,status,message,created_at'
    const rows = inquiries.map(
      (i) =>
        `"${i.name.replace(/"/g, '""')}","${i.email}","${i.phone || ''}","${i.event_date}",${i.headcount},"${i.event_type}","${i.status}","${(i.message || '').replace(/"/g, '""')}","${i.created_at}"`
    )
    const csv = [header, ...rows].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `catering-inquiries-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className={styles.loading}>Loading catering inquiries...</div>
  }

  return (
    <div>
      <div className={styles.topRow}>
        <div>
          <h1 className={styles.heading}>Catering Inquiries</h1>
          <div className={styles.count}>{inquiries.length} total inquiries</div>
        </div>
        <button
          onClick={exportCSV}
          className={styles.exportBtn}
          disabled={inquiries.length === 0}
        >
          Export CSV
        </button>
      </div>

      {error && (
        <div className={`${styles.feedback} ${styles.feedbackError}`}>
          {error}
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className={styles.empty}>No catering inquiries yet.</div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Event Date</th>
                <th>Headcount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq) => (
                <>
                  <tr
                    key={inq.id}
                    onClick={() => setExpandedId(expandedId === inq.id ? null : inq.id)}
                  >
                    <td>{inq.name}</td>
                    <td>{inq.email}</td>
                    <td>{formatDate(inq.event_date)}</td>
                    <td>{inq.headcount}</td>
                    <td>{inq.event_type}</td>
                    <td>
                      <span className={`${styles.badge} ${badgeClass(inq.status)}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td>{formatDateTime(inq.created_at)}</td>
                  </tr>
                  {expandedId === inq.id && (
                    <tr key={`${inq.id}-details`} className={styles.expandedRow}>
                      <td colSpan={7}>
                        <div className={styles.details}>
                          <div className={styles.detailGrid}>
                            <div>
                              <div className={styles.detailLabel}>Name</div>
                              <div className={styles.detailValue}>{inq.name}</div>
                            </div>
                            <div>
                              <div className={styles.detailLabel}>Email</div>
                              <div className={styles.detailValue}>{inq.email}</div>
                            </div>
                            <div>
                              <div className={styles.detailLabel}>Phone</div>
                              <div className={styles.detailValue}>{inq.phone || 'Not provided'}</div>
                            </div>
                            <div>
                              <div className={styles.detailLabel}>Event Date</div>
                              <div className={styles.detailValue}>{formatDate(inq.event_date)}</div>
                            </div>
                            <div>
                              <div className={styles.detailLabel}>Headcount</div>
                              <div className={styles.detailValue}>{inq.headcount}</div>
                            </div>
                            <div>
                              <div className={styles.detailLabel}>Event Type</div>
                              <div className={styles.detailValue}>{inq.event_type}</div>
                            </div>
                          </div>
                          {inq.message && (
                            <div>
                              <div className={styles.detailMessageLabel}>Message</div>
                              <div className={styles.detailMessage}>{inq.message}</div>
                            </div>
                          )}
                          <div className={styles.statusActions}>
                            {STATUS_OPTIONS.map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  updateStatus(inq.id, s)
                                }}
                                className={`${styles.statusBtn} ${inq.status === s ? styles.statusBtnActive : ''}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
