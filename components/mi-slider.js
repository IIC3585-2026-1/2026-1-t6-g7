// =============================================================
//  <mi-slider> + <mi-slider-label>
//  Uso:
//    <mi-slider min="0" max="100" value="50" step="5">
//      <mi-slider-label position="0">0℃</mi-slider-label>
//      <mi-slider-label position="50">50℃</mi-slider-label>
//      ...
//    </mi-slider>
//  - Los <mi-slider-label> son hijos (light DOM) proyectados con <slot>.
//  - mi-slider los posiciona bajo la barra según su atributo position.
// =============================================================

class MiSlider extends HTMLElement {
  static get observedAttributes() { return ["min", "max", "value", "step"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  render() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const value = Number(this.getAttribute("value") || min);
    const step = Number(this.getAttribute("step") || 1);

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        input[type="range"] { width: 100%; accent-color: #673ab7; }
        .labels { position: relative; height: 1.4em; margin-top: 4px; }
        /* ::slotted estiliza los hijos proyectados desde el slot */
        ::slotted(mi-slider-label) {
          position: absolute;
          transform: translateX(-50%);
          font-size: 0.75rem;
          color: #555;
          white-space: nowrap;
        }
      </style>

      <input type="range" id="r" min="${min}" max="${max}" value="${value}" step="${step}">
      <div class="labels"><slot></slot></div>
    `;

    const r = this.shadowRoot.querySelector("#r");
    r.addEventListener("input", () => {
      this.setAttribute("value", r.value);
      this.dispatchEvent(new CustomEvent("change", { detail: { value: r.value } }));
    });

    // Posicionamos cada label hijo según (position - min) / (max - min)
    this.querySelectorAll("mi-slider-label").forEach((lbl) => {
      const pos = Number(lbl.getAttribute("position") || min);
      const pct = ((pos - min) / (max - min)) * 100;
      lbl.style.left = `${pct}%`;
    });
  }

  get value() { return Number(this.getAttribute("value") || 0); }
  set value(v) { this.setAttribute("value", v); }

  static get params() {
    return [
      { attr: "min",   label: "Mínimo", type: "number", default: 0 },
      { attr: "max",   label: "Máximo", type: "number", default: 100 },
      { attr: "value", label: "Valor",  type: "number", default: 50 },
      { attr: "step",  label: "Paso",   type: "number", default: 5 },
    ];
  }
}

// Componente hijo: solo muestra su contenido. El posicionamiento lo hace
// el padre (mi-slider) escribiendo style.left sobre él.
class MiSliderLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `<slot></slot>`;
  }
}

customElements.define("mi-slider", MiSlider);
customElements.define("mi-slider-label", MiSliderLabel);
