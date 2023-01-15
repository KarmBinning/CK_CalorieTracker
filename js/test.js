test("calculateDCI", function () {

    var gender = new Array("Male", "Female", "Male", "Female");
    var age = new Array(26, 40, 79, 15);
    var feet = new Array(5, 7, 6, 4);
    var inches = new Array(10, 2, 4, 6);
    var weight = new Array(150, 500, 123, 324);

    var expected = new Array(1667, 3272, 1374, 2091);

    for (var i = 0; i < expected.length; i++) {

        var height = (feet[i] * 12) + inches[i];

        var dci = 10 * weight[i] + 6.25 * height[i] - 5 * age[i];

        if (gender == "Male") {
            dci = dci + 5;
        }
        else {
            dci = dci - 161;
        }

        dci = Math.round(dci);

        if (expected[i] == dci) {
            ok(gender[i], age[i], feet[i], inches[i], weight[i], "Passed!");
        }
        else {
            ok(gender[i], age[i], feet[i], inches[i], weight[i], "Failed!");
        }
    }

});

test("determineCorrectGender", function (gender) {
    gender = new Array("Male", "Female", "male", "female",
        " ", "m ale", "femalemale", "gender", "male,", 
        "femalE");

    for (var i = 0; i < gender.length; i++) {

        if (gender[i] == "Male" || gender[i] == "Female") {
            ok(gender[i], "Passed!");
        }
        else {
            ok(gender[i], "Failed!");
        }
    }

});

//check if user selected correct dropdown selection for gender
test("userSelectedCorrectGender", function (gender) {
    var ddlGender = new Array(" ", "Male", "Female");

    for (var i = 0; i < ddlGender.length; i++) {
        if (ddlGender[i] == "Male" || ddlGender[i] == "Female")
            ok(ddlGender[i], "Passed!");
        else
            ok(ddlGender[i], "Failed!");
    }
});