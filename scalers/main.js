let addBtn = document.querySelector(".addBtn");
let deleteBtn = document.querySelector(".deleteBtn");
let colorPalette = document.querySelectorAll(".colorPalette");
let textArea = document.querySelector(".textarea");
let mainContainer = document.getElementById("mainContainer");
let modalContainer = document.querySelector(".modal_container");
let toolboxClrs = document.querySelectorAll(".color");
let ticketsArr = [];
let color = ["pink", "green", "blue", "black"];
let modalPriorityClr = color[color.length - 1];
let addTaskFlag = false;
let deleteTaskFlag = false;
let lockClass = "fa-lock";
let unlockClass = "fa-unlock";

if (localStorage.getItem("tickets")) {
  ticketsArr = JSON.parse(localStorage.getItem("tickets"));
  ticketsArr.forEach((ticket) => {
    createTicket(ticket.ticketClr, ticket.ticketTask, ticket.ticketId);
  });
}

addBtn.addEventListener("click", function () {
  addTaskFlag = !addTaskFlag;
  if (addTaskFlag) {
    modalContainer.style.display = "flex";
  } else {
    modalContainer.style.display = "none";
  }
});

deleteBtn.addEventListener("click", function () {
  deleteTaskFlag = !deleteTaskFlag;
  if (deleteTaskFlag) {
    deleteBtn.style.color = "red";
    alert("Delete button is activated !");
  } else {
    deleteBtn.style.color = "white";
    alert("Delete button is deactivated !");
  }
});

colorPalette.forEach((clrPicker) =>
  clrPicker.addEventListener("click", function () {
    colorPalette.forEach((priorityClrElem) => {
      priorityClrElem.classList.remove("active");
    });
    clrPicker.classList.add("active");
    modalPriorityClr = clrPicker.classList[0];
  })
);

modalContainer.addEventListener("keydown", function (e) {
  let key = e.key;
  if (key === "Enter") {
    modalContainer.style.display = "none";
    createTicket(modalPriorityClr, textArea.value);
    textArea.value = "";
  }
});

function createTicket(ticketClr, ticketTask, ticketId) {
  let id = ticketId || shortid();

  let ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticketCont");
  ticketCont.innerHTML = `
  <div class="ticketClr ${ticketClr}"></div>
  <div class="ticketId">${id}</div>
  <div class="taskArea">${ticketTask}</div>
  <div class="ticketLock">
  <i class="fa-solid fa-lock"></i></div>
  
  `;
  if (!ticketId) {
    ticketsArr.push({ ticketClr, ticketTask, ticketId: id });
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  }

  mainContainer.appendChild(ticketCont);
  handleLock(ticketCont, id);
  handleColor();
  handleRemove(ticketCont, id);
}

function handleLock(ticket, id) {
  let ticketIdx = getTicketId(id);
  let ticketLockElem = ticket.querySelector(".ticketLock");
  let ticketLockIcon = ticketLockElem.children[0];
  let ticketTaskArea = ticket.querySelector(".taskArea");

  ticketLockIcon.addEventListener("click", function () {
    if (ticketLockIcon.classList.contains(lockClass)) {
      ticketLockIcon.classList.add(unlockClass);
      ticketLockIcon.classList.remove(lockClass);
      ticketTaskArea.setAttribute("contenteditable", true);
    } else {
      ticketLockIcon.classList.add(lockClass);
      ticketLockIcon.classList.remove(unlockClass);
      ticketTaskArea.setAttribute("contenteditable", false);
    }
  });

  ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
  localStorage.setItem("tickets", JSON.stringify(ticketsArr));
}

function handleColor() {}

function handleRemove(ticket, id) {
  ticket.addEventListener("click", function () {
    if (!deleteTaskFlag) return;
    ticket.remove();
    let idx = getTicketId(id);
    let deletedElm = ticketsArr.splice(idx, 1);
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function getTicketId(id) {
  let ticketID = ticketsArr.findIndex((ticketObj) => {
    return ticketObj.ticketId === id;
  });

  return ticketID;
}

for (let i = 0; i < toolboxClrs.length; i++) {
  toolboxClrs[i].addEventListener("click", function () {
    let selectedClr = toolboxClrs[i].classList[0];
    let filteredTickets = ticketsArr.filter(function (ticket) {
      return selectedClr === ticket.ticketClr;
    });
    let allTickets = document.querySelectorAll(".ticketCont");
    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }
    filteredTickets.forEach(function (filteredTicket) {
      createTicket(
        filteredTicket.ticketClr,
        filteredTicket.ticketTask,
        filteredTicket.ticketId
      );
    });
  });
  toolboxClrs[i].addEventListener("dblclick", function () {
    let allTickets = document.querySelectorAll(".ticketCont");
    for (let i = 0; i < allTickets.length; i++) {
      allTickets[i].remove();
    }
    ticketsArr.forEach(function (ticketsObj) {
      createTicket(
        ticketsObj.ticketClr,
        ticketsObj.ticketTask,
        ticketsObj.ticketId
      );
    });
  });
}
