/*
    NAME: Karamdip Binning
    DATE STARTED: November 18th, 2013
    PURPOSE: Handle validation;
*/

function displayAbout() {
    try {
        var appname;
        var appversion;
        var appauthor;

        $.get("config.xml", function (data) {
            alert("APP NAME: " +
                $(data).find('widget').attr('name') +
                " " + $(data).find('widget').attr('version'));
            alert("APP AUTHOR: " +
                $(data).find('widget').attr('author'));
        });
    } catch (e) {
        alert(e);
    }
}

function calculateDCI(gender, age, feet, inches, weight) {

    var bmr;
    //convert feet to inches (12) then convert height to cm (2.54)
    var height = feet * 12 * 2.54 + inches * 2.54;
    //convert weight to kg
    weight = weight * 0.453592;

    bmr = 10 * weight + 6.25 * height - 5 * age;
    
    if (gender == "Male") {
        bmr = bmr + 5;
    }
    else {
        bmr = bmr - 161;
    }

    bmr = Math.round(bmr);

    $('#lblDCI').text(bmr + " calories per day");
}

function calculateBMI(weight, feet, inches) {
    var bmi;
    var weightStatus = "";
    var colourStatus = "";

    //convert feet to inches (12)
    feet = parseInt(feet, 10) * 12;
    var height = feet + parseInt(inches, 10);

    bmi = weight * 703;
    bmi = bmi / (height * height);

    bmi = Math.round(bmi * 10) / 10;

    if (bmi <= 18.5) {
        weightStatus = " (You are underweight.)";
        colourStatus = "#0000FF";
    }
    if (bmi > 18.5 && bmi <= 24.9) {
        weightStatus = " (You are normal weight.)";
        colourStatus = "#00FF00";
    }
    if (bmi > 24.9 && bmi <= 29.9) {
        weightStatus = " (You are overweight.)";
        colourStatus = "#FF8000";
    }
    if (bmi > 29.9) {
        weightStatus = " (You are obese.)";
        colourStatus = "#FF0000";
    }

    document.getElementById('lblStatus').style.color = colourStatus;
    $('#lblBMI').text(bmi);
    $('#lblStatus').text(weightStatus);
}

$.validator.addMethod('minNum', function (value, el, param) {
    return value > param;
});

$(document).ready(function () {

    $("#btnAboutUs").click(function () {
        //gets config.xml information and sets in labels on html
        displayAbout();
    });

    $("#btnDCI").click(function () {
        $('#frmDCI').validate({
            rules: {
                txtAgeDCI: {
                    required: true,
                    number: true,
                    minNum: 0
                },
                txtWeightDCI: {
                    required: true,
                    number: true,
                    minNum: 0
                }
            },
            messages: {
                txtAgeDCI: {
                    required: "Please enter an age in years.",
                    number: "Please enter a number.",
                    minNum: "Please enter a number greater than 0."
                },
                txtWeightDCI: {
                    required: "Please enter a weight in pounds.",
                    number: "Please enter numbers only.",
                    minNum: "Please enter a number greater than 0."
                }
            }
        });

        if ($('#frmDCI').valid()) {
            var Age = $("#txtAgeDCI").val();
            var Feet = $("#ddlFeet").val();
            var Inches = $("#ddlInches").val();
            var Weight = $("#txtWeightDCI").val();
            var Gender = (frmDCI.choice1a.checked ? "Male" : "Female");

            calculateDCI(Gender, Age, Feet, Inches, Weight);
            return false;
        };
    });

    $("#btnBMI").click(function () {
        $('#frmBMI').validate({
            rules: {
                txtWeightBMI: {
                    required: true,
                    number: true,
                    minNum: 1
                }
            },
            messages: {
                txtWeightBMI: {
                    required: "Please enter an weight in pounds.",
                    number: "Please enter numbers only.",
                    minNum: "Please enter a number greater than 0."
                }
            }
        });

        if ($('#frmBMI').valid()) {
            var Weight = $("#txtWeightBMI").val();
            var Feet = $("#ddlFeetBMI").val();
            var Inches = $("#ddlInchesBMI").val();
            
            calculateBMI(Weight, Feet, Inches);
            return false;
        };
    });
});