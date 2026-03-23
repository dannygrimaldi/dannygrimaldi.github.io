function initReveal() {
  const revealNodes = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function initCountdown() {
  const countdown = document.getElementById("countdown");
  if (!countdown) {
    return;
  }

  const targetDate = new Date(countdown.dataset.date);
  if (Number.isNaN(targetDate.getTime())) {
    return;
  }

  const daysNode = countdown.querySelector('[data-unit="days"]');
  const hoursNode = countdown.querySelector('[data-unit="hours"]');
  const minutesNode = countdown.querySelector('[data-unit="minutes"]');

  function update() {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      daysNode.textContent = "00";
      hoursNode.textContent = "00";
      minutesNode.textContent = "00";
      return;
    }

    const totalMinutes = Math.floor(diff / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;

    daysNode.textContent = String(days).padStart(2, "0");
    hoursNode.textContent = String(hours).padStart(2, "0");
    minutesNode.textContent = String(minutes).padStart(2, "0");
  }

  update();
  setInterval(update, 30000);
}

function initImageFallback() {
  const image = document.getElementById("couple-image");
  const fallback = document.getElementById("image-fallback");

  if (!image || !fallback) {
    return;
  }

  image.addEventListener("error", () => {
    image.hidden = true;
    fallback.hidden = false;
  });
}

function initCopyBank() {
  const copyButton = document.getElementById("copy-bank");
  const feedback = document.getElementById("copy-feedback");

  if (!copyButton || !feedback) {
    return;
  }

  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(copyButton.dataset.bank || "");
      feedback.textContent = "Datos copiados. Gracias por su detalle.";
    } catch {
      feedback.textContent = "No se pudo copiar automaticamente. Copia manualmente los datos de transferencia.";
    }
  });
}

function initRsvpForm() {
  const form = document.getElementById("rsvp-form");
  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const phone = form.dataset.phone;
    const name = (data.get("name") || "").toString().trim();
    const attending = (data.get("attending") || "").toString().trim();
    const guests = (data.get("guests") || "").toString().trim();
    const diet = (data.get("diet") || "Sin comentarios").toString().trim();
    const song = (data.get("song") || "Sin sugerencia").toString().trim();

    if (!phone || phone === "525512345678") {
      alert("Configura un telefono real en el atributo data-phone del formulario.");
      return;
    }

    const message = [
      "Hola, queremos confirmar asistencia a su boda:",
      `Nombre: ${name}`,
      `Asistencia: ${attending}`,
      `Numero de asistentes: ${guests}`,
      `Restriccion alimentaria: ${diet}`,
      `Cancion sugerida: ${song}`,
    ].join("\n");

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  initCountdown();
  initImageFallback();
  initCopyBank();
  initRsvpForm();
});
