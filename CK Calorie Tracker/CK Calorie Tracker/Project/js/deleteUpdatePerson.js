/*
    NAME: Karamdip Binning
    DATE STARTED: November 20th, 2013
    PURPOSE: To delete a friend;
*/

var personName = '';
var currentId = '';
var genderValue = '';

var bmr = '';
var statusBtn = "false";
var totHours;

//this method displays error
function errorHandler(transaction, error) {
    alert("SQL ERROR: " + error.message.toString());
}

//opens the database, if not existing then creates new
var dbAddPerson = openDatabase
    ('dbPerson', '1.0', 'Person Database', 100 * 1024);

//create person database table
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

function calculateBurntCalories() {

    var activity = parseFloat($("#ddlActivity").val());

    var cb = 0;
    cb = parseFloat(cb);
    cb = (bmr / 24) * activity * totHours;
    cb = (cb / 3.592037036666667);
    //alert("BMR: " + bmr + " | ACTIVITIY: " + activity + " | HOURS: " + totHours);
    $("#lblCalories").text(cb.toFixed(2));

    cb = 0;
    bmr = 0;
    activity = 0;
    totHours = 0;
}

function calculateAge(dob) {

    var birthDay = Number(dob.substr(8, 2));
    var birthMonth = Number(dob.substr(5, 2));
    var birthYear = Number(dob.substr(0, 4));

    var todayDate = new Date();
    var age = 0;
    age = todayDate.getFullYear() - birthYear;

    if (todayDate.getMonth() < birthMonth ||
        (todayDate.getMonth() == birthMonth && todayDate.getDate() < birthDay)) {
        age;
    }

    age = parseInt(age);

    return age;
}

function calculateBMR(gender, age, feet, inches, weight) {

    //convert feet to inches (12) then convert height to cm (2.54)
    var height = feet * 12 * 2.54 + inches * 2.54;
    //convert weight to kg
    weight = weight * 0.453592;

    bmr = 0;
    bmr = 10 * weight + 6.25 * height - 5 * age;

    if (gender == "Male") {
        bmr = bmr + 5;
    }
    else {
        bmr = bmr - 161;
    }

    bmr = Math.round(bmr);
    return bmr;
}

function calculateActivity(personName) {
    var nameRow = personName.rows.item(0);
    var gender = nameRow['gender'];
    var dob = nameRow['dob'];
    var feet = nameRow['feet'];
    var inches = nameRow['inches'];
    var weight = nameRow['weight'];

    var age = 0
    age = calculateAge(dob);
    age = parseInt(age);

    bmr = calculateBMR(gender, age, feet, inches, weight);
    bmr = parseInt(bmr);

    calculateBurntCalories()

    status = '';
}

function setupUpdate(personName) {
    var nameRow = personName.rows.item(0);

    //var gender = nameRow['gender'];
    var name_ = nameRow['name_'];
    var dob = nameRow['dob'];
    var feet = nameRow['feet'];
    var inches = nameRow['inches'];
    var weight = nameRow['weight'];

    $('#txtNameU').val(name_);
    $("#txtDobU").val(dob);
    $("#txtWeightU").val(weight);

    $("#ddlFeetU").val(feet);
    $('#ddlFeetU').change();
    $("#ddlInchesU").val(inches);
    $('#ddlInchesU').change();

    status = '';
}

function setupDCIBMI(personName) {
    var nameRow = personName.rows.item(0);

    var Gender = nameRow['gender'];
    var Dob = nameRow['dob'];
    var Feet = nameRow['feet'];
    var Inches = nameRow['inches'];
    var Weight = nameRow['weight'];

    var age = 0
    age = calculateAge(Dob);
    age = parseInt(age);

    if (Gender != "Male") {
        $('#choice1a').removeProp('checked');
        $('#choice1a').removeAttr('checked');
        $('#choice1a').change();

        //$('#choice2a').prop('checked');
        $('#choice2a').attr('checked', 'checked');
        $('#choice2a').change();
    }
    else {
        $('#choice2a').removeProp('checked');
        $('#choice2a').removeAttr('checked');
        $('#choice2a').change();

        $('#choice1a').prop('checked');
        $('#choice1a').attr('checked', 'checked');
        $('#choice1a').change();
    }

    $('#txtAgeDCI').val(age);
    $('#ddlFeet').val(Feet);
    $('#ddlInches').val(Inches);
    $('#txtWeightDCI').val(Weight);

    $('#ddlFeet').change();
    $('#ddlInches').change();

    //setup BMI
    $('#txtWeightBMI').val(Weight);
    $('#ddlFeetBMI').val(Feet);
    $('#ddlInchesBMI').val(Inches);

    $('#ddlFeetBMI').change();
    $('#ddlInchesBMI').change();

    $(this).load();
}

function selectPerson(ID) {
    var strSelectQry = "SELECT * FROM person WHERE ID = " + ID + ";";
    var statusFunc = '';

    if (status == "delete") {
        statusFunc = deletePerson;
    }
    if (status == "setUpdate") {
        statusFunc = setupUpdate;
    }
    if (status == "calculateActivity") {
        statusFunc = calculateActivity;
    }
    if (status == "setupDCIBMI") {
        statusFunc = setupDCIBMI;
    }
    //status = '';

    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
				[],
                function (transaction, personName) { statusFunc(personName) },
                errorHandler);
    });
    var thisRow = null;
}

function onDeletePersonPass() {
    alert("Person removed successfully!");
    sessionStorage.setItem('id', null);
    document.location.href = "#person";
    location.reload();

    status = '';
}

