# aprilcosmic.com

Sitio estático (HTML, CSS y JavaScript sin dependencias), listo para GitHub Pages.

## Estructura
- Español en la raíz: `index.html`, `sobre-mi.html`, `dj.html`, `fotografia.html`, `podcasts.html`, `contacto.html` (aprilcosmic.com)
- Inglés en `en/`, con los mismos nombres de archivo (aprilcosmic.com/en/)
- El botón ES / EN del encabezado lleva a la misma página en el otro idioma. Cada página le avisa a Google cuál es su versión en el otro idioma.
- `assets/css/style.css`: todo el diseño y las animaciones
- `assets/js/main.js`: revelados al hacer scroll, manifiesto que se enciende, encabezado que se esconde, transición entre páginas
- `assets/fonts/`: BB Manual Mono Pro Original (Regular, Medium, Bold, Super)
- `assets/img/retrato.jpg`
- `CNAME`: dominio aprilcosmic.com

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub (por ejemplo `aprilcosmic.com`) y sube todo el contenido de esta carpeta a la raíz, y copia `config-github/publicar.yml` a `.github/workflows/publicar.yml`.
2. En el repositorio: Settings > Pages > Build and deployment > Source: "GitHub Actions". Cada vez que subas cambios a `main`, el sitio se publica solo (reduce las fotos y arma la galería).
3. En Custom domain escribe `aprilcosmic.com` (el archivo CNAME ya lo trae) y activa "Enforce HTTPS" cuando aparezca.
4. En tu proveedor de dominio agrega los registros DNS que indica GitHub:
   - Cuatro registros A para `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - Un CNAME para `www` apuntando a `TU-USUARIO.github.io`
   Verifica los valores actuales en la documentación de GitHub Pages antes de configurarlos.
5. Antes de apuntar el dominio, da de baja o desconecta el dominio de Squarespace.

## Actualizar el sitio

### Textos
Cada texto existe dos veces: en la página en español (raíz) y en la de inglés (`en/`). Si cambias algo en una, cámbialo también en la otra. O pídemelo y cambio las dos.

### Ahora (inicio)
Edita `assets/js/ahora.js`. Cada bloque es un elemento; el primero sale arriba junto a tu foto. Para inglés agrega `titulo_en`, `texto_en` o `boton_en`; si no los pones, sale el texto en español. O mándame en el chat "pon este" con la liga y lo cambio yo.

### Galería de Fotografía
Pon o quita fotos en `fotos/galeria/` (JPG, PNG o WEBP). Las dos versiones del sitio usan la misma carpeta. Cada visita las muestra en un orden distinto, y cada foto se descubre al entrar en pantalla. Al publicar, GitHub las reduce a 1600 px y actualiza la lista sola (`assets/js/galeria.js`).
Para verlas en tu compu antes de publicar, la lista se actualiza corriendo `python3 scripts/galeria.py`, o me lo pides.

## Antes de publicar
- Licencia de la fuente: confirma que tu licencia de BB Manual Mono Pro incluye uso web. Si no, compra la licencia webfont o cambia la fuente en `style.css`.
- Placeholders pendientes: kit de prensa, demo reel, fechas de tres balls como jueza y asistencia del conversatorio.

- Revisa los textos en inglés, sobre todo tu ensayo de Sobre mí.

## Animaciones
Todas se desactivan si la persona tiene activado "reducir movimiento" en su sistema.
