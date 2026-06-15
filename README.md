# Casa Inteligente · Panel de control

Tarea del curso **Diseño Avanzado de Aplicaciones Web** — tema **Web Components**.

Es un **panel de domótica** para configurar un dormitorio. Lo distintivo es que la
página tiene una **maqueta viva de la habitación** (arriba del todo) que **reacciona en
tiempo real** a cada control: al mover un slider, tocar un switch, pulsar `+/−` en un
campo numérico o hacer clic en una escena, la habitación cambia de brillo, color de luz,
volumen e insignias de modo. Así se *demuestra* que cada Web Component funciona, no solo
que se ve.

Todos los controles son **Web Components nativos**, sin frameworks.

---

## 1. Cómo ejecutar

Los componentes se cargan como **módulos ES** (`<script type="module">`), y Chrome
**bloquea `file://`** por CORS. Hay que servir la carpeta por HTTP:

- **VS Code → Live Server**: clic derecho en `index.html` → *Open with Live Server*.
- o por terminal: `npx serve` (o `python -m http.server`) y abrir la URL en **Chrome**.

No requiere instalar dependencias ni build.

> **Carpeta de componentes correcta:** ✅ **`componentes/`** (en español) es la única que
> la app usa. La carpeta **`components/`** (en inglés) está **desactualizada** —contiene
> versiones viejas y archivos sueltos (`campo-texto.js`, `number-component.js`,
> `slider-component.js`) que no se usan— y se deja **fuera del flujo**. No mezclar ambas.

---

## 2. Requisitos del enunciado → dónde se cumplen

### Estándares nativos usados (todos los componentes)
| Estándar | Dónde |
|---|---|
| **HTML `<template>`** | cada componente define `document.createElement("template")` con su HTML+CSS |
| **Custom Elements** | `customElements.define(...)` al final de cada archivo |
| **Shadow DOM** | `this.attachShadow({ mode: "open" })` en cada constructor |
| **Vanilla JS** | sin imports de librerías; solo APIs del navegador |
| **Sin frameworks** | no hay Lit/React/Vue/Svelte ni dependencias |

### Los 7 componentes pedidos (todos en uso y reutilizados)
| # | Pedido | Componente (`componentes/…`) | Veces en la app |
|---|---|---|---|
| 1 | Campo numérico con botones +/− | `campo-numerico.js` | **3** (minutos, prioridad, personas) |
| 2 | Slider | `mi-slider.js` (+ `mi-slider-label`) | **3** (brillo, temperatura, volumen) |
| 3 | Switch | `mi-switch.js` | **4** (luz, notificaciones, ahorro, no molestar) |
| 4 | Breadcrumb | `mi-breadcrumb.js` (+ item) | 1 (Casa › Espacios › Dormitorio) |
| 5 | Accordion | `mi-accordion.js` (+ item) | 1 con **3 ítems** |
| 6 | Card con dimensiones por CSS | `mi-card.js` | **9** (1 demo + escenas + dispositivos) |
| 7 | Horizontal scroll | `mi-horizontal-scroll.js` | 1 (carrusel de escenas) |

---

## 3. Qué hace y cómo se usa cada componente

### `mi-slider` + `mi-slider-label`
Control deslizante. Coloca cada etiqueta hija en su posición según `position`.
- **Atributos:** `min`, `max`, `value`, `step`.
- **Slot:** etiquetas `<mi-slider-label position="…">`.
- **Evento:** `change` con `{ detail: { value } }`.
```html
<mi-slider id="slider-temp" min="16" max="30" value="22" step="1">
  <mi-slider-label position="16">16℃</mi-slider-label>
  <mi-slider-label position="30">30℃</mi-slider-label>
</mi-slider>
```

### `campo-numerico`
Campo numérico con botones `−` y `+` que respetan el rango.
- **Atributos:** `min`, `max`, `value`. **Evento:** `change`.
```html
<campo-numerico id="campo-min" value="30" min="0" max="120"></campo-numerico>
```

