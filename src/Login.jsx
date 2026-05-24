import { useState } from 'react'
import api from './api'

export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cedula: '', telefono: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async () => {
    setError('')
    setCargando(true)
    try {
      if (modo === 'login') {
        const res = await api.post('/auth/login', { email: form.email, password: form.password })
        onLogin(res.data.usuario, res.data.token)
      } else {
        await api.post('/auth/registro', form)
        setModo('login')
        setError('Cuenta creada. Ahora inicia sesion.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error al conectar con el servidor')
    }
    setCargando(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', border: '0.5px solid #e5e7eb', borderRadius: 12, padding: 32, width: 380 }}>
        
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚖</div>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#185FA5' }}>TributaSmart</span>
        </div>

        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, textAlign: 'center' }}>
          {modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 20, textAlign: 'center' }}>
          {modo === 'login' ? 'Ingresa tus datos para continuar' : 'Completa el formulario para registrarte'}
        </div>

        {/* Campos */}
        {modo === 'registro' && (
          <>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Nombre completo</label>
              <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Juan Carlos Perez"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Cedula</label>
              <input name="cedula" value={form.cedula} onChange={cambiar} placeholder="1050123456"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Telefono</label>
              <input name="telefono" value={form.telefono} onChange={cambiar} placeholder="+57 315 000 0000"
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </>
        )}

        <div style={{ marginBottom: 10 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Correo electronico</label>
          <input name="email" value={form.email} onChange={cambiar} placeholder="juan@ejemplo.com"
            style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Contrasena</label>
          <input name="password" type="password" value={form.password} onChange={cambiar} placeholder="Minimo 8 caracteres"
            style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#FAEEDA', border: '0.5px solid #FAC775', borderRadius: 6, padding: '8px 12px', fontSize: 12, color: '#633806', marginBottom: 12 }}>
            {error}
          </div>
        )}

        {/* Boton */}
        <button onClick={enviar} disabled={cargando}
          style={{ width: '100%', padding: '10px 14px', borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: '#185FA5', color: '#fff', border: 'none', marginBottom: 12 }}>
          {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesion' : 'Crear cuenta'}
        </button>

        {/* Cambiar modo */}
        <div style={{ textAlign: 'center', fontSize: 12, color: '#6b7280' }}>
          {modo === 'login' ? (
            <>No tienes cuenta? <span onClick={() => setModo('registro')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Registrate</span></>
          ) : (
            <>Ya tienes cuenta? <span onClick={() => setModo('login')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Inicia sesion</span></>
          )}
        </div>
      </div>
    </div>
  )
}