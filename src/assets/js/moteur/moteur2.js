const href = './hearing.html';


let nextLink = document.getElementById('valider');
let alertDiv = document.getElementById('errorDiv');
nextLink.addEventListener("click", (event) => {
  let reponse = document.getElementById('inputField').value.toLowerCase();
  const reponseAttendue = i18next.t('physicalSimu.response');
  if (reponse === reponseAttendue) {
    document.location.assign(href);
  } else {
    alertDiv.classList.remove("d-none");
    window.location.hash = '#errorDiv';
  }
});

let inputField = document.getElementById('inputField');

inputField.addEventListener('paste', (event) => {
  event.preventDefault();
  alert(i18next.t('physicalSimu.copyPasteForbidden'));
  return false;
})

inputField.addEventListener('keydown', swapKeys );

function swapKeys(event) {

  const originalKey = event.key;
  const neighboringKeys = {
    'a': ['q', 'w', 's', 'z', 'a'],
    'b': ['v', 'g', 'h', 'n', 'b'],
    'c': ['x', 'd', 'f', 'v', 'c'],
    'd': ['s', 'e', 'r', 'f', 'x', 'c', 'd'],
    'e': ['r', 'd', 'z', 'e'],
    'f': ['r', 't', 'g', 'v', 'c', 'f'],
    'g': ['t', 'y', 'h', 'b', 'v', 'g'],
    'h': ['y', 'u', 'j', 'n', 'b', 'h'],
    'H': ['Y', 'U', 'J', 'N', 'B', 'H'],
    'i': ['u', 'o', 'k', 'j', 'i'],
    'j': ['u', 'i', 'k', 'm', 'n', 'j'],
    'k': ['i', 'o', 'l', 'm', 'k'],
    'l': ['o', 'p', 'l'],
    'm': ['n', 'j', 'k', 'm'],
    'n': ['h', 'j', 'm', 'n'],
    'o': ['p', 'l', 'k', 'o'],
    'p': ['l', 'p'],
    'q': ['w', 'a', 'q'],
    'r': ['t', 'f', 'd', 'r'],
    's': ['q', 'd', 'x', 'z', 's'],
    'S': ['Q', 'D', 'X', 'Z', 'S'],
    't': ['r', 'y', 'g', 't'],
    'u': ['y', 'i', 'j', 'h', 'u'],
    'v': ['c', 'f', 'g', 'b', 'v'],
    'V': ['C', 'F', 'G', 'B', 'V'],
    'w': ['a', 's', 'e', 'w'],
    'x': ['s', 'd', 'c', 'x'],
    'y': ['t', 'u', 'h', 'g', 'y'],
    'z': ['a', 's', 'x', 'z'],
  };

  if (originalKey in neighboringKeys) {
    const possibleKeys = neighboringKeys[originalKey];
    const randomKey = possibleKeys[Math.floor(Math.random() * possibleKeys.length)];
    event.preventDefault();
    inputField.value += randomKey;
  }

}