document.addEventListener('DOMContentLoaded', function() {
    var textBloc = document.getElementById('text-bloc');

    function updateTextBloc(event) {
      var target = event.target;
      var accessibleName = target.getAttribute('aria-label') || target.innerText || target.value || '';

      textBloc.textContent = accessibleName;
    }

    document.addEventListener('focusin', updateTextBloc);
    document.addEventListener('focusout', function() {
      textBloc.textContent = '';
    });
  });