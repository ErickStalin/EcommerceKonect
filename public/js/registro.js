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

document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    
    // Obtener los valores del formulario
    const email = document.getElementById("email").value;
    const contraseña = document.getElementById("contraseña").value;

    // Crear un objeto con las credenciales para enviar al servidor
    const credenciales = {
        email: email,
        contraseña: contraseña
    };

    try {
        // Enviar las credenciales al servidor para verificar
        const response = await fetch("/verificar-credenciales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(credenciales)
        });

        if (response.status === 200) {
            // Si el inicio de sesión es exitoso, redirigir o mostrar un mensaje de éxito
            window.location.href = "/edicion";
            const data = await response.json();
            console.log(data.mensaje); // Mensaje del servidor
            // Puedes redirigir al usuario a la página de inicio de sesión exitoso o realizar otras acciones necesarias aquí.
        } else if (response.status === 401) {
            // Si las credenciales son incorrectas, mostrar un mensaje de error
            console.log("Credenciales incorrectas");
            // Puedes mostrar un mensaje de error al usuario o realizar otras acciones necesarias aquí.
        } else {
            console.log("Error desconocido");
            // Puedes manejar otros códigos de estado de respuesta según sea necesario.
        }
    } catch (error) {
        console.error("Error al enviar las credenciales al servidor: " + error.message);
    }
});
