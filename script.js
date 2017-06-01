var url = 'https://pacific-meadow-64112.herokuapp.com/data-api/taoshima';

//initialize the example row here 
var tableBody = $('#sushi-body');
var trow = $('<tr>');
var data1 = $('<td>').text("ie. Salmon Skin Roll");
var data2 = $('<td>').text("ie. Musashi's Sushi Restaurant");
trow.append(data1);
trow.append(data2);
tableBody.append(trow);

//holds all the data the user enters into the form
var sushiItems = [];

//read from the REST API at startup
/*the get will return all of the data in the database that we have put in so far. Does it return a table?*/
$(document).ready(function() {
  $.ajax(url, {
    method: 'GET',
    success: function(data) {
      var tbody = $('#sushi-body');
      sushiItems = data;
      sushiItems.forEach(function(sushiData) {
        var tr = buildTable(sushiData);
        tbody.append(tr);
      });
    }
  });
});

//function handlers
$('#newItemButton').on('click', handleNewItemButton);
$('#submit').on('click', addToArray);
$('#cancel').on('click', handleCancel);
$('#clearTable').on('click', clearTable);

//handler for the new item button
/*will hide the table and reveal the form*/
function handleNewItemButton() {
  //gets the h3 header just before the table
  var tableH3 = $('h1 + h3');
  //gets the div with the table
  var table = $('#table');
  //gets the div with the form
  var form = $('#form');
  //hides the table heading
  tableH3.css('display', 'none');
  //hides the table
  table.css('display', 'none');
  //reveals the form
  form.css('display', 'block'); 
}

//add user input to the data array
function addToArray() {
  //gets the input for the sushi field
  var sushiVal = $('#sushiEntry').val();
  //gets the form input for the restaurant field
  var restVal = $('#restEntry').val();
  //error handling
  if (sushiVal == "" || restVal == "") {
    alert("Please enter a sushi name and restaurant!");
  } else {
    //adds what the user entered into the object array
    sushiItems.push({sushi: sushiVal, restaurant: restVal});
    //call the buildTable function
    /*this gets the body of the table we put on the html*/
    var tbody = $('#sushi-body');
    /*make sure the table is empty each time we add entries*/
    tbody.html("");
    
    //add the example row here 
    var trow = $('<tr>');
    var data1 = $('<td>').text("ie. Salmon Skin Roll");
    var data2 = $('<td>').text("ie. Musashi's Sushi Restaurant");
    trow.append(data1);
    trow.append(data2);
    tbody.append(trow);
    
    /*this takes each entry in the data array and runs the build table function on it. sushiData is just the variable we give to each sushi object entry in the array*/
    sushiItems.forEach(function(sushiData) {
      var tr = buildTable(sushiData);
      tbody.append(tr);
    });
    //reveal the table and hide the form
    var tableH3 = $('h1 + h3');
    var table = $('#table');
    var form = $('#form');
    tableH3.css('display', 'block');
    table.css('display', 'block');
    form.css('display', 'none');
    //clear the form fields
    $('#sushiEntry').val("");
    $('#restEntry').val("");
    
    //save the data to localStorage in addition to having it in the local array
    localStorage["sushi-list"] = JSON.stringify(sushiItems);
    
    console.log(sushiItems);
    //also save the data to the REST API connected to a Mongo database that was created for this assignment
    /*unlike localstorage where we can store the entire data array and have it read back, with the REST API we will need to send just one objet at a time. Maybe there is a way to send the whole array but couldn't figure it out...*/
    $.ajax(url, {
      method: 'POST',
      data: {
        sushi: sushiVal,
        restaurant: restVal
      },
      success: function() {
        console.log("data posted successfully");
      },
      error: function() {
        cosole.log("AJAX error. Data not posted");
      }
    });
  }
}

//build the table with the data array. The code below dynamically builds a table
function buildTable(sushiData) {
  //creates a new row
  var tr = $('<tr>');
  //creates a new column and append to row
  var td = $('<td>').text(sushiData.sushi);
  tr.append(td);
  //create new column and append to row
  var td = $('<td>').text(sushiData.restaurant);
  tr.append(td);
  return tr;  
}

/*handle the cancel by simply revealing the table again*/
function handleCancel() {
  //reveal the table and hide the form
  var tableH3 = $('h1 + h3');
  var table = $('#table');
  var form = $('#form');
  tableH3.css('display', 'block');
  table.css('display', 'block');
  form.css('display', 'none');
}

//function to clear the table
function clearTable() {
  localStorage.clear();
  //clear the database. First get the id of each item in the dataabase
  $.ajax(url, {
    method: 'GET',
    success: function(data) {
      data.forEach(function(items) {
        $.ajax(url + '/' + items._id, {
          method: 'DELETE',
          success: function() {
            console.log("database cleared");
          },
          error: function() {
            console.log("could not clear database");
          }
        });
      });
    }
  });
}