
// ==========================================
// ASSIGNMENT STORAGE SECTION
// ==========================================

// An array is a list that can hold multiple pieces of information.
// This array stores all assignments added by the student.
//
// localStorage is browser storage that remembers information
// even after the page is refreshed or the browser is closed.
//
// getItem("assignments") retrieves previously saved assignments.
// JSON.parse converts saved text back into JavaScript data.
// The || [] means that if nothing has been saved yet, start with an empty list.

let assignments =
    JSON.parse(localStorage.getItem("assignments")) || [];


// ==========================================
// POMODORO TIMER VARIABLES
// ==========================================

// There are 60 seconds in a minute.
// 1500 seconds equals 25 minutes.
//
// seconds keeps track of the remaining timer time.
//
// interval stores the timer's repeating action.
// null means that the timer is not currently running.

let seconds = 1500;
let interval = null;


// ==========================================
// UPDATE TIMER FUNCTION
// ==========================================

// A function is a reusable block of code that performs a task.
//
// updateTimer calculates the remaining minutes and seconds
// and displays them on the website.

function updateTimer() {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;

    // textContent changes the text displayed inside an HTML element.
    //
    // padStart(2, "0") adds a zero in front of a number
    // when it has only one digit.
    // For example, 5 becomes 05.

    document.getElementById("timer").textContent =
        String(mins).padStart(2, "0") + ":" +
        String(secs).padStart(2, "0");
}


// ==========================================
// START TIMER FUNCTION
// ==========================================

// This function starts the Pomodoro countdown.
//
// setInterval is a JavaScript method that repeats an action
// at a set time interval. Here, it runs every 1000 milliseconds
// (one second).

function startTimer() {

    // Prevents the timer from starting multiple times at once.
    if (interval) return;

    interval = setInterval(() => {
        seconds--;

        // Checks whether the countdown has reached zero.
        if (seconds <= 0) {
            clearInterval(interval);
            interval = null;

            // Displays a message when the timer finishes.
            alert("Pomodoro complete!");
        }

        // Updates the displayed timer after each second.
        updateTimer();

    }, 1000);
}


// ==========================================
// PAUSE TIMER FUNCTION
// ==========================================

// Stops the repeating countdown without resetting the time.

function pauseTimer() {
    clearInterval(interval);
    interval = null;
}


// ==========================================
// RESET TIMER FUNCTION
// ==========================================

// Stops the timer and returns it to the original 25-minute setting.

function resetTimer() {
    pauseTimer();
    seconds = 1500;
    updateTimer();
}


// ==========================================
// SAVE DATA FUNCTION
// ==========================================

// This function saves assignments in localStorage.
//
// JSON.stringify converts JavaScript data into text
// so the browser can store it.
//
// setItem saves that text using the name "assignments".
//
// This allows assignment information to remain saved
// when the student refreshes or reopens the website.

function saveData() {
    localStorage.setItem(
        "assignments",
        JSON.stringify(assignments)
    );
}


// ==========================================
// ADD ASSIGNMENT FUNCTION
// ==========================================

// This function collects information from the assignment form
// and adds a new assignment to the assignment list.

function addAssignment() {

    // getElementById finds an HTML element using its ID.
    // .value retrieves the information typed or selected by the student.

    const title =
        document.getElementById("title").value;

    const course =
        document.getElementById("course").value;

    const priority =
        document.getElementById("priority").value;

    // Checks that the assignment name and course are not empty.
    // If either field is empty, an alert asks the student to fill it in.

    if (title === "" || course === "") {
        alert("Fill in all fields");
        return;
    }

    // push() adds a new item to the assignments array.
    //
    // An object is a collection of related information.
    // Each assignment has its own ID, title, course, priority,
    // and completion status.
    //
    // Date.now() creates a number based on the current time
    // to give each assignment a unique ID.

    assignments.push({
        id: Date.now(),
        title,
        course,
        priority,
        complete: false
    });

    // Saves the updated assignment list.
    saveData();

    // Refreshes the assignment display on the website.
    renderAssignments();

    // Clears the text boxes after the assignment has been added.
    document.getElementById("title").value = "";
    document.getElementById("course").value = "";
}


// ==========================================
// COMPLETE OR UNDO ASSIGNMENT FUNCTION
// ==========================================

