class NumberComponent extends HTMLElement {

  // Atributos EDITABLES (reactivos)
  static get observedAttributes() {
    return ["label", "min", "max"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.isConnected && oldValue !== newValue) {
      this.render();
    }
  }

  get label() {
    return this.getAttribute("label") || "Pregunta numérica";
  }
  set label(val) {
    if (val) {
      this.setAttribute("label", val);
    } else {
      this.removeAttribute("label");
    }
  }

  // El valor vive en el <input>. Solo lectura.
  get value() {
    return Number(this.shadowRoot.querySelector("#campo").value);
  }

  render() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);

    this.shadowRoot.innerHTML = `
      <style>
        label { display: block;
                font-size: 0.95rem;
                margin-bottom: 8px;
                color: #202124; }
        input[type="number"] {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #dadce0;
          border-radius: 6px;
          font-size: 0.95rem;
          accent-color: #673ab7;
        }
        input:focus { outline: none; border-color: #673ab7; }
      </style>

      <label for="campo">${this.label}</label>
      <input type="number" id="campo" min="${min}" max="${max}" placeholder="0">
    `;
  }

  static get params() {
    return [
      { attr: "label", label: "Título", type: "text",   default: "Pregunta numérica" },
      { attr: "min",   label: "Mínimo", type: "number", default: 0 },
      { attr: "max",   label: "Máximo", type: "number", default: 100 }
    ];
  }
}

customElements.define("number-component", NumberComponent);
