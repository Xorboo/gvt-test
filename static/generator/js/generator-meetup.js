document.addEventListener("DOMContentLoaded", () => {
  window.IMAGE_WIDTHS = ["2400px", "3600px"];
  window.IMAGE_TYPE = "meetup";
  initializeAndGenerate("meetup-template.html");
  setListeners();
});
