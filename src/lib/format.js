const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function formatPrice(value) {
  return ars.format(Number(value) || 0).replace(/\u00a0/g, ' ')
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
