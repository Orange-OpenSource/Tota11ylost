btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      stopMouse();
      break;
    default:
  }
});

function stopMouse() {
  const falseCursor = document.getElementById("falsecursor");
  const documentBody = document.querySelectorAll("body");
  const closePopup = document.getElementById("close-popup");
  const validateLink = document.getElementById("link30or60");

  falseCursor.style.display = "none";
  documentBody[0].classList.remove("no-cursor");
  closePopup.style.cursor = "pointer";
  validateLink.style.cursor = "pointer";
}