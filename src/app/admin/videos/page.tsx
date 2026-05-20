'use client'

import { useEffect, useRef, useState } from 'react'
import { getVideosAdmin, createVideo, updateVideo, deleteVideo } from '@/lib/adminApi'

interface VideoEvento {
  id: number
  titulo: string
  descripcion: string
  video_url: string
  embed_url: string
  thumbnail_url: string
  categoria: string
  fecha: string | null
  destacado: boolean
  orden: number
  activo: boolean
}

interface FormState {
  titulo: string
  descripcion: string
  video_url: string
  categoria: string
  fecha: string
  destacado: boolean
  orden: number
  activo: boolean
  thumbnailFile: File | null
  thumbnailPreview: string
}

const CATEGORIAS = [
  { value: 'boda',        label: 'Boda' },
  { value: 'cumpleanos',  label: 'Cumpleaños' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'clase',       label: 'Clase de Pastelería' },
  { value: 'otro',        label: 'Otro' },
]

const EMPTY_FORM: FormState = {
  titulo: '', descripcion: '', video_url: '', categoria: 'otro',
  fecha: '', destacado: false, orden: 0, activo: true,
  thumbnailFile: null, thumbnailPreview: '',
}

function getYoutubeThumbnail(url: string): string {
  if (!url) return ''
  const ytWatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/)
  const ytShort = url.match(/youtu\.be\/([\w-]+)/)
  const id = ytWatch?.[1] || ytShort?.[1]
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}

function getEmbedPreview(url: string): string {
  if (!url) return ''
  const ytWatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/)
  const ytShort = url.match(/youtu\.be\/([\w-]+)/)
  const vimeo  = url.match(/vimeo\.com\/(\d+)/)
  if (ytWatch?.[1]) return `https://www.youtube.com/embed/${ytWatch[1]}?rel=0&modestbranding=1`
  if (ytShort?.[1]) return `https://www.youtube.com/embed/${ytShort[1]}?rel=0&modestbranding=1`
  if (vimeo?.[1])   return `https://player.vimeo.com/video/${vimeo[1]}`
  return ''
}

