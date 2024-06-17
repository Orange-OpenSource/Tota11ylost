btnIndice.addEventListener("click", (e) => {
  switch (indice) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      addButtonsColors();
      break;
    default:
  }
});

function addButtonsColors() {
  const buttons = document.querySelectorAll('[id$="-button"]');

  buttons.forEach((button) => {
    button.classList.remove('btn-dark');
    button.classList.add('btn-info');

    const buttonId = button.getAttribute('id');

    if (buttonId.includes('blue')) {
        button.classList.add('blue-button');
    } else if (buttonId.includes('purple')) {
      button.classList.add('purple-button');
    } else if (buttonId.includes('green')) {
      button.classList.add('green-button');
    } else if (buttonId.includes('red')) {
      button.classList.add('red-button');
    }
  });
}
