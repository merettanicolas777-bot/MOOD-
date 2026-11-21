import { formatPrice } from './format'

export const WHATSAPP_NUMBER = '5493624819223'
export const WHATSAPP_DISPLAY = '+54 9 362 481-9223'
export const STORE_ADDRESS = 'Sta. Fe 1141, H3500 Resistencia, Chaco, Argentina'
export const STORE_HOURS = 'Lunes a domingo · 11:00 a 20:00 hs'
export const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Sta.+Fe+1141,+Resistencia,+Chaco,+Argentina'
export const MAPS_EMBED =
  'https://www.google.com/maps?q=Sta.+Fe+1141,+H3500+Resistencia,+Chaco,+Argentina&z=16&output=embed'

export function whatsappLink(message = '') {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export function buildOrderMessage({ items, total, name, delivery, payment, address }) {
  const lines = [
    '*NUEVO PEDIDO · MOOD INDUMENTARIA*',
    '',
    `*Cliente:* ${name}`,
    `*Modalidad:* ${
      delivery === 'envio' ? 'Envío a domicilio (Resistencia)' : 'Retiro en el local — Sta. Fe 1141'
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
