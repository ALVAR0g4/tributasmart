import { useState, useEffect } from 'react'
import api from './api'

export default function Login({ onLogin, onLoginContador }) {
  const [modo, setModo] = useState('login')
  const [form, setForm] = useState({ nombre: '', email: '', password: '', cedula: '', telefono: '', tipo: '', matricula: '', contador_id: '' })
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [contadores, setContadores] = useState([])

  useEffect(() => {
    api.get('/contadores').then(res => setContadores(res.data)).catch(console.error)
  }, [])

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async () => {
    setError('')
    setCargando(true)
    try {
      if (modo === 'contador') {
        const res = await api.post('/contador/login', { email: form.email, password: form.password })
        onLoginContador(res.data.contador, res.data.token)
      } else if (modo === 'registro-contador') {
        await api.post('/contador/registro', form)
        setModo('contador')
        setError('Cuenta de contador creada. Ahora inicia sesion.')
      } else if (modo === 'login') {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0C447C 0%, #185FA5 50%, #1a7fd4 100%)',
      position: 'relative', overflow: 'hidden' }}>

      {/* Formas decorativas */}
      <div style={{position:'absolute', top:-100, left:-100, width:400, height:400, borderRadius:'50%', background:'rgba(255,255,255,0.05)'}}></div>
      <div style={{position:'absolute', bottom:-150, right:-100, width:500, height:500, borderRadius:'50%', background:'rgba(255,255,255,0.05)'}}></div>
      <div style={{position:'absolute', top:'30%', left:'5%', width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,0.03)'}}></div>
      <div style={{position:'absolute', top:'10%', right:'10%', width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)'}}></div>

      {/* Panel izquierdo */}
      <div style={{flex:1, maxWidth:480, padding:48, color:'#fff', display:'flex', flexDirection:'column', justifyContent:'center', position:'relative', zIndex:1}}>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:32}}>
          <div style={{width:48, height:48, borderRadius:12, background:'rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24}}>⚖</div>
          <span style={{fontSize:24, fontWeight:700, letterSpacing:'-0.5px'}}>TributaSmart</span>
        </div>
        <div style={{fontSize:32, fontWeight:700, lineHeight:1.2, marginBottom:16, letterSpacing:'-0.5px'}}>
          Simplifica tu declaracion de renta
        </div>
        <div style={{fontSize:15, color:'rgba(255,255,255,0.75)', lineHeight:1.6, marginBottom:32}}>
          Plataforma inteligente para personas naturales en Colombia. Organiza tus datos, simula tu impuesto y conecta con tu contador.
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {[
            {ico:'📊', t:'Simulacion tributaria en tiempo real'},
            {ico:'👨‍💼', t:'Portal exclusivo para contadores'},
            {ico:'📄', t:'Generacion automatica de reportes PDF'},
            {ico:'🔒', t:'Datos cifrados y protegidos'},
          ].map((f,i) => (
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,0.85)'}}>
              <span style={{fontSize:16}}>{f.ico}</span>{f.t}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho - formulario */}
      <div style={{flex:1, maxWidth:420, padding:24, position:'relative', zIndex:1}}>
        <div style={{ background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:16, padding:32, boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, justifyContent: 'center' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#185FA5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚖</div>
            <span style={{ fontSize: 18, fontWeight: 600, color: '#185FA5' }}>TributaSmart</span>
          </div>

          <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, textAlign: 'center' }}>
            {modo === 'login' ? 'Iniciar sesion' : modo === 'registro' ? 'Crear cuenta' : modo === 'contador' ? 'Portal Contador' : 'Registro Contador'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 20, textAlign: 'center' }}>
            {modo === 'login' ? 'Ingresa tus datos para continuar' : modo === 'registro' ? 'Completa el formulario para registrarte' : modo === 'contador' ? 'Acceso exclusivo para contadores' : 'Crea tu cuenta como contador certificado'}
          </div>

          {/* Campos registro cliente */}
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
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Tipo de usuario</label>
                <select name="tipo" value={form.tipo} onChange={cambiar}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box', background: '#fff' }}>
                  <option value="">Selecciona tu tipo</option>
                  <option value="empleado">👔 Empleado</option>
                  <option value="independiente">💼 Independiente</option>
                  <option value="emprendedor">🚀 Emprendedor</option>
                  <option value="pensionado">🏖 Pensionado</option>
                </select>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Selecciona tu contador</label>
                <select name="contador_id" value={form.contador_id} onChange={cambiar}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box', background: '#fff' }}>
                  <option value="">Selecciona un contador</option>
                  {contadores.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre} · Mat. {c.matricula}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Campos registro contador */}
          {modo === 'registro-contador' && (
            <>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Nombre completo</label>
                <input name="nombre" value={form.nombre} onChange={cambiar} placeholder="Carlos Gomez CPC"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 500, color: '#6b7280', marginBottom: 4 }}>Matricula profesional</label>
                <input name="matricula" value={form.matricula} onChange={cambiar} placeholder="12345-T"
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: '0.5px solid #e5e7eb', fontSize: 12, outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          {/* Email y password */}
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
            {cargando ? 'Cargando...' : modo === 'login' ? 'Iniciar sesion' : modo === 'registro' ? 'Crear cuenta' : modo === 'contador' ? 'Ingresar como contador' : 'Registrarme como contador'}
          </button>

          {/* Cambiar modo */}
          <div style={{ textAlign: 'center', fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
            {modo === 'login' ? (
              <>No tienes cuenta? <span onClick={() => setModo('registro')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Registrate</span></>
            ) : modo === 'registro' ? (
              <>Ya tienes cuenta? <span onClick={() => setModo('login')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Inicia sesion</span></>
            ) : modo === 'contador' ? (
              <>No tienes cuenta? <span onClick={() => setModo('registro-contador')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Registrate como contador</span></>
            ) : (
              <>Ya tienes cuenta? <span onClick={() => setModo('contador')} style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>Inicia sesion</span></>
            )}
          </div>
          <div style={{ textAlign: 'center', fontSize: 12 }}>
            <span onClick={() => setModo(modo === 'contador' || modo === 'registro-contador' ? 'login' : 'contador')}
              style={{ color: '#185FA5', cursor: 'pointer', fontWeight: 500 }}>
              {modo === 'contador' || modo === 'registro-contador' ? '← Volver al login de cliente' : '¿Eres contador? Ingresa aqui'}
            </span>
          </div>

        </div>
      </div>
    </div>
  ) 
}