// This function changes an assignment's completion status.
//
// The id parameter identifies which assignment should be changed.
// A parameter is information passed into a function.

function toggleAssignment(id) {

    // forEach goes through every assignment in the array.
    assignments.forEach(a => {

        // Checks whether the current assignment matches the selected ID.
        if (a.id === id) {

            // The ! symbol means NOT.
            // It switches true to false or false to true.
            // This allows students to complete or undo assignments.

            a.complete = !a.complete;
        }
    });

    // Saves the updated completion status.
    saveData();

    // Updates the assignment list and progress bar.
    renderAssignments();
}


// ==========================================
// DELETE ASSIGNMENT FUNCTION
// ==========================================

// This function removes an assignment from the list.

function deleteAssignment(id) {

    // filter() creates a new array containing only assignments
    // that do not match the selected ID.
    //
    // This removes the selected assignment.

    assignments =
        assignments.filter(a => a.id !== id);

    // Saves the updated list without the deleted assignment.
    saveData();

    // Refreshes the assignment display.
    renderAssignments();
}


// ==========================================
// DISPLAY ASSIGNMENTS FUNCTION
// ==========================================

// This function displays assignments on the website
// and calculates the student's completion progress.
//
// DOM means Document Object Model.
// It is the browser's representation of the HTML page.
// JavaScript uses the DOM to find and update website elements.

function renderAssignments() {

    // Finds the HTML container where assignments will appear.
    const list =
        document.getElementById("assignmentList");

    // Clears the existing display before adding the assignments again.
    list.innerHTML = "";

    // Keeps track of how many assignments are completed.
    let completed = 0;

    // Goes through every assignment stored in the array.
    assignments.forEach(a => {

        // If an assignment is complete, increase the completed count.
        if (a.complete) completed++;

        // createElement creates a new HTML element.
        // Here, it creates a div to hold one assignment.

        const div =
            document.createElement("div");

        // className assigns CSS classes to the new assignment.
        //
        // Every assignment receives the assignment class.
        // Completed assignments also receive the completed class.
        // This allows CSS to show a line through completed assignments.

        div.className =
            "assignment " +
            (a.complete ? "completed" : "");

        // innerHTML adds the assignment information and buttons.
        //
        // The backticks create a template literal.
        // A template literal lets JavaScript insert variable values
        // directly into a block of text using ${ }.
        //
        // The buttons call the functions that complete, undo,
        // or delete an assignment.

        div.innerHTML = `
            <strong>${a.title}</strong><br>
            ${a.course}<br>
            Priority: ${a.priority}<br>

            <button onclick="toggleAssignment(${a.id})">
                ${a.complete ? "Undo" : "Complete"}
            </button>

            <button onclick="deleteAssignment(${a.id})">
                Delete
            </button>
        `;

        // appendChild adds the new assignment to the assignment list.
        list.appendChild(div);
    });

    // ==========================================
    // PROGRESS CALCULATION
    // ==========================================

    // Calculates the percentage of completed assignments.
    //
    // If there are no assignments, the percentage is zero.
    // Otherwise, divide completed assignments by total assignments
    // and multiply by 100.
    //
    // Math.round rounds the result to the nearest whole number.

    let percent =
        assignments.length === 0
        ? 0
        : Math.round(
            completed / assignments.length * 100
        );

    // Changes the width of the green progress bar
    // to match the calculated completion percentage.

    document.getElementById("progressBar")
        .style.width = percent + "%";

    // Updates the progress text displayed underneath the bar.

    document.getElementById("progressText")
        .textContent =
        percent + "% Complete";
}


// ==========================================
// DARK MODE BUTTON
// ==========================================

// addEventListener waits for something to happen to an HTML element.
// This is called an event listener.
//
// Here, JavaScript listens for a click on the dark mode button.
//
// classList.toggle adds the dark class if it is missing
// or removes it if it is already there.
//
// The CSS file uses the dark class to change the website's appearance.

document
.getElementById("darkModeBtn")
.addEventListener("click", () => {

    document.body.classList.toggle("dark");
});


// ==========================================
// STARTUP SECTION
// ==========================================

// These two functions run when the JavaScript file loads.
//
// updateTimer displays the original 25-minute countdown.
//
// renderAssignments loads the saved assignments into the website
// and updates the progress bar.
//
// This is why saved assignments appear when the page is reopened.

updateTimer();
renderAssignments();
