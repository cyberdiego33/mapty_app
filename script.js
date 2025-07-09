const toggleDiv = document.querySelector("#toggleDiv");
const viewLogs = document.querySelector("#viewLogs");

toggleDiv.addEventListener("click", (e) => {
  if (viewLogs.classList.contains("w-fit")) {
    viewLogs.classList.remove("p-4");
    viewLogs.classList.add("w-0");
    viewLogs.classList.remove("w-fit");
    viewLogs.classList.remove("inset-y-4");
    viewLogs.classList.remove("top-4");
  } else {
    viewLogs.classList.add("p-4");
    viewLogs.classList.remove("w-0");
    viewLogs.classList.add("w-fit");
    viewLogs.classList.add("inset-y-4");
    viewLogs.classList.add("top-4");
     
  }
});
