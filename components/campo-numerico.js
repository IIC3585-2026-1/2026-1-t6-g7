// =============================================================
//  <campo-numerico>  ·  Campo numérico con botones +/−
//  Uso: <campo-numerico value="0" min="0" max="10">Number:</campo-numerico>
//  - El texto hijo ("Number:") se proyecta con <slot>.
//  - value/min/max/step son atributos editables (reactivos).
// =============================================================

// HTML TEMPLATE (estándar del PPT): se define una sola vez y se clona
// en cada instancia. Más eficiente que escribir innerHTML cada vez.
const tmplCampoNumerico = document.createElement("template");
tmplCampoNumerico.innerHTML = `
  <style>
    :host { display: inline-flex; align-items: center; gap: 10px;
            font-family: system-ui, sans-serif; }
    .control { display: inline-flex; align-items: center;
               border: 1px solid #cfcfcf; border-radius: 8px; overflow: hidden; }
    button { border: none; background: #f3f0fa; color: #512da8;
             font-size: 1.2rem; width: 34px; height: 34px; cursor: pointer; }
    button:hover { background: #e7e0f7; }
    input { width: 60px; text-align: center; border: none; font-size: 1rem;
            padding: 6px 4px; border-left: 1px solid #eee; border-right: 1px solid #eee;
            -moz-appearance: textfield; }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
    input:focus { outline: none; }
  </style>

  <span class="label"><slot></slot></span>
  <span class="control">
    <button type="button" id="dec" aria-label="disminuir">−</button>
    <input type="number" id="campo">
    <button type="button" id="inc" aria-label="aumentar">+</button>
  </span>
`;

class CampoNumerico extends HTMLElement {
  static get observedAttributes() { return ["value", "min", "max", "step"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    // Clonamos el template dentro del shadow root.
    this.shadowRoot.appendChild(tmplCampoNumerico.content.cloneNode(true));
  }

  connectedCallback() {
    this._input = this.shadowRoot.querySelector("#campo");
    this._input.value = this.getAttribute("value") ?? "0";
    this._aplicarLimites();

    this.shadowRoot.querySelector("#inc").addEventListener("click", () => this._mover(+1));
    this.shadowRoot.querySelector("#dec").addEventListener("click", () => this._mover(-1));
    // Si el usuario escribe directo, reflejamos en el atributo.
    this._input.addEventListener("input", () => this.setAttribute("value", this._input.value));
  }

  attributeChangedCallback(name, oldV, newV) {
    if (!this._input) return;
    if (name === "value") this._input.value = newV;
    else this._aplicarLimites();
  }

  _aplicarLimites() {
    ["min", "max", "step"].forEach((a) => {
      if (this.hasAttribute(a)) this._input.setAttribute(a, this.getAttribute(a));
    });
  }

  _mover(direccion) {
    const paso = Number(this.getAttribute("step") || 1);
    let v = Number(this._input.value || 0) + direccion * paso;
    if (this.hasAttribute("min")) v = Math.max(v, Number(this.getAttribute("min")));
    if (this.hasAttribute("max")) v = Math.min(v, Number(this.getAttribute("max")));
    this.value = v;
  }

  // value accesible como propiedad (get/set)
  get value() { return Number(this._input ? this._input.value : this.getAttribute("value") || 0); }
  set value(val) { this.setAttribute("value", val); }

  // Metadata para el builder dinámico
  static get params() {
    return [
      { attr: "value", label: "Valor",  type: "number", default: 0 },
      { attr: "min",   label: "Mínimo", type: "number", default: 0 },
      { attr: "max",   label: "Máximo", type: "number", default: 100 },
      { attr: "step",  label: "Paso",   type: "number", default: 1 },
    ];
  }
}

customElements.define("campo-numerico", CampoNumerico);
