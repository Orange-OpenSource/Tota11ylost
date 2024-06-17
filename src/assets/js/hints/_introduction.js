btnIndice.addEventListener('click', (e) => {

    switch (indice) {
      case 1:
        break;
      case 2:
        break;
      case 3:
        changelinkStyle();
        break;
      default:
    }

  });

  function changelinkStyle() {

    const link = document.getElementsByClassName('link');

    link[0].classList.remove('link-underline-opacity-0');
    link[0].classList.remove('masked-link');
    link[0].classList.add('link-info');
  }