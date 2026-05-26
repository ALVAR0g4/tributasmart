import { useState, useEffect } from 'react'
import './App.css'
import api from './api'
import Login from './Login'
import Contador from './Contador'

export default function App() {
  const [page, setPage] = useState('dash')
  const [datos, setDatos] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('usuario')
    const t = localStorage.getItem('token')
    if (u && t) setUsuario(JSON.parse(u))
  }, [])

  useEffect(() => {
    if (usuario) {
      api.get('/tributario/' + usuario.id)
        .then(res => setDatos(res.data))
        .catch(err => console.error(err))
    }
  }, [usuario])

  const go = (id) => setPage(id)

  const onLogin = (u, token) => {
  localStorage.setItem('usuario', JSON.stringify(u))
  localStorage.setItem('token', token)
  setUsuario(u)
}

const onLoginContador = (c, token) => {
  localStorage.setItem('contador', JSON.stringify(c))
  localStorage.setItem('token', token)
  setUsuario(c)
}

  const onLogout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    setUsuario(null)
    setPage('dash')
  }

if (!usuario) return <Login onLogin={onLogin} onLoginContador={onLoginContador} />
if (usuario.rol === 'contador') return <Contador contador={usuario} onLogout={onLogout} />


  return (
    <div style={{display:'flex', flexDirection:'column', minHeight:'100vh', fontFamily:'system-ui, sans-serif'}}>
      
      {/* TOPBAR */}
      <div style={{height:48, background:'#fff', borderBottom:'0.5px solid #e5e7eb', display:'flex', alignItems:'center', padding:'0 16px', gap:12}}>
        <div style={{display:'flex', alignItems:'center', gap:8, minWidth:200}}>
          <div style={{width:28, height:28, borderRadius:6, background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>⚖</div>
          <span style={{fontSize:14, fontWeight:500, color:'#185FA5'}}>TributaSmart</span>
        </div>
        <div style={{flex:1, display:'flex', alignItems:'center', gap:6, background:'#f9fafb', border:'0.5px solid #e5e7eb', borderRadius:6, padding:'6px 10px', maxWidth:280}}>
          <span>🔍</span>
          <input placeholder="Buscar módulos, documentos..." style={{border:'none', background:'transparent', fontSize:12, outline:'none', width:'100%'}} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginLeft:'auto'}}>
          <span style={{background:'#E6F1FB', color:'#0C447C', fontSize:11, fontWeight:500, padding:'3px 8px', borderRadius:5}}>Año gravable 2024</span>
          <span style={{fontSize:16, cursor:'pointer'}}>🔔</span>
          <div style={{width:28, height:28, borderRadius:'50%', background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:500}}>JC</div>
        </div>
      </div>

      <div style={{display:'flex', flex:1}}>
        
       {/* SIDEBAR */}
        <aside style={{width:200, background:'#fff', borderRight:'0.5px solid #e5e7eb', padding:'10px 8px'}}>
          {[
            {id:'dash', ico:'🏠', label:'Dashboard'},
            {id:'diag', ico:'🔍', label:'Diagnostico', badge:'!'},
            {id:'reg',  ico:'📝', label:'Registro datos'},
            {id:'docs', ico:'📁', label:'Documentos', badge:'2'},
            {id:'sim',  ico:'📊', label:'Simulacion'},
            {id:'rep',  ico:'📄', label:'Reporte final'},
            {id:'perf', ico:'👤', label:'Mi perfil'},
          ].map(n => (
            <div key={n.id} onClick={() => go(n.id)}
              style={{display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:500,
                background: page===n.id ? '#E6F1FB' : 'transparent',
                color: page===n.id ? '#0C447C' : '#6b7280', marginBottom:1}}>
              <span style={{fontSize:14, width:18, textAlign:'center'}}>{n.ico}</span>
              {n.label}
              {n.badge && <span style={{marginLeft:'auto', background:'#185FA5', color:'#fff', fontSize:10, padding:'1px 5px', borderRadius:10}}>{n.badge}</span>}
            </div>
          ))}
          <div style={{marginTop:8, padding:8, borderRadius:8, background:'#f9fafb', display:'flex', alignItems:'center', gap:8}}>
            <div style={{width:26, height:26, borderRadius:'50%', background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10, fontWeight:500}}>
              {usuario.nombre?.charAt(0).toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11, fontWeight:500}}>{usuario.nombre}</div>
              <div style={{fontSize:10, color:'#9ca3af'}}>
              {usuario.tipo === 'empleado' ? '👔 Empleado' : 
              usuario.tipo === 'independiente' ? '💼 Independiente' : 
              usuario.tipo === 'emprendedor' ? '🚀 Emprendedor' : 
              usuario.tipo === 'pensionado' ? '🏖 Pensionado' : '👤 Usuario'}
            </div>
            </div>
            <span onClick={onLogout} style={{fontSize:10, color:'#A32D2D', cursor:'pointer', fontWeight:500}}>Salir</span>
          </div>
        </aside>

        {/* MAIN */}
        <main style={{flex:1, padding:16, overflowY:'auto', background:'#f9fafb'}}>
          {page === 'dash' && <Dashboard go={go} datos={datos} usuario={usuario} />}
          {page === 'diag' && <Diagnostico usuario={usuario} />}
          {page === 'reg' && <Registro usuario={usuario} />}
          {page === 'docs' && <Documentos usuario={usuario} />}
          {page === 'sim' && <Simulacion go={go} usuario={usuario} />}
          {page === 'rep' && <Reporte usuario={usuario} />}
          {page === 'perf' && <Perfil go={go} usuario={usuario} />}
        </main>
      </div>
    </div>
  )
}

