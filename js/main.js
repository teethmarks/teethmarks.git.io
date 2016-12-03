// Reservations

    // PART ONE: INITIALIZE FIREBASE //
    var config = {
        apiKey: "AIzaSyBodgvzGNKpEsosjcqhsXG8OTPHrZD9c6Q",
        authDomain: "reservation-site-7f3cf.firebaseapp.com",
        databaseURL: "https://reservation-site-7f3cf.firebaseio.com",
        storageBucket: "reservation-site-7f3cf.appspot.com",
        messagingSenderId: "511253754930"
    };
    firebase.initializeApp(config);

    var database = firebase.database(); // Connect to Database
    var reservationData = {}; // Create Object which will be populated with user input

    
    // PART TWO: CREATE SECTION AND PUSH DATA //
    $('.reservation-form').on('submit', function(event) { // On submit, name and date will be pushed to database
        event.preventDefault();

        var reservationName = $('.reservation-name').val();
        var reservationDate = $('.reservation-date').val();
        if (reservationName === '' || reservationDate === '') {
            $('.error').html('Please check your entry.')
        
        } else {
            reservationData.name = reservationName // Input for Name
            reservationData.date = reservationDate // Input for Date

            var reservationsReference = database.ref('reservations'); // Create a section in database
            reservationsReference.push(reservationData);  // Push to this database reference

            $('.reservation-form')[0].reset(); // Reset fields on submit
            $('.error').remove();
        }

    });

    
    // PART THREE: RETRIEVE DATA & COMPILE HANDLEBARS //
    function getReservations() { // retrieve reservations data

        database.ref('reservations').on('value', function(results) { // use reference to database to listen for changes in reservations data

            var allReservations = results.val(); // Get all reservations stored in the results we received back from database
            $('.reservations').empty(); // remove all list reservations from DOM before appending list reservations

            
            for (var reservation in allReservations) { // iterate (loop) through all reservations coming from database call

                // Create an object literal with the data we'll pass to Handlebars
                var context = {
                    name: allReservations[reservation].name, // {{name}}
                    date: allReservations[reservation].date, // {{date}}
                    reservationId: reservation //{{reservationId}}
                };

                var source = $("#reservation-template").html(); // Get the HTML from our Handlebars reservation template
                var template = Handlebars.compile(source); // Compile our Handlebars template
                var reservationListItem = template(context); // Pass the data for this reservation (context) into the template
                $('.reservations').append(reservationListItem); // Append newly created reservation to reservations list.
            }

        });
    }

    // PART FOUR: TRIGGER PART THREE //
    getReservations();


// Delete Reservation
$('.reservations').on('click', '.delete', function(e){

    var id = $(e.target).parent().data('id'); // Get the ID for the reservation we want to update
    var reservationRef = database.ref('reservations/' + id); // Find comment whose objectId is equal to the id we're searching with
    reservationRef.remove(); // Remove it!
});
    

// Datepicker
$(".reservation-date").datepicker({
    dateFormat: 'd MM, y'
});

// Google Places
$.ajax({
    type: 'GET',
    url: 'https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4&key=AIzaSyDR-HuYChLRYxteTk0oAMZ0zMSwss3pBy4',
    success: function (response) {
        $('.results').html('hi');
    },
    error: function (response) {
        $('.results').html('we dont know if its open now haha!');
    },
    beforeSend: function() {
        $('.status').text('Fetching your results..');
    },
    complete: function() {
        $('.status').remove();
    }
});

// Google Map
function initMap() {
    var monks = {
        lat: 40.8054491,
        lng: -73.9654415
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: monks
    });
    var marker = new google.maps.Marker({
        position: monks,
        map: map
    });
}

