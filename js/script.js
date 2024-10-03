document.addEventListener('DOMContentLoaded', function() {
    fetch('https://japceibal.github.io/japflix_api/movies-data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al fetchear el JSON");
            }
            return response.json();
        })
        .then(data => {
            const boton = document.getElementById("btnBuscar");
            const body = document.body; // Referencia al body para agregar el offcanvas

            function estrellas(numero) {
                if (numero <= 2) {
                    return '<span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
                } else if (numero <= 4) {
                    return '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
                } else if (numero <= 6) {
                    return '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>';
                } else if (numero <= 8) {
                    return '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star"></span>';
                } else {
                    return '<span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span><span class="fa fa-star checked"></span>';
                }
            }

            boton.addEventListener('click', function() {
                let busqueda = document.getElementById('inputBuscar').value.toLowerCase().trim();
                let listado = document.getElementById("lista");
                listado.innerHTML = ""; // Limpia resultados previos
                if (busqueda != "") {
                    let pelisFiltradas = data.filter(movie => movie.title.toLowerCase().includes(busqueda));
                    if (pelisFiltradas.length != 0) {
                        pelisFiltradas.forEach(movie => {
                            const li = document.createElement('li');
                            li.className = 'list-group-item text-white bg-dark';
                            li.innerHTML = `
                                <div class="d-flex justify-content-between align-items-center">
                                    <h4 class="mb-0">${movie.title}</h4>
                                    <div class="text-end">${estrellas(movie.vote_average)}</div>
                                </div>
                                <span class="tagline">${movie.tagline}</span>
                            `; // Crea el elemento li

                            // Agrega el event listener al elemento li
                            li.addEventListener('click', function() {
                                // Crea el offcanvas
                                let generos = "";
                                const anio = new Date(movie.release_date).getFullYear(); // Obtener el año correctamente
                                for (let i = 0; i < movie.genres.length - 1; i++) {
                                    generos += movie.genres[i].name + " - ";
                                }
                                generos += movie.genres[movie.genres.length - 1].name;

                                // Genera un ID único para el offcanvas
                                const offcanvasId = 'offcanvasTop_' + movie.id; // Suponiendo que movie.id es único
                                const offcanvasHTML = `
                                    <div class="offcanvas offcanvas-top" tabindex="-1" id="${offcanvasId}" aria-labelledby="offcanvasTopLabel">
                                        <div class="offcanvas-header">
                                            <h5 id="offcanvasTopLabel">${movie.title}</h5>
                                            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                        </div>
                                        <div class="offcanvas-body mb-0">
                                            <p>${movie.overview}</p>
                                            <hr>
                                            <p class="generos mb-0">${generos}</p>   
                                        </div>
                                        <div class="dropdown d-flex justify-content-between align-items-center ms-auto">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                More
                                            </button>
                                            <ul class="dropdown-menu">
                                                <li><p class="dropdown-item">Year: ${anio}</p></li>
                                                <li><p class="dropdown-item">Runtime: ${movie.runtime} min</p></li>
                                                <li><p class="dropdown-item">Budget: $${movie.budget}</p></li>
                                                <li><p class="dropdown-item">Revenue: $${movie.revenue}</p></li>
                                            </ul>
                                        </div>
                                    </div>`;
                                
                                // Limpia el offcanvas anterior si existe
                                const existingOffcanvas = document.getElementById(offcanvasId);
                                if (existingOffcanvas) {
                                    existingOffcanvas.remove(); // Elimina el offcanvas anterior
                                }

                                // Añade el nuevo offcanvas al body
                                body.insertAdjacentHTML('beforeend', offcanvasHTML);
                                
                                // Inicializa el offcanvas de Bootstrap y lo muestra
                                const offcanvas = new bootstrap.Offcanvas(document.getElementById(offcanvasId));
                                offcanvas.show();
                                
                                // Limpia el offcanvas después de cerrarlo
                                document.getElementById(offcanvasId).addEventListener('hidden.bs.offcanvas', function() {
                                    this.remove(); // Elimina el offcanvas del DOM
                                });
                            });

                            listado.appendChild(li); // Agrega el li al listado
                            document.getElementById('inputBuscar').value = ""
                        });
                    } else {
                        listado.innerHTML = '<li class="list-group-item text-white bg-dark">No se encontraron resultados.</li>'; // Mensaje si no hay resultados
                    }
                } else {
                    listado.innerHTML = '<li class="list-group-item text-white bg-dark">Debe ingresar un texto para comenzar la búsqueda.</li>'; // Mensaje si no hay resultados
                }
            });
        })
        .catch(error => console.error("Error:", error));
});






