// Variable para contar los intentos de inicio de sesión
let intentosInicioSesion = 3;

// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility() {
    const passwordField = document.getElementById('contraseña');
    const toggleBtn = document.getElementById('toggle-password');
    const label = document.getElementById('contraseña-label');

    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        label.classList.add('label-hidden');
    } else {
        passwordField.type = 'password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        label.classList.remove('label-hidden');
    }
}

// Función para manejar el envío del formulario de inicio de sesión
document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    try {
        // Enviar las credenciales al servidor para verificar
        const response = await fetch("/verificar-credenciales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, contraseña })
        });

        if (response.status === 200) {
            // Si el inicio de sesión es exitoso, redirigir o mostrar un mensaje de éxito
            window.location.href = "/edicion";
            const data = await response.json();
            console.log(data.mensaje); // Mensaje del servidor
            // Eliminar la cookie de sesión
            document.cookie = "connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            // Puedes redirigir al usuario a la página de inicio de sesión exitoso o realizar otras acciones necesarias aquí.
        } else if (response.status === 401) {
            // Si las credenciales son incorrectas, mostrar un mensaje de error
            console.log("Credenciales incorrectas");
            // Puedes mostrar un mensaje de error al usuario o realizar otras acciones necesarias aquí.
            alert("Credenciales incorrectas. Te quedan " + (--intentosInicioSesion) + " intentos.");

            // Deshabilitar el formulario después de tres intentos fallidos
            if (intentosInicioSesion === 0) {
                document.getElementById("email").disabled = true;
                document.getElementById("contraseña").disabled = true;
                document.querySelector('button[type="submit"]').disabled = true;
            }
        } else {
            console.log("Error desconocido");
            // Puedes manejar otros códigos de estado de respuesta según sea necesario.
        }
    } catch (error) {
        console.error("Error al enviar las credenciales al servidor: " + error.message);
    }
});

// JavaScript para el formulario de inicio de sesión
document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const requestCredentialsLink = document.getElementById("request-credentials-link");
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const requestCredentialsForm = document.getElementById("request-credentials-form");

    forgotPasswordLink.addEventListener("click", (event) => {
        event.preventDefault();
        // Mostrar el formulario de olvidar contraseña
        forgotPasswordForm.style.display = "block";
        // Ocultar otros formularios si es necesario
        requestCredentialsForm.style.display = "none";
    });

    requestCredentialsLink.addEventListener("click", (event) => {
        event.preventDefault();
        // Mostrar el formulario de solicitud de credenciales a gerencia
        requestCredentialsForm.style.display = "block";
        // Ocultar otros formularios si es necesario
        forgotPasswordForm.style.display = "none";
    });
});

// Función para enviar la solicitud de restablecimiento de contraseña
function sendPasswordResetEmail() {
    // Aquí puedes implementar la lógica para enviar el correo electrónico de restablecimiento de contraseña
    console.log("Enviar correo electrónico de restablecimiento de contraseña");
}

async function sendCredentialsRequest() {
    // Obtener los datos del formulario
    const identificacion = document.getElementById("identificacion").value;
    const nombre = document.getElementById("nombre").value;
    const motivo = document.getElementById("motivo").value;

    // Crear el objeto con los datos del formulario
    const datos = {
        identificacion: identificacion,
        nombre: nombre,
        motivo: motivo
    };

    try {
        // Enviar la solicitud al servidor (aquí se supone que el servidor se encargará de enviar el correo electrónico)
        const response = await fetch("/solicitar-credenciales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            // La solicitud se envió con éxito
            console.log("La solicitud de credenciales se envió con éxito.");
            // Mostrar alerta de éxito
            alert("La solicitud de credenciales se envió con éxito.");
            // Recargar la página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            // Hubo un problema al enviar la solicitud
            console.error("Hubo un problema al enviar la solicitud de credenciales.");
            // Mostrar mensaje de error al usuario
            alert("Hubo un problema al enviar la solicitud de credenciales. Por favor, inténtalo de nuevo.");
        }
    } catch (error) {
        // Error al enviar la solicitud
        console.error("Error al enviar la solicitud de credenciales:", error);
        // Mostrar mensaje de error al usuario
        alert("Error al enviar la solicitud de credenciales. Por favor, inténtalo de nuevo.");
    }
}