function PageHeader({bc, title, sub}) {
  return (
    <div style={{marginBottom:14}}>
      <div style={{fontSize:11, color:'#9ca3af', marginBottom:4}}>TributaSmart / <span style={{color:'#185FA5'}}>{bc}</span></div>
      <div style={{fontSize:18, fontWeight:500, marginBottom:2}}>{title}</div>
      <div style={{fontSize:12, color:'#6b7280'}}>{sub}</div>
    </div>
  )
}

function Alert({type, ico, text, action, onAction}) {
  const colors = {
    info: {bg:'#E6F1FB', border:'#B5D4F4', color:'#0C447C'},
    warn: {bg:'#FAEEDA', border:'#FAC775', color:'#633806'},
    ok:   {bg:'#EAF3DE', border:'#C0DD97', color:'#27500A'},
  }
  const c = colors[type]
  return (
    <div style={{display:'flex', alignItems:'flex-start', gap:8, padding:'9px 12px', borderRadius:8, marginBottom:8, fontSize:12, background:c.bg, border:`0.5px solid ${c.border}`, color:c.color}}>
      <span style={{fontSize:13}}>{ico}</span>
      <span style={{flex:1, lineHeight:1.4}}>{text}</span>
      {action && <span onClick={onAction} style={{fontWeight:500, cursor:'pointer', marginLeft:6}}>{action}</span>}
    </div>
  )
}

function Card({title, ico, children, style={}}) {
  return (
    <div style={{background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:10, padding:'14px 16px', ...style}}>
      {title && <div style={{fontSize:13, fontWeight:500, marginBottom:12, display:'flex', alignItems:'center', gap:6}}><span>{ico}</span>{title}</div>}
      {children}
    </div>
  )
}