### `mi-switch`
Interruptor on/off con etiquetas a los lados y color personalizable.
- **Atributos:** `ll` (izq), `rl` (der), `color`, `checked`.
- **Propiedad:** `.checked`. **Evento:** `change` con `{ detail: { checked } }`.
```html
<mi-switch id="sw-luz" ll="Off" rl="On" color="#b06a4f" checked></mi-switch>
```

### `mi-breadcrumb` + `mi-breadcrumb-item`
Ruta de navegación; el separador `›` es un SVG inyectado por CSS. El último ítem (sin
`href`) se muestra como ubicación actual.
- **Atributo:** `href`. **Slot:** texto del ítem.

### `mi-accordion` + `mi-accordion-item`
Secciones plegables independientes.
- **Atributo:** `open` (estado). **Slots:** `heading` (título) + slot por defecto (contenido).
```html
<mi-accordion-item open>
  <span slot="heading">Modos de la habitación</span>
  <div class="panel">…</div>
</mi-accordion-item>
```

### `mi-card`
Contenedor genérico cuyas **dimensiones se controlan desde fuera por CSS** (sobre el host).
- **Slot:** contenido. **Variables de theming:** `--card-border`, `--card-radius`,
  `--card-bg`, `--card-shadow`.
```html
<mi-card class="dispositivo"> … </mi-card>
<!-- styles.css: .dispositivo { min-height: 240px } controla el tamaño -->
```

### `mi-horizontal-scroll`
Carrusel con scroll horizontal y *scroll-snap*.
- **Slot:** las cards hijas. **Variables:** `--scroll-bg`, `--scroll-radius`.

---

## 4. Cómo se demuestra la ENCAPSULACIÓN

1. **Shadow DOM en todos.** Cada componente tiene su `#shadow-root` con sus propios
   `<style>`; esos estilos no se filtran a la página ni la página los pisa.
   *Demostración:* abre DevTools → inspecciona un `mi-card` → verás `#shadow-root (open)`.

2. **La página no entra al Shadow DOM.** `styles.css` solo afecta el *layout* y los
   **host** de los componentes. Ejemplo claro: el **tamaño** de las cards se fija desde
   fuera (`.escena { height: 150px }`, `.dispositivo { min-height: 240px }`) sin tocar su
   interior. Esto cumple literalmente el requisito *"Card con dimensiones controladas por CSS"*.

3. **La personalización se hace por los canales pensados para ello:**
   - **Atributos** → `mi-switch color="#6b7d6e"`, `mi-slider value="22"`.
   - **Slots** → texto del breadcrumb, `heading` del accordion, labels del slider.
   - **Variables CSS** (cruzan el límite del shadow) → `--switch-color`, `--card-*`,
     `--slider-accent`, `--accordion-*`.

4. **`app.js` nunca manipula el interior de un componente:** solo escucha sus eventos
   públicos (`change`) y lee sus propiedades públicas (`.value`, `.checked`). La maqueta
   viva se actualiza desde fuera, respetando la frontera del componente.

---

## 5. Arquitectura de la interacción (la "maqueta viva")

```
componentes (slider / switch / campo)  --evento "change"-->  app.js: paint()
                                                                 |
                       lee .value / .checked de cada componente  |
                                                                 v
                                            actualiza #room (brillo, color, volumen, chips, insignias)
```

- `app.js` mantiene a los **componentes como fuente de verdad**: en cada `change` llama a
  `paint()`, que **relee** el estado y repinta `#room`.
- Las **escenas** (cards del carrusel) tienen `data-scene`; al hacer clic, `app.js` aplica
  un *preset* que fija los `value`/`checked` de los componentes y vuelve a pintar → cambian
  todos los controles a la vez.

---

## 6. Cambios realizados sobre el avance de Santi (y por qué)

Todos los cambios en los componentes son **aditivos**: no rompen su uso anterior.

