const langManager = function () {
  let tabFn = [];
  let langLoaded = false;

  return {
    subscribe: (fn) => {
      if (langLoaded) {
        setTimeout(() => {
          fn();
        });
      } else {
        tabFn.push(fn);
      }
      return tabFn.filter(() => {
      });
    },

    onLangLoaded: () => {
      langLoaded = true;
      // Call all pending functions
      while (tabFn.length > 0) {
        // Remove the first function from the array
        const func = tabFn.shift();
        // call the function
        func();
      }
    },

    langReset: () => {
      langLoaded = false;
    }
  };
}();


i18next
  .use(i18nextHttpBackend)
  .init({
    lng: 'fr', // Langue par défaut
    fallbackLng: 'en', // Langue de secours
    debug: true,
    backend: {
      loadPath: '../locales/{{lng}}.json'
    },
  }, function (err, t) {
    changeLanguage(getLang() || 'fr');
    setActiveLanguage(getLang());
  });

function updateTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(function (element) {
    const keys = element.getAttribute('data-i18n').split(';');
    keys.forEach(function (key) {
      const attr = getAttributeFromKey(key);
      if (attr !== -1) {
        const value = i18next.t(key);
        element.setAttribute(attr, value);
      } else {
        element.innerHTML = i18next.t(key);
      }
    });
  });
}

function getAttributeFromKey(key) {
  const elements = key.split('.');
  const lastWord = elements[elements.length - 1];
  const parts = lastWord.split('_');
  return parts.length > 1 ? parts[0] : -1;
}

document.addEventListener('DOMContentLoaded', function () {
  const languageSelect = document.getElementById('languageSelect');
  languageSelect && languageSelect.addEventListener('click', (event) => {
    // Vérifier si le clic a été sur un élément <a>
    if (event.target.tagName === 'A') {
      // Empêcher le comportement par défaut du lien (navigation)
      event.preventDefault();

      // Retirer la classe 'active' de tous les liens
      languageSelect.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
      });

      // Ajouter la classe 'active' au lien cliqué
      event.target.classList.add('active');
      event.target.setAttribute('aria-current', 'true');

      // Ici, vous pouvez également gérer d'autres logiques comme le changement de contenu
      // en fonction du lien cliqué, si nécessaire.
      const lang = event.target.getAttribute('lang');
      changeLanguage(lang);
    }
  });
});

function changeLanguage(lang) {
  langManager.langReset();
  i18next.changeLanguage(lang, () => {
    setLang(lang);
    langManager.onLangLoaded();
    updateTranslations();
  });
}

// Fonction pour mettre à jour la classe 'active' en fonction de la langue courante
function setActiveLanguage(currentLang) {
  const languageLinks = document.querySelectorAll('#languageSelect .nav-link');
  languageLinks.forEach(link => {
    if (link.getAttribute('lang') === currentLang) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'true');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

function setLang(lang) {
  localStorage.setItem('lang', lang);
}

function getLang() {
  return localStorage.getItem('lang') || 'fr';
}
