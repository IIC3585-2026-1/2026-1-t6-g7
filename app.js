// app.js — conecta los Web Components con la "maqueta viva" de la habitación.
//
// Idea: los componentes son la fuente de verdad. Cada vez que uno emite su
// CustomEvent ("change"), llamamos a paint(), que LEE el estado actual de
// todos los componentes y lo refleja en la vista previa (#room).
// Así, mover un slider, tocar un switch o pulsar +/- produce un cambio visible.

const $ = (sel) => document.querySelector(sel);

const els = {
  room:      $("#room"),
  glow:      $(".room__glow"),
  light:     $("#lightState"),
  eq:        $("#eq"),
  badges:    $("#badges"),
  chipTimer: $("#chipTimer"),
  chipPers:  $("#chipPers"),
  chipPrio:  $("#chipPrio"),
  // componentes
  brillo: $("#slider-brillo"),
  temp:   $("#slider-temp"),
  vol:    $("#slider-vol"),
  luz:    $("#sw-luz"),
  campoMin:  $("#campo-min"),
  campoPrio: $("#campo-prio"),
  campoPers: $("#campo-pers"),
};

// Switches que se muestran como insignias en la habitación
const badgeSwitches = [...document.querySelectorAll("mi-switch[data-badge]")];

// Ecualizador: 11 barras fijas; en cada paint marcamos cuántas están activas.
const VOL_MAX = 11;
els.eq.innerHTML = Array.from({ length: VOL_MAX }, () => '<i></i>').join("");
const eqBars = [...els.eq.children];

// Mezcla dos colores hex (frío -> cálido) según t = 0..1
function mix(c1, c2, t) {
  const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
  const r = Math.round(((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t);
  const g = Math.round(((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t);
  const bl = Math.round((a & 255) * (1 - t) + (b & 255) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

// Repinta la habitación leyendo el estado actual de los componentes.
function paint() {
  const brillo = Number(els.brillo.value);          // 0..100
  const temp   = Number(els.temp.value);            // 16..30
  const vol    = Number(els.vol.value);             // 0..11
  const luzOn  = els.luz.checked;

  // --- Salidas de texto (las etiquetas "Brillo: 70%", etc.) ---
  document.querySelectorAll("[data-out]").forEach((out) => {
    const src = $("#" + out.getAttribute("data-out"));
    if (src) out.textContent = src.value;
  });

  // --- Iluminación: brillo efectivo solo si la luz está encendida ---
  const bri = luzOn ? brillo / 100 : 0;
  els.room.classList.toggle("is-on", luzOn);
  els.glow.style.opacity = String(0.12 + bri * 0.88);

  // --- Temperatura: tiñe la luz de fría (azul) a cálida (ámbar) ---
  const t = (temp - 16) / (30 - 16);
  els.glow.style.background =
    `radial-gradient(circle at 50% 25%, ${mix("#bcd4ff", "#ffc46b", t)}, transparent 72%)`;
  els.light.textContent = luzOn ? "Luz encendida" : "Luz apagada";

  // --- Volumen: barras activas del ecualizador ---
  eqBars.forEach((bar, i) => bar.classList.toggle("on", i < vol));
  els.eq.classList.toggle("muted", vol === 0);

  // --- Campos numéricos: chips informativos ---
  const min = Number(els.campoMin.value);
  els.chipTimer.textContent = min === 0 ? "Sin apagado" : `Apaga en ${min} min`;
  els.chipPers.textContent  = `${els.campoPers.value} personas`;
  els.chipPrio.textContent  = `Prioridad ${els.campoPrio.value}`;

  // --- Switches de modo: insignias visibles ---
  els.badges.replaceChildren(
    ...badgeSwitches
      .filter((sw) => sw.checked)
      .map((sw) => {
        const b = document.createElement("span");
        b.className = "badge";
        b.textContent = sw.getAttribute("data-badge");
        return b;
      })
  );
}

// --- Presets de escena: mueven todos los controles a la vez ---
const PRESETS = {
  noche:     { brillo: 15,  temp: 20, vol: 2,  luz: true  },
  lectura:   { brillo: 85,  temp: 23, vol: 0,  luz: true  },
  cine:      { brillo: 25,  temp: 22, vol: 8,  luz: true  },
  despertar: { brillo: 100, temp: 24, vol: 4,  luz: true  },
  fiesta:    { brillo: 90,  temp: 21, vol: 11, luz: true  },
  ausente:   { brillo: 0,   temp: 18, vol: 0,  luz: false },
};

function applyScene(name) {
  const p = PRESETS[name];
  if (!p) return;
  // setAttribute("value") hace que el slider actualice su input interno.
  els.brillo.setAttribute("value", p.brillo);
  els.temp.setAttribute("value", p.temp);
  els.vol.setAttribute("value", p.vol);
  els.luz.checked = p.luz;            // propiedad pública del switch
  paint();
}

// --- Cableado de eventos ---
[els.brillo, els.temp, els.vol, els.campoMin, els.campoPrio, els.campoPers, ...badgeSwitches, els.luz]
  .forEach((c) => c.addEventListener("change", paint));

document.querySelectorAll(".escena[data-scene]").forEach((card) => {
  card.addEventListener("click", () => applyScene(card.dataset.scene));
});

// Estado inicial
paint();
