'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './Toast.module.css'

type ToastType = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  type: ToastType
  exiting: boolean
}

let nextId = 0

export function showToast(message: string, type: ToastType = 'info') {
  window.dispatchEvent(
    new CustomEvent('toast', { detail: { message, type } })
  )
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)))
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
  }, [])

  useEffect(() => {
    function handleToast(e: Event) {
      const { message, type } = (e as CustomEvent).detail
      const id = nextId++
      setToasts((prev) => [...prev, { id, message, type: type || 'info', exiting: false }])

      setTimeout(() => {
        removeToast(id)
      }, 3000)
    }

    window.addEventListener('toast', handleToast)
    return () => window.removeEventListener('toast', handleToast)
  }, [removeToast])

  if (toasts.length === 0) return null

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]} ${toast.exiting ? styles.exiting : ''}`}
        >
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.dismiss}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}