function deletePerson(personName) {

    var nameRow = personName.rows.item(0);
    var strConfirm = "Delete " + nameRow['name_'] + " (ID: " + currentId + ")?";
    var decision = confirm(strConfirm);

    if (decision == true) {
        if (currentId != null) {
            strDeleteQry = "DELETE FROM person WHERE ID = " + currentId + ";";
            dbAddPerson.transaction(function (transaction) {
                transaction.executeSql(
                    strDeleteQry, [],
                    function () {
                        onDeletePersonPass();
                    }, errorHandler);
            });
        }
    }
}

    function onUpdatePass() {
        alert("This Item Row has been updated!");

        // refresh an element on any page to refresh the new values
        $("#lstAll").listview('refresh');

        // refresh the list
        displayAll();
        $.mobile.changePage('#person', { transition: 'slide' });
    }

    function displayOptions() {
        document.location.href = "#alterPerson";
    }

    function updatePerson(Name_, Dob, Feet, Inches, Weight) {
        currentId = sessionStorage.getItem('id');
        var strConfirm = "Update " + Name_ + " (ID: " + currentId + ")?";
        var decision = confirm(strConfirm);

        if (decision == true) {

            var strUpdateQry = "UPDATE person SET name_ = '" + Name_ + "', "
            + "dob = '" + Dob + "', "
            + "feet = " + Feet + ", "
            + "inches = " + Inches + ", "
            + "weight = " + Weight + " "
            + "WHERE ID = " + currentId + ";";

            dbAddPerson.transaction(function (transaction) {
                transaction.executeSql(
                strUpdateQry, [],
                onUpdatePass(),
                errorHandler);
            });
        }
    }

//when page is loaded
    $(document).ready(function () {
        $("#btnDelete").click(function () {
            try {
                status = "delete";
                currentId = sessionStorage.getItem('id');
                selectPerson(currentId);
            } catch (e) {
                alert(e);
            }
        });

        $("#liUpdate").click(function () {
            try {
                currentId = sessionStorage.getItem('id');
                status = "setUpdate";
                selectPerson(currentId);
            } catch (e) {
                alert(e);
            }
        });

        $("#btnUpdate").click(function () {
            try {
                $('#frmUpdate').validate({
                    rules: {
                        txtNameU: {
                            required: true,
                            rangelength: [2, 25]
                        },
                        txtDobU: {
                            date: true,
                            required: true
                        },
                        txtWeightU: {
                            required: true,
                            minNum: 1
                        }
                    },
                    messages: {
                        txtNameU: {
                            required: "Please enter a name.",
                            rangelength: "Name must be between 2 and 25 characters in length."
                        },
                        txtDobU: {
                            date: "Please enter your date of birth in YYYY/MM/DD format.",
                            required: "Please enter your date of birth."
                        },
                        txtWeightU: {
                            required: "Please enter your weight.",
                            minNum: "Please enter a number that is greater than 0."
                        }
                    }
                });

                if ($('#frmUpdate').valid()) {

                    var Name_ = $('#txtNameU').val();
                    var Dob = $('#txtDobU').val();
                    var Feet = $("#ddlFeetU").val();
                    var Inches = $("#ddlInchesU").val();
                    var Weight = $("#txtWeightU").val();

                    status = 'update';

                    updatePerson(Name_, Dob, Feet, Inches, Weight);
                }
            } catch (e) {
                alert(e);
            }
        });

        $('#btnStartA').click(function () {

            var timerCase;
            if (sessionStorage.getItem('signedIn') != "null") {
                if (statusBtn == "false") {

                    statusBtn = "true";

                    $('#countdown').countup();
                    $('#btnStartA').attr("disabled", "disabled");
                    $('#btnStartA').css("background-color", "red");
                    $('#ddlActivity').attr("disabled", "disabled");
                }
                else {
                    alert("Activity has already started.");
                }
            }
            else {
                alert("You must be signed in to access this feature.");
                document.location.href = "#person";
            }
        });

        $("#btnEndA").click(function () {
            statusBtn = "false";

            var totTime = 0;
            totTime = $('#countdown').text();
            totTime = totTime.replace(/[^0-9\.]+/g, "");
            totTime = parseInt(totTime, 20);

            hours = 0;
            var hours = parseFloat(totTime / 3600);

            totHours = hours;
            totHours = parseFloat(totHours);

            status = 'calculateActivity';
            currentId = sessionStorage.getItem('id');
            selectPerson(currentId);

            //alert("Activity finished.");
        });

        $("#btnStopA").click(function () {
            var string = $('#countdown').text();
            $('#countdown').text(string);

            //$('#btnStartA').removeAttr("disabled");
            $('#btnStartA').css("background-color", "");
            //$('#ddlActivity').removeAttr("disabled");

            $('#btnStopA').attr("disabled", "disabled");
            $('#btnStopA').css("background-color", "red");
            alert("Activity completed.");
        });

        $("#lstAll").click(function () {
            try {
                sessionStorage.setItem('id', currentId);
                if (sessionStorage.getItem('id') > 0) {

                    if (sessionStorage.getItem('signedIn') == 'true') {
                        sessionStorage.setItem('signedIn', null);
                        alert("You have just signed out.");
                        location.reload();
                    }
                    else {
                        sessionStorage.setItem('signedIn', true);
                        alert("You are signed in.");

                        status = 'setupDCIBMI';
                        selectPerson(currentId);

                        displayOptions();
                    }
                }
            } catch (e) {
                alert(e);
            }
        });
    });