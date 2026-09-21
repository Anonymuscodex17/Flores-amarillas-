// =========================================================
// GIRASOLES EN SVG — se construyen por código, no son emojis
// =========================================================
// Cada girasol tiene: sombra de piso, tallo (se dibuja), 2 hojas,
// una capa de pétalos traseros (más oscuros, dan volumen) y una
// capa de pétalos delanteros + centro con brillo (efecto 3D suave).

const SVG_NS = 'http://www.w3.org/2000/svg';
let contadorGirasoles = 0;

function crearElemento(tag, atributos = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [clave, valor] of Object.entries(atributos)) {
    el.setAttribute(clave, valor);
  }
  return el;
}

function formaPetalo(largo, ancho) {
  return `M 0,0 C -${ancho/2},-${largo*0.5} -${ancho/3},-${largo} 0,-${largo} C ${ancho/3},-${largo} ${ancho/2},-${largo*0.5} 0,0 Z`;
}

/**
 * Crea un girasol SVG con volumen (capas de pétalos + sombras)
 * y devuelve el elemento junto con una función "florecer()".
 * @param {object} tema  colores {frente:[c1,c2], atras:[c1,c2]}
 */
function crearGirasol(anchoTotal = 90, altoTallo = 120, numPetalos = 12, escala = 1, tema = null) {
  contadorGirasoles++;
  const id = contadorGirasoles;
  const altoTotal = altoTallo + 90;
  const cx = anchoTotal / 2;
  const baseY = altoTotal;
  const topY = altoTotal - altoTallo;

  // Degradado romántico por defecto si no se especifica uno
  const paleta = tema || { frente: ['#FF8FB3', '#FFD9A0'], atras: ['#D94F79', '#F0A85C'] };

  const svg = crearElemento('svg', {
    width: anchoTotal,
    height: altoTotal,
    viewBox: `0 0 ${anchoTotal} ${altoTotal}`
  });

  // ---- Degradados propios de este girasol (ids únicos) ----
  const defs = crearElemento('defs');

  const gradDelantero = crearElemento('linearGradient', { id: `petaloD-${id}`, x1: '0', y1: '1', x2: '0', y2: '0' });
  gradDelantero.appendChild(crearElemento('stop', { offset: '0%', 'stop-color': paleta.frente[0] }));
  gradDelantero.appendChild(crearElemento('stop', { offset: '100%', 'stop-color': paleta.frente[1] }));
  defs.appendChild(gradDelantero);

  const gradTrasero = crearElemento('linearGradient', { id: `petaloT-${id}`, x1: '0', y1: '1', x2: '0', y2: '0' });
  gradTrasero.appendChild(crearElemento('stop', { offset: '0%', 'stop-color': paleta.atras[0] }));
  gradTrasero.appendChild(crearElemento('stop', { offset: '100%', 'stop-color': paleta.atras[1] }));
  defs.appendChild(gradTrasero);

  const gradCentro = crearElemento('radialGradient', { id: `centroGrad-${id}`, cx: '35%', cy: '30%' });
  gradCentro.appendChild(crearElemento('stop', { offset: '0%', 'stop-color': '#8A5142' }));
  gradCentro.appendChild(crearElemento('stop', { offset: '55%', 'stop-color': '#5B2F2A' }));
  gradCentro.appendChild(crearElemento('stop', { offset: '100%', 'stop-color': '#3A1D1C' }));
  defs.appendChild(gradCentro);
  svg.appendChild(defs);

  // ---- Sombra de piso, da sensación de apoyo/profundidad ----
  const sombra = crearElemento('ellipse', {
    cx, cy: baseY, rx: anchoTotal * 0.28, ry: 5, class: 'sombra-suelo'
  });
  svg.appendChild(sombra);

  // ---- Tallo curvo, ligeramente distinto en cada flor ----
  const curva = (Math.random() - 0.5) * 16;
  const dTallo = `M ${cx} ${baseY} C ${cx + curva} ${baseY - altoTallo * 0.6}, ${cx - curva} ${topY + altoTallo * 0.3}, ${cx} ${topY}`;
  const tallo = crearElemento('path', { d: dTallo, class: 'tallo' });
  tallo.style.strokeWidth = (4 * escala) + 'px';
  svg.appendChild(tallo);

  // ---- Hojas ----
  function crearHoja(y, lado) {
    const ancho = 26 * escala, alto = 14 * escala;
    const puntoX = cx + (lado * 3);
    const d = lado > 0
      ? `M ${puntoX} ${y} C ${puntoX + ancho * 0.3} ${y - alto}, ${puntoX + ancho} ${y - alto * 0.2}, ${puntoX + ancho * 1.1} ${y} C ${puntoX + ancho} ${y + alto * 0.5}, ${puntoX + ancho * 0.3} ${y + alto * 0.3}, ${puntoX} ${y} Z`
      : `M ${puntoX} ${y} C ${puntoX - ancho * 0.3} ${y - alto}, ${puntoX - ancho} ${y - alto * 0.2}, ${puntoX - ancho * 1.1} ${y} C ${puntoX - ancho} ${y + alto * 0.5}, ${puntoX - ancho * 0.3} ${y + alto * 0.3}, ${puntoX} ${y} Z`;
    const hoja = crearElemento('path', { d, class: 'hoja' });
    hoja.style.transformOrigin = `${puntoX}px ${y}px`;
    return hoja;
  }
  const hoja1 = crearHoja(baseY - altoTallo * 0.35, 1);
  const hoja2 = crearHoja(baseY - altoTallo * 0.6, -1);
  svg.appendChild(hoja1);
  svg.appendChild(hoja2);

  // ---- Cabeza del girasol ----
  const cabeza = crearElemento('g', { transform: `translate(${cx}, ${topY})` });

  // Capa trasera: pétalos más grandes y oscuros, desfasados a medio paso
  // (asoman por detrás de los delanteros → sensación de volumen)
  const traseros = [];
  const pasoAngulo = 360 / numPetalos;
  for (let i = 0; i < numPetalos; i++) {
    const angulo = pasoAngulo * i + pasoAngulo / 2;
    const grupo = crearElemento('g', { transform: `rotate(${angulo})` });
    const petalo = crearElemento('path', {
      d: formaPetalo(33 * escala, 11 * escala), class: 'petalo-svg', fill: `url(#petaloT-${id})`
    });
    petalo.style.transformOrigin = '0px 0px';
    grupo.appendChild(petalo);
    cabeza.appendChild(grupo);
    traseros.push(petalo);
  }

  // Capa delantera: pétalos más claros y un poco más pequeños, encima
  const delanteros = [];
  for (let i = 0; i < numPetalos; i++) {
    const angulo = pasoAngulo * i;
    const grupo = crearElemento('g', { transform: `rotate(${angulo})` });
    const petalo = crearElemento('path', {
      d: formaPetalo(29 * escala, 9.5 * escala), class: 'petalo-svg', fill: `url(#petaloD-${id})`
    });
    petalo.style.transformOrigin = '0px 0px';
    grupo.appendChild(petalo);
    cabeza.appendChild(grupo);
    delanteros.push(petalo);
  }
  const petalos = [...traseros, ...delanteros];

  // Centro con textura de semillitas + brillo (luz falsa para dar volumen)
  const centro = crearElemento('g', { class: 'centro-girasol' });
  centro.style.transformOrigin = '0px 0px';
  centro.appendChild(crearElemento('circle', { cx: 0, cy: 0, r: 15 * escala, fill: `url(#centroGrad-${id})` }));
  for (let i = 0; i < 12; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = Math.random() * 11.5 * escala;
    centro.appendChild(crearElemento('circle', {
      cx: Math.cos(ang) * rad, cy: Math.sin(ang) * rad, r: 1.1 * escala, fill: '#2A1B0C'
    }));
  }
  // pequeño brillo ovalado, como reflejo de luz
  centro.appendChild(crearElemento('ellipse', {
    cx: -5 * escala, cy: -6 * escala, rx: 4.5 * escala, ry: 2.5 * escala, fill: 'rgba(255,255,255,0.35)'
  }));
  cabeza.appendChild(centro);
  svg.appendChild(cabeza);

  // ---- Contenedor final ----
  const contenedor = document.createElement('div');
  contenedor.className = 'girasol';
  contenedor.style.setProperty('--duracion', (3.5 + Math.random() * 2) + 's');
  contenedor.appendChild(svg);

  // ---- Medir el tallo real para animar su trazo ----
  const largoTallo = tallo.getTotalLength();
  tallo.style.strokeDasharray = largoTallo;
  tallo.style.strokeDashoffset = largoTallo;

  // ---- Función que hace florecer este girasol paso a paso ----
  function florecer() {
    requestAnimationFrame(() => { tallo.style.strokeDashoffset = 0; });

    setTimeout(() => { hoja1.classList.add('mostrar'); }, 500);
    setTimeout(() => { hoja2.classList.add('mostrar'); }, 700);

    petalos.forEach((petalo, i) => {
      setTimeout(() => petalo.classList.add('mostrar'), 1100 + i * 35);
    });

    setTimeout(() => {
      centro.classList.add('mostrar');
      contenedor.classList.add('balanceo');
    }, 1100 + petalos.length * 35 + 250);
  }

  return { contenedor, florecer };
}

