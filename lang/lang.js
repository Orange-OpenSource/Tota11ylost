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
      loadPath: './locales/{{lng}}.json'
    },
  }, function (err, t) {
    changeLanguage(getLang());
    langManager.onLangLoaded();
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
  languageSelect && languageSelect.addEventListener('change', function () {
    changeLanguage(this.value);
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

function setLang(lang) {
  localStorage.setItem('lang', lang);
}

function getLang() {
  return localStorage.getItem('lang');
}
