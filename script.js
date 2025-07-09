const toggleDiv = document.querySelector("#toggleDiv");
const viewLogs = document.querySelector("#viewLogs");

toggleDiv.addEventListener("click", (e) => {
  viewLogs.classList.toggle("p-4");
  viewLogs.classList.toggle("w-0");
  viewLogs.classList.toggle("w-fit");
});
