var axios = require("axios");

function fetchProduct() {
  var input = document.getElementById("userInput");
  var output = document.getElementById("response-text");
  var spinner = `<div class="spinner-border text-info" role="status">
                                  <span class="visually-hidden">Loading...</span >
                              </div >`;

  var buttonContainer = document.getElementById("form-button-container");
  buttonContainer.innerHTML = ``;
  buttonContainer.innerHTML = spinner;
  const url = `https://api-prod.moova.io/b2b/shippings?filters={"filter_groups":[{"filters":[["external_order_id","ct","${input.value}"]]}]}&appId=appid`;
  axios
    .get(url, {
      headers: {
        Authorization: "token",
        "Content-Type": "application/json",
      },
    })
    .then(({ data }) => {
      console.log(data);
      const orderStates = {
        DRAFT: { msg: "Compra procesada", progress: 15 },
        READY: { msg: "Compra lista para despacho", progress: 30 },
        WAITING: { msg: "En espera de courier", progress: 40 },
        CONFIRMED: { msg: "Recibido por courier", progress: 50 },
        ATPICKUPPOINT: { msg: "En el punto de retiro", progress: 70 },
        INTRANSIT: { msg: "En transito a destino", progress: 85 },
        DELIVERED: { msg: "Entregado", progress: 100 },
        INCIDENCE: { msg: "Con incidencia", progress: 25 },
        CANCELADO: { msg: "Cancelada", progress: 50 },
        TOBERETURNED: { msg: "Devolviendose a bodega", progress: 75 },
        RETURNED: { msg: "Devuelta", progress: 100 },
      };
      var responseData = data.data[0];
      var orderNumber = document.getElementById("order-number-header");
      var orderState = document.getElementById("order-state-title");
      var orderToAddress = document.getElementById("order-to-address");
      var orderProgress = document.getElementById("order-progress-container");
      if (data.data.length === 0) {
        orderNumber.innerHTML = "Nro de compra: #" + input.value;
        orderState.innerHTML = "Orden no encontrada!";
        buttonContainer.innerHTML = ``;
        buttonContainer.innerHTML = `<button class="btn btn-info text-white" type="submit" onclick = "fetchProduct()">Enviar</button>`;
      } else {
        var orderStatus = responseData.status;
        var to = responseData.to.address;

        orderNumber.innerHTML = "Nro de compra: #" + input.value;
        orderState.innerHTML =
          "Estado de la orden: " + orderStates[orderStatus].msg;
        orderToAddress.innerHTML = "Dirección de entrega: " + to;

        var progress = orderStates[orderStatus].progress;

        orderProgress.innerHTML = `<div class="progress-bar bg-info" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>`;
        buttonContainer.innerHTML = ``;
        buttonContainer.innerHTML = `<button class="btn btn-info text-white" type="submit" onclick = "fetchProduct()">Enviar</button>`;
      }
    });
}
