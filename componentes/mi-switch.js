const templateSwitch = document.createElement("template");
templateSwitch.innerHTML = `
  <style>
    :host { display: block; font-family: system-ui, sans-serif; }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 26px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      border-radius: 34px;
      transition: background-color 0.3s ease;
    }

    .slider::before {
      content: "";
      position: absolute;
      height: 20px;
      width: 20px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }

    .switch input:checked + .slider {
      background-color: var(--switch-color, #4CAF50);
    }

    .switch input:checked + .slider::before {
      transform: translateX(24px);
    }

  </style>

  <div class="control">
    <span class="labels" id="ll"></span>
    <label class="switch">
      <input type="checkbox" role="switch">
      <span class="slider"></span>
    </label>
    <span class="labels" id="rl"></span>
  </div>
`;

class MiSwitch extends HTMLElement {
  static get observedAttributes() { return ["rl", "ll", "color"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  render() {
    const ll = this.getAttribute("ll") || "Off";
    const rl = this.getAttribute("rl") || "On";
    const color = this.getAttribute("color") || "#4CAF50";

    this.shadowRoot.replaceChildren(templateSwitch.content.cloneNode(true));

    this.shadowRoot.querySelector("#ll").textContent = ll;
    this.shadowRoot.querySelector("#rl").textContent = rl;
    this.style.setProperty("--switch-color", color);
  }

  get value() { return Number(this.getAttribute("value") || 0); }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("mi-switch", MiSwitch);
