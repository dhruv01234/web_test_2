let arcnt = document.querySelector(".textarea-cont");
let priclr = document.querySelectorAll(".priority-color");
let mdlcnt = document.querySelector(".modal-cont");
let gum = document.querySelector(".remove-btn");
let adtb = document.querySelector(".add-btn");
let tlbxclr = document.querySelectorAll(".color");
let mncnt = document.querySelector(".main-cont");

let colors = ["pink", "blue", "green", "black"];
let modalPriorityColor = colors[colors.length - 1];

let removeFlag = false;



let addFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketArr = [];

if(localStorage.getItem("jira_tickets")){
    ticketArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketArr.forEach((ticketObj) =>{
        createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
    })
}

for(let i = 0 ;  i < tlbxclr.length ; i++){
    tlbxclr[i].addEventListener("click" , (e) =>{
        let currenttlbxclr = tlbxclr[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj , idx) =>{
            return currenttlbxclr === ticketObj.ticketColor;
        })
        
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        
        filteredTickets.forEach((ticketObj, idx) =>{
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask , ticketObj.ticketID);
        })

    })
    tlbxclr[i].addEventListener("dblclick" , (e) =>{
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0 ; i < allTicketsCont.length ; i++){
            allTicketsCont[i].remove();
        }
        ticketArr.forEach((ticketObj , idx) =>{
            createTicket(ticketObj.ticketColor , ticketObj.ticketTask , ticketObj.ticketID);
        })
    })
}

priclr.forEach((ColorElem, idx) => {
    ColorElem.addEventListener("click", (e) => {
        priclr.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        ColorElem.classList.add("border");

        modalPriorityColor = ColorElem.classList[0];
    })
})

adtb.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        mdlcnt.style.display = "flex";
    } else {
        mdlcnt.style.display = "none";
    }
})

gum.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    if(removeFlag){
        gum.classList.add("dh");
    }
    else{
        gum.classList.remove("dh");
    }

})

mdlcnt.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Enter"){
        createTicket(modalPriorityColor, arcnt.value);
        addFlag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
    <div class = "ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
        <i class="fa-solid"></i>
    </div>
    `;
    mncnt.appendChild(ticketCont);
    if(!ticketID) {
        
        ticketArr.push({ticketColor , ticketTask , ticketID : id});
        localStorage.setItem("jira_tickets",JSON.stringify(ticketArr));
    }

    handleRemoval(ticketCont ,id);
    handleLock(ticketCont , id);
}

function handleRemoval(ticket , id) {
    ticket.addEventListener("click" , (e) =>{
        if(!removeFlag) return ;
        let idx = getTicketIdx(id);
        ticketArr.splice(idx , 1);
        let strTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets", strTicketArr);
        ticket.remove();
    })
}


function handleLock(ticket , id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTicketIdx(id);
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contentedittable", "true");
        }
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorag.setItem("jira_tickets",JSON.stringify(ticketArr));
    })
}


function getTicketIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) =>{
        return ticketObj.ticketID == id;
    })
    return ticketIdx;
}

function setModalToDefault(){
    mdlcnt.style.display = "none";
    arcnt.value = "";
    priclr.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    priclr[priclr.length - 1].classList.add("border");

}



