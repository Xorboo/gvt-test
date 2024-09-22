async function loadTemplate(templateFilename) {
  try {
    const response = await fetch(templateFilename);
    const templateHTML = await response.text();
    document.getElementById("hidden-template").innerHTML = templateHTML;
  } catch (error) {
    console.error("Error loading template:", error);
    alert("Failed to load the template. Please try again.");
  }
}

function setDefaultValues() {
  const dateInput = document.getElementById("event-date");
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  dateInput.value = formattedDate;

  const formattedDisplayDate = `${day}.${month}`;
  const dateTextElement = document.getElementById("date-text");
  if (dateTextElement) {
    dateTextElement.textContent = formattedDisplayDate;
  }
}

function waitForImagesToLoad(container) {
  const images = container.querySelectorAll("img");
  const imagePromises = [];

  images.forEach((img) => {
    if (img.complete) {
      return;
    }
    imagePromises.push(
      new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      }),
    );
  });

  return Promise.all(imagePromises);
}

function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function generatePng() {
  showLoading();

  const templateElement = document.getElementById("hidden-template");
  html2canvas(templateElement, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
  })
    .then((canvas) => {
      const previewCanvas = document.getElementById("preview-canvas");
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height;
      const ctx = previewCanvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvas, 0, 0);

      hideLoading();
    })
    .catch((error) => {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
      hideLoading();
    });
}

function generatePngDelayed(delayMs = 300) {
  setTimeout(() => generatePng(), delayMs);
}

async function initializeAndGenerate(templateFilename) {
  await loadTemplate(templateFilename);
  setDefaultValues();

  const templateElement = document.getElementById("hidden-template");

  try {
    await waitForImagesToLoad(templateElement);
    generatePngDelayed();
  } catch (error) {
    console.error("Error loading images:", error);
    alert("Failed to load images. Please try again.");
  }
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  const logoImage = document.getElementById("logo-image");

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      logoImage.src = e.target.result;
      requestAnimationFrame(() => generatePng());
    };

    reader.onerror = function () {
      console.error("Error reading the uploaded image.");
      alert("Failed to read the uploaded image. Please try again.");
    };

    reader.readAsDataURL(file);
  }
}

async function regeneratePng() {
  const templateElement = document.getElementById("hidden-template");

  try {
    await waitForImagesToLoad(templateElement);
    requestAnimationFrame(() => {
      setTimeout(() => {
        generatePng();
      }, 0);
    });
  } catch (error) {
    console.error("Error loading the uploaded image:", error);
    alert("Failed to load the uploaded image. Please try again.");
  }
}

function showLoading() {
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.classList.add("active");
  }
}

function hideLoading() {
  const loadingIndicator = document.getElementById("loading-indicator");
  if (loadingIndicator) {
    loadingIndicator.classList.remove("active");
  }
}

function updateTemplateFields() {
  const dateInput = document.getElementById("event-date");
  if (dateInput) {
    const date = new Date(dateInput.value);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const formattedDate = `${day}.${month}`;

    document.getElementById("date-text").textContent = formattedDate;
  }

  const timeInput = document.getElementById("event-time");
  if (timeInput) document.getElementById("time-text").textContent = timeInput.value;

  const addressInput = document.getElementById("event-address");
  if (addressInput) document.getElementById("address-text").textContent = addressInput.value;

  const authorInput = document.getElementById("author-name");
  if (authorInput) document.getElementById("author-text").textContent = authorInput.value;

  const speakerInput = document.getElementById("speaker-name");
  if (speakerInput) document.getElementById("speaker-text").textContent = speakerInput.value;

  const speakerRole = document.querySelector('input[name="speaker-role"]:checked');
  if (speakerRole) document.getElementById("speaker-role").textContent = speakerRole.value;

  regeneratePng();
}

function downloadImage(canvas, filename) {
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function downloadImages() {
  const template = document.getElementById("hidden-template");

  for (let width of window.IMAGE_WIDTHS) {
    const clonedTemplate = template.cloneNode(true);
    document.body.appendChild(clonedTemplate);
    clonedTemplate.style.width = width;

    html2canvas(clonedTemplate, { scale: 2 }).then((canvas) => {
      downloadImage(canvas, "event-" + width + ".png");
      document.body.removeChild(clonedTemplate);
    });
  }
}

function setListeners() {
  const imageUploadInput = document.getElementById("image-upload");
  imageUploadInput.addEventListener("change", handleImageUpload);

  const debouncedUpdate = debounce(updateTemplateFields, 300);

  const dateInput = document.getElementById("event-date");
  if (dateInput) dateInput.addEventListener("input", debouncedUpdate);

  const timeInput = document.getElementById("event-time");
  if (timeInput) timeInput.addEventListener("input", debouncedUpdate);

  const addressInput = document.getElementById("event-address");
  if (addressInput) addressInput.addEventListener("input", debouncedUpdate);

  const authorInput = document.getElementById("author-name");
  if (authorInput) authorInput.addEventListener("input", debouncedUpdate);

  const speakerInput = document.getElementById("speaker-name");
  if (speakerInput) speakerInput.addEventListener("input", debouncedUpdate);

  document.querySelectorAll('#role-radio input[name="speaker-role"]').forEach((radio) => radio.addEventListener("change", debouncedUpdate));

  document.getElementById("download-link").addEventListener("click", downloadImages);

  document.getElementById("generate-btn").addEventListener("click", () => updateTemplateFields());
}
