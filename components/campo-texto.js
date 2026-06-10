// =============================================================
//  campo-texto — Componente de EJEMPLO que cumple el contrato.
//  Úsalo como plantilla para tus demás componentes.
// =============================================================
class CampoTexto extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  // Se ejecuta cuando el elemento se inserta en el DOM
  connectedCallback() {
    const label = this.getAttribute("label") || "Pregunta de texto";

    this.shadowRoot.innerHTML = `
      <style>
        label {
          display: block;
          font-size: 0.95rem;
          margin-bottom: 8px;
          color: #202124;
        }
        input {
          width: 100%;
          border: none;
          border-bottom: 1px solid #dadce0;
          padding: 6px 0;
          font-size: 0.95rem;
          outline: none;
        }
        input:focus { border-bottom: 2px solid #673ab7; }
      </style>

      <label>${label}</label>
      <input type="text" placeholder="Tu respuesta" />
    `;
  }

  // --- CONTRATO ---
  get value() {
    return this.shadowRoot.querySelector("input").value;
  }

  get label() {
    return this.getAttribute("label") || "Pregunta de texto";
  }
}

customElements.define("campo-texto", CampoTexto);
