// =========================================================
// 🌻 JARDÍN DE FLORES AMARILLAS
// Versión optimizada para PC + móvil
// =========================================================

const SVG_NS = 'http://www.w3.org/2000/svg';

let contadorGirasoles = 0;

// ---------------------------------------------------------
// 📱 DETECTAR DISPOSITIVO
// ---------------------------------------------------------

const esMovil = window.matchMedia('(max-width: 768px)').matches;
const pantallaPequena = window.matchMedia('(max-width: 420px)').matches;

// Configuración general
const CONFIG = {
  movil: esMovil,

  // Flores del jardín
  floresJardin: esMovil ? 22 : 60,

  // Polen
  intervaloPolen: esMovil ? 1800 : 900,

  // Animaciones
  duracionBalanceo: esMovil ? 7 : 5,

  // Pétalos
  petalosFondo: esMovil ? 6 : 7,
  petalosMedio: esMovil ? 7 : 9,
  petalosFrente: esMovil ? 9 : 11
};

// ---------------------------------------------------------
// 🛠️ CREAR ELEMENTOS SVG
// ---------------------------------------------------------

function crearElemento(tag, atributos = {}) {

  const elemento = document.createElementNS(
    SVG_NS,
    tag
  );

  Object.entries(atributos).forEach(([clave, valor]) => {
    elemento.setAttribute(clave, valor);
  });

  return elemento;
}

// ---------------------------------------------------------
// 🌼 FORMA DEL PÉTALO
// ---------------------------------------------------------

function formaPetalo(largo, ancho) {

  return `
    M 0,0
    C -${ancho * 0.45},-${largo * 0.45}
      -${ancho * 0.35},-${largo * 0.9}
      0,-${largo}
    C ${ancho * 0.35},-${largo * 0.9}
      ${ancho * 0.45},-${largo * 0.45}
      0,0
    Z
  `;
}

// ---------------------------------------------------------
// 🌻 CREAR GIRASOL
// ---------------------------------------------------------

