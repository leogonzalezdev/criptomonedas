const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
  moneda: '',
  criptomoneda: ''
}

const obtenerCriptomoneda = criptomonedas => new Promise( resolve =>{
  resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {

  consultarCriptomonedas();

  formulario.addEventListener('submit', submitFormulario);
  criptoSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);

});

function consultarCriptomonedas() {
  const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

  fetch(url)
    .then( result => result.json() )
    .then( resultado => obtenerCriptomoneda( resultado.Data ) )
    .then( criptomonedas => selectCriptomonedas(criptomonedas) )
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach(cripto => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement('option');
    option.textContent = FullName;
    option.value = Name

    criptoSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
  e.preventDefault();
  
  // validar
  const { moneda, criptomoneda } = objBusqueda;
  
  if ( moneda === '' || criptomoneda === '' ) {
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }
  consultarAPI();
}

function mostrarAlerta(msg){ 
  
  if (!document.querySelector('.error')) {
    
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    divMensaje.textContent = msg;
    
    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 2000);
  
  }
  
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpinner();

  fetch(url)
  .then(result => result.json())
  .then( cotizacion => {
    mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]);
  })

}

function mostrarCotizacion(cotizacion) {

  limpiarHTML();

  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

  const precio = document.createElement('p');
  precio.classList.add('precio');

  precio.innerHTML = ` 
  El precio es: <span>${PRICE}</span>
  `;

  const precioAlto = document.createElement('p');
  precioAlto.innerHTML = `
  El precio mas alto del dia es: <span>${HIGHDAY}</span>
  `;

  const precioBajo = document.createElement('p');
  precioBajo.innerHTML = `
  El precio mas bajo del dia es: <span>${LOWDAY}</span>
  `;

  const ultimasHoras = document.createElement('p');
  ultimasHoras .innerHTML = `
  Ultima actualizacion: <span>${CHANGEPCT24HOUR}%</span>
  `;

  const ultimasActualizacion = document.createElement('p');
  ultimasActualizacion .innerHTML = `
  Ultima actualizacion: <span>${LASTUPDATE}</span>
  `;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimasActualizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const spinner = document.createElement('div');
  spinner.classList.add('sk-chase');
  spinner.innerHTML = `
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
    <div class="sk-chase-dot"></div>
  `;
  resultado.appendChild(spinner);
}