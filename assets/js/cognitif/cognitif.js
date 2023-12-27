const linkDyslexie = [
    {
        label: "oui c'est sur, ce lien est le bon",
        href: "./3-1-simulation-cognitive.html"
    },
    {
        label: "oui bien sur, avec du jambon",
        href: "./3-cognitif"
    },
    {
        label: "oui c'est dur, ce lien est un rond",
        href: "./3-cognitif"
    },
    {
        label: "oui c'est nul, tien un bonbon",
        href: "./3-cognitif"
    }
];

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

document.addEventListener("DOMContentLoaded", (event) => {
    let divLink = document.getElementById('linkDyslexia');
    shuffle(linkDyslexie)
    linkDyslexie.forEach(linkD => {
        let button = document.createElement('button');
        button.textContent=linkD.label;
        button.classList.add("btn", "btn-primary", "btn-lg", "m-2", "dyslexia");
        button.setAttribute("role","link");
        button.addEventListener("click", (e) => {
            document.location.assign(linkD.href);
          });
       
        divLink.append(button)
    });
});