function crearGirasol(
  anchoTotal = 90,
  altoTallo = 120,
  numPetalos = 10,
  escala = 1,
  tema = null
) {

  contadorGirasoles++;

  const id = contadorGirasoles;

  const altoCabeza = 75;

  const altoTotal =
    altoTallo + altoCabeza;

  const cx =
    anchoTotal / 2;

  const baseY =
    altoTotal;

  const topY =
    altoTotal - altoTallo;


  // -------------------------------------------------------
  // 🎨 PALETA
  // -------------------------------------------------------

  const paleta = tema || {
    frente: ['#F5B233', '#FFE58A'],
    atras: ['#C97A1B', '#E8992A']
  };


  // -------------------------------------------------------
  // SVG
  // -------------------------------------------------------

  const svg = crearElemento('svg', {

    width: anchoTotal,

    height: altoTotal,

    viewBox:
      `0 0 ${anchoTotal} ${altoTotal}`

  });


  // -------------------------------------------------------
  // DEGRADADOS
  // -------------------------------------------------------

  const defs =
    crearElemento('defs');


  const gradFrente =
    crearElemento(
      'linearGradient',
      {
        id: `petaloFrente-${id}`,
        x1: '0',
        y1: '1',
        x2: '0',
        y2: '0'
      }
    );


  gradFrente.appendChild(
    crearElemento(
      'stop',
      {
        offset: '0%',
        'stop-color':
          paleta.frente[0]
      }
    )
  );


  gradFrente.appendChild(
    crearElemento(
      'stop',
      {
        offset: '100%',
        'stop-color':
          paleta.frente[1]
      }
    )
  );


  defs.appendChild(
    gradFrente
  );


  const gradAtras =
    crearElemento(
      'linearGradient',
      {
        id: `petaloAtras-${id}`,
        x1: '0',
        y1: '1',
        x2: '0',
        y2: '0'
      }
    );


  gradAtras.appendChild(
    crearElemento(
      'stop',
      {
        offset: '0%',
        'stop-color':
          paleta.atras[0]
      }
    )
  );


  gradAtras.appendChild(
    crearElemento(
      'stop',
      {
        offset: '100%',
        'stop-color':
          paleta.atras[1]
      }
    )
  );


  defs.appendChild(
    gradAtras
  );


  const gradCentro =
    crearElemento(
      'radialGradient',
      {
        id: `centro-${id}`,
        cx: '35%',
        cy: '30%'
      }
    );


  gradCentro.appendChild(
    crearElemento(
      'stop',
      {
        offset: '0%',
        'stop-color': '#986052'
      }
    )
  );


  gradCentro.appendChild(
    crearElemento(
      'stop',
      {
        offset: '60%',
        'stop-color': '#5B302A'
      }
    )
  );


  gradCentro.appendChild(
    crearElemento(
      'stop',
      {
        offset: '100%',
        'stop-color': '#321919'
      }
    )
  );


  defs.appendChild(
    gradCentro
  );


  svg.appendChild(defs);


  // -------------------------------------------------------
  // 🌱 TALLO
  // -------------------------------------------------------

  const curva =
    (Math.random() - 0.5) * 14;


  const dTallo = `
    M ${cx} ${baseY}
    C ${cx + curva} ${baseY - altoTallo * 0.55},
      ${cx - curva} ${topY + altoTallo * 0.25},
      ${cx} ${topY}
  `;


  const tallo =
    crearElemento(
      'path',
      {
        d: dTallo,
        class: 'tallo'
      }
    );


  tallo.style.strokeWidth =
    Math.max(2.5, 4 * escala) + 'px';


  svg.appendChild(tallo);


  // -------------------------------------------------------
  // 🍃 HOJAS
  // -------------------------------------------------------

  function crearHoja(
    y,
    lado
  ) {

    const ancho =
      25 * escala;

    const alto =
      13 * escala;

    const x =
      cx + lado * 3;


    const d = lado > 0

      ? `
        M ${x} ${y}
        C ${x + ancho * 0.35} ${y - alto},
          ${x + ancho} ${y - alto * 0.2},
          ${x + ancho * 1.05} ${y}
        C ${x + ancho} ${y + alto * 0.4},
          ${x + ancho * 0.3} ${y + alto * 0.3},
          ${x} ${y}
        Z
      `

      : `
        M ${x} ${y}
        C ${x - ancho * 0.35} ${y - alto},
          ${x - ancho} ${y - alto * 0.2},
          ${x - ancho * 1.05} ${y}
        C ${x - ancho} ${y + alto * 0.4},
          ${x - ancho * 0.3} ${y + alto * 0.3},
          ${x} ${y}
        Z
      `;


    const hoja =
      crearElemento(
        'path',
        {
          d,
          class: 'hoja'
        }
      );


    hoja.style.transformOrigin =
      `${x}px ${y}px`;


    return hoja;
  }


  const hoja1 =
    crearHoja(
      baseY - altoTallo * 0.38,
      1
    );


  const hoja2 =
    crearHoja(
      baseY - altoTallo * 0.62,
      -1
    );


  svg.appendChild(hoja1);
  svg.appendChild(hoja2);


  // -------------------------------------------------------
  // 🌻 CABEZA
  // -------------------------------------------------------

  const cabeza =
    crearElemento(
      'g',
      {
        transform:
          `translate(${cx}, ${topY})`
      }
    );


  const paso =
    360 / numPetalos;


  const petalos = [];


  // -------------------------------------------------------
  // PETALOS TRASEROS
  // -------------------------------------------------------

  for (
    let i = 0;
    i < numPetalos;
    i++
  ) {

    const angulo =
      i * paso + paso / 2;


    const grupo =
      crearElemento(
        'g',
        {
          transform:
            `rotate(${angulo})`
        }
      );


    const petalo =
      crearElemento(
        'path',
        {
          d:
            formaPetalo(
              32 * escala,
              10 * escala
            ),

          class:
            'petalo-svg',

          fill:
            `url(#petaloAtras-${id})`
        }
      );


    grupo.appendChild(petalo);

    cabeza.appendChild(grupo);

    petalos.push(petalo);
  }


  // -------------------------------------------------------
  // PETALOS DELANTEROS
  // -------------------------------------------------------

  for (
    let i = 0;
    i < numPetalos;
    i++
  ) {

    const angulo =
      i * paso;


    const grupo =
      crearElemento(
        'g',
        {
          transform:
            `rotate(${angulo})`
        }
      );


    const petalo =
      crearElemento(
        'path',
        {
          d:
            formaPetalo(
              28 * escala,
              9 * escala
            ),

          class:
            'petalo-svg',

          fill:
            `url(#petaloFrente-${id})`
        }
      );


    grupo.appendChild(petalo);

    cabeza.appendChild(grupo);

    petalos.push(petalo);
  }


  // -------------------------------------------------------
  // 🤎 CENTRO
  // -------------------------------------------------------

  const centro =
    crearElemento(
      'g',
      {
        class:
          'centro-girasol'
      }
    );


  centro.style.transformOrigin =
    '0 0';


  centro.appendChild(
    crearElemento(
      'circle',
      {
        cx: 0,
        cy: 0,
        r: 15 * escala,
        fill:
          `url(#centro-${id})`
      }
    )
  );


  // -------------------------------------------------------
  // SEMILLAS
  // -------------------------------------------------------

  const semillas =
    CONFIG.movil ? 5 : 7;


  for (
    let i = 0;
    i < semillas;
    i++
  ) {

    const angulo =
      Math.random() *
      Math.PI *
      2;


    const radio =
      Math.random() *
      10 *
      escala;


    centro.appendChild(
      crearElemento(
        'circle',
        {
          cx:
            Math.cos(angulo) *
            radio,

          cy:
            Math.sin(angulo) *
            radio,

          r:
            Math.max(
              0.8,
              1.1 * escala
            ),

          fill:
            '#24150C'
        }
      )
    );
  }


  // Pequeño brillo
  centro.appendChild(
    crearElemento(
      'ellipse',
      {
        cx: -5 * escala,
        cy: -6 * escala,
        rx: 4 * escala,
        ry: 2.2 * escala,
        fill:
          'rgba(255,255,255,0.3)'
      }
    )
  );


  cabeza.appendChild(centro);

  svg.appendChild(cabeza);


  // -------------------------------------------------------
  // CONTENEDOR
  // -------------------------------------------------------

  const contenedor =
    document.createElement('div');


  contenedor.className =
    'girasol';


  contenedor.style.setProperty(
    '--duracion',
    (
      CONFIG.duracionBalanceo +
      Math.random() * 1.5
    ) + 's'
  );


  contenedor.appendChild(svg);


  // -------------------------------------------------------
  // ANIMACIÓN DEL TALLO
  // -------------------------------------------------------

  let longitudTallo = 0;


  try {

    longitudTallo =
      tallo.getTotalLength();

  } catch {

    longitudTallo = 100;

  }


  tallo.style.strokeDasharray =
    longitudTallo;


  tallo.style.strokeDashoffset =
    longitudTallo;


  // -------------------------------------------------------
  // 🌱 FLORECER
  // -------------------------------------------------------

  function florecer() {

    requestAnimationFrame(() => {

      tallo.style.strokeDashoffset =
        '0';

    });


    // Primera hoja
    setTimeout(() => {

      hoja1.classList.add(
        'mostrar'
      );

    }, 350);


    // Segunda hoja
    setTimeout(() => {

      hoja2.classList.add(
        'mostrar'
      );

    }, 500);


    // Pétalos
    const retraso =
      CONFIG.movil
        ? 18
        : 25;


    petalos.forEach(
      (petalo, indice) => {

        setTimeout(() => {

          petalo.classList.add(
            'mostrar'
          );

        }, 650 + indice * retraso);

      }
    );


    // Centro
    setTimeout(() => {

      centro.classList.add(
        'mostrar'
      );


      contenedor.classList.add(
        'balanceo'
      );

    }, 650 + petalos.length * retraso + 150);

  }


  return {
    contenedor,
    florecer
  };
}


