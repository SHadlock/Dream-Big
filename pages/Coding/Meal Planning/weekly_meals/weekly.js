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
    document.getElementById("demo").innerHTML = "The p element was dropped"; //changes text when being dropped
}