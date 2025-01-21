document.addEventListener("DOMContentLoaded", () => {
  window.IMAGE_SIZES = [
    {
      width: "2400px",
      height: "1350px",
      platform: "common", // 16x9
    },
  ];
  window.IMAGE_PREFIX = "gvt-speaker";
  initializeAndGenerate("speaker-template.html");
  setListeners();
});

function getDynamicPrefix() {
  const eventDateInput = document.getElementById("event-date");
  const speakerInput = document.getElementById("speaker-name");
  const dateText = eventDateInput?.value ?? "unknown_date";
  const speakerName = (speakerInput?.value ?? "unknown_name").replace(/[^a-z0-9_\-\.]/gi, "_");
  return `${dateText}_${speakerName}`;
}
