// Redimensiona y comprime una imagen en el navegador antes de guardarla
// como data URL (modo local) o subirla a Storage.
export function fileToDataUrl(file, maxSize = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo no es una imagen'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('No pudimos leer la imagen'))
    reader.onload = () => {
      const src = String(reader.result)
      if (file.type === 'image/svg+xml') {
        resolve(src)
        return
      }

      const img = new Image()
      img.onerror = () => reject(new Error('No pudimos procesar la imagen'))
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height))
        const width = Math.round(img.width * scale)
        const height = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = src
    }
    reader.readAsDataURL(file)
  })
}
