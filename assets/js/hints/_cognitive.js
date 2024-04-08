btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      disableDyslexiaSimulation();
      break;
    default:
  }
});

function disableDyslexiaSimulation() {
  clearInterval(intervalSimulation);

  let divLink = document.getElementById("linkDyslexia");

  while (divLink.firstChild) {
    divLink.removeChild(divLink.firstChild);
  }

  globalLinkDyslexie.forEach((linkD) => {
    let button = document.createElement("button");
    button.textContent = linkD.label;
    button.classList.add("btn", "btn-primary", "btn-lg", "m-2", "dyslexia");
    button.setAttribute("role", "link");
    button.addEventListener("click", (e) => {
      document.location.assign(linkD.href);
    });

    divLink.append(button);
  });
}
