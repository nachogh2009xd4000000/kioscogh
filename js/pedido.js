(function () {
  var MAX = { ancho: 22, grosor: 22, alto: 25 };
  var MAX_MB = 8;
  var $ = function (id) { return document.getElementById(id); };

  // Aviso si la medida no entra en la impresora (cualquier orientación de la base)
  function revisarMedida() {
    var a = parseFloat($('ancho').value) || 0;
    var p = parseFloat($('grosor').value) || 0;
    var h = parseFloat($('alto').value) || 0;
    var dims = [a, p, h].sort(function (x, y) { return y - x; });
    // Lo más grande va al alto (25), las otras dos a la base (22 x 22)
    var entra = dims[0] <= MAX.alto && dims[1] <= MAX.ancho && dims[2] <= MAX.grosor;
    $('medida-error').hidden = entra;
  }
  ['ancho', 'grosor', 'alto'].forEach(function (id) { $(id).addEventListener('input', revisarMedida); });

  // Teléfono: solo dígitos, con la cantidad que corresponde al país elegido
  var PAISES = { '+54': 'Argentina', '+598': 'Uruguay', '+55': 'Brasil', '+56': 'Chile', '+595': 'Paraguay', '+591': 'Bolivia', '+51': 'Perú', '+57': 'Colombia', '+58': 'Venezuela', '+593': 'Ecuador', '+52': 'México', '+1': 'Estados Unidos', '+34': 'España', '+39': 'Italia' };
  var pais = $('pais'), tel = $('telefono');
  function rangoLargo() {
    var r = pais.selectedOptions[0].getAttribute('data-largo').split('-');
    return { min: +r[0], max: +(r[1] || r[0]) };
  }
  function pistaPais() {
    var ej = pais.selectedOptions[0].getAttribute('data-ejemplo');
    tel.placeholder = ej;
    $('telefono-ayuda').textContent = pais.value === '+54' ? 'Sin el 0 ni el 15. Ejemplo: ' + ej : 'Ejemplo: ' + ej;
    revisarTelefono();
  }
  function revisarTelefono() {
    var digitos = tel.value.replace(/\D/g, '');
    if (pais.value === '+54') digitos = digitos.replace(/^0/, '').replace(/^(\d{2,4})15/, '$1'); // tolera 011 y el 15
    var r = rangoLargo();
    var ok = digitos.length >= r.min && digitos.length <= r.max;
    var msg = '';
    if (tel.value && !ok) {
      var nombre = PAISES[pais.value];
      msg = nombre
        ? 'Ese número no parece de ' + nombre + ': tiene que tener ' + (r.min === r.max ? r.min : r.min + ' a ' + r.max) + ' dígitos.'
        : 'Escribí el número completo con el código de país.';
    }
    $('telefono-error').textContent = msg;
    $('telefono-error').hidden = !msg;
    tel.setCustomValidity(msg);
    return digitos;
  }
  pais.addEventListener('change', pistaPais);
  tel.addEventListener('input', revisarTelefono);
  // Si pegan un número con +código, elegimos el país solo
  tel.addEventListener('input', function () {
    var m = tel.value.match(/^\s*\+(\d{1,3})/);
    if (!m) return;
    var codigos = Array.prototype.map.call(pais.options, function (o) { return o.value; }).filter(Boolean);
    var hallado = codigos.filter(function (c) { return ('+' + m[1]).indexOf(c) === 0; }).sort(function (a, b) { return b.length - a.length; })[0];
    if (hallado) { pais.value = hallado; tel.value = tel.value.replace(/^\s*\+/, '').slice(hallado.length - 1).trim(); pistaPais(); }
  });
  // Antes de enviar, armamos el número completo en formato internacional
  document.querySelector('form').addEventListener('submit', function (e) {
    var digitos = revisarTelefono();
    if (!tel.checkValidity()) { e.preventDefault(); tel.reportValidity(); return; }
    $('contacto').value = (pais.value || '+') + digitos;
  });

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

  document.querySelector('form').addEventListener('submit', function (e) {
    if (e.defaultPrevented) return;
    var b = $('enviar'); b.disabled = true; b.textContent = 'Enviando…';
  });
})();
