const templateCampoNumerico = document.createElement("template");
templateCampoNumerico.innerHTML = `
  <style>
    :host { display: block; font-family: system-ui, sans-serif; }
    input[type="number"] { width: 40%;
                          height: 95%;
                          background-color: #f0f0f0;
                          margin: 0px;
                          border-radius: 0px;
                          text-align: center;
                          border: 0px;
                          font-weight: bolder;
                          &::-webkit-outer-spin-button,
                          &::-webkit-inner-spin-button{
                            -webkit-appearance: none;
                            margin: 0px;}
                          }
    #dec { background-color: #dec;
              border-top-left-radius: 10px;
              border-bottom-left-radius: 10px;
              margin: 0px;
              border: 0px;
              height: 100%;
              width: 20%;
              font-weight: bolder;
    }

    #inc { background-color: #dec;
              border-top-right-radius: 10px;
              border-bottom-right-radius: 10px;
              margin: 0px;
              border: 0px;
              height: 100%;
              width: 20%;
              font-weight: bolder;
    }
    .control {height: 40px;
              width: 200px}
  </style>
  <div class="control">
    <button type="button" id="dec" aria-label="disminuir">−</button><input type="number" id="campo"><button type="button" id="inc" aria-label="aumentar">+</button>
  </div>
`;

class CampoNumerico extends HTMLElement {
  static get observedAttributes() { return ["min", "max", "value"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }

  render() {
    const min = Number(this.getAttribute("min") || 0);
    const max = Number(this.getAttribute("max") || 100);
    const value = Number(this.getAttribute("value") || min);

    this.shadowRoot.replaceChildren(templateCampoNumerico.content.cloneNode(true));

    const r = this.shadowRoot.querySelector("#campo");
    r.min = min;
    r.max = max;
    r.value = value;

    r.addEventListener("input", () => {
      this.setAttribute("value", r.value);
      this.dispatchEvent(new CustomEvent("change", { detail: { value: r.value } }));
    });

    const dec = this.shadowRoot.querySelector("#dec");
    dec.addEventListener("click", () =>{
      if (r.value > min){
        this.setAttribute("value", String(Number(r.value) - 1));
        this.dispatchEvent(new CustomEvent("change", { detail: { value: r.value } }));
      }
    });

    const inc = this.shadowRoot.querySelector("#inc");
    inc.addEventListener("click", () => {
      if (r.value < max){
        this.setAttribute("value", String(Number(r.value) + 1));
        this.dispatchEvent(new CustomEvent("change", { detail: { value: r.value } }));
      }
    })
  }

  get value() { return Number(this.getAttribute("value") || 0); }
  set value(v) { this.setAttribute("value", v); }
}

customElements.define("campo-numerico", CampoNumerico);
