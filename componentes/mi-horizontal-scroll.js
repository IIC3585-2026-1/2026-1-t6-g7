const templateHorizontalScroll = document.createElement("template");
templateHorizontalScroll.innerHTML = `
  <style>
        .carrusel-contenedor {
        display: flex;
        gap: 20px;
        padding: 20px;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
        background-color: #f5f5f5;
        }

        ::slotted(*) {
        flex: 0 0 300px;
        scroll-snap-align: center;
        }

        .carrusel-contenedor::-webkit-scrollbar {
        display: none;
        }
  </style>
  <div class="carrusel-contenedor">
    <slot></slot>
  </div>
`;

class MiHorizontalScroll extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(templateHorizontalScroll.content.cloneNode(true));
  }
}

customElements.define("mi-horizontal-scroll", MiHorizontalScroll);
