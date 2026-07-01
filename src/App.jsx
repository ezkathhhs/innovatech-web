import { useState, useEffect } from 'react';

function App() {
  const [vista, setVista] = useState('usuarios');

  // ==========================================
  // LÓGICA DE USUARIOS
  // ==========================================
  const [usuarios, setUsuarios] = useState([]);
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');

  const API_URL_USUARIOS = import.meta.env.VITE_API_URL_USUARIOS || 'http://backend-alb-v2-974296197.us-east-1.elb.amazonaws.com:8080/api/usuarios';

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_URL_USUARIOS);
      if(res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) { console.error("Error al cargar usuarios:", error); }
  };

  const agregarUsuario = async (e) => {
    e.preventDefault();
    await fetch(API_URL_USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nombreUsuario, email: emailUsuario })
    });
    setNombreUsuario(''); setEmailUsuario('');
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await fetch(`${API_URL_USUARIOS}/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  };

  // ==========================================
  // LÓGICA DE PRODUCTOS (PERFUMES)
  // ==========================================
  const [productos, setProductos] = useState([]);
  const [nombreProd, setNombreProd] = useState('');
  const [marca, setMarca] = useState('');
  const [familia, setFamilia] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  // Apunta a la misma URL del ALB, pero con la ruta /api/productos
  const API_URL_PRODUCTOS = import.meta.env.VITE_API_URL_PRODUCTOS || 'http://backend-alb-v2-974296197.us-east-1.elb.amazonaws.com:8080/api/productos';

  const cargarProductos = async () => {
    try {
      const res = await fetch(API_URL_PRODUCTOS);
      if(res.ok) {
        const data = await res.json();
        setProductos(data);
      }
    } catch (error) { console.error("Error al cargar productos:", error); }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    await fetch(API_URL_PRODUCTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre: nombreProd, 
        marca: marca, 
        familiaOlfativa: familia, 
        precio: parseFloat(precio), 
        stock: parseInt(stock) 
      })
    });
    setNombreProd(''); setMarca(''); setFamilia(''); setPrecio(''); setStock('');
    cargarProductos();
  };

  const eliminarProducto = async (id) => {
    await fetch(`${API_URL_PRODUCTOS}/${id}`, { method: 'DELETE' });
    cargarProductos();
  };

  // Cargar ambos datos al iniciar la app
  useEffect(() => { 
    cargarUsuarios(); 
    cargarProductos();
  }, []);

  // ==========================================
  // RENDERIZADO VISUAL
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      
      {/* HEADER PRINCIPAL */}
      <header className="bg-purple-700 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">✨ Perfulandia Admin</h1>
          <nav className="space-x-4">
            <button
              onClick={() => setVista('usuarios')}
              className={`px-4 py-2 rounded transition-colors ${vista === 'usuarios' ? 'bg-purple-900 font-semibold' : 'hover:bg-purple-600'}`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setVista('productos')}
              className={`px-4 py-2 rounded transition-colors ${vista === 'productos' ? 'bg-purple-900 font-semibold' : 'hover:bg-purple-600'}`}
            >
              Catálogo
            </button>
          </nav>
        </div>
      </header>

      {/* CONTENIDO CENTRAL */}
      <main className="flex-grow w-full max-w-6xl mx-auto p-6">
        
        {/* VISTA: GESTIÓN DE USUARIOS */}
        {vista === 'usuarios' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">Gestión de Clientes</h2>

            <form onSubmit={agregarUsuario} className="mb-8 flex flex-wrap md:flex-nowrap gap-4 items-end bg-purple-50 p-5 rounded-md border border-purple-100 shadow-inner">
              <div className="flex-grow w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none" placeholder="Ej. Matías Rodrigo" value={nombreUsuario} onChange={e => setNombreUsuario(e.target.value)} required />
              </div>
              <div className="flex-grow w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none" type="email" placeholder="usuario@ejemplo.com" value={emailUsuario} onChange={e => setEmailUsuario(e.target.value)} required />
              </div>
              <button type="submit" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors h-10">
                Agregar Usuario
              </button>
            </form>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b font-semibold">ID</th><th className="p-4 border-b font-semibold">Nombre</th><th className="p-4 border-b font-semibold">Email</th><th className="p-4 border-b font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-500">No hay usuarios registrados.</td></tr>
                  ) : (
                    usuarios.map(u => (
                      <tr key={u.id} className="hover:bg-purple-50 transition-colors">
                        <td className="p-4 text-gray-500">#{u.id}</td><td className="p-4 font-medium text-gray-800">{u.nombre}</td><td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4 text-right">
                          <button onClick={() => eliminarUsuario(u.id)} className="text-red-500 hover:text-red-700 font-medium bg-red-50 px-3 py-1 rounded border border-red-100 hover:bg-red-100 transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA: CATÁLOGO DE PERFUMES */}
        {vista === 'productos' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-fade-in">
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">Catálogo de Perfumes</h2>

            {/* Formulario de Productos */}
            <form onSubmit={agregarProducto} className="mb-8 flex flex-col gap-4 bg-purple-50 p-5 rounded-md border border-purple-100 shadow-inner">
              <div className="flex flex-wrap md:flex-nowrap gap-4">
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 outline-none" placeholder="Ej. Acqua di Gio" value={nombreProd} onChange={e => setNombreProd(e.target.value)} required />
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                  <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 outline-none" placeholder="Ej. Giorgio Armani" value={marca} onChange={e => setMarca(e.target.value)} required />
                </div>
                <div className="flex-grow">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Familia Olfativa</label>
                  <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 outline-none" placeholder="Ej. Cítrico" value={familia} onChange={e => setFamilia(e.target.value)} required />
                </div>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-4 items-end">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                  <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 outline-none" type="number" step="0.01" min="0" placeholder="0.00" value={precio} onChange={e => setPrecio(e.target.value)} required />
                </div>
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 outline-none" type="number" min="0" placeholder="0" value={stock} onChange={e => setStock(e.target.value)} required />
                </div>
                <button type="submit" className="w-full md:w-1/3 bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors h-10">
                  Agregar Perfume
                </button>
              </div>
            </form>

            {/* Tabla de Productos */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b font-semibold">ID</th><th className="p-4 border-b font-semibold">Producto</th><th className="p-4 border-b font-semibold">Familia</th><th className="p-4 border-b font-semibold">Precio / Stock</th><th className="p-4 border-b font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {productos.length === 0 ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">No hay perfumes registrados.</td></tr>
                  ) : (
                    productos.map(p => (
                      <tr key={p.id} className="hover:bg-purple-50 transition-colors">
                        <td className="p-4 text-gray-500">#{p.id}</td>
                        <td className="p-4">
                          <div className="font-medium text-gray-800">{p.nombre}</div>
                          <div className="text-xs text-gray-500">{p.marca}</div>
                        </td>
                        <td className="p-4 text-gray-600">{p.familiaOlfativa}</td>
                        <td className="p-4 text-gray-600">${p.precio} <span className="text-xs ml-1 bg-gray-200 px-2 py-1 rounded-full">{p.stock} uds</span></td>
                        <td className="p-4 text-right">
                          <button onClick={() => eliminarProducto(p.id)} className="text-red-500 hover:text-red-700 font-medium bg-red-50 px-3 py-1 rounded border border-red-100 hover:bg-red-100 transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-300 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} Perfulandia. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0 text-gray-500">Sistema de Administración Interna</p>
        </div>
      </footer>
    </div>
  );
}

export default App;