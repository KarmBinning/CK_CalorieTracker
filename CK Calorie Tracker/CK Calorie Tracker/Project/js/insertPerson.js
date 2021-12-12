/*
    NAME: Karamdip Binning
    DATE STARTED: November 19th, 2013, 8:48pm
    PURPOSE: Handle validation for the Insert Person page;
       display all people in database;
*/

var genderValue = '';

//this method displays error
function errorHandler(transaction, error) {
    alert("SQL ERROR: " + error.message.toString());
}

//opens the database, if not existing then creates new
var dbAddPerson = openDatabase
    ('dbPerson', '1.0', 'Person Database', 100 * 1024);

//create Item database table
function createPersonTable() {
    dbAddPerson.transaction(function (transaction) {

        var strCreateTable = "CREATE TABLE IF NOT EXISTS person " +
            "(ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
            "gender VARCHAR NOT NULL, " +
            "name_ VARCHAR NOT NULL, " +
            "dob DATE NOT NULL, " +
            "feet INTEGER NOT NULL, " +
            "inches INTEGER NOT NULL, " +
            "weight INTEGER NOT NULL);";

        transaction.executeSql(strCreateTable, [], null, errorHandler);
    }, errorHandler);
}

//create Weight database table
function createWeightTable() {
    dbAddPerson.transaction(function (transaction) {

        var strCreateTable = "CREATE TABLE IF NOT EXISTS weight " +
            "(ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
            "weight INTERGER NOT NULL, " +
            "dateMonth INTEGER NOT NULL, " +
            "dateYear INTEGER NOT NULL, " +
            "personId INTEGER, " +
            "FOREIGN KEY(personId) REFERENCES person(ID));";

        transaction.executeSql(strCreateTable, [], null, errorHandler);
    }, errorHandler);
}

// drop table called only when clear all is clicked
function dropTables() {
    var query = 'DROP TABLE person;';
    try {
        friendDb.transaction(function (transaction) {
            transaction.executeSql(query, [], null, errorHandler);
        });
    }
    catch (e) {
        alert("Error: Unable to drop table " + e + ".");
        return;
    }
}

function setDefaultValues() {
    var localName = window.localStorage.getItem('localName');
    frmAddPerson.txtNameAdd.value = '';

    if (localName != null) {
        frmAddPerson.txtNameAdd.value = localName;
    }

    frmAddPerson.choice1.checked = 'Male';
    frmAddPerson.ddlFeetAdd.value = '';
    frmAddPerson.ddlInchesAdd.value = '';
    frmAddPerson.txtWeightAdd.value = '';

    var date = new Date();
    frmAddPerson.txtDobAdd.value = date.getMonth() + 1 + "/" +
        date.getDate() + "/" + date.getFullYear();
}

var newPersonId;
var newPersonName;
var newPersonWeight;

//get the newly inserted person's id
function getNewPersonId(results) {
    var thisRow = null;

    for (var i = 0; i < results.rows.length; i++) {
        thisRow = results.rows.item(i);
        newPersonId = thisRow['ID'];
        currentId = newPersonId;
        sessionStorage.setItem('id', currentId);
    }
}

//select the newly inserted person
function displayNewPerson() {
    var strSelectQry = "SELECT ID " +
        "FROM person " +
        "WHERE name_ = '" + newPersonName + "'";
    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
            [], function (transaction, results) {
                getNewPersonId(results)
            }, errorHandler);
    });
}

//show display when successful adding of item to DB
function showAddPerson() {
    alert("You have just added a new person.");
    setDefaultValues();

    //get the Id of the newly inserted person
    displayNewPerson();

    var currentTime = new Date();
    var month = currentTime.getMonth() + 1;
    var year = currentTime.getFullYear();

    //inserts the weight for new person immediately for the chart
    createWeightTable();
    insertWeight(newPersonWeight, month, year, newPersonId);

    document.location.href = "#person";
}

//show display when successful adding of Weight to DB
function showAddWeight() {
    alert("You have just added a new Weight.");
    setDefaultValues();

    document.location.href = "#alterWeight";
}

var currentId;

function getCurrentId(clickedId) {
    currentId = clickedId;
}

function displayAllItems(results) {
    var strHtml = '';
    var thisRow = null;

    if (results.rows.length == 0) {
        strHtmlFormat += '<h3>No People</h3>';
    }
    else {

        for (var i = 0; i < results.rows.length; i++) {
            thisRow = results.rows.item(i);

            strHtml += '<fieldset data-role="controlgroup" data-type="horizontal"' 
            + 'style="float: left;">'
            + '<button id="' + thisRow['ID'] + '" data-theme="e" '
            + 'style="text-align: left; background-color: gold; '
            + 'font-family: Century Gothic;" onclick="' 
            + 'getCurrentId(this.id);" data-rel="dialog" data-inline="false"'
            + ' data-transition="slide">' + '<h1><b><u>' + thisRow['name_'] 
            + '</u></b></h1>' 
            + '<p><b>' + 'GENDER:' + '</b>' + thisRow['gender'] + '<br />'
            + '<b>DOB: ' + '</b>' + thisRow['dob'] + '<br />'
            + '<b>HEIGHT: ' + '</b>' + thisRow['feet'] + "'" +
            + thisRow['inches'] + '"' + '<br />'
            + '<b>WEIGHT: ' + '</b>' + thisRow['weight'] + '<br />'
            + '</p></button></fieldset>';

            $("#lstAll").append(strHtml);
        }
    }

    $("#lstAll").empty();
    $("#lstAll").append(strHtml);
    $("#lstAll").listview('refresh');
}

