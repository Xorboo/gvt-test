document.addEventListener("DOMContentLoaded", async () => {
  window.IMAGE_SIZES = [
    {
      width: "1920px",
      height: "1005px",
      platform: "facebook", // For facebook events [19.1x10]
    },
    {
      width: "1920px",
      height: "1080px",
      platform: "common", // 16x9
    },
    {
      width: "2700px",
      height: "1080px",
      platform: "discord", // For discord events [25x10]
    },
  ];
  window.IMAGE_PREFIX = "pygda";
  await initializeAndGenerate("pygda-template.html");
  fill_monty_images();
  setListeners();
});

function getDynamicPrefix() {
  const eventNumberInput = document.getElementById("event-number");
  return eventNumberInput?.value ?? "unknown";
}
