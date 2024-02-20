document.addEventListener("DOMContentLoaded", () => {
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
            const response = await fetch("/verificar-credenciales2", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, contraseña })
            });

            if (response.status === 200) {
                // Si el inicio de sesión es exitoso, redirigir o mostrar un mensaje de éxito
                window.location.href = "/admin";
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
});