// =========================================================
// PORTADA: un girasol ya florecido, de bienvenida
// =========================================================
const florPortada = document.getElementById('florPortada');
const { contenedor: girasolPortada, florecer: florecerPortada } = crearGirasol(110, 65, 13, 1.5,
  { frente: ['#F5B233', '#FFE58A'], atras: ['#C97A1B', '#E8992A'] }
);
florPortada.appendChild(girasolPortada);
setTimeout(florecerPortada, 200);

// =========================================================
// JARDÍN: florece solo, sin necesidad de hacer clic
// Es el protagonista de la página: MUCHOS girasoles, de
// tamaños variados (grandes al frente, chiquitos atrás),
// bien juntos para que se sienta lleno y tupido.
// =========================================================
const jardin = document.getElementById('jardin');

// Paleta netamente amarilla: varía entre dorado fuerte, amarillo
// pálido y ámbar, para que no se vean todas idénticas pero sí
// claramente amarillas
const paletasAmarillas = [
  { frente: ['#F5B233', '#FFE58A'], atras: ['#C97A1B', '#E8992A'] },
  { frente: ['#F7C948', '#FFF3B0'], atras: ['#D98A2B', '#F0B94A'] },
  { frente: ['#EFA429', '#FBD34D'], atras: ['#B5730E', '#DB9A2E'] },
  { frente: ['#FFCB4D', '#FFF6D2'], atras: ['#D9A62B', '#F2C766'] },
];

