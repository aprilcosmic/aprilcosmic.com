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
      '<p class="mini">' + (ingles ? 'Now' : 'Ahora') + ' ↘' + (a.proyecto !== campo(a, 'titulo') ? ' ' + esc(a.proyecto) : '') + '</p>' +
      '<p class="dato">' + esc(campo(a, 'titulo')) + '</p>' +
      '<a class="mini" style="display:inline-block;margin-top:6px" href="' + esc(a.liga) + '"' + externa(a.liga) + '>' + esc(campo(a, 'boton')) + ' ↗</a>';
  }
  var lista = document.getElementById('ahora-lista');
  if (lista) {
    lista.innerHTML = items.map(function (it, i) {
      return '<div class="revelar"' + (i ? ' data-retraso="' + Math.min(i, 3) + '"' : '') + '>' +
        (it.proyecto !== campo(it, 'titulo') ? '<p class="mini" style="margin-bottom:8px">' + esc(it.proyecto) + '</p>' : '') +
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

  /* DJ: tocadas, mix y canciones desde assets/js/dj.js */
  var dj = window.DJ;
  if (dj) {
    var meses = ingles
      ? ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      : ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    var tocadas = document.getElementById('dj-tocadas');
    if (tocadas && dj.tocadas && dj.tocadas.length) {
      var filas = dj.tocadas.slice().sort(function (a, b) {
        return (b.anio || 0) - (a.anio || 0) || (b.mes || 0) - (a.mes || 0);
      }).map(function (g) {
        var lugar = g.liga ? '<a href="' + esc(g.liga) + '"' + externa(g.liga) + '>' + esc(g.lugar) + '</a>' : esc(g.lugar || '');
        var fecha = (g.mes ? meses[g.mes] + ' ' : '') + (g.anio || '');
        return '<tr><td>' + esc(g.evento) + '</td><td>' + lugar + '</td><td>' + esc(fecha) + '</td></tr>';
      }).join('');
      tocadas.innerHTML = '<div class="tabla revelar"><table><thead><tr><th>' + (ingles ? 'Event' : 'Evento') +
        '</th><th>' + (ingles ? 'With / where' : 'Con / dónde') + '</th><th>' + (ingles ? 'Date' : 'Fecha') +
        '</th></tr></thead><tbody>' + filas + '</tbody></table></div>';
    }

    var mix = document.getElementById('dj-mix');
    if (mix && dj.mix && dj.mix.url) {
      var u = dj.mix.url, src = '', alto = 166;
      if (/soundcloud\.com/.test(u)) {
        src = 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(u) + '&color=%23101010&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&visual=false';
        /* Liga a un perfil completo (soundcloud.com/usuario): se ve la lista de mixes */
        if (/^https?:\/\/(www\.)?soundcloud\.com\/[^\/?#]+\/?$/.test(u)) alto = 360;
      } else if (/mixcloud\.com/.test(u)) {
        var ruta = u.replace(/^https?:\/\/(www\.)?mixcloud\.com/, '');
        src = 'https://player-widget.mixcloud.com/widget/iframe/?hide_cover=1&light=1&feed=' + encodeURIComponent(ruta);
        alto = 120;
      }
      if (src) {
        mix.innerHTML = '<p class="mini" style="margin-bottom:12px">' + (ingles ? 'Latest mix' : 'Último mix') + ' ↘</p>' +
          (dj.mix.titulo ? '<p class="set-titulo">' + esc(dj.mix.titulo) + '</p>' : '') +
          '<iframe src="' + src + '" title="' + esc(dj.mix.titulo || 'Mix') + '" height="' + alto + '" loading="lazy" allow="autoplay"></iframe>' +
          (campo(dj.mix, 'texto') ? '<p class="gris set-vibe">' + esc(campo(dj.mix, 'texto')) + '</p>' : '') +
          '<a class="mini" style="display:inline-block;margin-top:12px" href="' + esc(u) + '" target="_blank" rel="noopener">' +
          (/soundcloud/.test(u) ? 'SoundCloud' : 'Mixcloud') + ' ↗</a>';
        mix.hidden = false;
      }
    }

    var canciones = document.getElementById('dj-canciones');
    if (canciones && dj.canciones && dj.canciones.length) {
      canciones.innerHTML = dj.canciones.map(function (c, i) {
        return '<div class="track revelar"><span class="mini">' + (i < 9 ? '0' : '') + (i + 1) + '</span><p class="cancion">' +
          esc(c.cancion) + '</p><p class="mini suave">' + esc(c.artista) + '</p><p></p></div>';
      }).join('');
      document.getElementById('dj-escucha').hidden = false;
    }
  }

  /* Contadores 1/5, 2/5...: se numeran solos según las secciones visibles */
  var contar = document.querySelector('main[data-contar]');
  if (contar) {
    var nums = [];
    contar.querySelectorAll('.contador .num').forEach(function (n) {
      if (!n.closest('[hidden]')) nums.push(n);
    });
    nums.forEach(function (n, i) { n.textContent = (i + 1) + '/' + nums.length; });
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
