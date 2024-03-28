function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", (event) => {
  langManager.subscribe(
    () => {
      let divLink = document.getElementById('linkDyslexia');

      const linkDyslexie = [
        {
          label: i18next.t('cognitive.buttonsLabels', {returnObjects: true})[0],
          href: "./3-1-simulation-cognitive.html"
        },
        {
          label: i18next.t('cognitive.buttonsLabels', {returnObjects: true})[1],
          href: "./3-cognitif"
        },
        {
          label: i18next.t('cognitive.buttonsLabels', {returnObjects: true})[2],
          href: "./3-cognitif"
        },
        {
          label: i18next.t('cognitive.buttonsLabels', {returnObjects: true})[3],
          href: "./3-cognitif"
        }
      ];

      shuffle(linkDyslexie)
      linkDyslexie.forEach(linkD => {
        let button = document.createElement('button');
        button.textContent = linkD.label;
        button.classList.add("btn", "btn-primary", "btn-lg", "m-2", "dyslexia");
        button.setAttribute("role", "link");
        button.addEventListener("click", (e) => {
          document.location.assign(linkD.href);
        });

        divLink.append(button)
      });
    });
});
