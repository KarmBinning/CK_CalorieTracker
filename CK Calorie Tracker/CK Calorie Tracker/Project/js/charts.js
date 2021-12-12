/*
    NAME: Karamdip Binning
    DATE: December 07th, 2013
    PURPOSE: Call the weight data for person and then display it as a graph.
*/

var currentId;
var currentName;

function getIdName(results) {
    var thisRow = null;

    for (var i = 0; i < results.rows.length; i++) {
        thisRow = results.rows.item(i);
        currentName = thisRow['name_'];
    }
}

function getPersonName() {
    var strSelectQry = "SELECT name_ " +
        "FROM person " +
        "WHERE ID = '" + currentId + "'";
    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
            [], function (transaction, results) {
                getIdName(results)
            }, errorHandler);
    });
}

function displayChart(results) {
    var strHtml = '';
    var thisRow = null;

    if (results.rows.length <= 1) {
        strHtmlFormat +=
            '<h3>No Weight is stored for this person. Please add more weight.</h3>';
    }
    else {
        strHtml += '<table><caption>WEIGHT</caption><thead>'
        + '<tr><td></td>';
        for (var i = 0; i < results.rows.length; i++) {
            thisRow = results.rows.item(i);
            strHtml+= '<th scope="col">' + thisRow['dateMonth'] + "/" + thisRow['dateYear'] + '</th>';
        }

        strHtml += '</tr></thead>';

        strHtml += '<tbody><tr><th scope="row">' + currentName + '</th>';

        for (var i = 0; i < results.rows.length; i++) {
            thisRow = results.rows.item(i);
            strHtml += '<td>' + thisRow['weight'] + '</td>';
        }

        strHtml += '</tr></tbody></table>';

        $("#ulChart").append(strHtml);
    }

    $("#ulChart").empty();
    $("#ulChart").append(strHtml);
    //$("#ulChart").listview('refresh');

        // Run capabilities test
        enhance({
            loadScripts: [
				{ src: 'js/excanvas.js' }, { iecondition: 'all' },
				//'js/jquery.js',
				'js/visualize.jQuery.js',
				'js/example.js'
            ],
            loadStyles: [
				'css/visualize.css',
				'css/visualize-dark.css'
            ]
        });
}

function displayWeight() {

    currentId = sessionStorage.getItem('id');
    getPersonName();

    var strSelectQry = "SELECT * " +
        "FROM weight " +
        "WHERE personId = " + currentId + " " +
        "ORDER BY dateYear ASC, dateMonth ASC";
    dbAddPerson.transaction(function (transaction) {
        transaction.executeSql(strSelectQry,
            [], function (transaction, results) {
                displayChart(results)
            }, errorHandler);
    });
}

$(document).ready(function () {

    $("#lstChart").click(function () {
        displayWeight();
    });

});