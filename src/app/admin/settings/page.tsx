'use client'

import { useEffect, useRef, useState } from 'react'
import { getSettings, updateSettings, getImageUrl } from '@/lib/adminApi'

export default function SettingsPage() {
  const [currentImg, setCurrentImg] = useState<string | null>(null)
  const [preview, setPreview]       = useState<string | null>(null)
  const [file, setFile]             = useState<File | null>(null)
  const [saving, setSaving]         = useState(false)
  const [toast, setToast]           = useState<{ msg: string; ok: boolean } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getSettings()
      .then(r => { if (r.data?.cascada_img) setCurrentImg(getImageUrl(r.data.cascada_img)) })
      .catch(() => {})
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSave() {
    if (!file) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('cascada_img', file)
      const res = await updateSettings(fd)
      if (res.data?.cascada_img) setCurrentImg(getImageUrl(res.data.cascada_img))
      setPreview(null)
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      showToast('Imagen actualizada correctamente ✓', true)
    } catch {
      showToast('Error al guardar la imagen', false)
    } finally {
      setSaving(false)
    }
  }

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3500)
  }

  /* ── styles ── */
  const S = {
    page:    { padding: '40px 40px', maxWidth: 900 } as React.CSSProperties,
    title:   { fontSize: 24, fontWeight: 700, color: '#FAF7F2', marginBottom: 6 } as React.CSSProperties,
    sub:     { fontSize: 14, color: '#8A7878', marginBottom: 40 } as React.CSSProperties,
    card:    { background: '#1A1515', border: '1px solid #2A2020', borderRadius: 14, padding: 28, marginBottom: 28 } as React.CSSProperties,
    label:   { fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' as const, color: '#CC1F1F', marginBottom: 14, display: 'block' },
    imgWrap: { width: '100%', maxWidth: 420, aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', background: '#111', border: '1px solid #2A2020', position: 'relative' as const },
    img:     { width: '100%', height: '100%', objectFit: 'cover' as const, display: 'block' },
    row:     { display: 'flex', gap: 24, flexWrap: 'wrap' as const, marginTop: 24, alignItems: 'flex-start' },
    btn:     { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, transition: 'all .2s' } as React.CSSProperties,
  }

  return (
    <div style={S.page}>
      <h1 style={S.title}>Configuración del Sitio</h1>
      <p style={S.sub}>Gestioná la imagen de la cascada que aparece en la galería principal.</p>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 24, right: 24, zIndex: 999,
          background: toast.ok ? '#16a34a' : '#DC2626',
          color: '#fff', padding: '14px 20px', borderRadius: 10,
          fontSize: 14, fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,.4)',
          animation: 'none',
        }}>
          {toast.msg}
        </div>
      )}

      {/* Card: imagen de cascada */}
      <div style={S.card}>
        <span style={S.label}>Imagen de la Cascada de Chocolate</span>
        <p style={{ fontSize: 13, color: '#6A5858', marginBottom: 20, lineHeight: 1.6 }}>
          Esta imagen aparece como la primera en el carrusel del showcase y en la galería principal.<br />
          Formatos recomendados: JPG o PNG. Proporción sugerida: vertical (3:4 o similar).
        </p>

        <div style={S.row}>
          {/* Imagen actual */}
          {currentImg && (
            <div>
              <p style={{ fontSize: 11, color: '#6A5858', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Actual</p>
              <div style={S.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentImg} alt="Cascada actual" style={S.img} />
              </div>
            </div>
          )}

          {/* Preview nueva imagen */}
          {preview && (
            <div>
              <p style={{ fontSize: 11, color: '#CC1F1F', marginBottom: 8, letterSpacing: 1, textTransform: 'uppercase' }}>Nueva (previsualización)</p>
              <div style={S.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" style={S.img} />
              </div>
            </div>
          )}
        </div>

        {/* File input + actions */}
        <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{
            ...S.btn,
            background: '#2A2020', color: '#FAF7F2',
            border: '1px solid #3A3030', cursor: 'pointer',
          }}>
            📁 Elegir imagen
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </label>

          {file && (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                ...S.btn,
                background: saving ? '#555' : '#CC1F1F',
                color: '#fff',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Guardando…' : '✓ Guardar cambios'}
            </button>
          )}

          {file && (
            <button
              onClick={() => { setFile(null); setPreview(null); if (inputRef.current) inputRef.current.value = '' }}
              style={{ ...S.btn, background: 'transparent', color: '#6A5858', border: '1px solid #2A2020' }}
            >
              Cancelar
            </button>
          )}
        </div>

        {file && (
          <p style={{ marginTop: 12, fontSize: 12, color: '#6A5858' }}>
            Archivo seleccionado: <strong style={{ color: '#8A7878' }}>{file.name}</strong> ({(file.size / 1024).toFixed(0)} KB)
          </p>
        )}
      </div>
    </div>
  )
}
