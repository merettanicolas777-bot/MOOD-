import { useEffect, useState } from 'react'

// Guardamos el evento a nivel de módulo para no perderlo si el navegador
// dispara `beforeinstallprompt` antes de que monte el panel.
let deferredPrompt = null
const listeners = new Set()

function emit(event) {
  listeners.forEach((listener) => listener(event))
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event
    emit(event)
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    emit(null)
  })
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export function useInstallPrompt() {
  const [prompt, setPrompt] = useState(deferredPrompt)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const listener = (event) => {
      setPrompt(event)
      if (!event) setInstalled(true)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const promptInstall = async () => {
    if (!prompt) return 'unavailable'
    prompt.prompt()
    const { outcome } = await prompt.userChoice
    deferredPrompt = null
    setPrompt(null)
    return outcome === 'accepted' ? 'accepted' : 'dismissed'
  }

  return { canInstall: Boolean(prompt), installed, promptInstall }
}