// =========================================================
// 🌻 FLOR PRINCIPAL DE LA PORTADA
// =========================================================

const florPortada =
  document.getElementById(
    'florPortada'
  );


const portadaGirasol =
  crearGirasol(
    110,
    65,
    13,
    1.5,
    {
      frente: [
        '#F5B233',
        '#FFE58A'
      ],

      atras: [
        '#C97A1B',
        '#E8992A'
      ]
    }
  );


florPortada.appendChild(
  portadaGirasol.contenedor
);


setTimeout(
  portadaGirasol.florecer,
  200
);


// =========================================================
// 🌻 JARDÍN
// =========================================================

const jardin =
  document.getElementById(
    'jardin'
  );


const paletasAmarillas = [

  {
    frente: [
      '#F5B233',
      '#FFE58A'
    ],

    atras: [
      '#C97A1B',
      '#E8992A'
    ]
  },

  {
    frente: [
      '#F7C948',
      '#FFF3B0'
    ],

    atras: [
      '#D98A2B',
      '#F0B94A'
    ]
  },

  {
    frente: [
      '#EFA429',
      '#FBD34D'
    ],

    atras: [
      '#B5730E',
      '#DB9A2E'
    ]
  },

  {
    frente: [
      '#FFCB4D',
      '#FFF6D2'
    ],

    atras: [
      '#D9A62B',
      '#F2C766'
    ]
  }

];


