(function () {
  var MAX = { ancho: 22, profundidad: 22, alto: 25 };
  var MAX_MB = 8;
  var $ = function (id) { return document.getElementById(id); };

  // Aviso si la medida no entra en la impresora (cualquier orientación de la base)
  function revisarMedida() {
    var a = parseFloat($('ancho').value) || 0;
    var p = parseFloat($('profundidad').value) || 0;
    var h = parseFloat($('alto').value) || 0;
    var dims = [a, p, h].sort(function (x, y) { return y - x; });
    // Lo más grande va al alto (25), las otras dos a la base (22 x 22)
    var entra = dims[0] <= MAX.alto && dims[1] <= MAX.ancho && dims[2] <= MAX.profundidad;
    $('medida-error').hidden = entra;
  }
  ['ancho', 'profundidad', 'alto'].forEach(function (id) { $(id).addEventListener('input', revisarMedida); });

  var archivo = $('archivo');
  archivo.addEventListener('change', function () {
    var f = archivo.files[0];
    var grande = f && f.size > MAX_MB * 1024 * 1024;
    $('archivo-error').hidden = !grande;
    archivo.setCustomValidity(grande ? 'El archivo pesa más de ' + MAX_MB + ' MB' : '');
  });

  var copiar = $('copiar-alias');
  if (copiar) copiar.addEventListener('click', function () {
    var alias = $('alias').textContent.trim();
    var listo = function () { copiar.textContent = '¡Copiado!'; setTimeout(function () { copiar.textContent = 'Copiar alias'; }, 2000); };
    if (navigator.clipboard) navigator.clipboard.writeText(alias).then(listo, function () { prompt('Copiá el alias:', alias); });
    else prompt('Copiá el alias:', alias);
  });

  document.querySelector('form').addEventListener('submit', function () {
    var b = $('enviar'); b.disabled = true; b.textContent = 'Enviando…';
  });
})();