/* ─── Estilos reutilizables ─────────────────────────────────── */
const s = {
  page:       { padding: '40px', maxWidth: 1200 } as React.CSSProperties,
  header:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 } as React.CSSProperties,
  title:      { fontSize: 26, fontWeight: 700, color: '#FAF7F2' } as React.CSSProperties,
  sub:        { color: '#8A7878', fontSize: 14, marginTop: 4 } as React.CSSProperties,
  addBtn:     { padding: '10px 22px', background: '#CC1F1F', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 } as React.CSSProperties,
  card:       { background: '#1A1515', borderRadius: 12, overflow: 'hidden', border: '1px solid #2A2020', display: 'flex', flexDirection: 'column' } as React.CSSProperties,
  cardThumb:  { width: '100%', aspectRatio: '16/9', objectFit: 'cover' as const, background: '#0E0C0C', display: 'block', position: 'relative' as const },
  cardBody:   { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 } as React.CSSProperties,
  cardTop:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 } as React.CSSProperties,
  cardCat:    { fontSize: 10, color: '#CC1F1F', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 },
  cardBadge:  (on: boolean) => ({ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: on ? 'rgba(204,31,31,0.15)' : 'rgba(255,255,255,0.05)', color: on ? '#CC1F1F' : '#5A5050', border: `1px solid ${on ? '#3A1010' : '#2A2020'}` }) as React.CSSProperties,
  cardTitle:  { fontSize: 15, fontWeight: 600, color: '#FAF7F2', lineHeight: 1.3 } as React.CSSProperties,
  cardDesc:   { fontSize: 12, color: '#8A7878', lineHeight: 1.5, marginTop: 2 } as React.CSSProperties,
  cardUrl:    { fontSize: 11, color: '#5A5050', marginTop: 4, whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' },
  cardActions:{ display: 'flex', gap: 8, marginTop: 14 } as React.CSSProperties,
  editBtn:    { flex: 1, padding: '8px', background: '#2A2020', color: '#FAF7F2', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
  delBtn:     { padding: '8px 12px', background: 'transparent', color: '#CC1F1F', border: '1px solid #3A1010', borderRadius: 6, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
  overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 } as React.CSSProperties,
  modalBox:   { background: '#1A1515', borderRadius: 16, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', padding: 32, border: '1px solid #2A2020' } as React.CSSProperties,
  modalTitle: { fontSize: 20, fontWeight: 700, color: '#FAF7F2', marginBottom: 24 } as React.CSSProperties,
  label:      { display: 'block', fontSize: 11, fontWeight: 700, color: '#8A7878', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8 },
  input:      { width: '100%', padding: '11px 14px', borderRadius: 8, background: '#0E0C0C', border: '1px solid #2A2020', color: '#FAF7F2', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  select:     { width: '100%', padding: '11px 14px', borderRadius: 8, background: '#0E0C0C', border: '1px solid #2A2020', color: '#FAF7F2', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  textarea:   { width: '100%', padding: '11px 14px', borderRadius: 8, background: '#0E0C0C', border: '1px solid #2A2020', color: '#FAF7F2', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, resize: 'vertical' as const, minHeight: 72 },
  field:      { marginBottom: 20 } as React.CSSProperties,
  row2:       { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 } as React.CSSProperties,
  hint:       { fontSize: 11, color: '#5A5050', marginTop: 6 } as React.CSSProperties,
  saveBtn:    (saving: boolean) => ({ width: '100%', padding: '13px', borderRadius: 8, background: saving ? '#8A2020' : '#CC1F1F', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', marginTop: 8 }) as React.CSSProperties,
  cancelBtn:  { width: '100%', padding: '11px', borderRadius: 8, background: 'transparent', color: '#8A7878', fontSize: 14, border: '1px solid #2A2020', cursor: 'pointer', marginTop: 8 } as React.CSSProperties,
  checkRow:   { display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties,
  checkLabel: { fontSize: 14, color: '#C8BFBF', cursor: 'pointer' } as React.CSSProperties,
  dropzone:   (over: boolean) => ({ border: `2px dashed ${over ? '#CC1F1F' : '#2A2020'}`, borderRadius: 10, padding: 16, textAlign: 'center' as const, cursor: 'pointer', background: over ? '#1A0808' : '#0E0C0C', transition: 'all 0.15s' }),
  errBox:     { background: '#3A1010', border: '1px solid #CC1F1F', borderRadius: 8, padding: '10px 14px', color: '#FF7070', fontSize: 13, marginBottom: 16 } as React.CSSProperties,
}

export default function VideosPage() {
  const [videos,        setVideos]        = useState<VideoEvento[]>([])
  const [loading,       setLoading]       = useState(true)
  const [modal,         setModal]         = useState<'add' | 'edit' | null>(null)
  const [editId,        setEditId]        = useState<number | null>(null)
  const [form,          setForm]          = useState<FormState>(EMPTY_FORM)
  const [saving,        setSaving]        = useState(false)
  const [error,         setError]         = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [dragging,      setDragging]      = useState(false)
  const [urlPreview,    setUrlPreview]    = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await getVideosAdmin()
      setVideos(res.data.results ?? res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setError('')
    setUrlPreview('')
    setModal('add')
  }

  function openEdit(v: VideoEvento) {
    setForm({
      titulo: v.titulo, descripcion: v.descripcion, video_url: v.video_url,
      categoria: v.categoria, fecha: v.fecha ?? '', destacado: v.destacado,
      orden: v.orden, activo: v.activo, thumbnailFile: null,
      thumbnailPreview: v.thumbnail_url || getYoutubeThumbnail(v.video_url),
    })
    setEditId(v.id)
    setError('')
    setUrlPreview(getEmbedPreview(v.video_url))
    setModal('edit')
  }

  function closeModal() { setModal(null); setEditId(null); setUrlPreview('') }

  function handleUrlChange(url: string) {
    setForm(f => ({ ...f, video_url: url }))
    const thumb = getYoutubeThumbnail(url)
    const embed = getEmbedPreview(url)
    setUrlPreview(embed)
    if (thumb && !form.thumbnailFile) {
      setForm(f => ({ ...f, video_url: url, thumbnailPreview: thumb }))
    }
  }

  function handleFile(file: File | null) {
    if (!file) return
    setForm(f => ({ ...f, thumbnailFile: file, thumbnailPreview: URL.createObjectURL(file) }))
  }

  function onFileDrop(e: React.DragEvent) {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.video_url) { setError('La URL del video es obligatoria'); return }
    setError(''); setSaving(true)
    try {
      const fd = new FormData()
      fd.append('titulo',      form.titulo)
      fd.append('descripcion', form.descripcion)
      fd.append('video_url',   form.video_url)
      fd.append('categoria',   form.categoria)
      fd.append('orden',       String(form.orden))
      fd.append('destacado',   String(form.destacado))
      fd.append('activo',      String(form.activo))
      if (form.fecha)          fd.append('fecha', form.fecha)
      if (form.thumbnailFile)  fd.append('thumbnail', form.thumbnailFile)

      if (modal === 'add')      await createVideo(fd)
      else if (editId !== null) await updateVideo(editId, fd)

      closeModal()
      await load()
    } catch {
      setError('Ocurrió un error al guardar. Revisá la URL e intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    await deleteVideo(id)
    setDeleteConfirm(null)
    await load()
  }

  const catLabel = (key: string) => CATEGORIAS.find(c => c.value === key)?.label ?? key

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Videos de Eventos</h1>
          <p style={s.sub}>{videos.length} video{videos.length !== 1 ? 's' : ''} cargado{videos.length !== 1 ? 's' : ''} — se muestran en la sección &quot;Tu evento, algo único&quot;</p>
        </div>
        <button style={s.addBtn} onClick={openAdd}>+ Agregar Video</button>
      </div>

      {/* Info tip */}
      <div style={{ background: 'rgba(204,31,31,0.07)', border: '1px solid rgba(204,31,31,0.18)', borderRadius: 10, padding: '12px 18px', marginBottom: 28, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontSize: 16, marginTop: 1 }}>🎬</span>
        <p style={{ fontSize: 13, color: '#C8BFBF', lineHeight: 1.6, margin: 0 }}>
          Pegá URLs de <strong style={{ color: '#FAF7F2' }}>YouTube</strong> o <strong style={{ color: '#FAF7F2' }}>Vimeo</strong>. La miniatura se genera automáticamente desde YouTube. Podés subir una imagen personalizada para reemplazarla. Solo los videos con <strong style={{ color: '#FAF7F2' }}>Activo</strong> aparecen en el sitio.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {[1,2,3].map(i => <div key={i} style={{ height: 260, background: '#1A1515', borderRadius: 12, opacity: 0.5 }} />)}
        </div>
      ) : videos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A7878' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🎬</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#FAF7F2', marginBottom: 8 }}>Todavía no hay videos</div>
          <div style={{ fontSize: 14, marginBottom: 24 }}>Agregá un video de YouTube o Vimeo para empezar</div>
          <button style={s.addBtn} onClick={openAdd}>Agregar el primero</button>
        </div>
      ) : (
        <div style={s.grid}>
          {videos.map(v => {
            const thumb = v.thumbnail_url || getYoutubeThumbnail(v.video_url)
            return (
              <div key={v.id} style={s.card}>
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '16/9', background: '#0E0C0C', overflow: 'hidden' }}>
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={v.titulo} style={{ ...s.cardThumb, position: 'absolute', inset: 0 }} />
                  ) : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 40, opacity: 0.3 }}>🎬</span>
                    </div>
                  )}
                  {/* Play overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(204,31,31,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M4 3L13 8L4 13V3Z"/></svg>
                    </div>
                  </div>
                  {/* Activo badge */}
                  <div style={{ position: 'absolute', top: 10, right: 10, ...s.cardBadge(v.activo) }}>
                    {v.activo ? 'Activo' : 'Oculto'}
                  </div>
                  {/* Destacado badge */}
                  {v.destacado && (
                    <div style={{ position: 'absolute', top: 10, left: 10, fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(204,31,31,0.85)', color: '#fff' }}>
                      ★ Destacado
                    </div>
                  )}
                </div>

                <div style={s.cardBody}>
                  <div style={s.cardTop}>
                    <span style={s.cardCat}>{catLabel(v.categoria)}</span>
                    {v.fecha && <span style={{ fontSize: 11, color: '#5A5050' }}>{v.fecha}</span>}
                  </div>
                  <div style={s.cardTitle}>{v.titulo}</div>
                  {v.descripcion && <div style={s.cardDesc}>{v.descripcion.slice(0, 80)}{v.descripcion.length > 80 ? '…' : ''}</div>}
                  <div style={s.cardUrl}>{v.video_url}</div>
                  <div style={s.cardActions}>
                    <button style={s.editBtn} onClick={() => openEdit(v)}>✏️ Editar</button>
                    {deleteConfirm === v.id ? (
                      <>
                        <button onClick={() => handleDelete(v.id)} style={{ ...s.delBtn, background: '#CC1F1F', color: '#fff', border: 'none' }}>Confirmar</button>
                        <button onClick={() => setDeleteConfirm(null)} style={s.delBtn}>No</button>
                      </>
                    ) : (
                      <button style={s.delBtn} onClick={() => setDeleteConfirm(v.id)}>🗑</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── MODAL ─────────────────────────────────────────────── */}
      {modal && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={s.modalBox}>
            <h2 style={s.modalTitle}>{modal === 'add' ? '+ Agregar Video' : '✏️ Editar Video'}</h2>

            <form onSubmit={handleSave}>

              {/* URL del video — campo principal */}
              <div style={s.field}>
                <label style={s.label}>URL del Video *</label>
                <input
                  style={{ ...s.input, borderColor: form.video_url && !getEmbedPreview(form.video_url) ? '#CC1F1F' : '#2A2020' }}
                  value={form.video_url}
                  onChange={e => handleUrlChange(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
                  required
                  type="url"
                />
                <p style={s.hint}>Compatible con YouTube (youtube.com/watch?v= o youtu.be/) y Vimeo</p>
                {form.video_url && !getEmbedPreview(form.video_url) && (
                  <p style={{ ...s.hint, color: '#CC1F1F', marginTop: 4 }}>⚠ URL no reconocida como YouTube o Vimeo</p>
                )}
              </div>

              {/* Preview del embed */}
              {urlPreview && (
                <div style={{ marginBottom: 20, borderRadius: 10, overflow: 'hidden', border: '1px solid #2A2020', aspectRatio: '16/9' }}>
                  <iframe
                    src={urlPreview}
                    title="preview"
                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Título */}
              <div style={s.field}>
                <label style={s.label}>Título *</label>
                <input
                  style={s.input}
                  value={form.titulo}
                  onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
                  placeholder="Ej: Boda García – Salón Imperial"
                  required
                />
              </div>

              {/* Descripción */}
              <div style={s.field}>
                <label style={s.label}>Descripción <span style={{ color: '#5A5050', fontWeight: 400 }}>(opcional)</span></label>
                <textarea
                  style={s.textarea}
                  value={form.descripcion}
                  onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                  placeholder="Una breve descripción del evento..."
                  rows={3}
                />
              </div>

              {/* Categoría + Fecha */}
              <div style={s.row2}>
                <div>
                  <label style={s.label}>Categoría</label>
                  <select
                    style={s.select}
                    value={form.categoria}
                    onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  >
                    {CATEGORIAS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Fecha <span style={{ color: '#5A5050', fontWeight: 400 }}>(opcional)</span></label>
                  <input
                    style={s.input}
                    type="date"
                    value={form.fecha}
                    onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))}
                  />
                </div>
              </div>

              {/* Orden */}
              <div style={s.field}>
                <label style={s.label}>Orden <span style={{ color: '#5A5050', fontWeight: 400 }}>(menor = antes)</span></label>
                <input
                  style={s.input}
                  type="number"
                  min={0}
                  value={form.orden}
                  onChange={e => setForm(f => ({ ...f, orden: Number(e.target.value) }))}
                />
              </div>

              {/* Thumbnail personalizado */}
              <div style={s.field}>
                <label style={s.label}>
                  Miniatura personalizada <span style={{ color: '#5A5050', fontWeight: 400 }}>(opcional)</span>
                </label>
                {form.thumbnailPreview && (
                  <div style={{ marginBottom: 10, borderRadius: 8, overflow: 'hidden', border: '1px solid #2A2020', aspectRatio: '16/9', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.thumbnailPreview} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    {!form.thumbnailFile && form.thumbnailPreview.includes('youtube') && (
                      <div style={{ position: 'absolute', bottom: 8, left: 8, fontSize: 10, background: 'rgba(0,0,0,0.7)', padding: '3px 8px', borderRadius: 4, color: '#8A7878' }}>
                        Auto-generada desde YouTube
                      </div>
                    )}
                  </div>
                )}
                <div
                  style={s.dropzone(dragging)}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onFileDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <div style={{ fontSize: 24, marginBottom: 6 }}>🖼</div>
                  <div style={{ fontSize: 13, color: '#8A7878' }}>
                    {form.thumbnailFile ? form.thumbnailFile.name : 'Arrastrá una imagen o hacé click para subir'}
                  </div>
                  <div style={{ fontSize: 11, color: '#5A5050', marginTop: 4 }}>JPG, PNG — máx. 5MB</div>
                </div>
                {form.thumbnailFile && (
                  <button type="button" onClick={() => {
                    const autoThumb = getYoutubeThumbnail(form.video_url)
                    setForm(f => ({ ...f, thumbnailFile: null, thumbnailPreview: autoThumb }))
                  }} style={{ marginTop: 6, background: 'none', border: 'none', color: '#CC1F1F', fontSize: 12, cursor: 'pointer' }}>
                    Quitar imagen personalizada
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0] ?? null)} />
              </div>

              {/* Checkboxes */}
              <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
                <label style={s.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={e => setForm(f => ({ ...f, destacado: e.target.checked }))}
                    style={{ accentColor: '#CC1F1F', width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span style={s.checkLabel}>★ Destacado</span>
                </label>
                <label style={s.checkRow}>
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                    style={{ accentColor: '#CC1F1F', width: 16, height: 16, cursor: 'pointer' }}
                  />
                  <span style={s.checkLabel}>Activo (visible en el sitio)</span>
                </label>
              </div>

              {error && <div style={s.errBox}>{error}</div>}

              <button type="submit" style={s.saveBtn(saving)} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'add' ? 'Agregar Video' : 'Guardar Cambios'}
              </button>
              <button type="button" style={s.cancelBtn} onClick={closeModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
