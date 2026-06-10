const templateSlider = document.createElement("template");
templateSlider.innerHTML = `
  <style>
    :host { display: block;
            font-family:
            system-ui,
            sans-serif; }
    input[type="range"] { width: 100%;
                          accent-color: #673ab7; }
    .labels { position: relative;
              height: 1.4em; margin-top: 4px; }
    ::slotted(mi-slider-label) {
      position: absolute;
      transform: translateX(-50%);
      font-size: 0.75rem;
      color: #555;
      white-space: nowrap;
    }
  </style>
  <input type="range" id="r">
  <div class="labels"><slot></slot></div>
`;

const templateSliderLabel = document.createElement("template");
templateSliderLabel.innerHTML = `<slot></slot>`;

class MiSlider extends HTMLElement {
  static get observedAttributes() { return ["min", "max", "value", "step"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }

  attributeChangedCallback(name) {
    if (!this.isConnected) return;
    if (name === "value") {
      this.shadowRoot.querySelector("#r").value = this.getAttribute("value");
    } else {
      this.render();
    }
  }

  render() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const value = Number(this.getAttribute("value") || min);
    const step = Number(this.getAttribute("step") || 1);

    this.shadowRoot.replaceChildren(templateSlider.content.cloneNode(true));

    const r = this.shadowRoot.querySelector("#r");
    r.min = min;
    r.max = max;
    r.value = value;
    r.step = step;

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
}

class MiSliderLabel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(templateSliderLabel.content.cloneNode(true));
  }
}

customElements.define("mi-slider", MiSlider);
customElements.define("mi-slider-label", MiSliderLabel);
