$(document).ready(function () {
    alert('Ready!');
    buttonControl("add");

   
    $.get("localhost:3020/GetAllTodo", function (data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    });
    
});
var todoList = [];
var EditedItem = null;

function newTodoTask(item) {
    // var date = new Date();
    // var dt = date.toLocaleString();
    // var _id = 0;
    // if (todoList.length > 0) {
    //     _id = todoList[todoList.length - 1].id + 1;
    // }
    // var todoItem = { id: _id, name: name, createdTime: dt, completedTime: "", status: "new" }

    var todoItem = this.http.post(`${environment.apiUrl}/users/InsertTodo`, item);
    
    //  todoList.push(todoItem);
    return todoItem;
}
function createButton(id, name, classname, fuc) {
    var _button = document.createElement("BUTTON");
    //var _button = $("<button></button>");

    var _txt = document.createTextNode(name);
    _button.className = classname;

    _button.appendChild(_txt);
    //$( _button).append(_txt);

    _button.setAttribute("data-id", id);
    //$(_button).attr({'data-id': id});
    if (fuc != undefined)
        _button.onclick = fuc;
    return _button;
}
function createTodoItem(todo) {
    var _htmlcode = "<span>" + todo.name + "</span>" + "<span>  (Created on: " + todo.createdTime + ")</span>" + "<span> (Completed on: " + todo.completedTime + ")</span>" + " <span>Status: " + todo.status + "</span>";

    return _htmlcode;
}
function clickli() {
    var _id = this.getAttribute('data-id');
    //var _id = $("li").attr("data-id");
    EditedItem = todoList.find(function (element) {
        return element.id == _id;
    });
    if (EditedItem != undefined) {

        document.getElementById("myInput").value = EditedItem.name;
        //document.getElementById("myInput").value = _value;
        //$('#myInput').get(value) = EditedItem.name;
    }
    buttonControl("update");
}
function updateItem() {
    var newEl = document.getElementsByTagName("LI");

    if (EditedItem != undefined) {
        EditedItem.name = document.getElementById("myInput").value;
        var _li = document.getElementById("Item_" + EditedItem.id);
        var todoItemHtml = createTodoItem(EditedItem);

        _li.innerHTML = todoItemHtml;

        _li.appendChild(createButton(EditedItem.id, "done", "done", doneTime));
        _li.appendChild(createButton(EditedItem.id, "del", "close", deleteItem));

        todoList.find(function (element) {
            if (element.id == EditedItem.id) {
                element.name = EditedItem.name;
            }
        });
        EditedItem = null;
        //newEl.setAttribute("data-name", EditedItem);

    }
    document.getElementById("myInput").value = '';
}
// Create a new list item when clicking on the "Add" button
function newElement() {
    var inputValue = document.getElementById("myInput").value;

    var todoItem = newTodoTask(inputValue);
    var todoItemHtml = createTodoItem(todoItem);

    var li = document.createElement("LI");
    //var li = $("<li></li>");
    var items = document.querySelectorAll("#myUL li");
    //var items = $("#myUL li");

    li.setAttribute("data-id", todoItem.id);
    li.onclick = clickli;

    //var inputValue = $("#myInput").value;
    //li.setAttribute("data-name", inputValue);
    if (inputValue === '') {
        alert("Write something!");
        return;
    }
    li.innerHTML = todoItemHtml;

    li.appendChild(createButton(todoItem.id, "done", "done", doneTime));
    li.appendChild(createButton(todoItem.id, "del", "close", deleteItem));
    li.setAttribute("id", "Item_" + todoItem.id);

    document.getElementById("myUL").appendChild(li);
    //$("#myUL").append(li);

    todoList.push(todoItem);

    document.getElementById("myInput").value = "";
    //$("#myUL").value = "";
    buttonControl("cancel");
}
function doneTime() {
    var date = new Date();
    var dt = date.toLocaleString();

    var _id = this.getAttribute("data-id");
    // var _id = $("li").attr("data-id");

    var _todoItem = todoList.find(function (element) {
        return element.id == _id;
    });
    if (_todoItem != undefined) {
        _todoItem.completedTime = dt;
        _todoItem.status = "done";

        var _li = document.getElementById("Item_" + _id);
        //var _li = $("Item_" + _id);

        var todoItemHtml = createTodoItem(_todoItem);

        _li.innerHTML = todoItemHtml;

        _li.appendChild(createButton(_todoItem.id, "done", "done", doneTime));
        _li.appendChild(createButton(_todoItem.id, "del", "close", deleteItem));
    }
}
function deleteItem(item) {
   var _id= $(_button).attr({ 'data-id': id });
    // var _id = this.getAttribute("data-id");
    // //var _id = $("li").attr("data-id");

    // var _list = document.getElementById("myUL");
    // //var _list = $("#myUL").value;

    // var items = document.querySelectorAll("#myUL li");

    // var _todoItem = todoList.find(function (element) {
    //     return element.id == _id;
    // });
    // if (_todoItem != undefined) {
    //     var _li = document.getElementById("Item_" + _id);

    //     //_list.removeChild(_list.childNodes[_id]);
    //     var div = this.parentElement;
    //     var elt = div.closest('li');
    //     elt.parentNode.removeChild(elt);

    //     _li.appendChild(createButton(_todoItem.id, "done", "done", doneTime));
    //     _li.appendChild(createButton(_todoItem.id, "del", "close", deleteItem));
    // }
    var todoItem = this.http.delete(`${environment.apiUrl}/DelTodo/` + _id);

    return todoItem;
}
function cancelFunction() {
    document.getElementById('myInput').value = "";
    buttonControl("cancel");
}
function buttonControl(mode) {
    //document.getElementById("Add").disabled = false;
    $('#Add').disabled = false;
    //document.getElementById("Update").disabled = false;
    $('#Update').disabled = false;
    //document.getElementById("Cancel").disabled = false;
    $('#Cancel').disabled = true;

    switch (mode) {
        case "add":
            document.getElementById("Update").disabled = true;
            break;
        case "update":
            document.getElementById("Add").disabled = true;
            break;
        case "cancel":
            document.getElementById("Add").disabled = false;
            document.getElementById("Update").disabled = true;
            break;
    }
}
function myFilter() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
function sortList() {
    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
    list = document.getElementById("myUL");
    switching = true;
    //set sorting to be in ascending order
    dir = "asc";
    //make a loop that will continue until no switching has been done
    while (switching) {
        //start by saying: no switching is done
        switching = false;
        b = list.getElementsByTagName("LI");
        //loop through all the list items
        for (i = 0; i < (b.length - 1); i++) {
            //start by saying there should be no switching
            shouldSwitch = false;
            /*check if the next item should switch place with the current item,
            based on the sorting direction (asc or desc) */
            if (dir == "asc") {
                if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                    /*if next item is alphabetically lower than current item,
                    mark as a switch and break the loop */
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
                    /*if next item is alphabetically higher than current item,
                    mark as a switch and break the loop */
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /*if a switch has been marked, make the switch
            and mark that a switch has been done */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
            //Each time a switch is done, increase switchcount by 1
            switchcount++;
        } else {
            /*if no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}