import { useState, useEffect } from 'react';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');

  // La URL base cambiará cuando esté en AWS, por ahora apunta al localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://backend-alb-2142126348.us-east-1.elb.amazonaws.com/api/usuarios';

  const cargarUsuarios = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setUsuarios(data);
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const agregarUsuario = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email })
    });
    setNombre(''); setEmail('');
    cargarUsuarios();
  };

  const eliminarUsuario = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  };

  return (
    <div className="p-8 font-sans max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios - Innovatech</h1>
      
      {/* Formulario */}
      <form onSubmit={agregarUsuario} className="mb-8 p-4 border rounded bg-gray-50">
        <input 
          className="border p-2 mr-2" placeholder="Nombre" 
          value={nombre} onChange={e => setNombre(e.target.value)} required 
        />
        <input 
          className="border p-2 mr-2" placeholder="Email" 
          value={email} onChange={e => setEmail(e.target.value)} required 
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Agregar</button>
      </form>

      {/* Lista */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th><th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th><th className="p-2 border">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id}>
              <td className="p-2 border">{u.id}</td><td className="p-2 border">{u.nombre}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <button onClick={() => eliminarUsuario(u.id)} className="text-red-500 underline">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default App;