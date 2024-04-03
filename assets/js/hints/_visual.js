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

    const buttonId = button.getAttribute('id');

    if (buttonId.includes('blue')) {
        button.style.backgroundColor = '#085ebd';
    } else if (buttonId.includes('purple')) {
        button.style.backgroundColor = '#492191';
    } else if (buttonId.includes('green')) {
        button.style.backgroundColor = '#0a6e31';
    } else if (buttonId.includes('red')) {
        button.style.backgroundColor = '#cd3c14';
    }
  });
}
