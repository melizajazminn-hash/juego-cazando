calcularDescuento = function(valorReal, porcentajeDescuento) {
    
    let valorDescuento;
    let total;

    
    valorDescuento = (valorReal * porcentajeDescuento) / 100;

   
    total = valorReal - valorDescuento;

   
    return total;
}
descontar = function() {
    
    let cmpMonto = document.getElementById("txtMonto");
    let monto = parseInt(cmpMonto.value);

    
    let cmpDescuento = document.getElementById("txtDescuento");
    let descuento = parseInt(cmpDescuento.value);

    
    let resultadoTotal = calcularDescuento(monto, descuento);
     let cmpTotal = document.getElementById("lblTotal");
    cmpTotal.innerText = resultadoTotal;
}