var itemName = '';

function insertPerson(Gender, Name, Dob, Feet, Inches, Weight) {

    newPersonName = Name;
    newPersonWeight = Weight;

    try {
        var strInsertItem = "INSERT INTO person " +
        "(gender, name_, dob, feet, inches, weight) " +
        "VALUES (?, ?, ?, ?, ?, ?)";

        dbAddPerson.transaction(function (transaction) {
            transaction.executeSql(
                strInsertItem,
                [Gender, Name, Dob, Feet, Inches, Weight],
                showAddPerson(),
                errorHandler);
        });
    } catch (e) {
        alert(e);
    }
}

function insertWeight(Weight, dateMonth, dateYear, PersonId) {
    try {
        var strInsertWeight = "INSERT INTO weight (weight, dateMonth, dateYear, personId) " +
        "VALUES (?, ?, ?, ?)";

        dbAddPerson.transaction(function (transaction) {
            transaction.executeSql(
                strInsertWeight,
                [Weight, dateMonth, dateYear, currentId],
                showAddWeight(),
                errorHandler);
        });

        currentId;

    } catch (e) {
        alert(e);
    }
}

function displayAll() {
    var strSelectQry = "SELECT * " +
        "FROM person " +
        "ORDER BY ID DESC";
    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
            [], function (transaction, results) {
                displayAllItems(results)
            }, errorHandler);
    });
}

$.validator.addMethod('minNum', function (value, el, param) {
    return value > param;
});

var myStatus;

function displayMonthYear(results) {
    myStatus = null;
    var Weight = $("#txtWeightAC").val();
    var dateMonth = $("#ddlDateMonthAC").val();
    var dateYear = $("#ddlDateYearAC").val();
    currentId = parseInt(sessionStorage.getItem('id'));

    if (results.rows.length == 0)
        myStatus = null;
    else
        myStatus = "!";

    if (myStatus != "!")
        insertWeight(Weight, dateMonth, dateYear, currentId);
    else
        alert("There is already a weight for this month / year.");
}

//check if this person already has month/year filled;
// do not want it because it will cause the chart to crash
function checkMonthYear(month, year, personId) {

    var strSelectQry = "SELECT * FROM weight " +
        "WHERE dateMonth = '" + month + "' AND dateYear = '" +
        year + "' AND personId = '" + personId + "';";
    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
            [], function (transaction, results) {
                displayMonthYear(results);
            },
            errorHandler);
    });
}

createPersonTable();

$(document).ready(function () {
    setDefaultValues();
    genderValue = null;

    $('input[name="type"]').change(function () {
        genderValue = this.value
    })

    $("#btnInsert").click(function () {
        $('#frmAddPerson').validate({
            rules: {
                txtNameAdd: {
                    required: true,
                    rangelength: [2, 25]
                },
                txtDobAdd: {
                    date: true,
                    required: true
                },
                txtWeightAdd: {
                    required: true,
                    minNum: 1
                }
            },
            messages: {
                txtNameAdd: {
                    required: "Please enter a name.",
                    rangelength: "Name must be between 2 and 25 characters in length."
                },
                txtDobAdd: {
                    date: "Please enter your date of birth in YYYY/MM/DD format.",
                    required: "Please enter your date of birth."
                },
                txtWeightAdd: {
                    required: "Please enter your weight.",
                    minNum: "Please enter a number that is greater than 0."
                }
            }
        });

        if ($('#frmAddPerson').valid()) {

            var Gender = $('input[name="genderAdd"]:checked').val();
            var Name = $("#txtNameAdd").val();
            var Dob = $("#txtDobAdd").val();
            var Feet = $("#ddlFeetAdd").val();
            var Inches = $("#ddlInchesAdd").val();
            var Weight = $("#txtWeightAdd").val();

            if (genderValue == null) {
                genderValue = "Male";
            }

            insertPerson(genderValue, Name, Dob, Feet, Inches, Weight);
        };
    });

    $("#btnDisplay").click(function () {
        try {
            displayAll();
        } catch (e) {
            alert(e);
        }
    });

    $("#btnWeightAC").click(function () {
        $('#frmAddWeight').validate({
            rules: {
                txtWeightAC: {
                    required: true,
                    minNum: 1
                },
                messages: {
                    txtWeightAC: {
                        required: "Please enter a weight in pounds",
                        minNum: "Please enter a minimum number of 1"
                    }
                }
            }
        });

        if ($('#frmAddWeight').valid()) {

            var Weight = $("#txtWeightAC").val();
            var dateMonth = $("#ddlDateMonthAC").val();
            var dateYear = $("#ddlDateYearAC").val();

            if (sessionStorage.getItem('id') != null &&
                sessionStorage.getItem('signedIn') == "true") {
                //createWeightTable();

                currentId = parseInt(sessionStorage.getItem('id'));

                //find out if already have weight at this certain month & year
                checkMonthYear(dateMonth, dateYear, currentId);
            }
            else
                alert("Please sign in as person to add weight.");
        }
    });
});