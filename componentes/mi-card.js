const templateCard = document.createElement("template");
templateCard.innerHTML = `
  <style>
    :host { display: block;
            font-family: system-ui, sans-serif; }
    .card { border: 2px solid #000000;
            border-radius: 5px;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            text-align: center;
            justify-content: center;
            display: flex;
            align-items: center;
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
