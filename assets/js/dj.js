/*
  DJ · lo que cambia seguido en la página de DJ
  ------------------------------------------------------------
  TOCADAS ("He tocado en" / "Played at")
    Agrega un bloque { ... } por tocada, en cualquier orden:
    la página las acomoda sola de la más nueva a la más vieja.
      evento: nombre del evento o del lugar
      lugar:  con quién o dónde (bar, colectivo, ciudad)
      liga:   opcional, sitio del lugar
      mes:    número del 1 al 12 (si no lo sabes, quítalo)
      anio:   año

  MIX ("Latest mix")
    Pega en url la liga de SoundCloud o Mixcloud. Mientras esté vacía,
    el espacio no aparece.

  CANCIONES ("Lo que vas a escuchar" / "What you'll hear")
    De 6 a 8 canciones que sí pones. Mientras la lista esté vacía,
    la sección no aparece.
*/
window.DJ = {
  mix: {
    url: "https://soundcloud.com/aprilcosmic",
    titulo: "",
    texto: "",
    texto_en: ""
  },

  tocadas: [
    { evento: "Pre Pride Party", lugar: "Just Fly", mes: 5, anio: 2025 },
    { evento: "The Gallery", lugar: "Lisztomaniac", mes: 12, anio: 2024 },
    { evento: "Queer Spooky Party", lugar: "Just Fly", mes: 10, anio: 2024 },
    { evento: "The Cosmic Renaissance Ball", lugar: "House of Cosmic", liga: "https://houseofcosmic.com", anio: 2024 },
    { evento: "Super Graphic Ultra Mega Ball with Mich", lugar: "House of Cosmic", liga: "https://houseofcosmic.com", anio: 2024 },
    { evento: "Fugaz Mini Ball", lugar: "House of Cosmic", liga: "https://houseofcosmic.com", anio: 2023 }
  ],

  canciones: [
    // { cancion: "Nombre", artista: "Artista" },
  ]
};