// =========================================================
// CAPAS DEL JARDÍN
// =========================================================

const capasConfig = CONFIG.movil

  ? {

      fondo: {

        cantidad: 10,

        alturaBase: 85,

        alturaVar: 30,

        escalaBase: 0.75,

        escalaVar: 0.2,

        ancho: 95,

        abajoPx: 25,

        opacidad: 0.7,

        zBase: 1,

        petalos:
          CONFIG.petalosFondo

      },


      medio: {

        cantidad: 8,

        alturaBase: 140,

        alturaVar: 40,

        escalaBase: 1.25,

        escalaVar: 0.25,

        ancho: 145,

        abajoPx: 10,

        opacidad: 0.88,

        zBase: 50,

        petalos:
          CONFIG.petalosMedio

      },


      frente: {

        cantidad: 4,

        alturaBase: 205,

        alturaVar: 40,

        escalaBase: 1.9,

        escalaVar: 0.3,

        ancho: 205,

        abajoPx: 0,

        opacidad: 1,

        zBase: 100,

        petalos:
          CONFIG.petalosFrente

      }

    }

  : {

      fondo: {

        cantidad: 30,

        alturaBase: 90,

        alturaVar: 35,

        escalaBase: 0.85,

        escalaVar: 0.25,

        ancho: 105,

        abajoPx: 25,

        opacidad: 0.72,

        zBase: 1,

        petalos:
          CONFIG.petalosFondo

      },


      medio: {

        cantidad: 20,

        alturaBase: 150,

        alturaVar: 50,

        escalaBase: 1.45,

        escalaVar: 0.3,

        ancho: 155,

        abajoPx: 10,

        opacidad: 0.9,

        zBase: 50,

        petalos:
          CONFIG.petalosMedio

      },


      frente: {

        cantidad: 10,

        alturaBase: 220,

        alturaVar: 55,

        escalaBase: 2.1,

        escalaVar: 0.35,

        ancho: 215,

        abajoPx: 0,

        opacidad: 1,

        zBase: 100,

        petalos:
          CONFIG.petalosFrente

      }

    };


// =========================================================
// 🌱 CREAR FLORES POR TANDAS
// =========================================================

const flores =
  [];


// Crear primero las configuraciones
// para evitar un golpe fuerte al navegador.

