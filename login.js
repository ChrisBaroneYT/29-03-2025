// Configuración
const SUPABASE_URL = 'https://ptquukigajsgnuvhefwe.supabase.co'; // Cambia por tu URL de Supabase
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0cXV1a2lnYWpzZ251dmhlZndlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMyNjQzNTgsImV4cCI6MjA1ODg0MDM1OH0.r38AqnrfsPddbtxQTKR2brNZu3ZApraqc2_ujBJO_0s';

// Función para obtener datos de usuario en el login
async function loginUser(identificacion, password) {
  try {
    console.log('\nVerificando datos de usuario...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios?identificacion=eq.${identificacion}&clave_encriptada=eq.${password}`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const user = await response.json();

    if (user.length === 0) {
      throw new Error('Usuario o contraseña incorrectos');
    }

    // Usuario encontrado
    console.log('\n✅ Usuario autenticado correctamente');
    console.log(user);

    return user[0];  // Retorna el primer usuario encontrado

  } catch (error) {
    console.error('\n❌ Error al autenticar usuario:');
    console.error(error.message);
    return null;
  }
}

// Función para registrar un nuevo usuario
async function registerUser(userData) {
  try {
    console.log('\nRegistrando nuevo usuario...');

    const response = await fetch(`${SUPABASE_URL}/rest/v1/usuarios`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify([userData])
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const newUser = await response.json();

    console.log('\n✅ Usuario registrado correctamente');
    console.log(newUser);

    return newUser[0];  // Retorna el usuario registrado

  } catch (error) {
    console.error('\n❌ Error al registrar usuario:');
    console.error(error.message);
    return null;
  }
}

// Ejemplo de uso (modificar los datos del formulario y los botones según tu interfaz)

// Función para manejar el login
async function handleLogin() {
  const identificacion = document.getElementById('loginIdentificacion').value;
  const password = document.getElementById('loginPassword').value;

  const user = await loginUser(identificacion, password);

  if (user) {
    // Si el usuario existe, mostrar mensaje de bienvenida
    document.getElementById('welcomeTitle').textContent = `Bienvenido, ${user.nombre_usuario}`;
    document.getElementById('userInfo').innerHTML = `
      <strong>Email:</strong> ${user.email}<br>
      <strong>Tipo:</strong> ${user.usuario_superadministrador ? 'Super Admin' :
        user.usuario_administrador ? 'Administrador' : 'Usuario Normal'}
    `;

    // Ocultar formulario de login y mostrar panel de bienvenida
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('welcomePanel').style.display = 'block';
  }
}

// Función para manejar el registro
async function handleRegister() {
  const userData = {
    identificacion: document.getElementById('regIdentificacion').value,
    nombre_usuario: document.getElementById('regNombre').value,
    clave_encriptada: document.getElementById('regPassword').value,  // En este ejemplo no encriptamos la clave
    usuario_normal: document.getElementById('regTipoUsuario').value === 'normal' ? 1 : 0,
    usuario_administrador: document.getElementById('regTipoUsuario').value === 'admin' ? 1 : 0,
    usuario_superadministrador: document.getElementById('regTipoUsuario').value === 'superadmin' ? 1 : 0,
    email: document.getElementById('regEmail').value,
  };

  const newUser = await registerUser(userData);

  if (newUser) {
    // Si el registro fue exitoso, mostrar un mensaje
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    document.getElementById('registerForm').reset();  // Limpiar formulario
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
  }
}

// Asociar los eventos de login y registro a los botones
document.getElementById('loginBtn').addEventListener('click', handleLogin);
document.getElementById('registerBtn').addEventListener('click', handleRegister);

// Función para cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', () => {
  document.getElementById('welcomePanel').style.display = 'none';
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('loginForm').reset();
});
