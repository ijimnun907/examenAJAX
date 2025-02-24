document.addEventListener('DOMContentLoaded', main);

function main() {
    let selectComunidades = document.createElement('select');
    selectComunidades.setAttribute('id', 'comunidades');
    let selectProvincias = document.createElement('select');
    selectProvincias.setAttribute('id', 'provincias');
    let selectLocalidades = document.createElement('select');
    selectLocalidades.setAttribute('id', 'localidades');
    let cajaGasolineras = document.querySelector(".table-container tbody");
    cargarComunidades(selectComunidades);
    selectComunidades.addEventListener('change', () => {
        if (selectComunidades.value !== "null"){
            selectProvincias.innerHTML = "<option value='null'>Selecciona una Provincia</option>";
            cargarProvincias(selectProvincias, selectComunidades.value);
        }
        else {
            selectProvincias.innerHTML = "<option>Selecciona una CCAA primero</option>";
            selectLocalidades.innerHTML = "<option>Selecciona una Provincia primero</option>";
            cajaGasolineras.innerHTML = "";
            console.log('Selecciona algo');
        }
    });

    selectProvincias.addEventListener('change', () => {
        if (selectProvincias.value !== "null"){
            selectLocalidades.innerHTML = "<option value='null'>Selecciona una Localidad</option>";
            cargarLocalidades(selectLocalidades, selectProvincias.value);
        }
        else {
            selectLocalidades.innerHTML = "<option>Selecciona una Provincia primero</option>";
            cajaGasolineras.innerHTML = "";
            console.log("Selecciona algo");
        }
    });



    let tituloFecha = document.querySelector(".table-container h2");

    selectLocalidades.addEventListener('change', () => {
        if (selectLocalidades.value !== "null"){
            cajaGasolineras.innerHTML = "";
            cargarGasolineras(cajaGasolineras, selectLocalidades.value, tituloFecha);
        }
        else {
            cajaGasolineras.innerHTML = "";
            console.log("Selecciona algo");
        }
    });
}

function cargarComunidades(select) {
    let solicitud;
    let url = "https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/";
    try {
        solicitud = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    }
    catch (e) {
        alert(e);
    }
    solicitud.addEventListener('load', (e) => {
        if (e.target.status == 200){
            let comunidades = JSON.parse(solicitud.responseText);
            let caja = document.getElementById('divComunidad');
            select.appendChild(new Option('Seleccione una comunidad', null));
            comunidades.forEach(com => {
                let opcion = new Option(com.CCAA, com.IDCCAA);
                select.appendChild(opcion);
            });
            caja.appendChild(select);
        }
    });
    solicitud.addEventListener('progress', () => {console.log('cargando...')});
    solicitud.open('GET', url);
    solicitud.send();
}

function cargarProvincias(select, idComunidad) {
    let solicitud;
    let url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/${idComunidad}`;
    try {
        solicitud = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    }
    catch (e) {
        alert(e);
    }
    solicitud.addEventListener('load', (e) => {
        if (e.target.status == 200){
            let provincias = JSON.parse(solicitud.responseText);
            let caja = document.getElementById('divProvincia');
            provincias.forEach(pro => {
                let opcion = new Option(pro.Provincia, pro.IDPovincia);
                select.appendChild(opcion);
            });
            caja.appendChild(select);
        }
    });
    solicitud.addEventListener('progress', () => {console.log('cargando...')});
    solicitud.open('GET', url);
    solicitud.send();
}

function cargarLocalidades(select, idProvincia) {
    let solicitud;
    let url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/MunicipiosPorProvincia/${idProvincia}`;
    try {
        solicitud = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    }
    catch (e) {
        alert(e);
    }
    solicitud.addEventListener('load', (e) => {
        if (e.target.status == 200){
            let localidades = JSON.parse(solicitud.responseText);
            let caja = document.getElementById('divLocalidad');
            console.log(localidades);
            localidades.forEach(loc => {
                let opcion = new Option(loc.Municipio, loc.IDMunicipio);
                select.appendChild(opcion);
            });
            caja.appendChild(select);
        }
    });
    solicitud.addEventListener('progress', () => {console.log('cargando...')});
    solicitud.open('GET', url);
    solicitud.send();
}

function cargarGasolineras(caja, idLocalidad, tituloFecha) {
    let solicitud;
    let url = `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/FiltroMunicipio/${idLocalidad}`;
    try {
        solicitud = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    }
    catch (e) {
        alert(e);
    }
    solicitud.addEventListener('load', (e) => {
        if (e.target.status == 200){
            let gasolineras = JSON.parse(solicitud.responseText);
            let listaPrecios = gasolineras.ListaEESSPrecio;
            tituloFecha.innerText = "Precios Actuales " + gasolineras.Fecha;
            console.log(gasolineras);
            console.log(listaPrecios);
            listaPrecios.forEach(pre => {
                let fila = document.createElement('tr');
                let estacion = document.createElement('td');
                estacion.textContent = pre["Rótulo"];
                let direccion = document.createElement('td');
                direccion.textContent = pre["Dirección"];
                let horario = document.createElement('td');
                horario.textContent = pre.Horario;
                let gasolina95 = document.createElement('td');
                gasolina95.textContent = pre["Precio Gasolina 95 E5"];
                let gasolina98 = document.createElement('td');
                gasolina98.textContent = pre["Precio Gasolina 98 E5"];
                let gasoleoA = document.createElement('td');
                gasoleoA.textContent = pre["Precio Gasoleo A"];
                let gasoleoAplus = document.createElement('td');
                gasoleoAplus.textContent = pre["Precio Gasoleo Premium"];
                let gasoleoB = document.createElement('td');
                gasoleoB.textContent = pre["Precio Gasoleo B"];
                let celdas = [estacion, direccion, horario, gasolina95, gasolina98, gasoleoA, gasoleoAplus, gasoleoB];
                celdas.forEach(celda => {
                    fila.appendChild(celda);
                });
                caja.appendChild(fila);
            });
        }
    });
    solicitud.addEventListener('progress', () => {console.log('cargando...')});
    solicitud.open('GET', url);
    solicitud.send();
}