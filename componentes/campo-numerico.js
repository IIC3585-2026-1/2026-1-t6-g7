const templateCampoNumerico = document.createElement("template");
templateCampoNumerico.innerHTML = `
	<style>
		:host {
			display: block;
			font-family: system-ui, sans-serif;
		}

		.campo-numerico {
			display: inline-flex;
			align-items: center;
			gap: 10px;
		}

		.etiqueta {
			font-weight: 600;
		}

		.control {
			width: 200px;
			height: 40px;
		}

		input[type="number"] {
			width: 40%;
			height: 95%;
			margin: 0;
			border: 0;
			border-radius: 0;
			background-color: #f0f0f0;
			text-align: center;
			font-weight: bolder;
		}

		input[type="number"]::-webkit-outer-spin-button,
		input[type="number"]::-webkit-inner-spin-button {
			margin: 0;
			-webkit-appearance: none;
		}

		button {
			width: 20%;
			height: 100%;
			margin: 0;
			border: 0;
			background-color: #dec;
			font-weight: bolder;
		}

		#dec {
			border-top-left-radius: 10px;
			border-bottom-left-radius: 10px;
		}

		#inc {
			border-top-right-radius: 10px;
			border-bottom-right-radius: 10px;
		}
	</style>

	<div class="campo-numerico">
		<span class="etiqueta"><slot></slot></span>
		<div class="control">
			<button type="button" id="dec" aria-label="disminuir">&minus;</button><input type="number" id="campo"><button type="button" id="inc" aria-label="aumentar">+</button>
		</div>
	</div>
`;

class CampoNumerico extends HTMLElement {
	static get observedAttributes() { return ["min", "max", "value"]; }

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() { this.render(); }

	attributeChangedCallback(nombreAtributo) {
		if (!this.isConnected) return;

		if (nombreAtributo === "value") {
			this.actualizarCampo();
			return;
		}

		this.render();
	}

	render() {
		this.shadowRoot.replaceChildren(templateCampoNumerico.content.cloneNode(true));

		const campo = this.shadowRoot.querySelector("#campo");
		campo.min = this.min;
		campo.max = this.max;
		campo.value = this.value;

		campo.addEventListener("input", () => {
			this.cambiarValor(campo.value);
		});

		this.shadowRoot.querySelector("#dec").addEventListener("click", () => {
			this.cambiarValor(this.value - 1);
		});

		this.shadowRoot.querySelector("#inc").addEventListener("click", () => {
			this.cambiarValor(this.value + 1);
		});
	}

	cambiarValor(valorNuevo) {
		const valorLimitado = this.limitarValor(Number(valorNuevo));

		this.setAttribute("value", String(valorLimitado));
		this.dispatchEvent(new CustomEvent("change", {
			detail: { value: valorLimitado }
		}));
	}

	limitarValor(valor) {
		if (Number.isNaN(valor)) return this.min;
		return Math.min(this.max, Math.max(this.min, valor));
	}

	actualizarCampo() {
		const campo = this.shadowRoot.querySelector("#campo");
		if (campo) campo.value = this.value;
	}

	get value() { return Number(this.getAttribute("value") || 0); }
	set value(valor) { this.setAttribute("value", valor); }
	get min() { return Number(this.getAttribute("min") || 0); }
	get max() { return Number(this.getAttribute("max") || 100); }
}

customElements.define("campo-numerico", CampoNumerico);
