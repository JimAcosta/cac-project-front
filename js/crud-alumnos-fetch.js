const BASEURL = 'http://127.0.0.1:5000';

async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null,
    };
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Ocurrió un error al obtener los datos. Por favor, inténtalo nuevamente.');
        throw error; // Re-lanzar el error para que sea manejado en el lugar donde se llama fetchData
    }
}

async function showAlumnos() {
    try {
        const url = `${BASEURL}/api/alumnos/?t=${new Date().getTime()}`;
        const alumnos = await fetchData(url, 'GET');
        const tableBody = document.querySelector('#tabla-estudiantes tbody');
        tableBody.innerHTML = ''; 

        alumnos.forEach(alumno => {
            const tr = `
                <tr>
                    <td>${alumno.nombre}</td>
                    <td>${alumno.apellido}</td>
                    <td>${alumno.telefono}</td>
                    <td>${alumno.email}</td>
                </tr>`;
            tableBody.insertAdjacentHTML('beforeend', tr);
        });
    } catch (error) {
        console.error('Error al mostrar alumnos:', error);
    }
}

async function addAlumno(event) {
    event.preventDefault();

    const form = document.getElementById('registroForm');
    const data = {
        nombre: form.nombre.value,
        apellido: form.apellido.value,
        telefono: form.telefono.value,
        email: form.email.value
    };

    try {
        const result = await fetchData(`${BASEURL}/api/alumnos/add`, 'POST', data);
        if (result) {
            alert('Alumno registrado exitosamente');
            form.reset();
            await showAlumnos();  // Actualizar la lista de alumnos después de agregar uno nuevo
        }
    } catch (error) {
        console.error('Error al registrar alumno:', error);
        alert('Ocurrió un error al registrar el alumno. Por favor, inténtalo nuevamente.');
    }
}

async function deleteAlumno(event) {
    event.preventDefault();

    const form = document.getElementById('bajaForm');
    if (!form) {
        console.error('Formulario de baja no encontrado');
        return;
    }

    const email = form.correo.value;

    try {
        const url = `${BASEURL}/api/alumnos/delete/${encodeURIComponent(email)}`; // Codificar el correo electrónico en la URL
        console.log('URL de la solicitud DELETE:', url);
        
        const result = await fetchData(url, 'DELETE');
        
        if (result.message) {
            alert(result.message);
            form.reset();
            //await showAlumnos();  // Actualizar la lista de alumnos después de eliminar uno
        }
    } catch (error) {
        console.error('Error al eliminar alumno:', error);
        alert('Ocurrió un error al eliminar el alumno. Por favor, inténtalo nuevamente.');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showAlumnos();

    const form = document.getElementById('registroForm');
    if (form) {
        form.addEventListener('submit', addAlumno);
    } else {
        console.error('Formulario de registro no encontrado');
    }

    const deleteForm = document.getElementById('bajaForm');
    if (deleteForm) {
        deleteForm.addEventListener('submit', deleteAlumno);
    } else {
        console.error('Formulario de baja no encontrado');
    }
});