function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id); //dataTransfer holds data that is going to be dragged. setData sets the format of data. 
    //event.dataTransfer.setData(format, data)
    //event.target.id returns the element (id) that targeted the event.
    console.log(dragStart);

}

function dragging(event) {
    document.getElementById("demo").innerHTML = "The p element is being dragged";
    //changes text when dragging element
}


function allowDrop(event) {
    event.preventDefault(); //will only allow to go to dropzone
}

function drop(event) {
    event.preventDefault(); //if outside of the area, won't drop
    var data = event.dataTransfer.getData("Text"); //variable of "data" is set to retrieve the data that is to be dragged
    event.target.appendChild(document.getElementById(data)); //puts variable of "data" in new box
    // document.getElementById("demo").innerHTML = "The p element was dropped"; //changes text when being dropped
}

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