// =============================================================
//  app.js — Lienzo dinámico de Web Components
// =============================================================
//  Cada botón de la paleta inserta un componente en el lienzo.
//  - Si el componente declara `static get params()`, abrimos un <dialog>
//    para configurar sus atributos antes de insertarlo.
//  - `contenido` = HTML hijo (light DOM) que se proyecta en los <slot>
//    del componente (ej. los items de un acordeón o breadcrumb).
// =============================================================

// Importamos todos los componentes (registran sus custom elements).
import "./components/campo-numerico.js";
import "./components/mi-slider.js";
import "./components/mi-switch.js";
import "./components/mi-breadcrumb.js";
import "./components/mi-accordion.js";
import "./components/mi-card.js";
import "./components/mi-horizontal-scroll.js";


// -------------------------------------------------------------
//  REGISTRO de la paleta. `contenido` es el HTML hijo por defecto.
// -------------------------------------------------------------
const COMPONENTES = [
  {
    tag: "campo-numerico", etiqueta: "Campo numérico", icono: "🔢",
    contenido: "Number:",
  },
  {
    tag: "mi-slider", etiqueta: "Slider", icono: "🎚️",
    contenido: `
      <mi-slider-label position="0">0℃</mi-slider-label>
      <mi-slider-label position="25">25℃</mi-slider-label>
      <mi-slider-label position="50">50℃</mi-slider-label>
      <mi-slider-label position="75">75℃</mi-slider-label>
      <mi-slider-label position="100">100℃</mi-slider-label>`,
  },
  {
    tag: "mi-switch", etiqueta: "Switch", icono: "🔘",
    contenido: `
      <span slot="checked-message">On</span>
      <span slot="unchecked-message">Off</span>
      <label>Captions:</label>`,
  },
  {
    tag: "mi-breadcrumb", etiqueta: "Breadcrumb", icono: "🧭",
    contenido: `
      <mi-breadcrumb-item href="#">Home</mi-breadcrumb-item>
      <mi-breadcrumb-item href="#">Next Level Down</mi-breadcrumb-item>
      <mi-breadcrumb-item>Current Location</mi-breadcrumb-item>`,
  },
  {
    tag: "mi-accordion", etiqueta: "Acordeón", icono: "🪗",
    contenido: `
      <mi-accordion-item><span slot="heading">Item 1</span><div>Panel one content</div></mi-accordion-item>
      <mi-accordion-item><span slot="heading">Item 2</span><div>Panel 2 content</div></mi-accordion-item>
      <mi-accordion-item><span slot="heading">Item 3</span><div>Panel 3 content</div></mi-accordion-item>`,
  },
  {
    tag: "mi-card", etiqueta: "Tarjeta", icono: "🃏",
    contenido: "Una tarjeta encapsulada 🎴",
  },
  {
    tag: "mi-horizontal-scroll", etiqueta: "Scroll horizontal", icono: "↔️",
    contenido: `
      <mi-card>Card 1</mi-card>
      <mi-card>Card 2</mi-card>
      <mi-card>Card 3</mi-card>
      <mi-card>Card 4</mi-card>`,
  },
];


// -------------------------------------------------------------
//  Referencias del DOM
// -------------------------------------------------------------
const paletteEl   = document.getElementById("palette-buttons");
const formEl      = document.getElementById("form");
const emptyHintEl = document.getElementById("empty-hint");
const outputEl    = document.getElementById("output");
const titleEl     = document.getElementById("form-title");


// -------------------------------------------------------------
//  1. Construir la paleta de botones
// -------------------------------------------------------------
COMPONENTES.forEach((comp) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "palette-btn";
  btn.innerHTML = `<span class="palette-icon">${comp.icono}</span> ${comp.etiqueta}`;
  btn.addEventListener("click", () => configurarCampo(comp));
  paletteEl.appendChild(btn);
});


// -------------------------------------------------------------
//  2. Configurar un componente ANTES de insertarlo
//     (solo si declara params; si no, se inserta directo)
// -------------------------------------------------------------
function configurarCampo(comp) {
  const Clazz = customElements.get(comp.tag);
  const params = (Clazz && Clazz.params) || [];

  if (params.length === 0) {
    insertarCampo(comp, {});
    return;
  }

  const dialog = document.createElement("dialog");
  dialog.className = "config-dialog";

  const form = document.createElement("form");
  form.method = "dialog";
  form.className = "config-form";
  form.innerHTML = `<h3>Configurar ${comp.etiqueta}</h3>`;

  const inputs = {};
  params.forEach((p) => {
    const row = document.createElement("label");
    row.className = "settings-row";

    const span = document.createElement("span");
    span.textContent = p.label || p.attr;

    const input = document.createElement("input");
    input.type = p.type || "text";
    input.value = p.default ?? "";

    inputs[p.attr] = input;
    row.append(span, input);
    form.appendChild(row);
  });

  const acciones = document.createElement("div");
  acciones.className = "config-actions";
  acciones.innerHTML = `
    <button type="button" class="btn-ghost" data-cancel>Cancelar</button>
    <button type="submit" class="btn-primary">Añadir</button>
  `;
  form.appendChild(acciones);

  acciones.querySelector("[data-cancel]").addEventListener("click", () => dialog.close());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const valores = {};
    params.forEach((p) => { valores[p.attr] = inputs[p.attr].value; });
    insertarCampo(comp, valores);
    dialog.close();
  });

  dialog.appendChild(form);
  dialog.addEventListener("close", () => dialog.remove());
  document.body.appendChild(dialog);
  dialog.showModal();
  inputs[params[0].attr].focus();
}


// -------------------------------------------------------------
//  2b. Insertar el componente ya configurado
// -------------------------------------------------------------
function insertarCampo(comp, valores) {
  emptyHintEl.hidden = true;

  const card = document.createElement("div");
  card.className = "field-card";

  // Creamos el web component y le inyectamos su contenido hijo (slots).
  const el = document.createElement(comp.tag);
  el.classList.add("field-component");
  if (comp.contenido) el.innerHTML = comp.contenido;

  // Aplicamos los atributos elegidos en el formulario.
  Object.entries(valores).forEach(([attr, val]) => {
    if (val !== "") el.setAttribute(attr, val);
  });

  // Botón eliminar
  const acciones = document.createElement("div");
  acciones.className = "field-actions";
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "field-btn field-remove";
  removeBtn.textContent = "✕";
  removeBtn.title = "Eliminar";
  removeBtn.addEventListener("click", () => {
    card.remove();
    if (!formEl.querySelector(".field-card")) emptyHintEl.hidden = false;
  });

  acciones.appendChild(removeBtn);
  card.append(el, acciones);
  formEl.appendChild(card);
}


// -------------------------------------------------------------
//  3. Recolectar valores (solo de los componentes que exponen `value`)
// -------------------------------------------------------------
document.getElementById("btn-submit").addEventListener("click", () => {
  const campos = formEl.querySelectorAll(".field-component");

  const respuestas = Array.from(campos)
    .filter((el) => el.value !== undefined)
    .map((el) => ({
      tipo: el.tagName.toLowerCase(),
      valor: el.value,
    }));

  const data = { titulo: titleEl.value, respuestas };

  outputEl.hidden = false;
  outputEl.textContent = JSON.stringify(data, null, 2);
});


// -------------------------------------------------------------
//  4. Limpiar todo
// -------------------------------------------------------------
document.getElementById("btn-clear").addEventListener("click", () => {
  formEl.querySelectorAll(".field-card").forEach((c) => c.remove());
  emptyHintEl.hidden = false;
  outputEl.hidden = true;
  outputEl.textContent = "";
});
