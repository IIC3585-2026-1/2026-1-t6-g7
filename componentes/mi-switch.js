const templateSwitch = document.createElement("template");
templateSwitch.innerHTML = `
	<style>
		:host {
			display: block;
			font-family: system-ui, sans-serif;
		}

		.control {
			display: inline-flex;
			align-items: center;
			gap: 8px;
		}

		.switch {
			position: relative;
			display: inline-block;
			width: 50px;
			height: 26px;
		}

		.switch input {
			width: 0;
			height: 0;
			opacity: 0;
		}

		.slider {
			position: absolute;
			inset: 0;
			cursor: pointer;
			border-radius: 34px;
			background-color: #ccc;
			transition: background-color 0.3s ease;
		}

		.slider::before {
			position: absolute;
			left: 3px;
			bottom: 3px;
			width: 20px;
			height: 20px;
			border-radius: 50%;
			background-color: white;
			content: "";
			transition: transform 0.3s ease;
		}

		.switch input:checked + .slider {
			background-color: var(--switch-color, #4CAF50);
		}

		.switch input:checked + .slider::before {
			transform: translateX(24px);
		}
	</style>

	<div class="control">
		<slot></slot>
		<span class="labels">
			<slot name="unchecked-message"><span id="ll"></span></slot>
		</span>
		<label class="switch">
			<input type="checkbox" role="switch">
			<span class="slider"></span>
		</label>
		<span class="labels">
			<slot name="checked-message"><span id="rl"></span></slot>
		</span>
	</div>
`;

class MiSwitch extends HTMLElement {
	static get observedAttributes() { return ["rl", "ll", "color", "checked"]; }

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() { this.render(); }

	attributeChangedCallback(nombreAtributo) {
		if (!this.isConnected) return;

		if (nombreAtributo === "checked") {
			this.actualizarChecked();
			return;
		}

		if (nombreAtributo === "color") {
			this.actualizarColor();
			return;
		}

		this.actualizarEtiquetas();
	}

	render() {
		this.shadowRoot.replaceChildren(templateSwitch.content.cloneNode(true));
		this.actualizarEtiquetas();
		this.actualizarColor();
		this.actualizarChecked();

		this.shadowRoot.querySelector("input").addEventListener("change", (evento) => {
			const input = evento.currentTarget;

			this.toggleAttribute("checked", input.checked);
			this.dispatchEvent(new CustomEvent("change", {
				detail: { checked: input.checked }
			}));
		});
	}

	actualizarEtiquetas() {
		const etiquetaIzquierda = this.shadowRoot.querySelector("#ll");
		const etiquetaDerecha = this.shadowRoot.querySelector("#rl");

		if (!etiquetaIzquierda || !etiquetaDerecha) return;

		etiquetaIzquierda.textContent = this.getAttribute("ll") || "Off";
		etiquetaDerecha.textContent = this.getAttribute("rl") || "On";
	}

	actualizarColor() {
		this.style.setProperty("--switch-color", this.getAttribute("color") || "#4CAF50");
	}

	actualizarChecked() {
		const input = this.shadowRoot.querySelector("input");
		if (!input) return;

		input.checked = this.checked;
		input.setAttribute("aria-checked", String(this.checked));
	}

	get checked() { return this.hasAttribute("checked"); }
	set checked(valor) { this.toggleAttribute("checked", Boolean(valor)); }
}

customElements.define("mi-switch", MiSwitch);
