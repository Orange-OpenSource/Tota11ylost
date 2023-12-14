const inputField1 = document.getElementById('first-name');
const inputField2 = document.getElementById('last-name');
const inputField3 = document.getElementById('email');
const inputField4 = document.getElementById('email2');
const inputField5 = document.getElementById('adress');
const inputField6 = document.getElementById('country');
const inputField7 = document.getElementById('state');
const inputField8 = document.getElementById('conditionnalcheck');
const inputField9 = document.getElementById('zip');
const validateButton = document.getElementById('validateButton');

function checkInputs() {
  const value1 = inputField1.value.trim();
  const value2 = inputField2.value.trim();
  const value3 = inputField3.value.trim();
  const value4 = inputField4.value.trim();
  const value5 = inputField5.value.trim();
  const value6 = inputField6.value.trim();
  const value7 = inputField7.value.trim();
  const value8 = inputField8.value.trim();
  const value9 = inputField9.value.trim();

  if (value1 === 'toto1' && value2 === 'toto2' && value3 === 'toto3' && value4 === 'toto3' && value5 === 'toto3' && value6 === 'toto3' && value7 === 'toto3' && value8 === 'toto3' && value9 === 'toto3' ) {
    validateButton.removeAttribute('disabled');
  } else {
    validateButton.setAttribute('disabled', 'disabled');
  }
}

inputField1.addEventListener('input', checkInputs);
inputField2.addEventListener('input', checkInputs);
inputField3.addEventListener('input', checkInputs);
inputField4.addEventListener('input', checkInputs);
inputField5.addEventListener('input', checkInputs);
inputField6.addEventListener('input', checkInputs);
inputField7.addEventListener('input', checkInputs);
inputField8.addEventListener('input', checkInputs);
inputField9.addEventListener('input', checkInputs);