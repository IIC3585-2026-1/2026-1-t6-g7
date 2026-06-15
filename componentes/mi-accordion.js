const templateAccordion = document.createElement("template");
templateAccordion.innerHTML = `
  <style>
    :host { display: block;
            font-family: system-ui, sans-serif; }
    ::slotted(mi-accordion-item) { display: block;
                                   margin-bottom: 8px; }
  </style>
  <slot></slot>
`;

const templateAccordionItem = document.createElement("template");
templateAccordionItem.innerHTML = `
  <style>
    :host { display: block;
            border: var(--accordion-border, 1px solid #ddd);
            border-radius: var(--accordion-radius, 8px);
            background: var(--accordion-bg, transparent);
            margin-bottom: 8px; }
    .header { width: 100%;
              padding: 14px 16px;
              background: none;
              border: none;
              cursor: pointer;
              font: inherit;
              color: inherit;
              text-align: left; }
    .panel { padding: 0 16px 14px;
             display: none; }
    :host([open]) .panel { display: block; }
    .header { display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: bolder;}
    .chevron { transition: transform 0.2s; }
    :host([open]) .chevron { transform: rotate(180deg); }
  </style>

  <button class="header" id="head">
    <slot name="heading"></slot>
    <span class="chevron">⌄</span>
  </button>
  <div class="panel">
    <slot></slot>
  </div>
`;

class MiAccordion extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(templateAccordion.content.cloneNode(true));
  }
}

class MiAccordionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(templateAccordionItem.content.cloneNode(true));
    this.shadowRoot.querySelector("#head").addEventListener("click", () => {
      this.toggleAttribute("open");
    });
  }
}

customElements.define("mi-accordion", MiAccordion);
customElements.define("mi-accordion-item", MiAccordionItem);
