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
  const url = `https://api-prod.moova.io/b2b/shippings?filters={"filter_groups":[{"filters":[["external_order_id","ct","${input.value}"]]}]}&appId=[AQUI APP ID]`;
  axios
    .get(url, {
      headers: {
        Authorization: "[AQUI TOKEN DE ACCESO]",
        "Content-Type": "application/json",
      },
    })
    .then(({ data }) => {
      console.log(data);
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
        var from = responseData.from.address;

        orderNumber.innerHTML = "Nro de compra: #" + input.value;
        orderState.innerHTML = "Estado de la orden: " + orderStatus;
        orderToAddress.innerHTML = "Dirección de entrega: " + to;

        var progress =
          responseData.statusHistory.length > 7
            ? 100
            : (responseData.statusHistory.length * 100) / 7;

        orderProgress.innerHTML = `<div class="progress-bar bg-info" role="progressbar" style="width: ${progress}%" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100">${progress}%</div>`;
        buttonContainer.innerHTML = ``;
        buttonContainer.innerHTML = `<button class="btn btn-info text-white" type="submit" onclick = "fetchProduct()">Enviar</button>`;
      }
    });
}
