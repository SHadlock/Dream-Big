

function myFunction() {
    $.ajax({
        url: "http://localhost:8080/recipes?user_id=1", success: function (data) {
            for (var i in data) {
                var meals = document.getElementById('meals');
                var div = document.createElement('div');
                var para = document.createElement('p');
                para.id = 'drop_' + data[i].id;
                div.id = 'dropTarget';
                para.innerHTML = data[i].name
                para.draggable = "true";
                div.appendChild(para);
                meals.appendChild(div);
                div.addEventListener("drop", drop);
                div.addEventListener("dragover", allowDrop);
                para.addEventListener("dragstart", dragStart);
            };



        }
    });
    var weekElement = document.getElementById("week");

    //define a date object variable that will take the current system date
    todaydate = new Date();

    //find the year of the current date
    var oneJan = new Date(todaydate.getFullYear(), 0, 1);

    // calculating number of days in given year before a given date 
    var numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));
    // weekElement.value = weekElement.defaultValue;

    // adding 1 since to current date and returns value starting from 0 
    var result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);

    var d = new Date();
    var n = d.getFullYear();


    var weekNumber = n + "-" + "W" + result;
    weekElement.value = weekNumber;

}
// Drag and drop meals
function dragStart(ev) {
    console.log("dragStart")
    ev.dataTransfer.setData("Text", ev.target.id); //dataTransfer holds data that is going to be dragged. setData sets the format of data. 
    ev.effectAllowed = "copy";
    //event.dataTransfer.setData(format, data)
    //event.target.id returns the element (id) that targeted the event.
}




function allowDrop(ev) {
    ev.preventDefault(); //will only allow to go to dropzone
}

function drop(ev) {
    ev.preventDefault(); //if outside of the area, won't drop
    //var data = ev.dataTransfer.getData("Text"); //variable of "data" is set to retrieve the data that is to be dragged
    var id = ev.dataTransfer.getData("Text");
    var nodeCopy = document.getElementById(id).cloneNode(true);
    nodeCopy.id = "newId"
    ev.target.appendChild(nodeCopy);
}



// Calendar

//define a date object variable that will take the current system date
todaydate = new Date();

//find the year of the current date
var oneJan = new Date(todaydate.getFullYear(), 0, 1);

// calculating number of days in given year before a given date 
var numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));

// adding 1 since to current date and returns value starting from 0 
var result = Math.ceil((todaydate.getDay() + 1 + numberOfDays) / 7);

// var d = new Date();
// var n = d.getFullYear();


// var weekNumber = "2021-W01";


// console.log(weekNumber)
// define variables
var nativePicker = document.querySelector('.nativeWeekPicker');
var fallbackPicker = document.querySelector('.fallbackWeekPicker');
var fallbackLabel = document.querySelector('.fallbackLabel');

var yearSelect = document.querySelector('#year');
var weekSelect = document.querySelector('#fallbackWeek');

// hide fallback initially
fallbackPicker.style.display = 'none';
fallbackLabel.style.display = 'none';

// test whether a new date input falls back to a text input or not
var test = document.createElement('input');

try {
    test.type = 'week';
} catch (e) {
    console.log(e.description);
}

// if it does, run the code inside the if() {} block
if (test.type === 'text') {
    // hide the native picker and show the fallback
    nativePicker.style.display = 'none';
    fallbackPicker.style.display = 'block';
    fallbackLabel.style.display = 'block';

    // populate the weeks dynamically
    populateWeeks();
}

function populateWeeks() {
    // Populate the week select with 52 weeks
    for (var i = 1; i <= 52; i++) {
        var option = document.createElement('option');
        option.textContent = (i < 10) ? ("0" + i) : i;
        weekSelect.appendChild(option);
    }
}