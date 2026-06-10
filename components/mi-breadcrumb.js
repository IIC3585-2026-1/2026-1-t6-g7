// =============================================================
//  <mi-breadcrumb> + <mi-breadcrumb-item>
//  Uso:
//    <mi-breadcrumb>
//      <mi-breadcrumb-item href="#">Home</mi-breadcrumb-item>
//      <mi-breadcrumb-item href="#">Next Level</mi-breadcrumb-item>
//      <mi-breadcrumb-item>Current</mi-breadcrumb-item>
//    </mi-breadcrumb>
//  - El item con href se ve como link; el último (sin href) es la posición actual.
//  - El separador "/" lo agrega cada item salvo el último.
// =============================================================

class MiBreadcrumb extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; font-family: system-ui, sans-serif; }
        nav { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 0.9rem; }
      </style>
      <nav aria-label="breadcrumb"><slot></slot></nav>
    `;
  }
}

class MiBreadcrumbItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }

  render() {
    const href = this.getAttribute("href");
    const esUltimo = !this.nextElementSibling; // ¿soy el último del breadcrumb?

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; align-items: center; gap: 6px; }
        a { color: #673ab7; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .current { color: #555; }
        .sep { color: #aaa; }
      </style>
      ${href
        ? `<a href="${href}"><slot></slot></a>`
        : `<span class="current" aria-current="page"><slot></slot></span>`}
      ${esUltimo ? "" : `<span class="sep">/</span>`}
    `;
  }
}

customElements.define("mi-breadcrumb", MiBreadcrumb);
customElements.define("mi-breadcrumb-item", MiBreadcrumbItem);
