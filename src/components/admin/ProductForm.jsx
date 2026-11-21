import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Link2, Loader2, Upload, X } from 'lucide-react'
import { ALL_SIZES } from '../../data/seed'
import { uploadImage } from '../../lib/api'
import { cn } from '../../lib/format'

const STATUSES = [
  { id: 'disponible', label: 'Disponible', hint: 'Visible y con stock' },
  { id: 'agotado', label: 'Agotado', hint: 'Se muestra sin stock' },
  { id: 'destacado', label: 'Destacado', hint: 'Con badge en la tienda' },
]

const LABEL = 'text-[10px] font-semibold uppercase tracking-[0.18em] text-muted'
const ERROR = 'mt-1.5 text-[11px] font-medium text-ink'

export default function ProductForm({ product, categories, onClose, onSubmit, notify }) {
  const [form, setForm] = useState(() => ({
    name: product?.name || '',
    price: product?.price ? String(product.price) : '',
    category: product?.category || categories[0] || '',
    description: product?.description || '',
    fabric: product?.fabric || '',
    fit: product?.fit || '',
    sizes: product?.sizes || ['S', 'M', 'L'],
    images: product?.images || [],
    inStock: product ? product.inStock : true,
    featured: product ? product.featured : false,
    isNew: product ? product.isNew : true,
  }))
  const [status, setStatus] = useState(() =>
    product && !product.inStock ? 'agotado' : product?.featured ? 'destacado' : 'disponible',
  )
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const fileRef = useRef(null)

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, saving])

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }))

  const toggleSize = (size) => {
    update({
      sizes: form.sizes.includes(size)
        ? form.sizes.filter((item) => item !== size)
        : [...form.sizes, size],
    })
    setErrors((prev) => ({ ...prev, sizes: undefined }))
  }

  const handleStatus = (value) => {
    setStatus(value)
    update({ inStock: value !== 'agotado', featured: value === 'destacado' })
  }

  const addFiles = async (files) => {
    const list = Array.from(files || []).filter((file) => file.type.startsWith('image/'))
    const room = 3 - form.images.length
    if (!list.length || room <= 0) return

    setUploading(true)
    try {
      const urls = []
      for (const file of list.slice(0, room)) {
        urls.push(await uploadImage(file))
      }
      setForm((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 3) }))
      setErrors((prev) => ({ ...prev, images: undefined }))
    } catch (err) {
      notify(err.message || 'No pudimos subir la imagen', 'error')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const addUrl = () => {
    const clean = urlInput.trim()
    if (!clean) return
    if (!/^(https?:\/\/|data:image\/)/.test(clean)) {
      notify('Pegá una URL de imagen válida', 'error')
      return
    }
    update({ images: [...form.images, clean].slice(0, 3) })
    setUrlInput('')
    setErrors((prev) => ({ ...prev, images: undefined }))
  }

  const removeImage = (index) => {
    update({ images: form.images.filter((_, position) => position !== index) })
  }

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Ponele un nombre a la prenda'
    if (!form.price || Number(form.price) <= 0) next.price = 'Ingresá un precio válido'
    if (!form.category) next.category = 'Elegí una categoría'
    if (!form.sizes.length) next.sizes = 'Seleccioná al menos un talle'
    if (!form.images.length) next.images = 'Agregá al menos una foto'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      await onSubmit({
        ...(product || {}),
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category,
        description: form.description.trim(),
        fabric: form.fabric.trim(),
        fit: form.fit.trim(),
        sizes: form.sizes,
        images: form.images,
        inStock: form.inStock,
        featured: form.featured,
        isNew: form.isNew,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/40 backdrop-blur-sm sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="anim-rise relative mx-auto w-full max-w-3xl bg-white text-ink sm:my-2 sm:rounded-2xl sm:border sm:border-line sm:shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-white/95 px-5 py-4 backdrop-blur sm:rounded-t-2xl">
          <div>
            <p className="text-[9px] uppercase tracking-[0.26em] text-muted">Catálogo</p>
            <h2 className="mt-1 font-serif text-xl">
              {product ? 'Editar prenda' : 'Nueva prenda'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={17} />
          </button>
        </div>

        <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
          <div className="sm:col-span-2">
            <label className={LABEL}>Nombre de la prenda</label>
            <input
              value={form.name}
              onChange={(event) => update({ name: event.target.value })}
              placeholder="Ej: Vestido Knit Arena"
              className="field mt-2"
            />
            {errors.name && <p className={ERROR}>{errors.name}</p>}
          </div>

          <div>
            <label className={LABEL}>Precio (ARS)</label>
            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">$</span>
              <input
                value={form.price}
                onChange={(event) => update({ price: event.target.value.replace(/[^\d]/g, '') })}
                placeholder="24900"
                inputMode="numeric"
                className="field pl-7"
              />
            </div>
            {errors.price && <p className={ERROR}>{errors.price}</p>}
          </div>

          <div>
            <label className={LABEL}>Categoría</label>
            <select
              value={form.category}
              onChange={(event) => update({ category: event.target.value })}
              className="field mt-2 appearance-none"
            >
              {categories.length === 0 && <option value="">Sin categorías</option>}
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && <p className={ERROR}>{errors.category}</p>}
          </div>

          <div className="sm:col-span-2">
            <label className={LABEL}>Descripción breve</label>
            <textarea
              value={form.description}
              onChange={(event) => update({ description: event.target.value })}
              rows={3}
              placeholder="Contale al cliente cómo es la prenda, el calce y para qué la puede usar."
              className="field mt-2 resize-none"
            />
          </div>

          <div>
            <label className={LABEL}>Tela</label>
            <input
              value={form.fabric}
              onChange={(event) => update({ fabric: event.target.value })}
              placeholder="Algodón peinado · 240 g/m²"
              className="field mt-2"
            />
          </div>

          <div>
            <label className={LABEL}>Calce</label>
            <input
              value={form.fit}
              onChange={(event) => update({ fit: event.target.value })}
              placeholder="Calce al cuerpo · Midi"
              className="field mt-2"
            />
          </div>

          <div className="sm:col-span-2">
            <p className={LABEL}>Talles disponibles</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ALL_SIZES.map((size) => {
                const active = form.sizes.includes(size)
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      'min-w-12 rounded-full border px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition',
                      active
                        ? 'border-ink bg-ink text-cream'
                        : 'border-line text-muted hover:border-ink/40 hover:text-ink',
                    )}
                    aria-pressed={active}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
            {errors.sizes && <p className={ERROR}>{errors.sizes}</p>}
          </div>

          <div className="sm:col-span-2">
            <p className={LABEL}>Estado</p>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {STATUSES.map((option) => {
                const active = status === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleStatus(option.id)}
                    className={cn(
                      'rounded-xl border px-3 py-3 text-left transition',
                      active
                        ? 'border-ink bg-brand/25'
                        : 'border-line hover:border-ink/40 hover:bg-cream',
                    )}
                    aria-pressed={active}
                  >
                    <span className="flex items-center gap-2 text-[11px] font-semibold">
                      <span
                        className={cn(
                          'grid size-3 place-items-center rounded-full border',
                          active ? 'border-ink' : 'border-muted/50',
                        )}
                      >
                        {active && <span className="size-1.5 rounded-full bg-ink" />}
                      </span>
                      {option.label}
                    </span>
                    <span className="mt-1 block pl-5 text-[10px] text-muted">{option.hint}</span>
                  </button>
                )
              })}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-xl border border-line px-3 py-3">
              <span>
                <span className="block text-[11px] font-semibold">Nuevo ingreso</span>
                <span className="mt-0.5 block text-[10px] text-muted">
                  Muestra el badge “Nuevo” en la tienda
                </span>
              </span>
              <span
                role="switch"
                aria-checked={form.isNew}
                className={cn(
                  'relative h-6 w-11 rounded-full border transition',
                  form.isNew ? 'border-ink bg-brand' : 'border-line bg-mist',
                )}
                onClick={(event) => {
                  event.preventDefault()
                  update({ isNew: !form.isNew })
                }}
              >
                <span
                  className={cn(
                    'absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-all',
                    form.isNew ? 'left-6 bg-ink' : 'left-1 bg-muted/60',
                  )}
                />
              </span>
            </label>
          </div>

          <div className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className={LABEL}>
                Fotos <span className="text-muted/60">(hasta 3)</span>
              </p>
              {uploading && (
                <span className="inline-flex items-center gap-1.5 text-[10px] text-muted">
                  <Loader2 size={12} className="animate-spin" /> Subiendo…
                </span>
              )}
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              {form.images.map((image, index) => (
                <div
                  key={image.slice(0, 40) + index}
                  className="relative aspect-[3/4] overflow-hidden rounded-xl border border-line bg-mist"
                >
                  <img src={image} alt={`Foto ${index + 1}`} className="h-full w-full object-cover" />
                  {index === 0 && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-brand px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-ink">
                      Principal
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-ink/70 text-white backdrop-blur transition hover:bg-ink"
                    aria-label="Quitar foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}

              {form.images.length < 3 && (
                <div
                  onDragOver={(event) => {
                    event.preventDefault()
                    setDragging(true)
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(event) => {
                    event.preventDefault()
                    setDragging(false)
                    addFiles(event.dataTransfer.files)
                  }}
                  className={cn(
                    'aspect-[3/4] rounded-xl border border-dashed transition',
                    dragging ? 'border-ink bg-brand/20' : 'border-ink/20 bg-cream',
                  )}
                >
                  <label className="flex h-full cursor-pointer flex-col items-center justify-center gap-2 px-2 text-center text-muted transition hover:text-ink">
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => addFiles(event.target.files)}
                      disabled={uploading}
                    />
                    <Upload size={18} strokeWidth={1.7} />
                    <span className="text-[9px] font-semibold uppercase leading-tight tracking-wider">
                      Subir foto
                    </span>
                    <span className="text-[9px] leading-tight text-muted/70">Galería o PC</span>
                  </label>
                </div>
              )}
            </div>

            <div className="mt-2 flex gap-2">
              <div className="relative flex-1">
                <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={urlInput}
                  onChange={(event) => setUrlInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      addUrl()
                    }
                  }}
                  placeholder="…o pegá la URL de una foto"
                  className="field pl-8"
                />
              </div>
              <button
                type="button"
                onClick={addUrl}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-3 text-[10px] font-semibold uppercase tracking-wider text-muted transition hover:border-ink hover:text-ink"
              >
                <ImagePlus size={14} /> Agregar
              </button>
            </div>
            {errors.images && <p className={ERROR}>{errors.images}</p>}
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-2 border-t border-line bg-white/95 px-5 py-4 backdrop-blur sm:rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:text-ink"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-ink/85 disabled:opacity-50"
          >
            {saving && <Loader2 size={13} className="animate-spin" />}
            {product ? 'Guardar cambios' : 'Publicar prenda'}
          </button>
        </div>
      </form>
    </div>
  )
}
