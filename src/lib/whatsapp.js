import { formatPrice } from './format'

export const BRAND = 'Shadday Indumentaria'
export const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || '5493624000000').replace(
  /\D/g,
  '',
)
function formatDisplay(digits) {
  if (digits.length === 13 && digits.startsWith('549')) {
    return `+54 9 ${digits.slice(3, 6)} ${digits.slice(6, 9)}-${digits.slice(9)}`
  }
  return `+${digits}`
}

export const WHATSAPP_DISPLAY = formatDisplay(WHATSAPP_NUMBER)
export const STORE_ADDRESS = 'Arturo Frondizi 174, H3500 Resistencia, Chaco, Argentina'
export const STORE_ADDRESS_SHORT = 'Arturo Frondizi 174, Resistencia'
export const STORE_HOURS = 'Lunes a sábado · 9:00 a 12:30 y 17:00 a 21:00 hs'
export const STORE_HOURS_MORNING = '9:00 a 12:30 hs'
export const STORE_HOURS_AFTERNOON = '17:00 a 21:00 hs'
export const INSTAGRAM_HANDLE = '@shaddayindumentaria'
export const INSTAGRAM_URL = 'https://www.instagram.com/shaddayindumentaria'
export const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Arturo+Frondizi+174,+Resistencia,+Chaco,+Argentina'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Arturo+Frondizi+174,+H3500+Resistencia,+Chaco,+Argentina&z=16&output=embed'

export function whatsappLink(message = '') {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildOrderMessage({ items, total, name, delivery, payment, address }) {
  const lines = [
    '*NUEVO PEDIDO · SHADDAY INDUMENTARIA*',
    '',
    `*Cliente:* ${name}`,
    `*Modalidad:* ${
      delivery === 'envio'
        ? 'Envío a domicilio (Resistencia)'
        : 'Retiro en el local — Arturo Frondizi 174'
    }`,
    `*Pago:* ${payment}`,
  ]

  if (delivery === 'envio' && address) lines.push(`*Dirección:* ${address}`)

  lines.push('', '*Detalle:*')
  items.forEach((item) => {
    lines.push(
      `• ${item.qty} x ${item.name} — Talle ${item.size} — ${formatPrice(
        item.price * item.qty,
      )}`,
    )
  })

  lines.push('', `*Total:* ${formatPrice(total)}`)
  if (delivery === 'envio') {
    lines.push('_El costo de envío se coordina según la zona._')
  }
  lines.push('', '¡Hola! Quiero confirmar este pedido 🙌')

  return lines.join('\n')
}
