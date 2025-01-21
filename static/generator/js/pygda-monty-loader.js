function fill_monty_images() {
  const imageGallery = document.getElementById("image-gallery");
  const numberOfImages = 4;
  const totalImages = 13;
  const imageBasePath = "img/monty-python";

  let availableImages = Array.from({ length: totalImages }, (_, i) => i + 1);
  availableImages = availableImages.sort(() => Math.random() - 0.5);
  for (let i = 0; i < numberOfImages; i++) {
    const img = document.createElement("img");
    img.src = `${imageBasePath}/${availableImages[i]}.jpg`;
    img.alt = `Monty Python ${i + 1}`;
    imageGallery.appendChild(img);
  }
}