function Dashboard({go, datos, usuario}) {
  const ingresos = datos ? `$${(datos.ingresos/1000000).toFixed(1)}M` : '$68.5M'
  const deducciones = datos ? `$${(datos.deducciones/1000000).toFixed(1)}M` : '$12.1M'
  const retenciones = datos ? `$${(datos.retenciones/1000000).toFixed(1)}M` : '$3.4M'
  const impuesto = datos ? `$${(datos.impuesto_estimado/1000000).toFixed(2)}M` : '$4.82M'

  return (
    <div>
      <PageHeader bc="Dashboard" title={`Bienvenido, ${usuario.nombre} 👋`} sub="Resumen de tu proceso tributario — año gravable 2024" />
      <Alert type="info" ico="🗓" text={<>Plazo para declarar renta 2024: hasta el <strong>21 de agosto de 2025</strong>. Te quedan aprox. 4 meses.</>} action="Comenzar →" onAction={() => go('diag')} />
      <Alert type="warn" ico="⚠" text={<>Tienes <strong>2 documentos pendientes</strong> de cargar para completar tu expediente.</>} action="Ver →" onAction={() => go('docs')} />
      <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:14}}>
        {[
          {ico:'💰', label:'Ingresos registrados', val:ingresos,    bg:'#E6F1FB'},
          {ico:'✂',  label:'Gastos deducibles',    val:deducciones, bg:'#EAF3DE'},
          {ico:'🧾', label:'Retenciones a favor',   val:retenciones, bg:'#FAEEDA'},
          {ico:'📋', label:'Impuesto estimado',      val:impuesto,    bg:'#FCEBEB'},
        ].map((s,i) => (
          <div key={i} style={{background:'#f9fafb', borderRadius:8, padding:'12px 14px'}}>
            <div style={{float:'right', width:30, height:30, borderRadius:6, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16}}>{s.ico}</div>
            <div style={{fontSize:11, color:'#6b7280', marginBottom:4}}>{s.label}</div>
            <div style={{fontSize:20, fontWeight:500, color:'#0C447C'}}>{s.val}</div>
          </div>
        ))}
      </div>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
        <Card title="Progreso del proceso tributario" ico="🗺">
          <div style={{display:'flex', alignItems:'center', gap:0, marginBottom:16}}>
            {['Registro','Diagnóstico','Datos','Documentos','Simulación','Reporte'].map((s,i) => (
              <div key={i} style={{display:'flex', alignItems:'center'}}>
                <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:4}}>
                  <div style={{width:24, height:24, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:500,
                    background: i<3?'#185FA5':'transparent', border: i<3?'none': i===3?'1.5px solid #185FA5':'1.5px solid #d1d5db',
                    color: i<3?'#fff': i===3?'#0C447C':'#9ca3af'}}>
                    {i<3?'✓':i+1}
                  </div>
                  <div style={{fontSize:10, color: i<=3?'#111':'#9ca3af', whiteSpace:'nowrap'}}>{s}</div>
                </div>
                {i<5 && <div style={{height:1, width:20, background: i<3?'#185FA5':'#e5e7eb', margin:'0 4px', marginBottom:14}}></div>}
              </div>
            ))}
          </div>
          <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'#6b7280', marginBottom:6}}>
            <span>Completado</span><span style={{fontWeight:500, color:'#0C447C'}}>57%</span>
          </div>
          <div style={{height:5, background:'#f3f4f6', borderRadius:3, overflow:'hidden', marginBottom:12}}>
            <div style={{height:'100%', width:'57%', background:'#185FA5', borderRadius:3}}></div>
          </div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={() => go('docs')} style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>Continuar proceso →</button>
            <button onClick={() => go('sim')}  style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#fff', color:'#374151', border:'0.5px solid #d1d5db'}}>Ver simulación</button>
          </div>
        </Card>
        <Card title="Lista de verificación" ico="✅">
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {[
              {ok:true,  t:'Cuenta creada'},
              {ok:true,  t:'Diagnóstico tributario'},
              {ok:true,  t:'Ingresos registrados'},
              {ok:true,  t:'Gastos deducibles'},
              {ok:true,  t:'Retenciones registradas'},
              {ok:false, t:'Documentos completos'},
              {ok:false, t:'Simulación generada'},
              {ok:false, t:'Reporte exportado'},
            ].map((item,i) => (
              <li key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'6px 0', borderBottom:'0.5px solid #f3f4f6', fontSize:12}}>
                <span style={{fontSize:13}}>{item.ok ? '✅' : '🔲'}</span>{item.t}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function Diagnostico({ usuario }) {
  const [form, setForm] = useState({ ingresos: 68500000, patrimonio: 120000000, tarjeta: 0, compras: 0, consignaciones: 0, inversiones: 0 })
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)

  const cambiar = (e) => setForm({ ...form, [e.target.name]: Number(e.target.value) })

  const calcular = async () => {
    setCargando(true)
    try {
      const res = await api.post('/diagnostico/' + usuario.id, form)
      setResultado(res.data)
    } catch (err) {
      console.error(err)
    }
    setCargando(false)
  }

  return (
    <div>
      <PageHeader bc="Diagnostico" title="Diagnostico tributario" sub="Determina si estas obligado a declarar renta en Colombia 2024" />
      <Card title="Cuestionario" ico="📋">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:12}}>
          {[
            {l:'Ingresos brutos anuales (COP)', n:'ingresos'},
            {l:'Patrimonio bruto total (COP)',  n:'patrimonio'},
            {l:'Consumos tarjeta de credito',   n:'tarjeta'},
            {l:'Compras y consumos totales',    n:'compras'},
            {l:'Consignaciones bancarias',      n:'consignaciones'},
            {l:'Inversiones y ahorros',         n:'inversiones'},
          ].map((f,i) => (
            <div key={i}>
              <label style={{display:'block', fontSize:11, fontWeight:500, color:'#6b7280', marginBottom:4}}>{f.l}</label>
              <input name={f.n} value={form[f.n]} onChange={cambiar} type="number"
                style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, outline:'none', boxSizing:'border-box'}} />
            </div>
          ))}
        </div>
        <button onClick={calcular} disabled={cargando}
          style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>
          {cargando ? 'Calculando...' : 'Calcular diagnostico'}
        </button>

        {resultado && (
          <div style={{marginTop:16, padding:'12px 16px', borderRadius:8, background: resultado.debeDeclarar ? '#FCEBEB' : '#EAF3DE', border: `0.5px solid ${resultado.debeDeclarar ? '#F4A0A0' : '#C0DD97'}`}}>
            <div style={{fontSize:14, fontWeight:500, color: resultado.debeDeclarar ? '#A32D2D' : '#27500A', marginBottom:4}}>
              {resultado.debeDeclarar ? '⚠ Debes declarar renta 2024' : '✅ No estas obligado a declarar renta 2024'}
            </div>
            <div style={{fontSize:12, color:'#6b7280'}}>{resultado.mensaje}</div>
          </div>
        )}
      </Card>
    </div>
  )
}

