/* AprilCosmic.com · animaciones */
(function () {
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var body = document.body;

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function externa(url) { return /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : ''; }

  var ingles = document.documentElement.lang === 'en';
  var base = body.getAttribute('data-base') || '';
  /* Toma el campo en inglés si existe (titulo_en, texto_en...), si no, el de español */
  function campo(it, k) { return (ingles && it[k + '_en']) || it[k] || ''; }

  /* Recuerda el idioma que eligió la persona */
  document.querySelectorAll('[data-idioma]').forEach(function (a) {
    a.addEventListener('click', function () {
      try { localStorage.setItem('idioma', a.getAttribute('data-idioma')); } catch (e) {}
    });
  });

  /* Ahora: se llena desde assets/js/ahora.js */
  var items = window.AHORA || [];
  var destacado = document.getElementById('ahora-destacado');
  if (destacado && items.length) {
    var a = items[0];
    destacado.innerHTML =
      '<p class="mini">' + (ingles ? 'Now' : 'Ahora') + ' ↘ ' + esc(a.proyecto) + '</p>' +
      '<p class="dato">' + esc(campo(a, 'titulo')) + '</p>' +
      '<a class="mini" style="display:inline-block;margin-top:6px" href="' + esc(a.liga) + '"' + externa(a.liga) + '>' + esc(campo(a, 'boton')) + ' ↗</a>';
  }
  var lista = document.getElementById('ahora-lista');
  if (lista) {
    lista.innerHTML = items.map(function (it, i) {
      return '<div class="revelar"' + (i ? ' data-retraso="' + Math.min(i, 3) + '"' : '') + '>' +
        '<p class="mini" style="margin-bottom:8px">' + esc(it.proyecto) + '</p>' +
        '<p class="dato" style="margin-bottom:10px">' + esc(campo(it, 'titulo')) + '</p>' +
        '<p class="gris-texto" style="margin-bottom:10px">' + esc(campo(it, 'texto')) + '</p>' +
        '<a class="mini" href="' + esc(it.liga) + '"' + externa(it.liga) + '>' + esc(campo(it, 'boton')) + ' ↗</a></div>';
    }).join('');
  }

  /* Galería: fotos de fotos/galeria/ en orden distinto cada vez.
     Cada foto aparta su espacio, y se descubre cuando ya cargó y entra en pantalla. */
  var galeria = document.getElementById('galeria');
  if (galeria) {
    var fotos = (window.GALERIA || []).slice();
    for (var i = fotos.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = fotos[i]; fotos[i] = fotos[j]; fotos[j] = t;
    }
    if (!fotos.length) {
      galeria.innerHTML = '<p class="mini gris">' + (ingles ? 'Coming soon.' : 'Pronto.') + '</p>';
    } else {
      var alt = ingles ? 'Photograph by April Cosmic' : 'Fotografía de April Cosmic';
      galeria.innerHTML = fotos.map(function (f) {
        if (typeof f === 'string') f = { src: f };
        var prop = f.w && f.h ? ' style="aspect-ratio:' + f.w + '/' + f.h + '"' : '';
        return '<figure class="foto-gal"' + prop + '><img src="' + encodeURI(base + f.src) + '" alt="' + alt + '" loading="lazy" decoding="async"></figure>';
      }).join('');

      var cola = [], pendiente = false;
      function soltar() {
        pendiente = false;
        cola.forEach(function (fig, n) {
          fig.style.setProperty('--d', (n * 110) + 'ms');
          fig.classList.add('visto');
        });
        cola = [];
      }
      function intentar(fig) {
        if (fig.classList.contains('visto') || !fig._cargada || !fig._enPantalla) return;
        cola.push(fig);
        if (!pendiente) { pendiente = true; requestAnimationFrame(soltar); }
      }
      var obsFoto = ('IntersectionObserver' in window && !reducido) ? new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) { e.target._enPantalla = true; obsFoto.unobserve(e.target); intentar(e.target); }
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 }) : null;

      galeria.querySelectorAll('.foto-gal').forEach(function (fig) {
        var img = fig.querySelector('img');
        function listo() {
          if (img.naturalWidth) fig.style.aspectRatio = img.naturalWidth + '/' + img.naturalHeight;
          fig._cargada = true; intentar(fig);
        }
        if (obsFoto) obsFoto.observe(fig); else fig._enPantalla = true;
        if (img.complete && img.naturalWidth) listo(); else img.addEventListener('load', listo);
        img.addEventListener('error', function () { fig.remove(); });
      });
    }
  }

  /* Regla general: toda liga a otro sitio abre en pestaña nueva */
  document.querySelectorAll('a[href]').forEach(function (a) {
    if (/^https?:/i.test(a.getAttribute('href')) && a.hostname !== location.hostname) {
      a.target = '_blank';
      if (!/noopener/.test(a.rel)) a.rel = (a.rel + ' noopener').trim();
    }
  });

  /* Titulares de portada: arrancan cuando la fuente ya cargó */
  function arrancar() { body.classList.add('listo'); }
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { requestAnimationFrame(arrancar); });
    setTimeout(arrancar, 1200);
  } else {
    arrancar();
  }

  /* Revelados al entrar en pantalla */
  var piezas = document.querySelectorAll('.revelar, .cortina, [data-lineas]');
  if (reducido || !('IntersectionObserver' in window)) {
    piezas.forEach(function (el) { el.classList.add('visto'); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    piezas.forEach(function (el) { obs.observe(el); });
  }

  /* Manifiesto: las palabras se encienden conforme bajas */
  var manifiesto = document.querySelector('.manifiesto [data-encender]');
  if (manifiesto) {
    var tenues = manifiesto.querySelectorAll('[data-tenue]');
    tenues.forEach(function (t) { t.setAttribute('data-tenue-texto', '1'); });
    var nodos = [];
    manifiesto.childNodes.forEach(function (n) { nodos.push(n); });
    manifiesto.innerHTML = '';
    nodos.forEach(function (n) {
      var tenue = n.nodeType === 1 && n.hasAttribute('data-tenue');
      if (n.nodeName === 'BR') { manifiesto.appendChild(document.createElement('br')); return; }
      var texto = n.textContent;
      texto.split(/(\s+)/).forEach(function (pedazo) {
        if (!pedazo) return;
        if (/^\s+$/.test(pedazo)) { manifiesto.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'palabra' + (tenue ? ' tenue' : '');
        s.textContent = pedazo;
        manifiesto.appendChild(s);
      });
    });
    var palabras = manifiesto.querySelectorAll('.palabra');
    function encender() {
      var r = manifiesto.getBoundingClientRect();
      var alto = window.innerHeight;
      var avance = (alto * 0.85 - r.top) / (r.height + alto * 0.35);
      avance = Math.max(0, Math.min(1, avance));
      var n = Math.round(avance * palabras.length);
      palabras.forEach(function (p, i) { p.classList.toggle('encendida', i < n); });
    }
    if (reducido) {
      palabras.forEach(function (p) { p.classList.add('encendida'); });
    } else {
      window.addEventListener('scroll', encender, { passive: true });
      window.addEventListener('resize', encender);
      encender();
    }
  }

  /* Encabezado: se esconde al bajar, vuelve al subir */
  var cabecera = document.querySelector('.cabecera');
  var ultimo = window.scrollY;
  window.addEventListener('scroll', function () {
    var y = window.scrollY;
    if (cabecera) cabecera.classList.toggle('oculta', y > ultimo && y > 160);
    ultimo = y;
  }, { passive: true });

  /* Transición suave entre páginas del sitio */
  if (!reducido) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/.test(href)) return;
      e.preventDefault();
      body.classList.add('saliendo');
      setTimeout(function () { window.location.href = href; }, 320);
    });
    window.addEventListener('pageshow', function (e) { if (e.persisted) body.classList.remove('saliendo'); });
  }
})();
