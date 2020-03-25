const currentDayEl = $("#currentDay")
const timeRowsDiv = $(".timeRows")
const timeRowsDivHolder = $(".timeRowsDivHolder")

function makeTimerows(selectedDay) {
    // Sets day in header to current day
    currentDayEl.text(selectedDay.format("MMMM Do YYYY"))

    // Sets planner up as user had it last 

    var storedObj = localStorage.getItem("userData")
    storedObj = JSON.parse(storedObj)

    // If there isnt already a storage object this creates one
    if (!storedObj) {
        storedObj = {}
    }

    for (i = 0; i < 24; i++) {
        let individualRow = document.createElement("div");
        individualRow.classList.add("row");
        individualRow.classList.add("alxStyling");

        let rowHour = moment().hour(i)

        // Making the time row subsections

        // Displays the Hour and AM/PM on the side
        let hourSection = document.createElement("div");
        hourSection.classList.add("col-1");
        hourSection.classList.add("rowTime");
        hourSection.innerText = rowHour.format("hA")
        let descriptionClass = rowHour.isBefore(moment(), 'hour') ?
            "past" :
            rowHour.isSame(moment(),
                'hour') ?
            "present" :
            "future";
        hourSection.classList.add(descriptionClass);


        // Displays the text the user has writen and displays it in the middle
        let entrySection = document.createElement("div")
        entrySection.classList.add("col-10");
        entrySection.classList.add("rowEntry");
        entrySection.setAttribute("data-hour", i);
        entrySection.contentEditable = true;
        // Searches storage object for content in current day then hour
        if (storedObj[moment().format("YYYY-MM-DD")]) {
            if (storedObj[moment().format("YYYY-MM-DD")][i]) {
                entrySection.innerText = storedObj[moment().format("YYYY-MM-DD")][i];
            }
        }

        // Makes a save button and an event listner that runs a save function

        let saveSection = document.createElement("button");
        saveSection.classList.add("col-1");
        saveSection.classList.add("rowSave");
        saveSection.textContent = "Save"
        saveSection.setAttribute("data-hour", i);
        saveSection.addEventListener("click", (event) => {
            console.log("Saved")
            let userSave = localStorage.getItem("userData")
            userSave = JSON.parse(userSave)

            // Tried writing this in jQuery $(`div[data-hour="${event.currentTarget.dataset.hour}"]`).text and it didnt work, unsure why
            let dataPointer = document.querySelector(`div[data-hour="${event.currentTarget.dataset.hour}"]`)
                .textContent

            if (!userSave) {
                userSave = {}
            }

            if (!userSave[selectedDay.format("YYYY-MM-DD")]) {
                userSave[selectedDay.format("YYYY-MM-DD")] = [];
            }
            userSave[selectedDay.format("YYYY-MM-DD")][event.currentTarget.dataset.hour] = dataPointer;

            userSave = JSON.stringify(userSave);
            localStorage.setItem("userData", userSave);
        })

        // merging subsection cols to make a row
        individualRow.appendChild(hourSection)
        individualRow.appendChild(entrySection)
        individualRow.appendChild(saveSection)

        timeRowsDiv.append(individualRow);

    }

}

function NewDayClick() {
    timeRowsDiv.empty()

    newDayRow = makeTimerows(selectedDay);
    timeRowsDivHolder.append(newDayRow);

    return newDayRow;
}

let selectedDay = moment()
let currentDay = makeTimerows(selectedDay)
timeRowsDiv.append(selectedDay)

$("#nextBtn").on("click", function () {
    selectedDay.add(1, 'd')
    currentDayEl.text(moment().add(1, 'd').format('MMMM Do YYYY'))
    NewDayClick();

})

$("#prevBtn").on("click", function () {
    selectedDay.subtract(1, 'd')
    currentDayEl.text(moment().subtract(1, 'd').format('MMMM Do YYYY'))
    NewDayClick();
})