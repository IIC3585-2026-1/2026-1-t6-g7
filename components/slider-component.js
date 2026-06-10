
class SliderComponent extends HTMLElement {

  static get observedAttributes() {
    return ["label", "min", "max", "step"];
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
    return this.getAttribute("label") || "Selecciona un valor";
  }
  set label(val) {
    if (val) {
      this.setAttribute("label", val);  
    } else {
      this.removeAttribute("label");
    }
  }

  get value() {
    return Number(this.shadowRoot.querySelector("#slider").value);
  }

  render() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const step = Number(this.getAttribute("step") || 1);
    const inicial = (min + max) / 2;

    this.shadowRoot.innerHTML = `
      <style>
        label { display: block; 
                font-size: 0.95rem; 
                margin-bottom: 8px; 
                color: #202124; }
        .row  { display: flex; 
                align-items: center; 
                gap: 12px; }
        input[type="range"] { flex: 1; 
                              accent-color: #673ab7; }
        .valor { min-width: 2.5em; 
                 text-align: center; 
                 font-weight: 600; 
                color: #673ab7; }
      </style>

      <label for="slider">${this.label}</label>
      <div class="row">
        <span>${min}</span>
        <input type="range" id="slider" min="${min}" max="${max}" value="${inicial}" step="${step}">
        <span>${max}</span>
        <span class="valor">${inicial}</span>
      </div>
    `;

    const slider = this.shadowRoot.querySelector("#slider");
    const valorEl = this.shadowRoot.querySelector(".valor");
    slider.addEventListener("input", () => {
      valorEl.textContent = slider.value;
    });
  }

  static get params() {
    return [
      { attr: "label", label: "Título", type: "text",   default: "Selecciona un valor" },
      { attr: "min",   label: "Mínimo", type: "number", default: 0 },
      { attr: "max",   label: "Máximo", type: "number", default: 100 },
      { attr: "step",  label: "Paso",   type: "number", default: 1 },
    ];
  }
}

customElements.define("slider-component", SliderComponent);
