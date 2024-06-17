btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      disableswapKeys();
      break;
    default:
  }
});

function disableswapKeys() {
  const inputField = document.getElementById("inputField");
  inputField.removeEventListener("keydown", swapKeys);
}
