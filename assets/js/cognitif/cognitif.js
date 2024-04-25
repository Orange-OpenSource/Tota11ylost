let divLink = document.getElementById("linkDyslexia");
var globalLinkDyslexie;

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", (event) => {
  langManager.subscribe(() => {

    const linkDyslexie = [
      {
        label: i18next.t("cognitive.buttonsLabels", { returnObjects: true })[0],
        href: "./cognitive-simulation.html",
      },
      {
        label: i18next.t("cognitive.buttonsLabels", { returnObjects: true })[1],
        href: "./cognitive.html",
      },
      {
        label: i18next.t("cognitive.buttonsLabels", { returnObjects: true })[2],
        href: "./cognitive.html",
      },
      {
        label: i18next.t("cognitive.buttonsLabels", { returnObjects: true })[3],
        href: "./cognitive.html",
      },
    ];

    shuffle(linkDyslexie);
    createButtons(linkDyslexie);

    globalLinkDyslexie = linkDyslexie;
  });
});

function createButtons(array) {
  array.forEach((linkD) => {
    let button = document.createElement("button");
    button.textContent = linkD.label;
    button.classList.add("btn", "btn-primary", "btn-lg", "m-2", "dyslexia", "fs-3", "p-2");
    button.setAttribute("role", "link");
    button.addEventListener("click", (e) => {
      document.location.assign(linkD.href);
    });

    divLink.append(button);
  });
}