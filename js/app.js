(function () {
  var $ = function (id) { return document.getElementById(id); };
  var precioARS = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
  var sinFoto = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#2a231f"/>' +
    '<path d="M50 24 72 36v26L50 74 28 62V36z M28 36l22 12 22-12M50 48v26" fill="none" stroke="#5a4a40" stroke-width="3" stroke-linejoin="round"/></svg>');

  function texto(id, valor) { if (valor && $(id)) $(id).textContent = valor; }
  function leer(url) {
    return fetch(url + '?v=' + Date.now()).then(function (r) { if (!r.ok) throw new Error(url); return r.json(); });
  }

  // Datos del kiosco
  leer('content/kiosco.json').then(function (k) {
    texto('nombre', k.nombre);
    texto('bajada', k.bajada);
    texto('direccion', k.direccion);
    texto('localidad', k.localidad);
    texto('horario', k.horario);
    if (k.aviso) { $('aviso').textContent = k.aviso; $('aviso').hidden = false; }
    if (k.instagram) {
      var ig = k.instagram.replace(/^@/, '');
      $('instagram').href = 'https://instagram.com/' + ig;
      texto('ig-usuario', ig);
    }
    if (k.mercadopago_alias) {
      var s = document.createElement('span');
      s.className = 'alias';
      s.textContent = 'O transferí al alias: ' + k.mercadopago_alias;
      $('alias-linea').appendChild(s);
    }
    if (k.whatsapp) {
      $('whatsapp').href = 'https://wa.me/' + k.whatsapp.replace(/\D/g, '');
      $('whatsapp').hidden = false;
    }
    if (k.direccion) {
      $('mapa').href = 'https://www.google.com/maps/search/?api=1&query=' +
        encodeURIComponent(k.direccion.split(',')[0] + ', ' + (k.localidad || ''));
    }
  }).catch(function () {});

  // Catálogo
  var productos = [];
  var categoriaActual = 'Todo';

  function tarjeta(p) {
    var art = document.createElement('article');
    art.className = 'producto' + (p.disponible === false ? ' producto--agotado' : '');
    var img = document.createElement('img');
    img.className = 'producto__foto';
    img.loading = 'lazy';
    img.alt = p.nombre || '';
    img.src = p.foto || sinFoto;
    img.onerror = function () { img.src = sinFoto; };
    art.appendChild(img);
    if (p.disponible === false) art.appendChild(etiqueta('Agotado', 'agotado'));
    else if (p.destacado) art.appendChild(etiqueta('Nuevo', 'destacado'));
    var c = document.createElement('div');
    c.className = 'producto__cuerpo';
    var h = document.createElement('h3'); h.className = 'producto__nombre'; h.textContent = p.nombre || ''; c.appendChild(h);
    if (p.descripcion) { var d = document.createElement('p'); d.className = 'producto__desc'; d.textContent = p.descripcion; c.appendChild(d); }
    var pr = document.createElement('div'); pr.className = 'producto__precio';
    pr.textContent = Number(p.precio) > 0 ? precioARS.format(Number(p.precio)) : 'Consultar';
    c.appendChild(pr);
    art.appendChild(c);
    return art;
  }
  function etiqueta(t, tipo) { var e = document.createElement('span'); e.className = 'etiqueta etiqueta--' + tipo; e.textContent = t; return e; }

  function pintar() {
    var g = $('grilla'); g.innerHTML = '';
    var lista = productos.filter(function (p) { return categoriaActual === 'Todo' || p.categoria === categoriaActual; });
    if (!lista.length) { g.innerHTML = '<p class="vacio">Muy pronto, más productos. Seguinos en Instagram para enterarte.</p>'; return; }
    lista.forEach(function (p) { g.appendChild(tarjeta(p)); });
  }

  function filtros() {
    var cats = ['Todo'];
    productos.forEach(function (p) { if (p.categoria && cats.indexOf(p.categoria) < 0) cats.push(p.categoria); });
    var f = $('filtros'); f.innerHTML = '';
    if (cats.length < 3) return; // con una sola categoría no hace falta filtrar
    cats.forEach(function (cat) {
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.textContent = cat;
      b.setAttribute('aria-selected', cat === categoriaActual);
      b.onclick = function () { categoriaActual = cat; filtros(); pintar(); };
      f.appendChild(b);
    });
  }

  leer('content/catalogo.json').then(function (data) {
    productos = (data.productos || []).filter(function (p) { return p && p.nombre && p.oculto !== true; });
    // El producto estrella va arriba, en grande, y no se repite en la grilla
    var estrellas = productos.filter(function (p) { return p.estrella; });
    productos = productos.filter(function (p) { return !p.estrella; });
    if (estrellas.length) {
      var t = tarjeta(estrellas[0]);
      t.classList.add('producto--estrella');
      var et = t.querySelector('.etiqueta--destacado'); if (et) et.remove();
      $('estrella-tarjeta').appendChild(t);
      $('estrella').hidden = false;
    }
    // Destacados primero, agotados al final
    productos.sort(function (a, b) {
      var pa = (a.disponible === false ? 2 : 0) - (a.destacado ? 1 : 0);
      var pb = (b.disponible === false ? 2 : 0) - (b.destacado ? 1 : 0);
      return pa - pb;
    });
    filtros(); pintar();
  }).catch(function () {
    $('grilla').innerHTML = '<p class="vacio">No pudimos cargar el catálogo. Probá recargar la página.</p>';
  });
})();
