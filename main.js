// Pelicula Class: representa una pelicula
class Pelicula{
    constructor(titulo,director,orden){
        this.titulo = titulo;
        this.director = director;
        this.orden = orden;
    }
}

//UI Class : Maneja las tareas del UI
class UI{
    static mostrarPeliculas(){
        const peliculas = Store.getPeliculas();

        peliculas.forEach((pelicula) => UI.agregarPeliculaALista(pelicula));
    }

    static agregarPeliculaALista(pelicula){
        const list = document.querySelector('#peliculas-list');

        const row = document.createElement('tr');

        row.innerHTML =`
            <td>${pelicula.titulo}</td>
            <td>${pelicula.director}</td>
            <td>${pelicula.orden}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
    static borrarPelicula(el){
        if (el.classList.contains('delete')){
            //Necesito el padre del padre del elemento
            el.parentElement.parentElement.remove();
        }
    }

    //Crear elemento (div) para mostrar el mensaje de error
    static showAlert(mensaje, className){
        const div = document.createElement('div');
        div.className =`alert alert-${className}`;
        div.appendChild(document.createTextNode(mensaje));
        const container = document.querySelector('.container');
        const form = document.querySelector('#film-form');
        container.insertBefore(div,form);
        //Desaparece en 4 segundos
        setTimeout(() => document.querySelector('.alert').remove(),4000);
    }
    
    static limpiarCampos(){
        document.querySelector('#titulo').value = '';
        document.querySelector('#director').value = '';
        document.querySelector('#orden').value = '';
    }
}

//Store Class : Maneja LocalStorage
class Store{
    static getPeliculas(){
        let peliculas;
        if (localStorage.getItem('peliculas') === null){
            peliculas = [];
        } else{
            peliculas = JSON.parse(localStorage.getItem('peliculas'));
        }
        return peliculas;
    }
    
    static agregarPelicula(pelicula){
        const peliculas = Store.getPeliculas();

        peliculas.push(pelicula);
        
        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    }

    static eliminarPelicula(orden){
        const peliculas = Store.getPeliculas();

        peliculas.forEach((pelicula,index) => {
            if (pelicula.orden === orden){
                peliculas.splice(index,1);
            }
        });

        localStorage.setItem('peliculas', JSON.stringify(peliculas));
    }
}
//Mostrar peliculas

document.addEventListener('DOMContentLoaded', UI.mostrarPeliculas);

//Agregar pelicula

document.querySelector('#film-form').addEventListener('submit', (e) =>
{
    e.preventDefault();

    //Tomar los valores del form

    const titulo = document.querySelector('#titulo').value;
    const director = document.querySelector('#director').value;
    const orden = document.querySelector('#orden').value;

    //Validacion

    if (titulo === '' || director === '' || orden === ''){
        UI.showAlert('Por favor ingresa informacion en todos los campos','danger');
    } else{
        //Instanciar pelicula

        const pelicula = new Pelicula(titulo,director,orden);

        //Agregar pelicula al UI

        UI.agregarPeliculaALista(pelicula);
        
        //Agregar pelicula al store
        Store.agregarPelicula(pelicula);
        
        //Mostrar mensaje de que fue exitoso cuando agrego una pelicula

        UI.showAlert('Pelicula agregada', 'success');

        //Limpiar los campos del form
        UI.limpiarCampos();
    }
});

//Eliminar una pelicula

document.querySelector('#peliculas-list').addEventListener('click', (e) =>
{
    //Eliminar pelicula del UI
    UI.borrarPelicula(e.target);

    //Eliminar pelicula del Store
    Store.eliminarPelicula(e.target.parentElement.previousElementSibling.textContent);

    //Mostrar mensaje de que se elimino correctamente
    UI.showAlert('Pelicula eliminada correctamente','info');
});
