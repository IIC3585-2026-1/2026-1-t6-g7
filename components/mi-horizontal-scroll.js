// =============================================================
//  <mi-horizontal-scroll>  ·  Carrusel con scroll horizontal
//  Uso:
//    <mi-horizontal-scroll>
//      <mi-card>Card 1</mi-card>
//      <mi-card>Card 2</mi-card>
//      ...
//    </mi-horizontal-scroll>
//  - Los hijos van por <slot> y se muestran en fila con scroll-snap.
//  - ::slotted(*) evita que los hijos se encojan (flex: 0 0 auto).
// =============================================================

class MiHorizontalScroll extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .track {
          display: flex;
          gap: 12px;
          overflow-x: auto;
          padding: 8px;
          scroll-snap-type: x mandatory;
        }
        .track::-webkit-scrollbar { height: 8px; }
        .track::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
        ::slotted(*) { flex: 0 0 auto; scroll-snap-align: start; }
      </style>
      <div class="track"><slot></slot></div>
    `;
  }
}

customElements.define("mi-horizontal-scroll", MiHorizontalScroll);
