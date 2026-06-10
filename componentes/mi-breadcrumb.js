const templateBreadcrumb = document.createElement("template");
templateBreadcrumb.innerHTML = `
  <style>
    :host { display: block;
            font-family: system-ui, sans-serif; }
    .breadcrumb-container {
      display: flex;
      align-items: center;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    ::slotted(*) {
      display: inline-flex;
      align-items: center;
      border: 0px solid #ffffff;
    }

    ::slotted(*:not(:last-child)) { margin-right: 8px;
                                    padding-right: 16px;
                                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12'%3E%3Cpath d='M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z' fill='%23666'/%3E%3C/svg%3E") no-repeat right center;
                                  }
  </style>

  <div class="breadcrumb-container">
    <slot></slot>
  </div>
`;

const templateBreadcrumbItem = document.createElement("template");
templateBreadcrumbItem.innerHTML = `
  <style>
    :host { display: block;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 8px; }
  </style>
  <a id="link"><slot></slot></a>
`;

class MiBreadcrumb extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.appendChild(templateBreadcrumb.content.cloneNode(true));
  }
}

class MiBreadcrumbItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() { return ["href"]; }

  connectedCallback() { this.render(); }

  attributeChangedCallback() { if (this.isConnected) this.render(); }

  render() {
    const href = this.getAttribute("href") || "";

    this.shadowRoot.replaceChildren(templateBreadcrumbItem.content.cloneNode(true));
    this.shadowRoot.querySelector("#link").href = href;
  }
}

customElements.define("mi-breadcrumb", MiBreadcrumb);
customElements.define("mi-breadcrumb-item", MiBreadcrumbItem);