for (
  const nombreCapa of [
    'fondo',
    'medio',
    'frente'
  ]
) {

  const capa =
    capasConfig[
      nombreCapa
    ];


  for (
    let i = 0;
    i < capa.cantidad;
    i++
  ) {

    const altura =
      capa.alturaBase +
      Math.random() *
      capa.alturaVar;


    const escala =
      capa.escalaBase +
      Math.random() *
      capa.escalaVar;


    const paleta =
      paletasAmarillas[
        Math.floor(
          Math.random() *
          paletasAmarillas.length
        )
      ];


    const girasol =
      crearGirasol(
        capa.ancho,
        altura,
        capa.petalos,
        escala,
        paleta
      );


    // Posición horizontal
    const porcentaje =
      ((i + 0.5) /
        capa.cantidad) *
      100 +
      (Math.random() * 5 - 2.5);


    girasol.contenedor.style.position =
      'absolute';


    girasol.contenedor.style.left =
      `calc(${porcentaje}% - ${capa.ancho / 2}px)`;


    girasol.contenedor.style.bottom =
      capa.abajoPx + 'px';


    girasol.contenedor.style.opacity =
      capa.opacidad;


    girasol.contenedor.style.zIndex =
      capa.zBase + i;


    flores.push(
      girasol
    );

  }
}


// =========================================================
// 📦 INSERTAR LAS FLORES
// =========================================================

const fragmento =
  document.createDocumentFragment();


flores.forEach(
  flor => {

    fragmento.appendChild(
      flor.contenedor
    );

  }
);


jardin.appendChild(
  fragmento
);


// =========================================================
// 🌱 HACER FLORECER
// =========================================================

// No hacemos que todas florezcan
// exactamente al mismo tiempo.

const retrasoFlores =
  CONFIG.movil
    ? 100
    : 70;


flores.forEach(
  (
    flor,
    indice
  ) => {

    setTimeout(
      flor.florecer,
      250 +
      indice *
      retrasoFlores
    );

  }
);


// =========================================================
// ✨ POLEN
// =========================================================

const contenedorPolen =
  document.getElementById(
    'polen'
  );


function crearMotaPolen() {

  // En móviles evitamos acumular demasiadas partículas.
  if (
    CONFIG.movil &&
    contenedorPolen.children.length >= 5
  ) {
    return;
  }


  if (
    !CONFIG.movil &&
    contenedorPolen.children.length >= 10
  ) {
    return;
  }


  const mota =
    document.createElement(
      'div'
    );


  mota.className =
    'mota-polen';


  mota.style.left =
    (
      10 +
      Math.random() * 80
    ) + 'vw';


  mota.style.setProperty(
    '--deriva',
    (
      Math.random() * 50 -
      25
    ) + 'px'
  );


  const duracion =
    CONFIG.movil
      ? 8 + Math.random() * 4
      : 6 + Math.random() * 4;


  mota.style.animationDuration =
    duracion + 's';


  contenedorPolen.appendChild(
    mota
  );


  setTimeout(() => {

    mota.remove();

  }, duracion * 1000);

}


setInterval(
  crearMotaPolen,
  CONFIG.intervaloPolen
);


// =========================================================
// 💌 ABRIR MENSAJE
// =========================================================

const portada =
  document.getElementById(
    'portada'
  );


const mensaje =
  document.getElementById(
    'mensaje'
  );


const botonAbrir =
  document.getElementById(
    'botonAbrir'
  );


botonAbrir.addEventListener(
  'click',
  () => {

    // Ocultar portada
    portada.style.display =
      'none';


    // Mostrar mensaje
    mensaje.classList.add(
      'visible'
    );


    // Animar cada línea
    const lineas =
      mensaje.querySelectorAll(
        '.linea, .firma'
      );


    lineas.forEach(
      (
        elemento,
        indice
      ) => {

        elemento.style.animationDelay =
          (
            indice * 0.35
          ) + 's';

      }
    );

  }
);


// =========================================================
// ♿ REDUCIR ANIMACIONES
// =========================================================

const prefiereMenosMovimiento =
  window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;


if (
  prefiereMenosMovimiento
) {

  document
    .querySelectorAll(
      '.girasol'
    )
    .forEach(
      flor => {

        flor.classList.remove(
          'balanceo'
        );

      }
    );

}


// =========================================================
// 📊 INFORMACIÓN EN CONSOLA
// =========================================================

console.log(
  '🌻 Jardín cargado:',
  CONFIG.floresJardin,
  'flores |',
  CONFIG.movil
    ? '📱 Modo móvil'
    : '💻 Modo PC'
);
