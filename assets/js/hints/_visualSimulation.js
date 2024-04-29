btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      disableAllStyles();
      break;
    default:
  }
});

function disableAllStyles() {
  let cssFiles = document.querySelectorAll('link[href*=".css"]');

  cssFiles.forEach((file) => {
    file.setAttribute("disabled", "true");
  });
}
