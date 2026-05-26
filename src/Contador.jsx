import { useState, useEffect } from 'react'
import api from './api'

export default function Contador({ contador, onLogout }) {
  const [clientes, setClientes] = useState([])
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
  const [notificaciones, setNotificaciones] = useState([])
  const [verNotifs, setVerNotifs] = useState(false)

  useEffect(() => {
    cargarNotificaciones()
    const interval = setInterval(cargarNotificaciones, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    api.get('/contador/' + contador.id + '/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error(err))
  }, [])

  const cargarNotificaciones = async () => {
    try {
      const res = await api.get('/contador/' + contador.id + '/notificaciones')
      setNotificaciones(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const marcarLeida = async (id) => {
    try {
      await api.put('/notificaciones/' + id + '/leer')
      cargarNotificaciones()
    } catch (err) {
      console.error(err)
    }
  }

  const cambiarEstado = async (userId, estado) => {
    try {
      await api.put('/tributario/' + userId + '/estado', { estado })
      setClienteSeleccionado({ ...clienteSeleccionado, estado })
    } catch (err) {
      console.error(err)
    }
  }

  const fmt = (n) => n ? '$' + Math.round(n).toLocaleString() : '$0'

  return (
    <div style={{display:'flex', flexDirection:'column', minHeight:'100vh', fontFamily:'system-ui, sans-serif'}}>

      {/* TOPBAR */}
      <div style={{height:48, background:'#fff', borderBottom:'0.5px solid #e5e7eb', display:'flex', alignItems:'center', padding:'0 16px', gap:12}}>
        <div style={{display:'flex', alignItems:'center', gap:8, minWidth:200}}>
          <div style={{width:28, height:28, borderRadius:6, background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>⚖</div>
          <span style={{fontSize:14, fontWeight:500, color:'#185FA5'}}>TributaSmart</span>
          <span style={{background:'#E6F1FB', color:'#0C447C', fontSize:10, fontWeight:500, padding:'2px 6px', borderRadius:4}}>Portal Contador</span>
        </div>
        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', gap:10}}>
          <div style={{position:'relative'}}>
            <span onClick={() => setVerNotifs(!verNotifs)} style={{fontSize:18, cursor:'pointer'}}>🔔</span>
            {notificaciones.filter(n => !n.leida).length > 0 && (
              <span style={{position:'absolute', top:-4, right:-4, background:'#A32D2D', color:'#fff', fontSize:9, fontWeight:500, padding:'1px 4px', borderRadius:10}}>
                {notificaciones.filter(n => !n.leida).length}
              </span>
            )}
            {verNotifs && (
              <div style={{position:'absolute', right:0, top:30, width:300, background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:10, boxShadow:'0 4px 12px rgba(0,0,0,0.1)', zIndex:100}}>
                <div style={{padding:'10px 14px', borderBottom:'0.5px solid #e5e7eb', fontSize:12, fontWeight:500}}>Notificaciones</div>
                {notificaciones.length === 0 && (
                  <div style={{padding:'12px 14px', fontSize:12, color:'#9ca3af'}}>No tienes notificaciones</div>
                )}
                {notificaciones.map((n,i) => (
                  <div key={i} style={{padding:'10px 14px', borderBottom:'0.5px solid #f3f4f6', background: n.leida?'#fff':'#E6F1FB'}}>
                    <div style={{fontSize:12, marginBottom:4}}>{n.mensaje}</div>
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontSize:10, color:'#9ca3af'}}>{new Date(n.created_at).toLocaleDateString('es-CO')}</span>
                      {!n.leida && <span onClick={() => marcarLeida(n.id)} style={{fontSize:10, color:'#185FA5', cursor:'pointer', fontWeight:500}}>Marcar leida</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{fontSize:12, color:'#6b7280'}}>
            <span style={{fontWeight:500, color:'#111'}}>{contador.nombre}</span> · Mat. {contador.matricula}
          </div>
          <span onClick={onLogout} style={{fontSize:12, color:'#A32D2D', cursor:'pointer', fontWeight:500}}>Salir</span>
        </div>
      </div>

      <div style={{display:'flex', flex:1}}>

        {/* SIDEBAR clientes */}
        <aside style={{width:240, background:'#fff', borderRight:'0.5px solid #e5e7eb', padding:'10px 8px'}}>
          <div style={{fontSize:11, fontWeight:500, color:'#9ca3af', textTransform:'uppercase', padding:'4px 8px', marginBottom:8}}>Mis clientes ({clientes.length})</div>
          {clientes.map(c => (
            <div key={c.id} onClick={() => setClienteSeleccionado(c)}
              style={{padding:'8px 10px', borderRadius:6, cursor:'pointer', marginBottom:4,
                background: clienteSeleccionado?.id === c.id ? '#E6F1FB' : 'transparent',
                border: clienteSeleccionado?.id === c.id ? '0.5px solid #B5D4F4' : '0.5px solid transparent'}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <div style={{width:28, height:28, borderRadius:'50%', background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:500}}>
                  {c.nombre?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{fontSize:12, fontWeight:500}}>{c.nombre}</div>
                  <div style={{fontSize:10, color:'#9ca3af'}}>CC {c.cedula}</div>
                </div>
              </div>
            </div>
          ))}
          {clientes.length === 0 && (
            <div style={{fontSize:12, color:'#9ca3af', padding:'8px 10px'}}>No tienes clientes asignados</div>
          )}
        </aside>

        {/* MAIN */}
        <main style={{flex:1, padding:16, background:'#f9fafb'}}>
          {!clienteSeleccionado ? (
            <div style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', color:'#9ca3af'}}>
              <div style={{fontSize:32, marginBottom:8}}>👈</div>
              <div style={{fontSize:14}}>Selecciona un cliente para ver sus datos</div>
            </div>
          ) : (
            <div>
              {/* Header cliente */}
              <div style={{marginBottom:16}}>
                <div style={{fontSize:11, color:'#9ca3af', marginBottom:4}}>Portal Contador / Cliente</div>
                <div style={{fontSize:18, fontWeight:500}}>{clienteSeleccionado.nombre}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{clienteSeleccionado.email} · CC {clienteSeleccionado.cedula}</div>
              </div>

              {/* Tarjetas resumen */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16}}>
                {[
                  {ico:'💰', label:'Ingresos',      val:fmt(clienteSeleccionado.ingresos),         bg:'#E6F1FB'},
                  {ico:'✂',  label:'Deducciones',   val:fmt(clienteSeleccionado.deducciones),       bg:'#EAF3DE'},
                  {ico:'🧾', label:'Retenciones',   val:fmt(clienteSeleccionado.retenciones),       bg:'#FAEEDA'},
                  {ico:'📋', label:'Impuesto est.', val:fmt(clienteSeleccionado.impuesto_estimado), bg:'#FCEBEB'},
                ].map((s,i) => (
                  <div key={i} style={{background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:8, padding:'12px 14px'}}>
                    <div style={{float:'right', width:28, height:28, borderRadius:6, background:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14}}>{s.ico}</div>
                    <div style={{fontSize:11, color:'#6b7280', marginBottom:4}}>{s.label}</div>
                    <div style={{fontSize:16, fontWeight:500, color:'#0C447C'}}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Detalle calculo */}
              <div style={{background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:10, padding:'14px 16px', marginBottom:12}}>
                <div style={{fontSize:13, fontWeight:500, marginBottom:12}}>🧮 Calculo tributario</div>
                <table style={{width:'100%', borderCollapse:'collapse', fontSize:12}}>
                  <tbody>
                    {[
                      {l:'Ingresos brutos',        v:fmt(clienteSeleccionado.ingresos)},
                      {l:'(-) Rentas exentas 25%', v:'-'+fmt(clienteSeleccionado.ingresos * 0.25), c:'#A32D2D'},
                      {l:'(-) Deducciones',        v:'-'+fmt(clienteSeleccionado.deducciones), c:'#A32D2D'},
                      {l:'= Renta liquida',        v:fmt(clienteSeleccionado.ingresos - clienteSeleccionado.ingresos*0.25 - clienteSeleccionado.deducciones), c:'#0C447C'},
                      {l:'(-) Retenciones',        v:'-'+fmt(clienteSeleccionado.retenciones), c:'#27500A'},
                      {l:'Impuesto estimado',      v:fmt(clienteSeleccionado.impuesto_estimado), c:'#A32D2D'},
                    ].map((r,i) => (
                      <tr key={i}>
                        <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', color:'#6b7280'}}>{r.l}</td>
                        <td style={{padding:'8px 10px', borderBottom:'0.5px solid #f3f4f6', textAlign:'right', fontWeight:500, color:r.c||'inherit'}}>{r.v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Estado del reporte */}
              <div style={{background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:10, padding:'14px 16px', marginBottom:12}}>
                <div style={{fontSize:13, fontWeight:500, marginBottom:12}}>📋 Estado del reporte</div>
                <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
                  {[
                    {val:'pendiente',    ico:'📋', label:'Pendiente',             bg:'#f3f4f6', color:'#6b7280'},
                    {val:'en_revision',  ico:'🔍', label:'En revision',           bg:'#E6F1FB', color:'#0C447C'},
                    {val:'aprobado',     ico:'✅', label:'Aprobado',              bg:'#EAF3DE', color:'#27500A'},
                    {val:'correcciones', ico:'⚠',  label:'Requiere correcciones', bg:'#FAEEDA', color:'#633806'},
                  ].map((e,i) => (
                    <div key={i} onClick={() => cambiarEstado(clienteSeleccionado.id, e.val)}
                      style={{padding:'10px 8px', borderRadius:8, textAlign:'center', cursor:'pointer',
                        background: clienteSeleccionado.estado === e.val ? e.bg : '#f9fafb',
                        border: clienteSeleccionado.estado === e.val ? `1.5px solid ${e.color}` : '0.5px solid #e5e7eb',
                        color: clienteSeleccionado.estado === e.val ? e.color : '#6b7280'}}>
                      <div style={{fontSize:18, marginBottom:4}}>{e.ico}</div>
                      <div style={{fontSize:10, fontWeight:500}}>{e.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notas */}
              <div style={{background:'#fff', border:'0.5px solid #e5e7eb', borderRadius:10, padding:'14px 16px'}}>
                <div style={{fontSize:13, fontWeight:500, marginBottom:8}}>📌 Notas del contador</div>
                <textarea placeholder="Agrega observaciones para este cliente..."
                  style={{width:'100%', padding:'8px 10px', borderRadius:6, border:'0.5px solid #e5e7eb', background:'#f9fafb', fontSize:12, resize:'vertical', minHeight:80, outline:'none', boxSizing:'border-box'}} />
                <button style={{marginTop:8, padding:'8px 14px', borderRadius:6, fontSize:12, fontWeight:500, cursor:'pointer', background:'#185FA5', color:'#fff', border:'none'}}>
                  Guardar nota
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}