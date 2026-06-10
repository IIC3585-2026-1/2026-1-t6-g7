// =============================================================
//  <mi-card>  ·  Tarjeta con dimensiones controladas por CSS
//  Uso:
//    <mi-card>Contenido</mi-card>
//    <mi-card class="custom">Otra</mi-card>
//
//    .custom { --card-width: 150px; --card-height: 100px; padding: 22px; }
//
//  - El contenido va por <slot>.
//  - Las CSS custom properties (var(--card-*)) SÍ cruzan el shadow boundary,
//    así que desde fuera se puede personalizar tamaño/colores sin tocar el JS.
//    Lo que NO esté expuesto como variable queda blindado.
// =============================================================

class MiCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          box-sizing: border-box;
          width:   var(--card-width, 200px);
          height:  var(--card-height, 140px);
          padding: var(--card-padding, 16px);
          border-radius: var(--card-radius, 12px);
          background: var(--card-bg, #ffffff);
          color: var(--card-color, #202124);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          font-family: system-ui, sans-serif;
          overflow: auto;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define("mi-card", MiCard);