// Genera 3 "capas de profundidad" (fondo, medio, frente), cada
// una repartida a lo ANCHO de la misma franja (no en filas nuevas
// hacia abajo). Las de fondo son chiquitas, borrosas y quedan más
// arriba (como si estuvieran más lejos); las de frente son grandes,
// nítidas y quedan abajo, tapando a las de atrás. 100 en total.
const capasConfig = {
  fondo:  { cantidad: 54, alturaBase: 90,  alturaVar: 40, escalaBase: 0.95, escalaVar: 0.3,  ancho: 110, abajoPx: 26, blur: 1.6, opacidad: 0.8,  zBase: 1   },
  medio:  { cantidad: 34, alturaBase: 160, alturaVar: 55, escalaBase: 1.7,  escalaVar: 0.35, ancho: 170, abajoPx: 12, blur: 0.6, opacidad: 0.92, zBase: 100 },
  frente: { cantidad: 10, alturaBase: 230, alturaVar: 60, escalaBase: 2.4,  escalaVar: 0.45, ancho: 230, abajoPx: 0,  blur: 0,   opacidad: 1,    zBase: 200 },
};

const girasolesJardin = [];

// Importante: se dibujan en este orden (fondo → medio → frente)
// para que las de adelante queden pintadas encima de las de atrás.
for (const nombreCapa of ['fondo', 'medio', 'frente']) {
  const { cantidad, alturaBase, alturaVar, escalaBase, escalaVar, ancho, abajoPx, blur, opacidad, zBase } = capasConfig[nombreCapa];

  for (let i = 0; i < cantidad; i++) {
    const altura = alturaBase + Math.random() * alturaVar;
    const escala = escalaBase + Math.random() * escalaVar;
    const paleta = paletasAmarillas[Math.floor(Math.random() * paletasAmarillas.length)];
    const numPetalos = escala > 1.2 ? 12 + Math.floor(Math.random() * 3) : 9 + Math.floor(Math.random() * 3);
    const g = crearGirasol(ancho, altura, numPetalos, escala, paleta);

    // Posición horizontal: repartidas a lo ancho de TODA la franja,
    // con un poco de desorden para que no se vea en cuadrícula
    const xPorcentaje = ((i + 0.5) / cantidad) * 100 + (Math.random() * 6 - 3);

    g.contenedor.style.position = 'absolute';
    g.contenedor.style.left = `calc(${xPorcentaje}% - ${ancho / 2}px)`;
    g.contenedor.style.bottom = abajoPx + 'px';
    g.contenedor.style.filter = `blur(${blur}px)`;
    g.contenedor.style.opacity = opacidad;
    g.contenedor.style.zIndex = zBase + i;

    girasolesJardin.push(g);
  }
}

girasolesJardin.forEach(({ contenedor }) => jardin.appendChild(contenedor));

// Florecen uno tras otro, rapidito porque son muchas
girasolesJardin.forEach(({ florecer }, i) => {
  setTimeout(florecer, 200 + i * 40);
});

// =========================================================
// POLEN: puntitos de luz que suben lentamente desde el jardín,
// puro decorado para que el jardín se sienta vivo
// =========================================================
const contenedorPolen = document.getElementById('polen');

function crearMotaPolen() {
  const mota = document.createElement('div');
  mota.className = 'mota-polen';
  mota.style.left = (10 + Math.random() * 80) + 'vw';
  mota.style.setProperty('--deriva', (Math.random() * 60 - 30) + 'px');
  const duracion = 6 + Math.random() * 5;
  mota.style.animationDuration = duracion + 's';
  contenedorPolen.appendChild(mota);
  setTimeout(() => mota.remove(), duracion * 1000);
}

// Suelta una motita nueva cada cierto tiempo, de forma continua
setInterval(crearMotaPolen, 500);

// =========================================================
// Abrir la tarjeta: pasa de "portada" a "mensaje"
// =========================================================
const portada = document.getElementById('portada');
const mensaje = document.getElementById('mensaje');
const botonAbrir = document.getElementById('botonAbrir');

botonAbrir.addEventListener('click', () => {
  portada.style.display = 'none';
  mensaje.classList.add('visible');

  const lineas = mensaje.querySelectorAll('.linea, .firma');
  lineas.forEach((el, index) => {
    el.style.animationDelay = (index * 0.35) + 's';
  });
});