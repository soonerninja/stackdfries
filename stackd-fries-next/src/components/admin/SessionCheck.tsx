'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import styles from './SessionCheck.module.css'

const CHECK_INTERVAL = 5 * 60 * 1000 // 5 minutes

export default function SessionCheck() {
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setExpired(true)
      }
    }

    const interval = setInterval(checkSession, CHECK_INTERVAL)

    return () => clearInterval(interval)
  }, [])

  if (!expired) return null

  return (
    <div className={styles.banner}>
      Session expired. Please{' '}
      <a href="/admin/login" className={styles.link}>
        log in again
      </a>
      .
    </div>
  )
}
