'use client'

import { useEffect, useRef, useState } from 'react'
import { getEventos, createEvento, updateEvento, deleteEvento, getImageUrl } from '@/lib/adminApi'

interface Evento {
  id: number
  titulo: string
  categoria: string
  img: string
}

interface FormState {
  titulo: string
  categoria: string
  imgFile: File | null
  imgPreview: string
}

const CATEGORIAS = ['Bodas', 'Cumpleaños', 'Cascadas', 'Catering', 'Empresarial', 'Otro']
const EMPTY_FORM: FormState = { titulo: '', categoria: '', imgFile: null, imgPreview: '' }

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<'add' | 'edit' | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await getEventos()
      setEventos(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function openAdd() {
    setForm(EMPTY_FORM)
    setEditId(null)
    setError('')
    setModal('add')
  }

  function openEdit(e: Evento) {
    setForm({ titulo: e.titulo, categoria: e.categoria, imgFile: null, imgPreview: getImageUrl(e.img) })
    setEditId(e.id)
    setError('')
    setModal('edit')
  }

  function closeModal() { setModal(null); setEditId(null) }

  function handleFile(file: File | null) {
    if (!file) return
    setForm(f => ({ ...f, imgFile: file, imgPreview: URL.createObjectURL(file) }))
  }

  function onFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (modal === 'add' && !form.imgFile) { setError('Seleccioná una imagen'); return }
    setError('')
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('titulo', form.titulo)
      fd.append('categoria', form.categoria)
      if (form.imgFile) fd.append('img', form.imgFile)

      if (modal === 'add') {
        await createEvento(fd)
      } else if (editId) {
        await updateEvento(editId, fd)
      }
      closeModal()
      await load()
    } catch {
      setError('Ocurrió un error al guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    await deleteEvento(id)
    setDeleteConfirm(null)
    await load()
  }

  const s = {
    page: { padding: '40px 40px', maxWidth: 1100 } as React.CSSProperties,
    header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 } as React.CSSProperties,
    title: { fontSize: 26, fontWeight: 700, color: '#FAF7F2' } as React.CSSProperties,
    addBtn: { padding: '10px 22px', background: '#CC1F1F', color: '#fff', borderRadius: 8, border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 } as React.CSSProperties,
    card: { background: '#1A1515', borderRadius: 12, overflow: 'hidden', border: '1px solid #2A2020', display: 'flex', flexDirection: 'column' } as React.CSSProperties,
    cardImg: { width: '100%', height: 200, objectFit: 'cover' as const, background: '#2A2020', display: 'block' },
    cardBody: { padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 } as React.CSSProperties,
    cardCat: { fontSize: 11, color: '#CC1F1F', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: 1 },
    cardTitle: { fontSize: 15, fontWeight: 600, color: '#FAF7F2' } as React.CSSProperties,
    cardActions: { display: 'flex', gap: 8, marginTop: 14 } as React.CSSProperties,
    editBtn: { flex: 1, padding: '8px', background: '#2A2020', color: '#FAF7F2', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
    delBtn: { padding: '8px 12px', background: 'transparent', color: '#CC1F1F', border: '1px solid #3A1010', borderRadius: 6, cursor: 'pointer', fontSize: 13 } as React.CSSProperties,
    overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 16 } as React.CSSProperties,
    modalBox: { background: '#1A1515', borderRadius: 16, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto', padding: 32, border: '1px solid #2A2020' } as React.CSSProperties,
    modalTitle: { fontSize: 20, fontWeight: 700, color: '#FAF7F2', marginBottom: 24 } as React.CSSProperties,
    label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#8A7878', letterSpacing: 1.5, textTransform: 'uppercase' as const, marginBottom: 8 },
    input: { width: '100%', padding: '11px 14px', borderRadius: 8, background: '#0E0C0C', border: '1px solid #2A2020', color: '#FAF7F2', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
    field: { marginBottom: 20 } as React.CSSProperties,
    dropzone: (over: boolean) => ({
      border: `2px dashed ${over ? '#CC1F1F' : '#2A2020'}`,
      borderRadius: 10, padding: 24, textAlign: 'center' as const,
      cursor: 'pointer', background: over ? '#1A0808' : '#0E0C0C',
      transition: 'all 0.15s',
    }),
    saveBtn: { width: '100%', padding: '13px', borderRadius: 8, background: saving ? '#8A2020' : '#CC1F1F', color: '#fff', fontSize: 15, fontWeight: 700, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', marginTop: 8 } as React.CSSProperties,
    cancelBtn: { width: '100%', padding: '11px', borderRadius: 8, background: 'transparent', color: '#8A7878', fontSize: 14, border: '1px solid #2A2020', cursor: 'pointer', marginTop: 8 } as React.CSSProperties,
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Eventos</h1>
          <p style={{ color: '#8A7878', fontSize: 14, marginTop: 4 }}>{eventos.length} eventos en total</p>
        </div>
        <button style={s.addBtn} onClick={openAdd}>+ Agregar Evento</button>
      </div>

      {loading ? (
        <div style={{ color: '#8A7878', fontSize: 15 }}>Cargando...</div>
      ) : eventos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8A7878' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📸</div>
          <div style={{ fontSize: 16, marginBottom: 8 }}>Todavía no hay eventos</div>
          <button style={s.addBtn} onClick={openAdd}>Agregar el primero</button>
        </div>
      ) : (
        <div style={s.grid}>
          {eventos.map(ev => (
            <div key={ev.id} style={s.card}>
              {ev.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={getImageUrl(ev.img)} alt={ev.titulo} style={s.cardImg} />
              )}
              <div style={s.cardBody}>
                <div style={s.cardCat}>{ev.categoria}</div>
                <div style={s.cardTitle}>{ev.titulo}</div>
                <div style={s.cardActions}>
                  <button style={s.editBtn} onClick={() => openEdit(ev)}>✏️ Editar</button>
                  {deleteConfirm === ev.id ? (
                    <>
                      <button onClick={() => handleDelete(ev.id)} style={{ ...s.delBtn, background: '#CC1F1F', color: '#fff', border: 'none' }}>Confirmar</button>
                      <button onClick={() => setDeleteConfirm(null)} style={s.delBtn}>No</button>
                    </>
                  ) : (
                    <button style={s.delBtn} onClick={() => setDeleteConfirm(ev.id)}>🗑</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) closeModal() }}>
          <div style={s.modalBox}>
            <h2 style={s.modalTitle}>{modal === 'add' ? 'Agregar Evento' : 'Editar Evento'}</h2>
            <form onSubmit={handleSave}>
              <div style={s.field}>
                <label style={s.label}>Título del evento</label>
                <input style={s.input} value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} required placeholder="Ej: Boda García" />
              </div>

              <div style={s.field}>
                <label style={s.label}>Categoría</label>
                <input
                  style={s.input}
                  list="cat-eventos"
                  value={form.categoria}
                  onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                  required
                  placeholder="Ej: Bodas"
                />
                <datalist id="cat-eventos">
                  {CATEGORIAS.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div style={s.field}>
                <label style={s.label}>Imagen {modal === 'edit' && '(dejá vacío para no cambiar)'}</label>
                <div
                  style={s.dropzone(dragging)}
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onFileDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  {form.imgPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.imgPreview} alt="preview" style={{ maxHeight: 160, maxWidth: '100%', borderRadius: 8, margin: '0 auto', display: 'block' }} />
                  ) : (
                    <>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                      <div style={{ fontSize: 14, color: '#8A7878' }}>Arrastrá una imagen o hacé click para subir</div>
                      <div style={{ fontSize: 12, color: '#5A5050', marginTop: 4 }}>JPG, PNG — máx. 5MB</div>
                    </>
                  )}
                </div>
                {form.imgPreview && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, imgFile: null, imgPreview: '' }))} style={{ marginTop: 8, background: 'none', border: 'none', color: '#CC1F1F', fontSize: 12, cursor: 'pointer' }}>
                    Cambiar imagen
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files?.[0] ?? null)} />
              </div>

              {error && (
                <div style={{ background: '#3A1010', border: '1px solid #CC1F1F', borderRadius: 8, padding: '10px 14px', color: '#FF7070', fontSize: 13, marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <button type="submit" style={s.saveBtn} disabled={saving}>
                {saving ? 'Guardando...' : modal === 'add' ? 'Agregar Evento' : 'Guardar Cambios'}
              </button>
              <button type="button" style={s.cancelBtn} onClick={closeModal}>Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
