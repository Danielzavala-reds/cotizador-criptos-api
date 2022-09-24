const formulario = document.querySelector('#formulario');
const selectorMoneda = document.querySelector('#moneda');
const selectorCripto = document.querySelector('#criptomonedas');
const resultado = document.querySelector('#resultado')


// Creamos un objeto para que se llene cuando el usuario seleccione algo
const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

// Creamos promise que solo va acumplir cuando las criptomonedas se hayan descargado
const obtenerCriptomonedas = criptomonedas => new Promise (resolve =>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () =>{
    consultarCriptomonedas();
   
    formulario.addEventListener('submit', submitFormulario);

    selectorCripto.addEventListener('change', leerValor);

    selectorMoneda.addEventListener('change', leerValor);
})


function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=MXN'
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))
}

function selectCriptomonedas (criptomonedas){
    
    criptomonedas.forEach(cripto => {
        
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        selectorCripto.appendChild(option);

    })
    

}

function leerValor (e) {
    // Aqui agregamos e como parametro porque en el HTML tienen el name para acceder al mapeado 
    objBusqueda[e.target.name] = e.target.value;
    // console.log(objBusqueda);
}



function submitFormulario(e){
    e.preventDefault();
    
    const { moneda, criptomoneda } = objBusqueda
    if( moneda === '' || criptomoneda ===''){
        mostrarAlerta('Los campos deben ser obligatorios');
        return;
    }

    // Consultamos api con los resultados
    consultarAPI();

    
    
    
}

function mostrarAlerta (mensaje){

    const existeAlerta = document.querySelector('.error');

    if(!existeAlerta){
        const divMensaje = document.createElement('div');
    
    divMensaje.classList.add('error');

    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);
    
    setTimeout(() => {
        divMensaje.remove();
    }, 4000);

    }
};

function consultarAPI(){
    const {moneda,criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    spinner();

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(conversion =>{
        limpiarHTML();
        mostrarHTML(conversion.DISPLAY [criptomoneda] [moneda]);
    })
}



function mostrarHTML (conversion){
   const { PRICE, HIGHDAY, LOWDAY, LASTUPDATE, CHANGEPCTDAY } = conversion;

   const precio = document.createElement('p');
   precio.classList.add('precio');
   precio.innerHTML = `Precio: <span>${PRICE}</span>`;
   

   const precioMax = document.createElement('p');
   precioMax.innerHTML = `Precio máximo del día: <span>${HIGHDAY}</span>`;
   precioMax.classList.add('font-bold', 'text-2xl')

   const precioMin = document.createElement('p');
   precioMin.innerHTML = `Precio mínimo del día: <span>${LOWDAY}</span>`;
   precioMin.classList.add();

   const cambio24Hrs = document.createElement('p');
   cambio24Hrs.innerHTML = `Cambio en las ultimas 24hrs: <span>${CHANGEPCTDAY}%</span>`;

   const update = document.createElement('p');
   update.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;



   const resultadoFinal = document.createElement('div');
   resultadoFinal.classList.add('text-center', 'text-white');

   resultadoFinal.appendChild(precio);
   resultadoFinal.appendChild(precioMax);
   resultadoFinal.appendChild(precioMin);
   resultadoFinal.appendChild(cambio24Hrs);
   resultadoFinal.appendChild(update);

   resultado.appendChild(resultadoFinal);
}

function spinner (){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-folding-cube')
    divSpinner.innerHTML = `
    
  <div class="sk-cube1 sk-cube"></div>
  <div class="sk-cube2 sk-cube"></div>
  <div class="sk-cube4 sk-cube"></div>
  <div class="sk-cube3 sk-cube"></div>

  
    `;

    resultado.appendChild(divSpinner);
}

function limpiarHTML (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}