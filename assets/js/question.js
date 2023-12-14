var clickCount = 0;
var container = document.getElementById('container');
var questionButton = document.getElementById('question-button');
var texts = ['texte numéro 1', 'texte numéro 2', 'texte numéro 3'];

questionButton.addEventListener('click', function() {
  clickCount++;

  if (clickCount <= texts.length) {
    var textField = document.createElement('input');
    textField.setAttribute('type', 'text');
    textField.className = 'text-field';
    textField.placeholder = texts[clickCount - 1];

    container.appendChild(textField);
  }
});