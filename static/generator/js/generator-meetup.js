document.addEventListener("DOMContentLoaded", () => {
  window.IMAGE_WIDTHS = ["2400px", "3375px"];
  window.IMAGE_SIZES = [
    {
      width: "2578px",
      height: "1350px",
      platform: "facebook", // For facebook events [19.1x10]
    },
    {
      width: "2400px",
      height: "1350px",
      platform: "common", // 16x9
    },
    {
      width: "3375px",
      height: "1350px",
      platform: "discord", // For discord events [25x10]
    },
  ];
  window.IMAGE_PREFIX = "gvt-meetup";
  initializeAndGenerate("meetup-template.html");
  setListeners();
});

function getDynamicPrefix() {
  const eventDateInput = document.getElementById("event-date");
  return eventDateInput?.value ?? "unknown_date";
}
