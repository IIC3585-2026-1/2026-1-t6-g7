// =============================================================
//  <mi-accordion> + <mi-accordion-item>
//  Uso:
//    <mi-accordion>
//      <mi-accordion-item>
//        <span slot="heading">Item 1</span>
//        <div class="panel">Contenido</div>
//      </mi-accordion-item>
//      ...
//    </mi-accordion>
//  - Cada item usa 2 slots: "heading" (título) y el slot por defecto (panel).
//  - Click en el título alterna el atributo "open" → CSS muestra/oculta el panel.
// =============================================================

class MiAccordion extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; border: 1px solid #e0e0e0; border-radius: 8px;
                overflow: hidden; font-family: system-ui, sans-serif; }
      </style>
      <slot></slot>
    `;
  }
}

class MiAccordionItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; border-top: 1px solid #e0e0e0; }
        :host(:first-child) { border-top: none; }
        .head { display: flex; justify-content: space-between; align-items: center;
                padding: 12px 16px; cursor: pointer; background: #faf9fd; font-weight: 600; }
        .head:hover { background: #f3f0fa; }
        .icon { color: #673ab7; transition: transform .2s; }
        :host([open]) .icon { transform: rotate(90deg); }
        .panel { max-height: 0; overflow: hidden; padding: 0 16px;
                 transition: max-height .25s ease, padding .25s ease; }
        :host([open]) .panel { max-height: 500px; padding: 12px 16px; }
      </style>

      <div class="head" id="head">
        <span><slot name="heading">Item</slot></span>
        <span class="icon">▶</span>
      </div>
      <div class="panel"><slot></slot></div>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#head")
      .addEventListener("click", () => this.toggleAttribute("open"));
  }
}

customElements.define("mi-accordion", MiAccordion);
customElements.define("mi-accordion-item", MiAccordionItem);