function Registro({ usuario }) {
  const [ingresos, setIngresos] = useState([
    {d:'Salario mensual', f:'Ene-Dic 2024', v:62500000, s:'Verificado'},
    {d:'Honorarios freelance', f:'Mar 2024', v:6000000, s:'Pendiente'},
  ])
  const [deducciones, setDeducciones] = useState([
    {d:'Intereses hipotecarios', f:'2024', v:4200000},
    {d:'Medicina prepagada', f:'2024', v:3600000},
    {d:'Dependientes', f:'2024', v:4300000},
  ])
  const [guardado, setGuardado] = useState(false)

  const totalIngresos = ingresos.reduce((a, b) => a + b.v, 0)
  const totalDeducciones = deducciones.reduce((a, b) => a + b.v, 0)
  const retenciones = 3400000
  const impuesto = Math.max(0, (totalIngresos - totalDeducciones * 0.25) * 0.19 - retenciones)

  const guardar = async () => {
    try {
      await api.put('/tributario/' + usuario.id, {
        ingresos: totalIngresos,
        deducciones: totalDeducciones,
        retenciones,
        impuesto_estimado: impuesto
      })
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <PageHeader bc="Registro datos" title="Registro de datos" sub="Ingresa tus ingresos, deducciones y retenciones" />
      <Alert type="info" ico="💡" text="Registra todos tus ingresos del año gravable 2024 para un calculo preciso." />
      
      <Card title="Ingresos" ico="💰" style={{marginBottom:12}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr>{['Descripcion','Fecha','Valor','Estado'].map(h => <th key={h} style={{fontSize:10, fontWeight:500, color:'#9ca3af', textTransform:'uppercase', padding:'6px 10px', textAlign:'left', borderBottom:'0.5px solid #e5e7eb'}}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {ingresos.map((r,i) => (
              <tr key={i}>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6'}}>{r.d}</td>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', color:'#6b7280'}}>{r.f}</td>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6'}}>
                  <input type="number" value={r.v} onChange={e => {
                    const nueva = [...ingresos]
                    nueva[i].v = Number(e.target.value)
                    setIngresos(nueva)
                  }} style={{width:120, padding:'4px 8px', borderRadius:4, border:'0.5px solid #e5e7eb', fontSize:12, outline:'none'}} />
                </td>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6'}}>
                  <span style={{background: r.s==='Verificado'?'#EAF3DE':'#FAEEDA', color: r.s==='Verificado'?'#27500A':'#633806', padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500}}>{r.s}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:8, fontSize:12, fontWeight:500, color:'#0C447C', textAlign:'right'}}>
          Total ingresos: ${totalIngresos.toLocaleString()}
        </div>
      </Card>

      <Card title="Deducciones" ico="✂" style={{marginBottom:12}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
          <thead>
            <tr>{['Descripcion','Periodo','Valor'].map(h => <th key={h} style={{fontSize:10, fontWeight:500, color:'#9ca3af', textTransform:'uppercase', padding:'6px 10px', textAlign:'left', borderBottom:'0.5px solid #e5e7eb'}}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {deducciones.map((r,i) => (
              <tr key={i}>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6'}}>{r.d}</td>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', color:'#6b7280'}}>{r.f}</td>
                <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6'}}>
                  <input type="number" value={r.v} onChange={e => {
                    const nueva = [...deducciones]
                    nueva[i].v = Number(e.target.value)
                    setDeducciones(nueva)
                  }} style={{width:120, padding:'4px 8px', borderRadius:4, border:'0.5px solid #e5e7eb', fontSize:12, outline:'none'}} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{marginTop:8, fontSize:12, fontWeight:500, color:'#A32D2D', textAlign:'right'}}>
          Total deducciones: ${totalDeducciones.toLocaleString()}
        </div>
      </Card>

      <div style={{display:'flex', alignItems:'center', gap:10}}>
        <button onClick={guardar} style={{padding:'8px 16px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>
          💾 Guardar datos
        </button>
        {guardado && <span style={{fontSize:12, color:'#27500A', fontWeight:500}}>✅ Datos guardados correctamente</span>}
      </div>
    </div>
  )
}

function Documentos({ usuario }) {
  const [docs, setDocs] = useState([])
  const [subiendo, setSubiendo] = useState(false)
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    cargarDocs()
  }, [])

  const cargarDocs = async () => {
    try {
      const res = await api.get('/documentos/' + usuario.id)
      setDocs(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const subir = async (e) => {
    const archivo = e.target.files[0]
    if (!archivo) return
    setSubiendo(true)
    const formData = new FormData()
    formData.append('archivo', archivo)
    formData.append('nombre', archivo.name)
    formData.append('tipo', 'documento')
    try {
      await api.post('/documentos/' + usuario.id + '/subir', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMensaje('Documento subido correctamente')
      cargarDocs()
      setTimeout(() => setMensaje(''), 3000)
    } catch (err) {
      setMensaje('Error al subir el documento')
    }
    setSubiendo(false)
  }

  const docsRequeridos = [
    {ico:'📄', name:'Certificado de ingresos y retenciones', meta:'Emitido por empleador · PDF'},
    {ico:'🏦', name:'Certificado bancario', meta:'Extractos del año · PDF'},
    {ico:'🏠', name:'Certificado hipotecario', meta:'Intereses pagados 2024'},
    {ico:'🏥', name:'Medicina prepagada', meta:'Pagos del año'},
  ]

  return (
    <div>
      <PageHeader bc="Documentos" title="Documentos" sub="Carga los soportes necesarios para tu declaracion" />
      {docs.length < docsRequeridos.length && (
        <Alert type="warn" ico="⚠" text={`Tienes ${docsRequeridos.length - docs.length} documentos pendientes de cargar.`} />
      )}
      {docs.length >= docsRequeridos.length && (
        <Alert type="ok" ico="✅" text="Todos los documentos han sido cargados correctamente." />
      )}

      <Card title="Documentos requeridos" ico="📁" style={{marginBottom:12}}>
        {docsRequeridos.map((d,i) => {
          const cargado = docs[i]
          return (
            <div key={i} style={{display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:'#f9fafb', borderRadius:6, marginBottom:6, border:'0.5px solid #e5e7eb'}}>
              <div style={{width:30, height:30, borderRadius:6, background: cargado?'#EAF3DE':'#FAEEDA', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>{d.ico}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12, fontWeight:500}}>{d.name}</div>
                <div style={{fontSize:10, color:'#9ca3af'}}>{cargado ? cargado.nombre : d.meta}</div>
              </div>
              <span style={{background: cargado?'#EAF3DE':'#FAEEDA', color: cargado?'#27500A':'#633806', padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500}}>
                {cargado ? 'Cargado' : 'Pendiente'}
              </span>
            </div>
          )
        })}
      </Card>

      <Card title="Subir documento" ico="📎">
        <div style={{border:'1.5px dashed #d1d5db', borderRadius:8, padding:24, textAlign:'center', background:'#f9fafb', marginBottom:10}}>
          <div style={{fontSize:24, marginBottom:6}}>📎</div>
          <div style={{fontSize:12, fontWeight:500, marginBottom:4}}>Arrastra o haz clic para cargar</div>
          <div style={{fontSize:11, color:'#9ca3af', marginBottom:12}}>PDF, JPG, PNG · max. 10MB</div>
          <label style={{padding:'8px 16px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>
            {subiendo ? 'Subiendo...' : 'Seleccionar archivo'}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={subir} style={{display:'none'}} />
          </label>
        </div>
        {mensaje && (
          <div style={{background:'#EAF3DE', border:'0.5px solid #C0DD97', borderRadius:6, padding:'8px 12px', fontSize:12, color:'#27500A'}}>
            ✅ {mensaje}
          </div>
        )}

        {docs.length > 0 && (
          <div style={{marginTop:12}}>
            <div style={{fontSize:12, fontWeight:500, marginBottom:8}}>Documentos subidos ({docs.length})</div>
            {docs.map((d,i) => (
              <div key={i} style={{display:'flex', alignItems:'center', gap:8, padding:'6px 10px', background:'#f9fafb', borderRadius:6, marginBottom:4, border:'0.5px solid #e5e7eb', fontSize:12}}>
                <span>📄</span>
                <span style={{flex:1}}>{d.nombre}</span>
                <span style={{fontSize:10, color:'#9ca3af'}}>{new Date(d.created_at).toLocaleDateString('es-CO')}</span>
                <span style={{background:'#EAF3DE', color:'#27500A', padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500}}>Cargado</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

function Simulacion({ go, usuario }) {
  const [datos, setDatos] = useState(null)

  useEffect(() => {
    api.get('/tributario/' + usuario.id)
      .then(res => setDatos(res.data))
      .catch(err => console.error(err))
  }, [])

  if (!datos) return <div style={{padding:20, fontSize:12, color:'#6b7280'}}>Cargando simulacion...</div>

  const rentaExenta = datos.ingresos * 0.25
  const rentaLiquida = datos.ingresos - rentaExenta - datos.deducciones
  const impuestoTabla = Math.max(0, rentaLiquida * 0.19)
  const impuestoNeto = Math.max(0, impuestoTabla - datos.retenciones)

  const fmt = (n) => '$' + Math.round(n).toLocaleString()

  return (
    <div>
      <PageHeader bc="Simulacion" title="Simulacion tributaria" sub="Estimacion de tu impuesto de renta 2024" />
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
        <Card title="Detalle del calculo" ico="🧮">
          <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
            <tbody>
              {[
                {l:'Ingresos brutos',        v:fmt(datos.ingresos),   c:''},
                {l:'(-) Rentas exentas 25%', v:'-'+fmt(rentaExenta),  c:'#A32D2D'},
                {l:'(-) Deducciones',        v:'-'+fmt(datos.deducciones), c:'#A32D2D'},
                {l:'= Renta liquida',        v:fmt(rentaLiquida),     c:'#0C447C'},
                {l:'Impuesto segun tabla',   v:fmt(impuestoTabla),    c:''},
                {l:'(-) Retenciones',        v:'-'+fmt(datos.retenciones), c:'#27500A'},
              ].map((r,i) => (
                <tr key={i}>
                  <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', color:'#6b7280'}}>{r.l}</td>
                  <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', textAlign:'right', fontWeight:500, color:r.c||'inherit'}}>{r.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{background:'#185FA5', borderRadius:8, padding:'10px 12px', display:'flex', justifyContent:'space-between', marginTop:10}}>
            <span style={{color:'rgba(255,255,255,0.8)', fontSize:12}}>Impuesto neto estimado</span>
            <span style={{color:'#fff', fontSize:15, fontWeight:500}}>{fmt(impuestoNeto)}</span>
          </div>
          <button onClick={() => go('rep')} style={{width:'100%', marginTop:10, padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>Generar reporte →</button>
        </Card>
        <div>
          <Alert type="info" ico="💡" text="Si registras mas deducciones podrias reducir tu impuesto estimado." />
          <Card title="Escenarios" ico="📊">
            {[
              {tag:'Optimista',   val:fmt(impuestoNeto * 0.9), c:'#27500A', bg:'#EAF3DE'},
              {tag:'Base',        val:fmt(impuestoNeto),        c:'#0C447C', bg:'#E6F1FB'},
              {tag:'Conservador', val:fmt(impuestoNeto * 1.1),  c:'#633806', bg:'#FAEEDA'},
            ].map((e,i) => (
              <div key={i} style={{background:e.bg, borderRadius:8, padding:10, textAlign:'center', marginBottom:8}}>
                <div style={{fontSize:10, fontWeight:500, color:e.c, marginBottom:3}}>{e.tag}</div>
                <div style={{fontSize:14, fontWeight:500, color:e.c}}>{e.val}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

function Reporte({ usuario }) {
  const descargarPDF = () => {
    window.open('https://tributasmart-backend.onrender.com/reporte/' + usuario.id + '/pdf', '_blank')
  }

  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const enviarContador = async () => {
    setEnviando(true)
    try {
      await api.post('/reporte/' + usuario.id + '/enviar')
      setEnviado(true)
      setTimeout(() => setEnviado(false), 3000)
    } catch (err) {
      console.error(err)
    }
    setEnviando(false)
  }
  return (
    <div>
      <PageHeader bc="Reporte final" title="Reporte para tu contador" sub="Resumen consolidado listo para compartir con tu profesional contable" />
      <div style={{display:'flex', alignItems:'center', gap:8, background:'#EAF3DE', borderRadius:6, padding:'8px 12px', marginBottom:10}}>
        <span style={{fontSize:11, color:'#27500A', fontWeight:500}}>🔒 Informacion verificada y protegida · TributaSmart no reemplaza el trabajo de tu contador</span>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:12}}>
        <Card>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:12, borderBottom:'0.5px solid #e5e7eb', marginBottom:14}}>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <div style={{width:36, height:36, borderRadius:8, background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18}}>⚖</div>
              <div>
                <div style={{fontSize:14, fontWeight:500}}>TributaSmart — Resumen Tributario 2024</div>
                <div style={{fontSize:11, color:'#9ca3af'}}>Generado el {new Date().toLocaleDateString('es-CO')} · Confidencial</div>
              </div>
            </div>
            <span style={{background:'#E6F1FB', color:'#0C447C', padding:'2px 7px', borderRadius:20, fontSize:10, fontWeight:500}}>Vista previa</span>
          </div>
          {[
            {title:'Ingresos', rows:[{l:'Salario y prestaciones',v:'$62.500.000'},{l:'Honorarios independiente',v:'$6.000.000'},{l:'Total ingresos',v:'$68.500.000',bold:true,c:'#27500A'}]},
            {title:'Deducciones', rows:[{l:'Intereses hipotecarios',v:'$4.200.000'},{l:'Medicina prepagada',v:'$3.600.000'},{l:'Dependientes',v:'$4.300.000'}]},
            {title:'Retenciones', rows:[{l:'Total retenciones a favor',v:'$3.400.000',c:'#0C447C'}]},
          ].map((sec,i) => (
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontSize:10, fontWeight:500, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.4px', marginBottom:8}}>{sec.title}</div>
              {sec.rows.map((r,j) => (
                <div key={j} style={{display:'flex', justifyContent:'space-between', fontSize:12, padding:'4px 0', borderBottom:'0.5px solid #f3f4f6'}}>
                  <span style={{color:'#6b7280', fontWeight: r.bold?500:'normal'}}>{r.l}</span>
                  <span style={{fontWeight:500, color:r.c||'inherit'}}>{r.v}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{display:'flex', justifyContent:'space-between', background:'#185FA5', borderRadius:8, padding:'10px 14px', marginTop:10}}>
            <span style={{color:'rgba(255,255,255,0.8)', fontSize:12, fontWeight:500}}>Impuesto estimado a pagar</span>
            <span style={{color:'#fff', fontSize:15, fontWeight:500}}>$4.820.000</span>
          </div>
        </Card>
        <div>
          <Card title="Exportar y compartir" ico="⬇" style={{marginBottom:10}}>
            <button onClick={descargarPDF} style={{width:'100%', padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:5, background:'#639922', color:'#fff', border:'none'}}>
              📥 Descargar PDF
            </button>
           <button onClick={enviarContador} disabled={enviando}
              style={{width:'100%', padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:5, background:'#185FA5', color:'#fff', border:'none'}}>
              {enviando ? 'Enviando...' : enviado ? '✅ Enviado al contador' : '📧 Enviar al contador'}
            </button>
            <button style={{width:'100%', padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', marginBottom:8, display:'flex', alignItems:'center', justifyContent:'center', gap:5, background:'#fff', color:'#374151', border:'0.5px solid #d1d5db'}}>
              🔗 Enlace seguro
            </button>
          </Card>
          <Card title="Notas para el contador" ico="📌">
            <textarea placeholder="Agrega notas adicionales..." style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, resize:'vertical', minHeight:80, outline:'none', boxSizing:'border-box'}}></textarea>
            <Alert type="info" ico="ℹ" text="TributaSmart organiza tu informacion. La revision y firma legal corresponde a tu contador certificado." />
          </Card>
        </div>
      </div>
    </div>
  )
}

function Perfil({ go, usuario }) {
  const [form, setForm] = useState({
    nombre: usuario.nombre || '',
    cedula: usuario.cedula || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    password_actual: '',
    password_nuevo: '',
  })
  const [guardado, setGuardado] = useState(false)
  const [mensajePassword, setMensajePassword] = useState('')

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const guardar = async () => {
    try {
      await api.put('/usuario/' + usuario.id, form)
      setGuardado(true)
      setTimeout(() => setGuardado(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const cambiarPassword = async () => {
    try {
      await api.put('/usuario/' + usuario.id + '/password', {
        password_actual: form.password_actual,
        password_nuevo: form.password_nuevo
      })
      setMensajePassword('✅ Contrasena actualizada correctamente')
      setTimeout(() => setMensajePassword(''), 3000)
    } catch (err) {
      setMensajePassword('❌ ' + (err.response?.data?.error || 'Error al cambiar contrasena'))
      setTimeout(() => setMensajePassword(''), 3000)
    }
  }

  return (
    <div>
      <PageHeader bc="Mi perfil" title="Mi perfil" sub="Configura tu informacion personal y de seguridad" />
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
        <Card title="Datos personales" ico="👤">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12}}>
            {[
              {l:'Nombre completo',    n:'nombre'},
              {l:'Numero de cedula',   n:'cedula'},
              {l:'Correo electronico', n:'email'},
              {l:'Telefono',           n:'telefono'},
            ].map((f,i) => (
              <div key={i}>
                <label style={{display:'block', fontSize:11, fontWeight:500, color:'#6b7280', marginBottom:4}}>{f.l}</label>
                <input name={f.n} value={form[f.n]} onChange={cambiar} style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, outline:'none', boxSizing:'border-box'}} />
              </div>
            ))}
          </div>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <button onClick={guardar} style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>Guardar cambios</button>
            <button onClick={() => go('dash')} style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#fff', color:'#374151', border:'0.5px solid #d1d5db'}}>Cancelar</button>
            {guardado && <span style={{fontSize:12, color:'#27500A', fontWeight:500}}>✅ Guardado correctamente</span>}
          </div>
        </Card>
        <div>
          <Card title="Seguridad" ico="🔒" style={{marginBottom:10}}>
            <div style={{display:'flex', flexDirection:'column', gap:8, marginBottom:10}}>
              <div>
                <label style={{display:'block', fontSize:11, fontWeight:500, color:'#6b7280', marginBottom:4}}>Contrasena actual</label>
                <input type="password" name="password_actual" value={form.password_actual||''} onChange={cambiar}
                  style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, outline:'none', boxSizing:'border-box'}} />
              </div>
              <div>
                <label style={{display:'block', fontSize:11, fontWeight:500, color:'#6b7280', marginBottom:4}}>Nueva contrasena</label>
                <input type="password" name="password_nuevo" value={form.password_nuevo||''} onChange={cambiar}
                  placeholder="Minimo 8 caracteres"
                  style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, outline:'none', boxSizing:'border-box'}} />
              </div>
            </div>
            <div style={{display:'flex', alignItems:'center', gap:10}}>
              <button onClick={cambiarPassword} style={{padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#fff', color:'#374151', border:'0.5px solid #d1d5db'}}>
                Cambiar contrasena
              </button>
              {mensajePassword && <span style={{fontSize:12, color: mensajePassword.includes('incorrecta') ? '#A32D2D' : '#27500A', fontWeight:500}}>{mensajePassword}</span>}
            </div>
          </Card>
          <Alert type="ok" ico="🔐" text="Datos cifrados con TLS 1.3. TributaSmart nunca comparte tu informacion con terceros." />
        </div>
      </div>
    </div>
  )
}