| Archivo | Cambio | Motivo |
|---|---|---|
| `mi-breadcrumb.js` | Quitado `border/border-radius/margin` del `:host` del item; estilo de enlace correcto | **Bug:** era copy-paste del accordion y dibujaba un recuadro feo en cada migaja |
| `mi-switch.js` | Añadido evento `change`, atributo+propiedad `checked` | El switch no avisaba de cambios → imposible reaccionar a él |
| `mi-card.js` | Borde/radio/fondo/sombra vía variables `--card-*` | Tenía `border: 2px solid #000` fijo, imposible de tematizar desde fuera |
| `mi-slider.js` | `accent-color` vía `--slider-accent` | Permitir el acento de la paleta sin tocar el shadow |
| `mi-horizontal-scroll.js` | Fondo/radio vía `--scroll-*` | Tenía un gris fijo que chocaba con el diseño |
| `mi-accordion.js` | Borde/radio/fondo vía `--accordion-*` + `color: inherit` | Tematizar sin entrar al shadow |
| `index.html` | Reescrito como dashboard + maqueta viva + ids/data-attrs | Convertir el sandbox en una app con sentido |
| `styles.css` | Diseño minimalista "casa moderna" (paleta cálida, espacio, cards suaves) | Requisito de interfaz presentable |
| `app.js` | Estado central, `paint()`, presets de escena, cableado de eventos | Hacer que los componentes produzcan cambios visibles |

> **`components/` (carpeta antigua) no se tocó** y queda fuera del flujo.

---

## 7. Guía para presentar (3–5 min)

1. **Contexto (30 s).** "Panel de domótica; cada control de la UI es un Web Component
   nativo y reutilizable." Señala el breadcrumb arriba.
2. **Demostración de funcionamiento (1.5 min).** Pulsa **"Fiesta"** y luego **"Modo
   noche"** → la habitación cambia de golpe (brillo, color, volumen). Apaga el **switch de
   luz** → la habitación se va a negro. Sube un **slider** y pulsa `+` en un **campo
   numérico** → chips y barras cambian. *Esto prueba que cada componente funciona.*
3. **Reutilización (1 min).** Mismo `mi-slider` con 3 rangos (0–100 %, 16–30 ℃, 0–11);
   mismo `mi-switch` con distinto `color`; `mi-card` reutilizado 9 veces.
4. **Encapsulación (1 min).** Abre DevTools → muestra el `#shadow-root` de un `mi-card` y
   explica que `styles.css` solo fija su tamaño (host), no su interior; la personalización
   va por atributos, slots y variables CSS.
5. **Cierre (30 s).** `app.js` solo escucha eventos públicos y lee `.value`/`.checked`:
   nunca toca el Shadow DOM → la frontera del componente queda intacta.

### Chuleta de preguntas típicas
- **¿Dónde está el Shadow DOM?** En todos: `attachShadow` en cada `componentes/*.js`.
- **¿Dónde hay slots?** breadcrumb, card, horizontal-scroll, slider (labels) y accordion
  (`heading` + default).
- **¿Dónde hay atributos?** slider (`min/max/value/step`), campo (`min/max/value`),
  switch (`ll/rl/color/checked`), breadcrumb-item (`href`), accordion-item (`open`).
- **¿Lo más interesante/desafiante?** (a) posicionar los labels del slider con
  `(position − min) / (max − min)`; (b) comunicar el estado a la app con `CustomEvent`
  sin romper la encapsulación; (c) la maqueta viva que reúne a todos los componentes.

---

## 8. Estructura de archivos

```
index.html              # Dashboard + maqueta viva (#room)
styles.css              # Estilos globales (layout + hosts + variables de theming)
app.js                  # Estado, paint(), presets de escena, eventos
componentes/            # ✅ Componentes válidos (los que usa la app)
  mi-slider.js          #    slider + labels
  campo-numerico.js     #    campo numérico con +/−
  mi-switch.js          #    interruptor on/off
  mi-breadcrumb.js      #    ruta de navegación
  mi-accordion.js       #    secciones plegables
  mi-card.js            #    tarjeta (dimensiones por CSS externo)
  mi-horizontal-scroll.js#   carrusel horizontal
components/             # ⛔ Versión antigua, fuera de uso (no tocar/ignorar)
```
