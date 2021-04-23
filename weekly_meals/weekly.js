//functions to run on page load
window.addEventListener("load", myInit, true); function myInit() {
    myFunction();
    loadMeals();
    shoppingList();
}

var mealIds = new Array();
// brings in meals from database
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



    //displays current week in drop down calendar
    var weekElement = document.getElementById("week");
    todaydate = new Date();
    var oneJan = new Date(todaydate.getFullYear(), 0, 1);
    var numberOfDays = Math.floor((todaydate - oneJan) / (24 * 60 * 60 * 1000));
    var result = Math.round((1 + numberOfDays) / 7);

    var d = new Date();
    var n = d.getFullYear();

    var weekNumber = n + "-" + "W" + result;
    weekElement.value = weekNumber;
}

//individual dates from the date picker
//allows meals to save for the week
function loadMeals() {

    var inputWeek = document.querySelector('#week');
    var dates = parseDates(inputWeek.value);

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
                    // var sid = "dropzone" + this.indexValue;
                    var dropzone = document.getElementById('dropzone' + this.indexValue);
                    var parg = document.createElement('p');
                    var dele = document.createElement('a');
                    // dele.href = deleteMeal();
                    // div.id = "dropzone" + this.indexValue;
                    parg.id = "dropzones" + this.indexValue;
                    dele.id = "delete" + this.indexValue;
                    dele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + "x";
                    // dele.addEventListener("mouseover", hover);
                    parg.innerHTML = data.recipe.name;
                    parg.appendChild(dele);
                    $(document).on('click', '#delete' + this.indexValue, { day: this.indexValue }, function (event) {
                        var data = event.data;
                        var url = "http://localhost:8080/meal/" + mealIds[data.day];
                        $.ajax({
                            url: url,
                            type: "DELETE",
                            success: function (result) {

                            }
                        })
                        var del = document.getElementById("dropzones" + data.day);
                        del.remove();

                    });



                    dropzone.appendChild(parg);

                    mealIds[this.indexValue] = data.id;
                    console.log(mealIds);


                    // div.innerHTML = data.recipe.name;
                    // var dropzone = document.getElementById(sid)


                }

            }
        })




    }





}





// Drag and drop meals
function dragStart(ev) {
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
    var id = ev.dataTransfer.getData("Text");
    var recipe_id = id.substring(5);
    var element = document.getElementById(id);
    //check to make sure a meal hasn't already been assigned for that date
    if (ev.target.innerHTML == "") {
        var nodeCopy = element.cloneNode(true);
        var day = ev.currentTarget.id.substring(8);
        var inputWeek = document.querySelector('#week');
        var dates = parseDates(inputWeek.value);
        var date = dates[day];
        nodeCopy.id = "dropzones" + day;
        ev.target.appendChild(nodeCopy);
        var data = { mealDate: date, user: { id: 1 }, recipe: { id: recipe_id } };
        var dele = document.createElement('a')
        dele.id = 'delete' + day;
        dele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + "x";
        // dele.addEventListener("mouseover", hover);
        nodeCopy.appendChild(dele);
        $(document).on('click', '#delete' + day, { day: day }, function (event) {
            var data = event.data;
            var url = "http://localhost:8080/meal/" + mealIds[data.day];
            $.ajax({
                url: url,
                type: "DELETE",
                success: function (result) {

                }
            })
            var del = document.getElementById("dropzones" + data.day);
            del.remove();
            delete mealIds[data.day];
            shoppingList();
        });
        $.ajax({
            url: "http://localhost:8080/meal",
            data: JSON.stringify(data),
            contentType: 'application/json',
            dataType: 'json',
            type: 'post',
            indexValue: day,
            success: function (response) {
                mealIds[this.indexValue] = response.id;
                console.log(mealIds);
            }

        });
        shoppingList();

    }
    else {
        alert("meal has already been assigned for this date");
    }
}




// Calendar

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
//helper function for picking date from picker
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

// Update Shopping List
function shoppingList() {
    setTimeout(function () {



        var items = document.getElementById("items");
        items.value = "SHOPPING LIST \n";
        console.log(mealIds);
        for (i = 0; i < 7; i++) {
            if (mealIds.length > i && mealIds[i] != null) {
                var url = "http://localhost:8080/meal?id=" + mealIds[i];
                $.ajax({
                    url: url,
                    success: function (data) {

                        var items = document.getElementById("items");

                        for (let j = 0; j < data.recipe.recipeIngredients.length; j++) {
                            var recipeIngredient = data.recipe.recipeIngredients[j];
                            console.log(recipeIngredient.ingredient.name);
                            console.log(recipeIngredient.quantity);
                            var newItem = recipeIngredient.ingredient.name;
                            // var ingredients = ingredients.push[newItem];

                            items.value += ("\n" + newItem);

                        }

                    }


                })

            }

        }
    }, 1000);
}

function clear() {

    delete mealIds[i];
}

function hover() {
    dele.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;" + "x";
}