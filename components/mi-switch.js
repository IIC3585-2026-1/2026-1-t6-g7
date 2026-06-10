// =============================================================
//  <mi-switch>  ·  Interruptor on/off
//  Uso:
//    <mi-switch>
//      <span slot="checked-message">On</span>
//      <span slot="unchecked-message">Off</span>
//      <label>Captions:</label>
//    </mi-switch>
//  - Usa 3 slots: el label (slot por defecto) y dos mensajes con nombre.
//  - El estado se guarda en el atributo "checked" y se refleja con :host([checked]).
// =============================================================

class MiSwitch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-flex; align-items: center; gap: 10px;
                font-family: system-ui, sans-serif; }
        .track { width: 46px; height: 24px; border-radius: 999px; background: #ccc;
                 position: relative; cursor: pointer; transition: background .2s; flex: none; }
        .thumb { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px;
                 border-radius: 50%; background: #fff; transition: left .2s;
                 box-shadow: 0 1px 3px rgba(0,0,0,.3); }
        /* :host([checked]) reacciona al atributo "checked" del host */
        :host([checked]) .track { background: #673ab7; }
        :host([checked]) .thumb { left: 24px; }
        /* Mostramos un mensaje u otro según el estado */
        .on  { display: none; }
        :host([checked]) .on  { display: inline; }
        :host([checked]) .off { display: none; }
      </style>

      <slot></slot>
      <span class="track" id="track" role="switch"><span class="thumb"></span></span>
      <span>
        <span class="on"><slot name="checked-message">On</slot></span>
        <span class="off"><slot name="unchecked-message">Off</slot></span>
      </span>
    `;
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#track")
      .addEventListener("click", () => { this.checked = !this.checked; });
  }

  get checked() { return this.hasAttribute("checked"); }
  set checked(v) { v ? this.setAttribute("checked", "") : this.removeAttribute("checked"); }

  // value para el builder (true/false)
  get value() { return this.checked; }
}

customElements.define("mi-switch", MiSwitch);
