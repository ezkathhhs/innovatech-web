import { useState, useEffect } from 'react';

function App() {
  const [vista, setVista] = useState('usuarios'); // Controla si vemos 'usuarios' o 'productos'

  // --- ESTADOS Y LÓGICA DE USUARIOS ---
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  const API_URL_USUARIOS = import.meta.env.VITE_API_URL || 'http://backend-alb-v2-974296197.us-east-1.elb.amazonaws.com:8080/api/usuarios';

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(API_URL_USUARIOS);
      const data = await res.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const agregarUsuario = async (e) => {
    e.preventDefault();
    await fetch(API_URL_USUARIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email })
    });
    setNombre(''); setEmail('');
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await fetch(`${API_URL_USUARIOS}/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  };

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
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-6 border-b pb-2">Gestión de Clientes</h2>

            {/* Formulario Estilizado */}
            <form onSubmit={agregarUsuario} className="mb-8 flex gap-4 items-end bg-purple-50 p-5 rounded-md border border-purple-100 shadow-inner">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  placeholder="Ej. Matías Rodrigo"
                  value={nombre} onChange={e => setNombre(e.target.value)} required
                />
              </div>
              <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                <input
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                  type="email"
                  placeholder="usuario@ejemplo.com"
                  value={email} onChange={e => setEmail(e.target.value)} required
                />
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2 rounded-md transition-colors h-10">
                Agregar Usuario
              </button>
            </form>

            {/* Tabla Estilizada */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b font-semibold">ID</th>
                    <th className="p-4 border-b font-semibold">Nombre</th>
                    <th className="p-4 border-b font-semibold">Email</th>
                    <th className="p-4 border-b font-semibold text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500 bg-gray-50">
                        No hay usuarios registrados en la base de datos.
                      </td>
                    </tr>
                  ) : (
                    usuarios.map(u => (
                      <tr key={u.id} className="hover:bg-purple-50 transition-colors">
                        <td className="p-4 text-gray-500">#{u.id}</td>
                        <td className="p-4 font-medium text-gray-800">{u.nombre}</td>
                        <td className="p-4 text-gray-600">{u.email}</td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => eliminarUsuario(u.id)} 
                            className="text-red-500 hover:text-red-700 font-medium transition-colors bg-red-50 px-3 py-1 rounded border border-red-100 hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VISTA: CATÁLOGO DE PERFUMES (EN CONSTRUCCIÓN) */}
        {vista === 'productos' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <span className="text-5xl mb-4">📦</span>
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">Catálogo de Perfumes</h2>
            <p className="text-gray-500 text-center max-w-md">
              Este módulo está en construcción. Aquí integraremos el nuevo microservicio <strong>ProductoService</strong> en la siguiente fase de desarrollo.
            </p>
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