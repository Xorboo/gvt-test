document.addEventListener("DOMContentLoaded", () => {
  window.IMAGE_WIDTHS = ["2400px", "3375px"];
  window.IMAGE_TYPE = "meetup";
  initializeAndGenerate("meetup-template.html");
  setListeners();
});
