//Seleziona elementi dalla pagina
const clear = document.querySelector(".clear");
const dateElement = document.getElementById("date");
const list = document.getElementById("list");
const input = document.getElementById("input");

//Definisco i controlli sugli oggetti della lista (tramite le classi)
const CHECK = "fa-check-circle";
const UNCHECK = "fa-circle-thin";
const LINE_THROUGH = "lineThrough";

//Variabili: un array per la lista (LIST) e l'id degli elementi della stessa
let LIST, id;

//Ottiene gli oggetti memorizzati
let data = localStorage.getItem("TASK");

//All'apertura dell'app, se la lista contiene dati, li carica, altrimenti restituisce la pagina vuota
if (data) {
    LIST = JSON.parse(data);
    loadTasks(LIST);
    id = LIST.length; //setta l'id al numero dell'ultimo elemento
}
else {
    LIST = [];
    id = 0;
}

//Carica i task 
function loadTasks(array) {
    array.forEach(function (item) {
        addTask(item.name, item.id, item.done, item.trash);
    });
}

//Cancella i task (premendo il tasto clear)
clear.addEventListener('click', function () {
    localStorage.clear();
    location.reload();
});

//Data di oggi: Giorno Num. Mese Anno 
const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
const today = new Date();
dateElement.innerHTML = today.toLocaleDateString("it-IT", options);

//Funzione che aggiunge il task inserito dall'utente alla lista
function addTask(task, id, done, trash) {
    if (trash) { return; }

    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : "";

    const item = `<li class="item">
                    <i class ="fa ${DONE} co" job = "complete" id=${id}></i>
                    <p class = "text ${LINE}"> ${task} </p>
                    <i class ="fa fa-trash-o de" job="delete" id=${id}></i>
                </li>`;
    const position = "beforeend";
    list.insertAdjacentHTML(position, item);
}

//Quando l'utente preme "invio", aggiunge il task alla lista
document.addEventListener("keyup", function (event) {
    //Controlliamo che l'utente abbia premuto il tasto invio (keyCode 13)
    if (event.keyCode == 13) {
        //una volta premuto invio, prendiamo il valore dell'input e lo associamo alla variabile task
        const task = input.value;

        //Se la variabile task non è vuota, aggiungiamo il valore alla lista
        if (task) {

            addTask(task, id, false, false);
            LIST.push(
                {
                    name: task,
                    id: id,
                    done: false,
                    trash: false
                }
            );
            localStorage.setItem("TASK", JSON.stringify(LIST));
            id++;
        }
        input.value = "";
    }
});

//Se l'utente flagga il cerchietto "check", barra il task e lo "completa"
function completeTask(element) {

    element.classList.toggle(CHECK);
    element.classList.toggle(UNCHECK);
    element.parentNode.querySelector(".text").classList.toggle(LINE_THROUGH);

    LIST[element.id].done = LIST[element.id].done ? false : true;
}

//Se l'utente clicka sul cestino, elimina il task
function removeTask(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    LIST[element.id].trash = true;
}

//Qui l'app si mette in ascolto degli eventi creati dall'utente sulla lista
list.addEventListener("click", function (event) {
    let element = event.target;
    const elementJOB = element.attributes.job.value;

    if (elementJOB == "complete") {
        completeTask(element);
    }
    else if (elementJOB == "delete") {
        removeTask(element);
    }

    localStorage.setItem("TASK", JSON.stringify(LIST));
});




