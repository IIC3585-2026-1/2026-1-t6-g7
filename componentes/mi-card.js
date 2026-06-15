const templateCard = document.createElement("template");
templateCard.innerHTML = `
  <style>
    :host { display: block;
            font-family: system-ui, sans-serif; }
    /* Hooks de theming (con valores por defecto): la página puede personalizar
       borde, radio, fondo y sombra del card sin entrar al Shadow DOM. */
    .card { border: var(--card-border, 2px solid #000000);
            border-radius: var(--card-radius, 5px);
            background: var(--card-bg, transparent);
            box-shadow: var(--card-shadow, none);
            width: var(--card-width, 100%);
            height: var(--card-height, 100%);
            box-sizing: border-box;
            text-align: center;
            justify-content: center;
            display: flex;
            align-items: center;
            transition: box-shadow .2s ease, transform .2s ease, border-color .2s ease;
            }
  </style>

  <div class="card">
    <slot></slot>
  </div>
`;

class MiCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(templateCard.content.cloneNode(true));
  }
}

customElements.define("mi-card", MiCard);
