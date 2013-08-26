/* Denise M. Gilbert
 AVF Term 1308
 index.js Page*/

// GLOBAL VARIABLES

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

// DEVICE READY

var onDeviceReady;

document.addEventListener('deviceready', onDeviceReady, false);

// NATIVE FEATURE FUNCTIONS

var accessGeolocation,
    updateOrientation,
    loadVenueList;

function onDeviceReady() {
    $("#navGeolocation").on("click", accessGeolocation);
    $("#navAccellerometer").on("click", updateOrientation);
    $("#navMyVenueInfo").on("click", loadVenueList());
};

// GEOLOCATION

var onGeoError,
    onSuccess;

var accessGeolocation = function () {
    navigator.geolocation.getCurrentPosition(onSuccess, onGeoError);
};

var google;

    // ONSUCCESS GEOLOCATION

    var onSuccess = function (position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: '   + "<h1 class='geoText'>" + position.coords.latitude  + "</h1>" +
                            'Longitude: '  + "<h1 class='geoText'>" + position.coords.longitude + "</h1>" +
                            'Altitude: '   + "<h1 class='geoText'>" + position.coords.altitude  + "</h1>" +
                            'Accuracy: '   + "<h1 class='geoText'>" + position.coords.accuracy  + "</h1>" +
                            'Altitude <br> Accuracy: ' + "<h1 class='geoText'>" + position.coords.altitudeAccuracy + "</h1>" +
                            'Heading: ' + "<h1 class='geoText'>" + position.coords.heading + "</h1>" +
                            'Speed: ' + "<h1 class='geoText'>" + position.coords.speed + "</h1>" +
                            'Timestamp: '   + "<h1 class='geoText'>" + position.timestamp + "</h1>";
        
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        
        var currentposition = new google.maps.LatLng(lat, lng);
			
			var mapoptions = {
				zoom: 12,
				center: currentposition,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
			
			var map = new google.maps.Map(document.getElementById("map"), mapoptions);
			

			var marker = new google.maps.Marker({
					position: currentposition,
					map: map
			});
    };

// ERROR GEOLOCATION

function onGeoError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

// VENUES - MY ENTERTAINMENT INFO

var addTableRow;

    // Save Venue List
var saveVenueList = function () {
    
    var todoArray = {};
    var checkBoxState = 0;
    var textValue = "";
    
    var table = document.getElementById("dataTable");
    var rowCount = table.rows.length;
    
    if (rowCount !== 0)
    {
            // Loop Through All Table Rows
        for(var i=0; i<rowCount; i+=1)
        {
            var row = table.rows[i];
            
                // Get Checkbox Status
            var chkbox = row.cells[0].childNodes[0];
            if(null !== chkbox && true === chkbox.checked)
            {
                checkBoxState = 1;
            }
            else
            {
                checkBoxState= 0;
            }
            
                // Get Venue
            var textbox = row.cells[1].childNodes[0];
            textValue = textbox.value;
            
                // Add Checkbox Value to Array
            todoArray["row" + i] =
            {
                check : checkBoxState,
                text : textValue
            };
        }
    }
    else
    {
        todoArray = null;
    }
    
        // SET JSON DATA
    window.localStorage.setItem("venueList", JSON.stringify(todoArray));
};

// Add Venue
    var addVenue = function () {
        
        var venueList = {};
        
            var venue = prompt("Venue","");
                if (venue !== null)
                {
                    if (venue === "")
                    {
                        alert("Please Enter a Venue");
                    }
                    else
                    {
                        // Add Venue to Table
                        venueList = { check : 0 , text : venue};
                        addTableRow(venueList, false);
                    }
                }
                
    };

            // Add Table Row
            var rowID = 0;

            var addTableRow = function (venueList, appIsLoading)
            {
                rowID +=1;
                
                var table = document.getElementById("dataTable");
                var rowCount = table.rows.length;
                var row = table.insertRow(rowCount);
                
                    // create the checkbox
                var cell1 = row.insertCell(0);
                var element1 = document.createElement("input");
                element1.type = "checkbox";
                element1.name = "chkbox[]";
                element1.checked = venueList.check;
                element1.setAttribute("onclick", "checkboxClicked()");
                cell1.appendChild(element1);
                
                    // create the textbox
                var cell2 = row.insertCell(1);
                var element2 = document.createElement("input");
                element2.type = "text";
                element2.name = "txtbox[]";
                element2.size = 16;
                element2.id = "text" + rowID;
                element2.value = venueList.text;
                element2.setAttribute("onchange", "saveVenueList()");
                cell2.appendChild(element2);
                
                    // create the view button
                var cell3 = row.insertCell(2);
                var element3 = document.createElement("input");
                element3.type = "image";
                element3.src = "img/eye.png";
                element3.id = rowID;
                element3.value = "View";
                element3.setAttribute("onclick", "viewSelectedRow(document.getElementById('text' + this.id))");
                cell3.appendChild(element3);
                
                    // create the delete button
                var cell4 = row.insertCell(3);
                var element4 = document.createElement("input");
                element4.type = "image";
                element4.src = "img/delete.png";
                element4.value = "Delete";
                element4.setAttribute("onclick", "deleteSelectedRow(this)");
                cell4.appendChild(element4);
                
                // Update UI and Save Venue List
                checkboxClicked();
                saveVenueList();
                
                if (!appIsLoading) alert("Venue Added to Storage");
            };
            
            // add the strike-through styling to completed tasks
            var checkboxClicked = function () {
                
                var table = document.getElementById("dataTable");
                var rowCount = table.rows.length;
                
                // Loop Through All Rows of the Table
                for(var i = 0; i < rowCount; i++)
                {
                    var row = table.rows[i];
                    var chkbox = row.cells[0].childNodes[0];
                    var textbox = row.cells[1].childNodes[0];
                    
                    // if the checkbox is checked, add the strike-through styling
                    if(null !== chkbox && true === chkbox.checked)
                    {
                        if(null !== textbox)
                        {
                            textbox.style.setProperty("text-decoration", "line-through");
                        }
                    }
                    
                        // if the checkbox isn't checked, remove the strike-through styling
                    else
                    {
                        textbox.style.setProperty("text-decoration", "none");
                    }
                }
                
                saveVenueList();
            };
            
            // View Venue
            var viewSelectedRow = function (todoTextField) {
                
                alert(todoTextField.value);
            };
            
            // Delete Row
            var deleteSelectedRow = function (deleteButton)
            {
                var p = deleteButton.parentNode.parentNode;
                p.parentNode.removeChild(p);
                saveVenueList();
            };
            
            
            
            // Load Venue List
            var loadVenueList = function ()
            {
                // GET JSON
                var theList = JSON.parse(window.localStorage.getItem("venueList"));
                
                if (null === theList || theList === "null")
                {
                    deleteAllRows();
                }
                else
                {
                    var count = 0;
                    for (var obj in theList)
                    {
                        count++;
                    }
                    
                    // Delete Current Table Rows
                    deleteAllRows();
                    
                    // Loop Through Venue List
                    for(var i = 0; i < count; i++)
                    {
                        // Add Row to Table for Each Venue
                        addTableRow(theList["row" + i], true);
                    }
                }
            };
            
            // Delete All Rows
            var deleteAllRows = function () {
                
                var table = document.getElementById("dataTable");
                var rowCount = table.rows.length;
                
                    // loop through all rows of the table
                for(var i = 0; i < rowCount; i++)
                {
                        // delete the row
                    table.deleteRow(i);
                    rowCount--;
                    i--;
                }
                
                saveVenueList();
            }

var deleteAll = function () {
    confirm("WARNING:  You Are About to Delete ALL Venues, Continue?");
    localStorage.clear();
    alert("All Venues Have Been Deleted!");
    $('body').load('#myVenueInfoPage', function () {
        $(this).fadeIn(5000);
});
};

// INSTAGRAM
$('#instagramPage').on('pageinit', function() {

    var screenOutput = function(info) {

        console.log(info);

        $.each(info.data, function(index, photo) {

            var pic = "<li class='instaPics'><img src='" + photo.images.standard_resolution.url + "'alt='" + photo.user.id + "' />" + "<h3 class='instaTitles'>" + photo.user.full_name + "&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;♥ " + photo.likes.count + " ♥</h3>" + "</li>";

            $("#data-output").append(pic);
        });
    };

    $(function() {

        var tag1 = "Chicago",

        tag2 = "Bears",

        tag3 = "Football",

        url = "https://api.instagram.com/v1/tags/" + tag1 + tag2 + tag3 + "/media/recent?callback=?&amp;client_id=0fc4d14efc1a47b398687eed8dbc29dc&amp;min_id=20";

        $.getJSON(url, screenOutput);

    });
});

// FOURSQUARE
$('#foursquarePage').on('pageinit', function() {

    var placesOutput = function(info) {

        console.log(info);
                        
        $.each(info, function(index, respons) {
                      
            var cityHeader = "<h1>" + respons.headerFullLocation + "</h1>";

                $("#fourSquare-city").append(cityHeader);

        });

        $.each(info.response.groups, function(index, group) {
               
            $.each(group.items, function(index, item) {
                      
            var popularPlaces = "<li><h4>" + item.venue.name + "<h5>" + "<a href=" + item.venue.canonicalUrl + "/a>" + "</h5></h4></li>";

                $("#fourSquare-venues").append(popularPlaces);
            });
        });
};

    $(function() {

        var url = "https://api.foursquare.com/v2/venues/explore?ll=44.30,37.20&near=Chicago, IL&client_id=TGZE1Y20FMUHMIMDTR5G3LTBUKT4NYSST3IEWCKCPOJAVLNI&client_secret=OPOSSLEYHH2ZR5G5I05PTCDQRP0FA24WHUDSZ0HLIYVFWT2O&v=20130814";

        $.getJSON(url, placesOutput);

    });
});

// ACCELEROMETER

var updateOrientation = function ()
{
    switch(window.orientation)
    {
        case -90:
        case 90:
            alert('landscape');
            break;
        default:
            alert('portrait');
            break;
    }
    document.addEventListener("orientationchange", updateOrientation);
};

// Initial execution if needed
//updateOrientation();

// HOME PAGE

$('#home').on('pageinit', function() {
                 
    $('#home').css({
        background: "#C1B298"
    });
});

// ABOUT PAGE

$('#aboutPage').on('pageinit', function() {
                 
    $('#aboutPage').css({
        background: "#C1B298"
    });
});
