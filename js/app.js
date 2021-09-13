// Constant Variables
const formulario = document.querySelector('#cotizar-seguro');

// Constructores
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}
//Realizar la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function() {
    /*
        **** PRECIOS BASES ****
        1 = Americano 1.15
        2 = Asiatico 1.05
        3 = Europeo 1.35
    */
    let cantidad;
    const base = 2000;

    switch(this.marca) {
        case '1':
            cantidad = base * 1.15;
            break;
        case '2':
            cantidad = base * 1.05;
            break;
        case '3':
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;

    // Cada año que la diferencia es mayor, el costo se reduce 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /* 
        Si el seguro es básico se multiplica por un 30% más.
        Si el seguro es completo se multiplica por un 50% mas.
    */
    this.tipo === 'basico' ? cantidad *= 1.3 : cantidad *= 1.5;

    return cantidad;
}


function UI() {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for(let i = max; i > min; i--){
        let option = document.createElement('OPTION');
        option.value = i;
        option.textContent = i;
        selectYear.appendChild(option);
    }
};

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');

    if(tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // Insertar en el HTML
    formulario.insertBefore(div, document.querySelector('#resultado'));

    setTimeout(() => {
        div.remove();
    }, 3000);
};

UI.prototype.mostrarResultado = (cantidad, seguro) => {
    // Crear el resultado
    let { marca, year, tipo} = seguro;

    switch(marca){
        case '1':
            marca = 'Americano';
            break;
        case '2':
            marca = 'Asiático';
            break;
        case '2':
            marca = 'Europeo';
            break;
        default:
            break;
    }
    const div = document.createElement('DIV');
    div.classList.add('mt-10');
    
    div.innerHTML = `
        <p class="header">Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal">${marca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
        <p class="font-bold">Total: <span class="font-normal">$ ${cantidad}</span></p>
    `;

    const resultadoDiv = document.querySelector('#resultado');
    // Mostrando spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = "block";

    setTimeout(() => {
        spinner.style.display = "none";
        resultadoDiv.appendChild(div);
    }, 3000);
};

// Instancias globales
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones();
});

eventListeners();
function eventListeners() {
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;
    // Leer el año seleccionado
    const year = document.querySelector('#year').value;
    // Leer el tipo de cobertura
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if(marca === '' || year === '' || tipo === ''){
        ui.mostrarMensaje('Todos los campos son obligatorios', 'error');
        return;
    }

    ui.mostrarMensaje('Cotizando...', 'exito');

    // Ocultar cotizaciones previas
    const resultados = document.querySelector('#resultado div');
    if(resultados != null){
        resultados.remove();
    }

    // Instanciar seguro
    const seguro = new Seguro(marca, year, tipo);
    const cantidad = seguro.cotizarSeguro();

    // Prototype para cotizar
    ui.mostrarResultado(cantidad, seguro);

}