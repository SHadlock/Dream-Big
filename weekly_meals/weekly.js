window.addEventListener("load", myInit, true); function myInit() {
    myFunction();
    loadMeals();
}

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
                $(para).data("recipe_id", data[i].id);
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
    var result = Math.round((1 + numberOfDays) / 7);

    var d = new Date();
    var n = d.getFullYear();


    var weekNumber = n + "-" + "W" + result;
    weekElement.value = weekNumber;
    console.log(numberOfDays)

}



function loadMeals() {
    var inputWeek = document.querySelector('#week');
    var dates = parseDates(inputWeek.value);
    console.log(dates);

    // for (let i = 1; i <= 7; i++) {
    //     let first = curr.getDate() - curr.getDay() + i
    //     let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
    //     weekMeal.push(day)
    // }



    for (var j = 0; j < 7; j++) {
        console.log("dropzone" + j);

        var d = document.getElementById("dropzone" + j);
        while (d.firstChild) {
            d.removeChild(d.firstChild);
        }
        var url = "http://localhost:8080/meal-user?user_id=1&meal_date=" + dates[j]
        $.ajax({
            url: url, indexValue: j, success: function (data) {
                if (data !== "") {
                    var id = "dropzone" + this.indexValue;

                    var div = document.createElement('div');
                    div.id = "savedMeal" + this.indexValue;
                    div.innerHTML = data.recipe.name;
                    var dropzone = document.getElementById(id)
                    dropzone.appendChild(div);
                }
            }
        })
    }
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
    var recipe_id = id.substring(5);
    var element = document.getElementById(id);
    var nodeCopy = element.cloneNode(true);
    var day = ev.currentTarget.id.substring(8);

    var inputWeek = document.querySelector('#week');
    var dates = parseDates(inputWeek.value);
    var date = dates[day];
    nodeCopy.id = "newId" + day;
    ev.target.appendChild(nodeCopy);
    // var recipe_id = $(nodeCopy).data("recipe_id");
    // recipe_id = 3;
    var data = { mealDate: date, user: { id: 1 }, recipe: { id: recipe_id } };
    $.ajax({
        url: "http://localhost:8080/meal",
        data: JSON.stringify(data),
        contentType: 'application/json',
        dataType: 'json',
        type: 'post',
        success: function (response) {
        }
    });
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

let parseDates = (inp) => {
    let year = parseInt(inp.slice(0, 4), 10);
    let week = parseInt(inp.slice(6), 10);

    let day = (1 + (week) * 7); // 1st of January + 7 days for each week

    let dayOffset = new Date(year, 0, 1).getDay(); // we need to know at what day of the week the year start

    dayOffset--;  // depending on what day you want the week to start increment or decrement this value. This should make the week start on a monday

    let days = [];
    for (let i = 0; i < 7; i++) { // do this 7 times, once for every day
        var date = new Date(year, 0, day - dayOffset + i);
        days.push(date.getFullYear() + '-' + ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '-' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate()))); // add a new Date object to the array with an offset of i days relative to the first day of the week
    }
    return days;
}

