App.config(function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.useXDomain = true;
     delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

App.factory('api', function($http) {
    var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NjEwNDMyNzgsImV4cCI6MTQ5MjU3OTI3OCwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSJ9.dXZVC--uvtigrFB7T3fGTG84NIYlSnRqbgbT43xzFAw"
    var chosenOutgoingFlight, chosenReturningFlight, bookingData, cabinetOutgoingClass, cabinetReturningClass, outgoingSeat, returnSeat, refNum;
    var isOtherHosts; // set to false in flightsctrl ,set to true flightsNewCtrl
    var stripeToken;
    var passengerData = [];
    return {
        getStripeKey: function(url) {
            return $http({
              'method': 'GET',
              'url': url,
              'headers': {
                  'x-access-token': accessToken,
                  'website': 'AirBerlin'
              }
            });
        },
        getAirports: function() {
            return $http({
                method: 'GET',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/airports',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getFlights: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'

                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/0/1",
                    headers: {
                        'x-access-token': accessToken,
                        'other-hosts': 'false'


                    }
                })
        },
        getOtherFlightsEco: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/economy/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getOtherFlightsBusi: function(origin, destination, exitDate, returnDate) {
            if (!returnDate)
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
            else
                return $http({
                    method: 'GET',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/flights/search/' + origin + "/" + destination + "/" + exitDate + "/" + returnDate + "/business/1",
                    headers: {
                        'x-access-token': accessToken,
                        'website': 'AirBerlin',
                        'other-hosts': 'true'
                    }
                })
        },
        getAircrafts: function() {
            return $http({
                method: 'GET',
                url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/api/aircrafts',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        getCountries: function() {
            return $http({
                method: 'GET',
                url: '/api/countries',
                headers: {
                    'x-access-token': accessToken,
                    'website': 'AirBerlin'
                }
            })
        },
        setOutGoingFlight: function(flight) {
            chosenOutgoingFlight = flight;
        },
        setReturningFlight: function(flight) {
            chosenReturningFlight = flight;
        },
        setPassenger: function(passenger) {
            passengerData.push(passenger);
            if (isOtherHosts)
                bookingData.PassengerDetails = passengerData
        },
        getCabinetOutgoingClass: function() {
            return cabinetOutgoingClass;
        },
        getCabinetReturningClass: function() {
            return cabinetReturningClass;
        },
        setBooking: function(booking) {
            if (!isOtherHosts) {

                if (!booking.exitIsEconomy)
                    cabinetOutgoingClass = "Business"
                else
                    cabinetOutgoingClass = "Economy"

                if (!booking.reEntryIsEconomy)
                    cabinetReturningClass = "Business"

                else
                    cabinetReturningClass = "Economy"
            } else {
                if (!booking.class)
                    cabinetOutgoingClass = "Business"
                else
                    cabinetOutgoingClass = "Economy"

                if (!booking.class)
                    cabinetReturningClass = "Business"

                else
                    cabinetReturningClass = "Economy"
            }



            bookingData = booking;
        },

        getPassenger: function() {
            return passengerData;
        },
        getBooking: function() {
            return bookingData;
        },
        getChosenOutGoingFlight: function() {
            return chosenOutgoingFlight;
        },
        getChosenReturningFlight: function() {
            return chosenReturningFlight;
        },
        getOutgoingSeat: function() {
            return outgoingSeat;
        },

        getReturnSeat: function() {
            return returnSeat;
        },
        setOutgoingSeat: function(seat) {
            outgoingSeat = seat;
        },
        setRetrunSeat: function(seat) {
            returnSeat = seat;
        },
        setIsOtherHosts: function(otherHosts) {
            isOtherHosts = otherHosts;
        },
        IsOtherHosts: function() {
            return isOtherHosts;
        },
        clearLocal: function() {
            chosenReturningFlight = {}
            chosenOutgoingFlight = {}
            passengerData = []
            bookingData = {}
            cabinetOutgoingClass = {}
            cabinetReturningClass = {}
            outgoingSeat = {}
            returnSeat = {}
            isisOtherHosts = false

        },
        submitBooking: function(otherHosts,url) {
            var price = 0;
            if (this.getCabinetOutgoingClass() == 'Economy')
                price = this.getChosenOutGoingFlight().economyFare
            else
                price = this.getChosenOutGoingFlight().businessFare

            if (this.getChosenReturningFlight())
                if (this.getCabinetReturningClass() == 'Economy')
                    price = price + this.getChosenReturningFlight().economyFare
                else
                    price = price + this.getChosenReturningFlight().businessFare

            if (!otherHosts) {
                return $http({
                    method: 'POST',
                    url: 'http://ec2-52-38-101-89.us-west-2.compute.amazonaws.com/booking',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': accessToken,
                        'other-hosts': otherHosts
                    },
                    data: $.param({
                        passenger: passengerData,
                        booking: bookingData,
                        price: price,
                        outgoingSeatNumber: outgoingSeat,
                        returnSeatNumber: returnSeat,
                        token: stripeToken
                    })
                });
            } else {
                return $http({
                    method: 'POST',
                    url: url + '/booking',
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                        'x-access-token': accessToken
                    },
                    data: $.param(bookingData)
                });
            }

        },
        getStripeToken: function() {
            return stripeToken;
        },
        setStripeToken: function(token) {
            stripeToken = token;
        }
    };
});

  App.config(function($translateProvider) {
    $translateProvider.translations('en', {
      MAIN: {
        BOOK_NOW: 'Book Now',
        FROM: 'From',
        FLYING_FROM: 'Flying from',
        DEPARTURE_DATE: 'Departure Date',
        TO: 'To',
        FLYING_TO: 'Flying to',
        REENTRY_DATE: 'Re-entry Date',
        UNDER_2_YEARS: 'Under 2 years',
        ROUND_TRIP: 'Round Trip',
        ONE_WAY: 'One Way',
        OTHER_AIRLINES: 'Search other airlines',
        SEARCH_FOR_FLIGHTS: 'Search for flights',
        YEARS: "years",
        CHILDREN: 'children',
        CHILD: 'child',
        ADULT: 'adult',
        ADULTS: 'adults',
        INFANTS: 'infants',
        INFANT: 'infant',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        QUOTES_HOME: {
          ONE: "Simple, convenient, instant confirmation.",
          TWO: "Destinations all around the globe.",
          THREE: "Experience authentic hospitality.",
          FOUR: "Time to get enchanted."
        }
      },
      FLIGHTS: {
        TITLE: 'Choose a Flight',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        SEATS_LEFT: 'seats left',
        MORE_DETAILS: 'More details',
        BOOK: 'Book',
        SELECT:'Select',
        FLIGHT: 'Flight',
        OPERATED_BY: 'Operated by'
      },
      FLIGHT: {
        FLIGHT: "Flight",
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        TITLE: 'Flight Details',
        OPERATED_BY: 'Operated by',
        NUMBER_OF_PASSENGERS: 'Number of passengers',
        FLYING_CALSS: 'Flying class',
        FLIGHT_FARE: 'Flight fare',
        FLIGHT_FAC: 'Flight facilities',
        PASSENGER: 'passenger',
        PASSENGERS: 'passengers'
      },
      NAV: {
        GO_HOME:'Go Home',
        SUBMIT: 'Submit',
        NEXT: 'Next',
        BACK: 'Back',
        SPECIAL_OFFERS: 'Special Offers',
        SERVICES: 'Services',
        OUR_TEAM: 'Our Team',
        ABOUT: 'About',
        CONTACT_US: 'Contact Us',
        CHOOSE_LANGUAGE:'Choose language',
        ENGLISH: 'English',
        GERMAN:'German'
      },

      CONFIRMATION: {
        THANK_YOU: 'Thank you',
        NAME: 'Name',
        PHONE: 'Phone',
        MAIL: 'E-mail',
        FLIGHTNO: 'Flight number',
        DEPARTURE: 'Departure',
        ARRAIVAL: 'Arrival',
        PRINT: 'Print ticket'
      },
      CONTACT_US: {

        CONTACT_US: 'Contact Us',
        PHONE: 'Phone',
        MAIL: 'E-mail',
        LEAVE_MSG: 'Leave us a message',
        SEND: 'Send'
      },
      four_o_for: {
        //Do you mean 404notfound team ?  in 404.html
        QUESTION: 'Do you mean 404NotFound Team?'

      },

      ABOUT_US: {

        ABOUT: 'About AirBerlin',
        HISTORY: 'History',
        HISTORY_PARA: 'The first airberlin plane took off on 28th April 1979. Experience the highlights and milestones in airberlins history ',
        OUR_GOAL: 'Our goal',
        OUR_GOAL_PARA: 'First Europe, and then the globe, will be linked by flight, and nations so knit together that they will grow to be next-door neighbors… . What railways have done for nations, airways will do for the world.',
        A_P: 'Alliance/partners',
        A_P_PARA: 'airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.airberlin guarantees a dense connection network and constant growth thanks to the co-operation with other airlines.'
      },

      OFFERS: {
        SPECIAL_OFFERS: 'Special Offers',
        FLIGHT_OFFERS: 'Flight Offers',
        FLIGHT_OFFERS_PARA: 'Find the most attractive fare for your flight',
        LIKE_FACEBOOK: 'Like us on Facebook',
        LIKE_FACEBOOK_PARA: 'Dont miss our special offers on: with our newsletter and on Facebook',
        HOTEL: 'Hotel',
        HOTEL_PARA: 'Special offers for your hotel stay away from our partners .'
      },


      PASS_DETAILS: {
        FIRST_NAME: 'First Name',
        MIDDLE_NAME: 'Middle Name',
        LAST_NAME: 'Last Name',
        PASS_NO: 'Passport Number',
        PLACE_OFBIRTH: 'Place Of Birth',
        PHONE_NO: 'Phone Number',
        E_MAIL: 'Email',
        REPEAT_E_MAIL: 'Repeat Email',
        VERIFY_PARA: 'I verify the information provided matches the passport information.'

      },
      PAYMENT: {

        WE_ACCEPT: 'We accept',
        CARD_INFO: 'Card information:',
        EXP_DATE: 'Expire Date:',
        COST: 'Your booking total cost'

      },

      SEATING: {

        SEAT_MAP: 'Seatmap',
        SELECTED: 'You selected seat'

      },

      SERVICES: {

        SERVICE: 'Services',
        INFLIGHT_SERVICES: 'Inflight Services',
        INFLIGHT_PARA: '  Airberlin presents the economy and business class.',
        G_MEALS: 'Gourmet Meals',
        G_MEALS_PARA: 'Airberlin is the right airline for connoisseurs: treat yourself to one of the delicious gourmet meals from "Sansibar" on board',
        BAGGAGE: 'Baggage',
        BAGGAGE_PARA: 'Everything you need to know about free baggage allowances, cabin baggage regulations and special baggage.'

      },

    });
    $translateProvider.translations('de', {
      MAIN: {
        BOOK_NOW: 'Jetzt buchen',
        FROM: 'von',
        FLYING_FROM: 'Abflughafen',
        DEPARTURE_DATE: 'Hinflug',
        TO: 'nach',
        FLYING_TO: 'Zielflughafen',
        REENTRY_DATE: 'Rückflug',
        UNDER_2_YEARS: 'Jünger als 2 Jahren',
        ROUND_TRIP: 'Hin-/Rückfahrt',
        ONE_WAY: 'Nur Hinflug',
        OTHER_AIRLINES: 'Andere Fluggesellschaften',
        SEARCH_FOR_FLIGHTS: 'Flüge suchen',
        YEARS: "Jahre",
        CHILDREN: 'Kinder',
        CHILD: 'Kind',
        ADULT: 'Erwachsener',
        ADULTS: 'Erwachsenen',
        INFANTS: 'Babys',
        INFANT: 'Baby',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        QUOTES_HOME: {
          ONE: "Einfach, bequem, sofortige Bestätigung.",
          TWO: "Zielen auf der Welt.",
          THREE: "Authentische Gastfreundschaft erleben.",
          FOUR: "Verwunschene Zeit mit uns."
        }
      },
      FLIGHTS: {
        TITLE: 'Einen Flug aussuchen',
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        SEATS_LEFT: 'freie Sitzplätze',
        MORE_DETAILS: 'Mehr Details',
        BOOK: 'buchen',
        SELECT:'Wählen',
        FLIGHT: 'Flug',
        OPERATED_BY: 'betrieben von'
      },
      FLIGHT: {
        FLIGHT: "Flug",
        ECONOMY: 'Economy',
        BUSINESS: 'Business',
        TITLE: 'Details des Flugs',
        OPERATED_BY: 'betrieben von',
        NUMBER_OF_PASSENGERS: 'Anzahl der Passagiere',
        FLYING_CALSS: 'Beförderungsklassen',
        FLIGHT_FARE: 'Flugpreis',
        FLIGHT_FAC: 'Dienstleistungen des Flugs',
        PASSENGER: 'Passagier',
        PASSENGERS: 'Passagiere'
      },
      NAV: {
        GO_HOME:'heimgehen',
        SUBMIT: 'einreichen',
        NEXT: 'weiter',
        BACK: 'zurück',
        SPECIAL_OFFERS: 'Spezielle Angebote',
        SERVICES: 'Dienstleistungen',
        OUR_TEAM: 'Unser Team',
        ABOUT: 'Über uns',
        CONTACT_US: 'Unser Kontakt',
        CHOOSE_LANGUAGE:'Wähle eine Sprache',
        ENGLISH: 'Englisch',
        GERMAN:'Deutsch'
      },
      CONFIRMATION: {

        THANK_YOU: 'Danke schön',
        NAME: 'Name',
        PHONE: 'Telefon',
        MAIL: 'E-mail adresse',
        FLIGHTNO: 'Flug Nummer',
        DEPARTURE: 'Abfahrt',
        ARRAIVAL: 'Ankunft',
        PRINT: 'Flugkarte abdrucken'
      },
      CONTACT_US: {

        CONTACT_US: 'Unser Kontakt',
        PHONE: 'Telefon',
        MAIL: 'E-mail adresse',
        LEAVE_MSG: 'Ihr Anliegen',
        SEND: 'abschicken'
      },
      four_o_for: {
        //Do you mean 404notfound team ?  in 404.html
        QUESTION: 'Meinten Sie die Gruppe von 404NotFound ?'

      },
      ABOUT_US: {

        ABOUT: 'Über AirBerlin',
        HISTORY: 'Geschichte',
        HISTORY_PARA: 'Am 28. April 1979 startet eine Boeing 707 von Berlin-Tegel nach Palma de Mallorca. Der Erstflug ist der Anfang der Erfolgsgeschichte von airberlin. ',
        OUR_GOAL: 'Unser Ziel',
        OUR_GOAL_PARA: 'Zuert Europa, zunächst die ganze Welt, werden durch den Flug zusammen verbunden, und Nationen eng zusammen damit sie Nachbarn aufwachsen… . Was die Eisbahnen für die Nationen getan hat, wird die Flüge für das ganze Welt tun.',
        A_P: 'Alliance/partners',
        A_P_PARA: 'airberlin erweitert ihr internationales Streckennetz, indem sie mit mehreren Airlines als Codeshare-Partnern kooperiert.'


      },
      OFFERS: {
        SPECIAL_OFFERS: 'Spezielle Angebote',
        FLIGHT_OFFERS: 'Flugangebote',
        FLIGHT_OFFERS_PARA: 'Finden Sie die attraktivsten Tarife für Ihren Flug',
        LIKE_FACEBOOK: 'Folgen Sie uns auf Facebook',
        LIKE_FACEBOOK_PARA: 'Vermissen Sie nicht unsere spezielle Angebote: mit unser newsletter und auf Facebook',
        HOTEL: 'Hotel',
        HOTEL_PARA: 'Sonderangebote für Ihr Hotel weg von unsere Partnern .'

      },

      PASS_DETAILS: {

        FIRST_NAME: 'Vorname',
        MIDDLE_NAME: 'Zweitname',
        LAST_NAME: 'Nachname',
        PASS_NO: 'Reisepass Nummer',
        PLACE_OFBIRTH: 'Ort des Geburts',
        PHONE_NO: 'Telefon Nummer',
        E_MAIL: 'E-mail adresse',
        REPEAT_E_MAIL: 'E-mail wiederholen',
        VERIFY_PARA: 'Hiermit, bestätige ich, dass die Informationen, die vorhin gegeben sind, meine Passdaten entsprichen.'

      },
      PAYMENT: {

        WE_ACCEPT: 'Zahlungsmethoden',
        CARD_INFO: 'Kreditkarte informationen:',
        EXP_DATE: 'Ablaufdatum Ihrer Karte:',
        COST: 'Gesamtpreis'

      },
      SEATING: {

        SEAT_MAP: 'Sitzplatzreservierung',
        SELECTED: 'Sie haben einen Sitzplatz reserviert.'

      },
      SERVICES: {

        SERVICE: 'Services',
        INFLIGHT_SERVICES: 'Services an board',
        INFLIGHT_PARA: '  Airberlin heißen Sie herzlich willkommen an Bord: economy und business class.',
        G_MEALS: 'Gourmetessen',
        G_MEALS_PARA: 'Freuen Sie sich auf Airberlins a la carte-Speise : Wir servieren Ihnen unsere warmen On-Top-Speisen, die extra vom Sansibar-Wirt Herbert Seckler kreiert wurden.',
        BAGGAGE: 'Reisegepäck',
        BAGGAGE_PARA: 'Unsere Reglungen über Aufzugebendes Gepäckmengen, über Handgepäck und Sondergepäck.'

      },

    });

    $translateProvider.preferredLanguage('de');
    $translateProvider.useSanitizeValueStrategy('escape');

  });

// @abdelrhman-essam
var confirmationController = function($scope, $location,api, $routeParams) {
      $scope.pageClass = 'page-confirmation';
  $scope.title = "Confirmation";

  $scope.buttonTextNxt = "Go Home";
  $scope.buttonTextBk = "Back";

  if(Type == 'desktop'){
    $scope.goNext = function() {
      // api.submitBooking('false').then(function(data){
      //   console.log(data);
      //   alert(data.data)
      //   api.clearLocal();
      // },function(err){
      //
      // })
      $location.path('/');
    }
    $scope.goBack = function() {
      $location.path('/payment');
    }

    if(!api.getChosenOutGoingFlight() || !api.getBooking()){
      $location.path('/flights');
      return;
    }
    if(!api.getPassenger()){
      $location.path('/passenger-details');
        return;
    }
    $scope.goSocial = function () {
      $location.path('/social');

    }

    $('#quotes-text').typeIt({
      strings: [
        '"Travel and change of place impart new vigor to the mind."-Seneca',
         '“Traveling tends to magnify all human emotions.” — Peter Hoeg',
         '“Traveling – it leaves you speechless, then turns you into a storyteller.” - Ibn Battuta',
        ' “We travel, some of us forever, to seek other places, other lives, other souls.” – Anais Nin'
      ],
      speed: 80,
      breakLines: false,
      loop: true
    });

  }else{

  }
  $scope.flight = api.getChosenOutGoingFlight();


  $scope.passenger = api.getPassenger()[0];

  $scope.booking = $routeParams.booking;
  $scope.notOtherHosts = !api.IsOtherHosts();

  $scope.passenger = api.getPassenger()[0];


}
if (Type == 'mobile') {
  confirmationController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
  confirmationController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}

App.controller('confirmationCtrl', confirmationController);

// @Nabila
App.controller('flightDetailsCtrl', function($scope, $location, api) {
  $scope.pageClass = 'page-flight';
  $scope.title = "Flight(s) Details";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";



  if (Type == 'desktop') {
    $scope.goNext = function() {
      $location.path('/passenger-details');
    }
    $scope.goBack = function() {
      $location.path('/flights');
    }

    if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
      $location.path('/flights');
      return;
    }
  }
  var outgoingFlight = api.getChosenOutGoingFlight();
  var returnFlight = api.getChosenReturningFlight();

  var booking = api.getBooking();

  var facilities = ["Smoking areas available", "Wi-Fi availability",
    "4 cultural cuisines", "Inflight entertainment", "Extra cozy sleeperette",
    "Screens to show your flight pattern, aircraft altitude and speed"
  ];
if (outgoingFlight){
  var departureDate = new Date(outgoingFlight.departureUTC);
  outgoingFlight.departureUTC = departureDate.toUTCString();
  var arrivalDate = new Date(outgoingFlight.arrivalUTC);
  outgoingFlight.arrivalUTC = arrivalDate.toUTCString();


  if (returnFlight) {
    departureDate = new Date(returnFlight.departureUTC);
    returnFlight.departureUTC = departureDate.toUTCString();
    arrivalDate = new Date(returnFlight.arrivalUTC);
    returnFlight.arrivalUTC = arrivalDate.toUTCString();
  }
  var aircrafts = [];
  var outAircrafthasSmoking;
  var outAircrafthasWifi;
  var reAircrafthasSmoking;
  var reAircrafthasWifi ;
  api.getAircrafts().then(function mySucces(response) {
    aircrafts = response.data;
    for (var i = 0; i < aircrafts.length; i++) {
      if (aircrafts[i].tailNumber === outgoingFlight.refAircraftTailNumber) {
        outAircrafthasSmoking = aircrafts[i].hasSmoking;
        outAircrafthasWifi = aircrafts[i].hasWifi;
        $scope.outAircraftModel = aircrafts[i].model;
      }
      if (returnFlight) {
        if (aircrafts[i].tailNumber === returnFlight.refAircraftTailNumber) {
          reAircrafthasSmoking = aircrafts[i].hasSmoking;
          reAircrafthasWifi = aircrafts[i].hasWifi;
          $scope.reAircraftModel = aircrafts[i].model;
        }
      }

    }
  }, function myError(response) {
    console.log(response.statusText);
  });

  $scope.outRefOriginAirportName;
  $scope.outRefDestinationAirportName;
  var airports = [];
  api.getAirports().then(function mySucces(response) {
    airports = response.data;
    for (var i = 0; i < airports.length; i++) {
      if (airports[i].iata === outgoingFlight.refOriginAirport) {
        $scope.outRefOriginAirportName = airports[i].name;
      }
      if (airports[i].iata === outgoingFlight.refDestinationAirport) {
        $scope.outRefDestinationAirportName = airports[i].name;
      }
      if (returnFlight) {
        $scope.reRefOriginAirportName;
        $scope.reRefDestinationAirportName;
        if (airports[i].iata === returnFlight.refOriginAirport) {
          $scope.reRefOriginAirportName = airports[i].name;
        }
        if (airports[i].iata === returnFlight.refDestinationAirport) {
          $scope.reRefDestinationAirportName = airports[i].name;
        }

      }
    }
  }, function myError(response) {
    console.log(response.statusText);
  });
  var outbusinessOrEcon = "";
  var outfare = 0;

  if (booking.exitIsEconomy) {
    outbusinessOrEcon = "Economy";
    outfare = outgoingFlight.economyFare;
  } else {
    outbusinessOrEcon = "Business";
    outfare = outgoingFlight.businessFare;
  }
  if (returnFlight) {
    var rebusinessOrEcon = "";
    var refare = 0;
    if (booking.reEntryIsEconomy) {
      rebusinessOrEcon = "Economy";
      refare = returnFlight.economyFare;
    } else {
      rebusinessOrEcon = "Business";
      refare = returnFlight.businessFare;
    }
  }

  var outfacilitiesResult = [];
  if (outAircrafthasSmoking)
    outfacilitiesResult.push(facilities[0]);
  if (outAircrafthasWifi)
    outfacilitiesResult.push(facilities[1]);

  if (!booking.exitIsEconomy) {
    outfacilitiesResult.push(facilities[2]);
    outfacilitiesResult.push(facilities[3]);
    outfacilitiesResult.push(facilities[4]);
  }
 outfacilitiesResult.push(facilities[5]);
  if (returnFlight) {
    var refacilitiesResult = [];
    if (reAircrafthasSmoking)
      refacilitiesResult.push(facilities[0]);
    if (reAircrafthasWifi)
      refacilitiesResult.push(facilities[1]);

    if (!booking.reEntryIsEconomy) {

      refacilitiesResult.push(facilities[2]);
      refacilitiesResult.push(facilities[3]);
      refacilitiesResult.push(facilities[4]);
    }
    refacilitiesResult.push(facilities[5]);

    $scope.returnFlight = returnFlight;
    $scope.rebusinessOrEcon = rebusinessOrEcon;
    $scope.refare = refare;
    $scope.refacilitiesResult = refacilitiesResult;
  }
  $scope.outgoingFlight = outgoingFlight;
  $scope.outbusinessOrEcon = outbusinessOrEcon;
  $scope.outfare = outfare;
  $scope.outfacilitiesResult = outfacilitiesResult;

}
});

// @abdelrahman-maged
var flightController = function($scope, $location, api, $routeParams) {

    $scope.pageClass = 'page-flights';
    $scope.title = "Choose a Flight";
    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    api.setIsOtherHosts(false);

    var origin = $routeParams.origin;
    var destination = $routeParams.destination;
    var exitDate = new Date($routeParams.exitDate * 1000);

    $scope.origin = origin;
    $scope.destination = destination;
    $scope.exitDate = exitDate;

    $scope.roundTrip = false;

    if ($routeParams.returnDate) {
        var returnDate = new Date($routeParams.returnDate * 1000);
        $scope.returnDate = returnDate;
        $scope.roundTrip = true;
    }

    $scope.selectedBooking = {
        "refPassengerID": [],
        "issueDate": null,
        "isOneWay": !$scope.roundTrip,
        "refExitFlightID": null,
        "refReEntryFlightID": null,
        "receiptNumber": null
    };

    var flights;
    var returnDateMill;

    if (returnDate)
        returnDateMill = returnDate.getTime();

    $scope.selectOutgoingFlight = function(flight, isEconomy) {
        $scope.isOutgoingFlightSelected = true;
        $scope.selectedOutgoingFlight = flight;
        $scope.selectedBooking.exitIsEconomy = isEconomy;
        $scope.selectedBooking.refExitFlightID = flight._id;
    }

    $scope.selectReturningFlight = function(flight, isEconomy) {
        $scope.isReturningFlightSelected = true;
        $scope.selectedReturningFlight = flight;
        $scope.selectedBooking.reEntryIsEconomy = isEconomy;
        $scope.selectedBooking.refReEntryFlightID = flight._id;
    }

    $scope.constructDate = function(date) {
        var dateOut = new Date(date);
        return new Date(dateOut.getUTCFullYear(), dateOut.getUTCMonth(), dateOut.getUTCDate(), dateOut.getUTCHours(), dateOut.getUTCMinutes(), dateOut.getUTCSeconds());
    };

    $scope.goNext = function() {

        api.setOutGoingFlight($scope.selectedOutgoingFlight);
        api.setReturningFlight($scope.selectedReturningFlight);

        $scope.selectedBooking.refExitFlightID = $scope.selectedOutgoingFlight._id;

        if ($scope.selectedReturningFlight)
            $scope.selectedBooking.refReEntryFlightID = $scope.selectedReturningFlight._id;

        api.setBooking($scope.selectedBooking);

        if (Type == "desktop")
            $location.path('/exit-flight');
        else
            $location.go('tab.flight-details');

    }

    $scope.goBack = function() {
        $location.path('/');
    }

    if (!origin || !destination || !exitDate) {
        $location.path('/');
    }

    $scope.checkNextBtnState = function() {
        if ($scope.roundTrip)
            return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
        else
            return $scope.isOutgoingFlightSelected;
    }

    if (Type == 'desktop') {

        $scope.isCollapsed = true;
        $scope.isOutgoingFlightSelected = false;

        api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {

            flights = response.data;

            for (i = 0; i < flights.outgoingFlights.length; i++) {

                var hours = Math.floor(flights.outgoingFlights[i].duration / 60);
                var minutes = flights.outgoingFlights[i].duration % 60;

                flights.outgoingFlights[i].duration = hours + "h " + minutes + "m";

            }

            if ($scope.roundTrip) {

                for (i = 0; i < flights.returnFlights.length; i++) {

                    var hours = Math.floor(flights.returnFlights[i].duration / 60);
                    var minutes = flights.returnFlights[i].duration % 60;

                    flights.returnFlights[i].duration = hours + "h " + minutes + "m";

                }

            }

            $scope.flights = flights;

            api.getAirports().then(function mySuccess(response) {

                airports = response.data;

                for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

                    for (var j = 0; j < airports.length; j++) {

                        if (airports[j].iata === $scope.flights.outgoingFlights[i].refOriginAirport)
                            $scope.flights.outgoingFlights[i].refOriginAirportName = airports[j].name;

                        if (airports[j].iata === $scope.flights.outgoingFlights[i].refDestinationAirport)
                            $scope.flights.outgoingFlights[i].refDestinationAirportName = airports[j].name;

                    }

                }

                if ($scope.roundTrip) {

                    for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                        for (var j = 0; j < airports.length; j++) {

                            if (airports[j].iata === $scope.flights.returnFlights[i].refOriginAirport)
                                $scope.flights.returnFlights[i].refOriginAirportName = airports[j].name;

                            if (airports[j].iata === $scope.flights.returnFlights[i].refDestinationAirport)
                                $scope.flights.returnFlights[i].refDestinationAirportName = airports[j].name;

                        }

                    }

                }

            }, function myError(response) {
                console.log(response.statusText);
            });

            api.getAircrafts().then(function mySuccess(response) {

                aircrafts = response.data;

                for (var i = 0; i < $scope.flights.outgoingFlights.length; i++) {

                    for (var j = 0; j < aircrafts.length; j++) {

                        if (aircrafts[j].tailNumber === $scope.flights.outgoingFlights[i].refAircraftTailNumber)
                            $scope.flights.outgoingFlights[i].refAircraftModel = aircrafts[j].model;

                    }

                }

                if ($scope.roundTrip) {

                    for (var i = 0; i < $scope.flights.returnFlights.length; i++) {

                        for (var j = 0; j < aircrafts.length; j++) {

                            if (aircrafts[j].tailNumber === $scope.flights.returnFlights[i].refAircraftTailNumber)
                                $scope.flights.returnFlights[i].refAircraftModel = aircrafts[j].model;

                        }

                    }

                }

            }, function myError(response) {
                console.log(response.statusText);
            });

        }, function myError(response) {
            console.log(response.statusText);
        });

    } else {


        $scope.isEconomy = Boolean($routeParams.isEconomy);
        api.getFlights(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
            $scope.flights = response.data;
        }, function myError(response) {
            console.log(response.statusText);
        });

        $scope.miniLogoPath = function(operatorAirline) {
            if (operatorAirline === "Air Berlin")
                return "img/air-berlin-mini-logo.png"
            return "img/other-airline-mini-logo.png"
        };

    }

}

if (Type == 'mobile') {
    flightController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
    flightController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}

App.controller('flightsCtrl', flightController);

var flightNewController = function($scope, $location, api, $routeParams) {

  $scope.pageClass = 'page-flights';
  $scope.title = "Choose a Flight";
  $scope.buttonTextNxt = "Next";
  $scope.buttonTextBk = "Back";

  if (Type == "desktop") {
    $scope.isCollapsed = false;
    $scope.isOutgoingFlightSelected = false;
  } else {

    String.prototype.contains = function(it) {
      return this.indexOf(it) != -1;
    };

    $scope.miniLogoPath = function(operatorAirline) {

      if (operatorAirline === "Air Berlin")
        return "img/air-berlin-mini-logo.png"
        
      if (operatorAirline.toLowerCase().contains("swiss"))
        return "img/swiss-air-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("austrian"))
        return "img/austrian-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("hawaiian"))
        return "img/hawaiian-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("zealand"))
        return "img/air-new-zealand-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("klm"))
        return "img/klm-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("madagascar"))
        return "img/air-madagascar-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("iberia"))
        return "img/iberia-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("united"))
        return "img/united-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("delta"))
        return "img/delta-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("turkish"))
        return "img/turkish-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("france"))
        return "img/air-france-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("canada"))
        return "img/airline-canada-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("alaska"))
        return "img/alaska-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("alitalia"))
        return "img/alitalia-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("cathay"))
        return "img/cathay-pacific-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("dragon"))
        return "img/dragon-air-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("japan"))
        return "img/japan-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("malaysia"))
        return "img/malaysia-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("northwest"))
        return "img/northwest-airlines-mini-logo.png"
      if (operatorAirline.toLowerCase().contains("south"))
        return "img/south-african-airways-logo.png"
      if (operatorAirline.toLowerCase().contains("virgin"))
        return "img/virgin-australia-mini-logo.png"

      return "img/other-airline-mini-logo.png"

    };

  }

  api.setIsOtherHosts(true);

  $scope.goNext = function() {

    api.setOutGoingFlight($scope.selectedOutgoingFlight);
    api.setReturningFlight($scope.selectedReturningFlight);
    api.setBooking($scope.selectedBooking);

    if (Type == "desktop")
      $location.path('/passenger-details');
    else
      $location.go('tab.passenger-details');

  }

  $scope.goBack = function() {
    $location.path('/');
  }

  $scope.selectedBooking = {
    "passengerDetails": [{
      "firstName": null,
      "lastName": null,
      "passportNum": null,
      "passportExpiryDate": null,
      "dateOfBirth": null,
      "nationality": null,
      "email": null,
    }],
    "class": null,
    "outgoingFlightId": null,
    "returnFlightId": null,
    "paymentToken": null
  }

  var origin = $routeParams.origin;
  var destination = $routeParams.destination;
  var exitDate = new Date($routeParams.exitDate * 1000);

  $scope.origin = origin;
  $scope.destination = destination;
  $scope.exitDate = exitDate;

if($routeParams.flightClass)
  var isEconomy = $routeParams.flightClass == "Economy";
if($routeParams.isEconomy)
var isEconomy = Boolean($routeParams.isEconomy);

  // var isEconomy = true;
  $scope.roundTrip = false;

  if ($routeParams.returnDate) {
    var returnDate = new Date($routeParams.returnDate * 1000);
    $scope.returnDate = returnDate;
    $scope.roundTrip = true;
  }

  var returnDateMill;

  if (returnDate)
    returnDateMill = returnDate.getTime();

  if (isEconomy) {
    api.getOtherFlightsEco(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
      console.log(response.data);
    }, function myError(response) {
      console.log(response.statusText);
    });
  } else {
    api.getOtherFlightsBusi(origin, destination, exitDate.getTime(), returnDateMill).then(function mySuccess(response) {
      $scope.flights = response.data;
    }, function myError(response) {
      console.log(response.statusText);
    });
  }

  $scope.selectOutgoingFlight = function(flight) {
    $scope.isOutgoingFlightSelected = true;
    $scope.selectedOutgoingFlight = flight;
    $scope.selectedBooking.class = isEconomy === true ? "economy" : "business";
    $scope.selectedBooking.outgoingFlightId = flight.flightId;
    $scope.selectedBooking.outgoingUrl = flight.url;
    $scope.selectedBooking.outgoingCost = flight.cost;
  }

  $scope.selectReturningFlight = function(flight) {
    $scope.isReturningFlightSelected = true;
    $scope.selectedReturningFlight = flight;
    $scope.selectedBooking.returnFlightId = flight.flightId;
    $scope.selectedBooking.returnUrl = flight.url;
    $scope.selectedBooking.returnCost = flight.cost;
  }

  $scope.checkNextBtnState = function() {

    if ($scope.roundTrip)
      return $scope.isReturningFlightSelected && $scope.isOutgoingFlightSelected;
    else
      return $scope.isOutgoingFlightSelected;

  }

}


if (Type == 'mobile') {
  flightNewController.$inject = ['$scope', '$state', 'api', '$stateParams'];
} else {
  flightNewController.$inject = ['$scope', '$location', 'api', '$routeParams'];
}


App.controller('flightsNewCtrl', flightNewController);

 var mainController = function($scope, $location, api,$translate) {
   $scope.pageClass = 'page-main';

   $scope.go = function() {
     console.log($scope.selectedOrigin);
   }
   $scope.exitDate = new Date();
   $scope.returnDate = new Date();

   api.getAirports().then(function mySucces(response) {
     $scope.airports = response.data;
   }, function myError(response) {
     console.log(response.statusText);
   });


   $scope.selectedOrigin = undefined;
   $scope.selectedDest = undefined;

   function airporsContains(iata) {
    //  if( $scope.airports)
    //  for (var i = 0; i < $scope.airports.length; i++) {
    //    if (iata == $scope.airports[i]['iata'])
    //      return true;
    //  }
     return true;
   }

   $scope.buttonState = function() {
     return !$scope.selectedOrigin || !$scope.selectedDest || !$scope.exitDate || $scope.selectedDest == $scope.selectedOrigin || !airporsContains($scope.selectedOrigin) || !airporsContains($scope.selectedDest);
   }

   $scope.flight = {
     type: "one"
   }
   $scope.otherAirline = {
     value: false
   }



   $scope.goToFlights = function() {
     var exitDate, returnDate;

     exitDate = ($scope.exitDate.getTime() / 1000).toFixed(0);
     if ($scope.returnDate)
       returnDate = ($scope.returnDate.getTime() / 1000).toFixed(0);

     if ($scope.otherAirline.value) {
       if ($scope.flight.type == "one")
         if (Type == 'desktop')
           $location.path('/flights-new')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', exitDate)
           .search('flightClass',$scope.classeBtnText);

         else
           $location.go('tab.flights-new', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: exitDate,
             isEconomy: !$scope.isBusiness
           })
       else {
         if (Type == 'desktop')
           $location.path('/flights-new')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', exitDate)
           .search('returnDate', returnDate)
           .search('flightClass',$scope.classeBtnText);
         else
           $location.go('tab.flights-new', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: exitDate,
             returnDate: returnDate,
             isEconomy: !$scope.isBusiness

           })
       }
     } else {
       if ($scope.flight.type == "one")
       if(Type == 'desktop')
         $location.path('/flights').search('origin', $scope.selectedOrigin).search('destination', $scope.selectedDest).search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0));
         else
         $location.go('tab.flights', {
           origin: $scope.selectedOrigin,
           destination: $scope.selectedDest,
           exitDate: ($scope.exitDate.getTime() / 1000).toFixed(0),
           isEconomy: !$scope.isBusiness

         })
       else {
         if(Type == 'desktop')
         $location.path('/flights')
           .search('origin', $scope.selectedOrigin)
           .search('destination', $scope.selectedDest)
           .search('exitDate', ($scope.exitDate.getTime() / 1000).toFixed(0))
           .search('returnDate', ($scope.returnDate.getTime() / 1000).toFixed(0));
           else
           $location.go('tab.flights', {
             origin: $scope.selectedOrigin,
             destination: $scope.selectedDest,
             exitDate: ($scope.exitDate.getTime() / 1000).toFixed(0),
             returnDate: ($scope.returnDate.getTime() / 1000).toFixed(0),
             isEconomy: !$scope.isBusiness

           })
       }

     }

   };




   if (Type == 'desktop') {
     $('#main-text').typeIt({
       strings: [$translate.instant('MAIN.QUOTES_HOME.ONE'),$translate.instant('MAIN.QUOTES_HOME.TWO'),$translate.instant('MAIN.QUOTES_HOME.THREE'),$translate.instant('MAIN.QUOTES_HOME.FOUR')],
       speed: 120,
       breakLines: false,
       loop: true
     });


     $location.url($location.path());
     setUpDate($scope);

     $scope.children = ['0 ' + $translate.instant('MAIN.CHILDREN'), '1 ' + $translate.instant('MAIN.CHILD'), '2 ' + $translate.instant('MAIN.CHILDREN'), '3 ' + $translate.instant('MAIN.CHILDREN'), '4 ' + $translate.instant('MAIN.CHILDREN')];
     $scope.childrenBtnText = $scope.children[0];
     $scope.changeChildren = function(text) {
       $scope.childrenBtnText = text;
     }



     $scope.adults = ['1 '+$translate.instant('MAIN.ADULT') , '2 '+$translate.instant('MAIN.ADULTS'), '3 ' + $translate.instant('MAIN.ADULTS'), '4 '+$translate.instant('MAIN.ADULTs')];
     $scope.adultBtnText = $scope.adults[0];
     $scope.changeAdult = function(text) {
       $scope.adultBtnText = text;
     }

     $scope.infants = ['0 '+$translate.instant('MAIN.INFANT'), '1 '+$translate.instant('MAIN.INFANTS')];
     $scope.infantBtnText = $scope.infants[0];
     $scope.changeInfant = function(text) {
       $scope.infantBtnText = text;
     }


     $scope.classes = [$translate.instant('MAIN.ECONOMY'), $translate.instant('MAIN.BUSINESS')];
     $scope.classeBtnText = $scope.classes[0];
     $scope.changeClass = function(text) {
       $scope.classeBtnText = text;
     }
   }


 };

 function setUpDate($scope) {
   $scope.today = function() {
     $scope.exitDate = new Date();
     $scope.returnDate = new Date();
   };
   $scope.today();

   $scope.open2 = function() {
     $scope.popup2.opened = true;
   };
   $scope.open = function() {
     $scope.popup.opened = true;
   };


   function disabled(data) {
     var date = data.date,
       mode = data.mode;
     return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
   }
   $scope.dateOptions = {
     formatYear: 'yy',
     maxDate: new Date(2020, 5, 22),
     minDate: new Date(),
     startingDay: 1
   };
   $scope.popup2 = {
     opened: false
   };
   $scope.popup = {
     opened: false
   };
 }

 if (Type == 'mobile') {
   mainController.$inject = ['$scope', '$state', 'api','$translate'];
 } else {
   mainController.$inject = ['$scope', '$location', 'api','$translate'];
 }

 App.controller('mainCtrl', mainController);

// @yassmine
App.controller('passengerDetailsCtrl', function($scope, $location, api) {
    $scope.title = "Fill in your details";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";


    if (Type == 'desktop') {
        if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
            $location.path('/flights');
            return;
        }

        $scope.titles = ['Mr', 'Mrs', 'Ms', 'Dr'];
        $scope.titlesBtnText = $scope.titles[0];
        $scope.changeTitle = function(text) {
            $scope.titlesBtnText = text;
        }

        api.getCountries().then(function mySucces(response) {
            $scope.countries = response.data;
        }, function myError(response) {
            console.log(response.statusText);
        });




        $scope.goNext = function() {



            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.nationality,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.titlesBtnText,
                firstName: $scope.firstName,
                middleName: $scope.middleName,
                lastName: $scope.lastName,
                passportNumber: $scope.passportNumber,
                phoneNumber: $scope.phoneNumber,
                email: $scope.email1


            };
            ///before you leave the page make sure that the passenger object is complete otherwise show alert("Fill in all data");



            // if (complete == false) {
            //   $scope.alertData = false;
            //   if (($scope.firstName == null) || ($scope.middleName == null) || ($scope.lastName == null) || ($scope.phoneNumber == null) || ($scope.passportNumber == null) || ($scope.email1 == null) || ($scope.emailver == null)) {
            //     $scope.alertData = true;
            //
            //   } else {
            //     $scope.alertConfirm = false;
            //     if ($scope.email1 != $scope.emailver)
            //       $scope.alertConfirm = true;
            //     else {
            //       $scope.alertCheck = false;
            //       if (($scope.check == null))
            //         $scope.alertCheck = true;
            //       else {
            //         complete = true;
            //       }
            //     }
            //
            //   }
            //
            //
            // }
            // if (complete == true) {
            //   api.setPassenger($scope.passenger);
            //   if (!api.isOtherHosts)
            //     $location.path('/seating/outgoing');
            //   else $location.path('/payment')
            // }

            var fields = [true, true, true, true, true, true, true, true, true, true];

            $scope.alertFName = false;
            $scope.alertMName = false;
            $scope.alertLName = false;
            $scope.alertPhNumber = false;
            $scope.alertPNumber = false;
            $scope.alertCountry = false;
            $scope.alertEmail = false;
            $scope.alertConfirm = false;
            $scope.alertCheck = false;


            if ($scope.firstName == null) {
                fields[0] = false;
                $scope.alertFName = true;
            }
            if ($scope.middleName == null) {
                fields[1] = false;
                $scope.alertMName = true;
            }
            if ($scope.lastName == null) {
                fields[2] = false;
                $scope.alertLName = true;
            }
            if ($scope.phoneNumber == null) {
                fields[3] = false;
                $scope.alertPhNumber = true;
            }
            if ($scope.passportNumber == null) {
                fields[4] = false;
                $scope.alertPNumber = true;
            }
            if ($scope.nationality == null) {
                fields[5] = false;
                $scope.alertCountry = true;
            }
            if ($scope.email1 == null) {
                fields[6] = false;
                $scope.alertEmail = true;
            }
            if ($scope.emailver == null) {
                fields[7] = false;
                $scope.alertEmail = true;
            }
            if ($scope.email1 != $scope.emailver) {
                fields[8] = false;
                $scope.alertConfirm = true;
            }
            if ($scope.check == null) {
                fields[9] = false;
                $scope.alertCheck = true;
            }

            var allpassing = true;

            for (var i = 0; i < fields.length; i++) {
                if (fields[i] == false) {
                    allpassing = false;
                    break;
                }
            }

            if (allpassing == true) {
                if (!api.IsOtherHosts()) {
                    api.setPassenger($scope.passenger);
                    $location.path('/seating/outgoing');

                } else {
                    var booking = api.getBooking();
                    if (Type == 'desktop') {
                        booking.passengerDetails[0] = {
                            "firstName": $scope.firstName,
                            "lastName": $scope.lastName,
                            "passportNum": $scope.passportNumber,
                            "passportExpiryDate": null,
                            "dateOfBirth": null,
                            "nationality": $scope.nationality,
                            "email": $scope.email1
                        }
                    }
                    api.setBooking(booking);
                    $location.path('/payment')
                }
            }


        }
        $scope.goBack = function() {
            $location.path('/exit-flight');
        }
    } else {



        var complete1 = false;

        $scope.Next = function() {


            $scope.passenger = {
                type: null,
                countryCode: null, //according to country
                nationality: $scope.countriesMob,
                sex: null,
                birthDate: null,
                birthPlace: null,
                nationalID: null,
                authority: null,
                issueDate: null,
                expiryDate: null,
                points: null,
                membership: null,
                title: $scope.TitleMob,
                firstName: $scope.firstNameMob,
                middleName: $scope.middleNameMob,
                lastName: $scope.lastNameMob,
                passportNumber: $scope.passportNumberMob,
                phoneNumber: $scope.phoneNumberMob,
                email: $scope.email1Mob


            };




            // if (complete1 == false) {
            //
            //   if (($scope.firstNameMob == null) || ($scope.middleNameMob == null) || ($scope.lastNameMob == null) || ($scope.phoneNumberMob == null) || ($scope.passportNumberMob == null) || ($scope.email1Mob == null) || ($scope.emailverMob == null)) {
            //     alert("Please fill in data:" + "\n" + "Passport Number must be 8 numbers" + "\n" +
            //       "Phone Number must be 10 numbers" + "\n" + "Emails must be in a@xyz.com format");
            //
            //   } else {
            //
            //     if ($scope.email1Mob != $scope.emailverMob)
            //       alert("The entered emails do not match");
            //     else {
            //
            //       if (($scope.checkMob == null))
            //         alert("Please verify the information you entered")
            //       else {
            //         complete1 = true;
            //
            //       }
            //     }
            //
            //   }
            //
            //
            // }
            //
            // if (complete1 == true) {
            //   api.setPassenger($scope.passenger);
            //
            //   $location.path('/tab/seating/outgoing');
            // }



            var fieldsMob = [true, true, true, true, true, true, true, true, true];




            if ($scope.firstNameMob == null) {
                fieldsMob[0] = false;
                alert("Please Enter your first name.")
            }
            if ($scope.middleNameMob == null) {
                fieldsMob[1] = false;
                alert("Please enter your middle name.");
            }
            if ($scope.lastNameMob == null) {
                fieldsMob[2] = false;
                alert("Please enter your last name.");

            }
            if ($scope.phoneNumberMob == null) {
                fieldsMob[3] = false;
                alert("Please enter your phone number, it must be 10 digits");
            }
            if ($scope.passportNumberMob == null) {
                fieldsMob[4] = false;
                alert("Please enter your passport number, it must be 8 digits.");
            }
            if ($scope.email1Mob == null) {
                fieldsMob[5] = false;
                alert("Please enter your email, it must be in this format 'a@xyz.com' ");
            }
            if ($scope.emailverMob == null) {
                fieldsMob[6] = false;
                alert("Please confirm your email, it must be in this format 'a@xyz.com' ");

            }
            if ($scope.email1Mob != $scope.emailverMob) {
                fieldsMob[7] = false;
                alert("The entered emails do not match");
            }
            if ($scope.checkMob == null) {
                fieldsMob[8] = false;
                alert("Please verify the information you've entered");
            }

            var allpassingMob = true;

            for (var i = 0; i < fieldsMob.length; i++) {
                if (fieldsMob[i] == false) {
                    allpassingMob = false;
                    break;
                }
            }

            if (allpassingMob == true) {
                api.setPassenger($scope.passenger);

                $location.path('/tab/payment');
            }

        };
    }



});

// @mirna
var paymentCtrl = function($scope, $location, $http, api) {
    $scope.pageClass = 'page-payment';
    $scope.title = "Choose your payment option";

    $scope.buttonTextNxt = "Submit";
    $scope.buttonTextBk = "Back";

    $scope.form = {
        number: null,
        cvc: null,
        exp_month: null,
        exp_year: null
    };





    $scope.goNext = function() {
        var r = confirm("Are you sure you want pay?");
        if (r == true) {



            if (Type == 'desktop') {
                $scope.form.exp_year = $scope.yearsBtnText
                $scope.form.exp_month = parseInt($scope.months.indexOf($scope.monthsBtnText)) + 1

            } else {
                $scope.form.exp_year = (parseInt(new Date($scope.date).getYear())) + 2000 - 100
                $scope.form.exp_month = new Date($scope.date).getMonth()

                console.log($scope.form)
            }



            if (!api.IsOtherHosts())
                Stripe.card.createToken($scope.form, function(status, response) {
                    console.log(api.getChosenOutGoingFlight());
                    console.log(response.id)
                    api.setStripeToken(response.id)
                    api.submitBooking(api.IsOtherHosts()).then(function(data) {
                        console.log(data)
                        if (data.data.refNum)
                            if (Type == 'desktop')
                                $location.path('/confirmation').search('booking', data.data.refNum);
                            else
                                $location.go('tab.confirmation', {
                                    booking: data.data.refNum
                                })

                        else
                            alert(data.data.errorMessage)
                            // api.clearLocal();
                    }, function(err) {

                    })
                });
            else {
                var booking = api.getBooking();
                if (booking.returnUrl == booking.outgoingUrl || !booking.returnUrl) {
                    if (booking.returnCost)
                        booking.cost = parseInt(booking.returnCost) + parseInt(booking.outgoingCost);
                    else
                        booking.cost = parseInt(booking.outgoingCost);
                    var url = "http://" + booking.outgoingUrl;
                    console.log(url + '/stripe/pubkey/')
                    api.getStripeKey(url + '/stripe/pubkey/').then(function(data) {
                      console.log(data)
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            booking.paymentToken = response.id;
                            api.setBooking(booking);
                            api.submitBooking(true, url).then(function(data) {
                                console.log(data)
                                if (data.data.refNum) {
                                    Stripe.setPublishableKey('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
                                    if (Type == 'desktop')
                                        $location.path('/confirmation').search('booking', data.data.refNum);
                                    else
                                        $location.go('tab.confirmation', {
                                            booking: data.data.refNum
                                        })

                                } else
                                    alert(data.data.errorMessage)

                            })

                        }, function(err) {
                            console.log(err)
                        })
                    }, function(status) {
                        console.log(status)
                    })

                } else {
                    //here we should send two reqeusts
                    var outgoingBooking = booking;
                    var returnBooking = booking;
                    outgoingBooking.cost = parseInt(booking.outgoingCost);
                    outgoingBooking.returnFlightId = null;
                    if (booking.returnUrl) {
                        returnBooking.cost = parseInt(booking.returnCost);
                        returnBooking.outgoingFlightId = booking.returnFlightId;
                    }

                    var url = "http://" + booking.outgoingUrl;
                    api.getStripeKey(url + '/stripe/pubkey').then(function(data) {
                        Stripe.setPublishableKey(data.data)
                        Stripe.card.createToken($scope.form, function(status, response) {
                            outgoingBooking.paymentToken = response.id;
                            api.setBooking(outgoingBooking);
                            api.submitBooking(true, url).then(function(data) {
                                console.log(data)
                                    // $location.path('/confirmation').search('booking', data.data.refNum);
                                if (data.data.refNum)
                                    if (booking.returnUrl) {
                                        var url = "http://" + booking.returnUrl;
                                        api.getStripeKey(url + '/stripe/pubkey').then(function(data) {
                                            Stripe.setPublishableKey(data.data)
                                            Stripe.card.createToken($scope.form, function(status, response) {

                                                returnBooking.paymentToken = response.id;
                                                api.setBooking(returnBooking);
                                                api.submitBooking(true, url).then(function(data) {
                                                    if (data.data.refNum) {
                                                        Stripe.setPublishableKey('pk_test_SiY0xaw7q3LNlpCnkhpo60jt');
                                                        if (Type == 'desktop')
                                                            $location.path('/confirmation').search('booking', data.data.refNum);
                                                        else
                                                            $location.go('tab.confirmation', {
                                                                booking: data.data.refNum
                                                            })
                                                    } else
                                                        alert(data.data.errorMessage)

                                                })

                                            }, function(err) {
                                                console.log(err)
                                            })
                                        }, function(status) {
                                            console.log(status)
                                        })
                                    }


                            })

                        }, function(err) {
                            console.log(err)
                        })
                    }, function(status) {
                        console.log(status)
                    })


                }
            }
        }

        // if (!api.IsOtherHosts())
    }
    $scope.goBack = function() {
        $location.path('/seating');
    }

    if (Type == 'desktop') {

        if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
            $location.path('/flights');
            return;
        }
        if (!api.getPassenger()) {
            $location.path('/passenger-details');
            return;
        }

        $scope.years = ['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
        $scope.yearsBtnText = $scope.years[0];
        $scope.changeYear = function(text) {
            $scope.yearsBtnText = text;
        }

        $scope.months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        $scope.monthsBtnText = $scope.months[0];
        $scope.changeMonth = function(text) {
            $scope.monthsBtnText = text;
            $scope.monthsBtnNo = $scope.months.indexOf(text);
        }
    }
    $scope.otherHosts = api.IsOtherHosts();
    console.log(api.getBooking().outgoingCost)
    if ($scope.otherHosts) {
        if (api.getBooking().returnCost)
            $scope.price = parseInt(api.getBooking().outgoingCost) + parseInt(api.getBooking().returnCost);
        else
            $scope.price = parseInt(api.getBooking().outgoingCost)
        console.log($scope.price)
    } else {
        var price = 0;
        if (api.getCabinetOutgoingClass() == 'Economy')
            price = api.getChosenOutGoingFlight().economyFare
        else
            price = api.getChosenOutGoingFlight().businessFare

        if (api.getChosenReturningFlight()) {

            if (api.getCabinetReturningClass() == 'Economy')
                price = price + api.getChosenReturningFlight().economyFare
            else
                price = price + api.getChosenReturningFlight().businessFare


        }


        $scope.price = price;
    }
}


if (Type == 'mobile') {
    paymentCtrl.$inject = ['$scope', '$state', '$http', 'api'];
} else {
    paymentCtrl.$inject = ['$scope', '$location', '$http', 'api'];
}

App.controller('paymentCtrl', paymentCtrl);

// @ahmed-essmat
  var seatingController = function($scope, $location,api,$routeParams) {
    $scope.pageClass = 'page-seating';
    $scope.title = "Where would you like to sit?";

    $scope.buttonTextNxt = "Next";
    $scope.buttonTextBk = "Back";

    if(Type == 'desktop'){
      $scope.goNext = function() {
          if (api.getChosenReturningFlight())
              if ($routeParams.outgoing == "outgoing") {
                  $location.path('/seating/returing');
                  api.setOutgoingSeat($scope.seat);
              } else {
                  api.setRetrunSeat($scope.seat);
                  $location.path('/payment');
              }
          else {
              api.setOutgoingSeat($scope.seat);
              $location.path('/payment');
          }

      }
      $scope.goBack = function() {
          $location.path('/passenger-details');
      }



      if (!api.getChosenOutGoingFlight() || !api.getBooking()) {
          $location.path('/flights');
          return;
      }
      if (!api.getPassenger()) {
          $location.path('/passenger-details');
          return;
      }
      var seatmap;

      if ($routeParams.outgoing == "outgoing") {

          $scope.isEconomyText = api.getCabinetOutgoingClass();
          seatmap = api.getChosenOutGoingFlight().seatmap;
      } else {
          $scope.isEconomyText = api.getCabinetReturningClass();
          seatmap = api.getChosenReturningFlight().seatmap;
      }



      var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
      var schema = [3, 5, 3, 20];

      $scope.array1 = [];

      $scope.array2 = [];

      $scope.array3 = [];

      $scope.bob = [];

      for (var i = 0; i < schema[0]; i++) {
          $scope.array1.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[1]; i++) {
          $scope.array2.push(alphabits[0]);
          alphabits.splice(0, 1);
      }
      for (var i = 0; i < schema[2]; i++) {
          $scope.array3.push(alphabits[0]);
          alphabits.splice(0, 1);
      }

      for (var i = 0; i < schema[3]; i++) {
          $scope.bob.push(i);

      }



      $scope.searchColor = function(text) {
          if (!$scope.isEmpty(text))
              return 'seatOcu';
          else
              return 'seatEmpty';
      }
      $scope.isEmpty = function(text) {
          for (var i = 0; i < seatmap.length; i++) {
              if (seatmap[i]['number'] == text) {
                  return seatmap[i]['isEmpty']
              }
          }
          return true;
      }
      $scope.selectSeat = function(seat) {
          $scope.seat = seat;
      };
    }



    var alphabits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', "M", "N"];
    var schema = [2, 4, 2, 9];

    $scope.array1 = [];

    $scope.array2 = [];

    $scope.array3 = [];

    $scope.bob = [];

    for (var i = 0; i < schema[0]; i++) {
        $scope.array1.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[1]; i++) {
        $scope.array2.push(alphabits[0]);
        alphabits.splice(0, 1);
    }
    for (var i = 0; i < schema[2]; i++) {
        $scope.array3.push(alphabits[0]);
        alphabits.splice(0, 1);
    }

    for (var i = 0; i < schema[3]; i++) {
        $scope.bob.push(i);

    }


};


if(Type == 'mobile'){
  seatingController.$inject = ['$scope', '$location', 'api'];
}else{
  seatingController.$inject = ['$scope', '$location', 'api','$routeParams'];
}


App.controller('seatingCtrl', seatingController);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS5qcyIsInRyYW5zbGF0ZS5qcyIsImNvbnRyb2xsZXJzL2NvbmZpcm1hdGlvbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvZmxpZ2h0c0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9mbGlnaHRzTmV3Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL21haW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcGFzc2VuZ2VyRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9wYXltZW50Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NlYXRpbmdDb250cm9sbGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3VEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQXBwLmNvbmZpZyhmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vbiA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wb3N0ID0ge307XG4gICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLnB1dCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5wYXRjaCA9IHt9O1xuICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XG4gICAgIGRlbGV0ZSAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ107XG59KTtcblxuQXBwLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKCRodHRwKSB7XG4gICAgdmFyIGFjY2Vzc1Rva2VuID0gXCJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcGMzTWlPaUpQYm14cGJtVWdTbGRVSUVKMWFXeGtaWElpTENKcFlYUWlPakUwTmpFd05ETXlOemdzSW1WNGNDSTZNVFE1TWpVM09USTNPQ3dpWVhWa0lqb2lkM2QzTG1WNFlXMXdiR1V1WTI5dElpd2ljM1ZpSWpvaWFuSnZZMnRsZEVCbGVHRnRjR3hsTG1OdmJTSjkuZFhaVkMtLXV2dGlnckZCN1QzZkdURzg0TklZbFNuUnFiZ2JUNDN4ekZBd1wiXG4gICAgdmFyIGNob3Nlbk91dGdvaW5nRmxpZ2h0LCBjaG9zZW5SZXR1cm5pbmdGbGlnaHQsIGJvb2tpbmdEYXRhLCBjYWJpbmV0T3V0Z29pbmdDbGFzcywgY2FiaW5ldFJldHVybmluZ0NsYXNzLCBvdXRnb2luZ1NlYXQsIHJldHVyblNlYXQsIHJlZk51bTtcbiAgICB2YXIgaXNPdGhlckhvc3RzOyAvLyBzZXQgdG8gZmFsc2UgaW4gZmxpZ2h0c2N0cmwgLHNldCB0byB0cnVlIGZsaWdodHNOZXdDdHJsXG4gICAgdmFyIHN0cmlwZVRva2VuO1xuICAgIHZhciBwYXNzZW5nZXJEYXRhID0gW107XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZ2V0U3RyaXBlS2V5OiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICdtZXRob2QnOiAnR0VUJyxcbiAgICAgICAgICAgICAgJ3VybCc6IHVybCxcbiAgICAgICAgICAgICAgJ2hlYWRlcnMnOiB7XG4gICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGdldEFpcnBvcnRzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9haXJwb3J0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldEZsaWdodHM6IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvMC8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ2ZhbHNlJ1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiLzAvMVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICdmYWxzZSdcblxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRPdGhlckZsaWdodHNFY286IGZ1bmN0aW9uKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLCByZXR1cm5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoIXJldHVybkRhdGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL2VjMi01Mi0zOC0xMDEtODkudXMtd2VzdC0yLmNvbXB1dGUuYW1hem9uYXdzLmNvbS9hcGkvZmxpZ2h0cy9zZWFyY2gvJyArIG9yaWdpbiArIFwiL1wiICsgZGVzdGluYXRpb24gKyBcIi9cIiArIGV4aXREYXRlICsgXCIvZWNvbm9teS8xXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICd4LWFjY2Vzcy10b2tlbic6IGFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6ICd0cnVlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2FwaS9mbGlnaHRzL3NlYXJjaC8nICsgb3JpZ2luICsgXCIvXCIgKyBkZXN0aW5hdGlvbiArIFwiL1wiICsgZXhpdERhdGUgKyBcIi9cIiArIHJldHVybkRhdGUgKyBcIi9lY29ub215LzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRPdGhlckZsaWdodHNCdXNpOiBmdW5jdGlvbihvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZSwgcmV0dXJuRGF0ZSkge1xuICAgICAgICAgICAgaWYgKCFyZXR1cm5EYXRlKVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2ZsaWdodHMvc2VhcmNoLycgKyBvcmlnaW4gKyBcIi9cIiArIGRlc3RpbmF0aW9uICsgXCIvXCIgKyBleGl0RGF0ZSArIFwiL1wiICsgcmV0dXJuRGF0ZSArIFwiL2J1c2luZXNzLzFcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAnd2Vic2l0ZSc6ICdBaXJCZXJsaW4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ290aGVyLWhvc3RzJzogJ3RydWUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBnZXRBaXJjcmFmdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuICRodHRwKHtcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9lYzItNTItMzgtMTAxLTg5LnVzLXdlc3QtMi5jb21wdXRlLmFtYXpvbmF3cy5jb20vYXBpL2FpcmNyYWZ0cycsXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgJ3dlYnNpdGUnOiAnQWlyQmVybGluJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0sXG4gICAgICAgIGdldENvdW50cmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS9jb3VudHJpZXMnLFxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW4sXG4gICAgICAgICAgICAgICAgICAgICd3ZWJzaXRlJzogJ0FpckJlcmxpbidcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBzZXRPdXRHb2luZ0ZsaWdodDogZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgICAgICAgICBjaG9zZW5PdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UmV0dXJuaW5nRmxpZ2h0OiBmdW5jdGlvbihmbGlnaHQpIHtcbiAgICAgICAgICAgIGNob3NlblJldHVybmluZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0UGFzc2VuZ2VyOiBmdW5jdGlvbihwYXNzZW5nZXIpIHtcbiAgICAgICAgICAgIHBhc3NlbmdlckRhdGEucHVzaChwYXNzZW5nZXIpO1xuICAgICAgICAgICAgaWYgKGlzT3RoZXJIb3N0cylcbiAgICAgICAgICAgICAgICBib29raW5nRGF0YS5QYXNzZW5nZXJEZXRhaWxzID0gcGFzc2VuZ2VyRGF0YVxuICAgICAgICB9LFxuICAgICAgICBnZXRDYWJpbmV0T3V0Z29pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldE91dGdvaW5nQ2xhc3M7XG4gICAgICAgIH0sXG4gICAgICAgIGdldENhYmluZXRSZXR1cm5pbmdDbGFzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldFJldHVybmluZ0NsYXNzO1xuICAgICAgICB9LFxuICAgICAgICBzZXRCb29raW5nOiBmdW5jdGlvbihib29raW5nKSB7XG4gICAgICAgICAgICBpZiAoIWlzT3RoZXJIb3N0cykge1xuXG4gICAgICAgICAgICAgICAgaWYgKCFib29raW5nLmV4aXRJc0Vjb25vbXkpXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG5cbiAgICAgICAgICAgICAgICBpZiAoIWJvb2tpbmcucmVFbnRyeUlzRWNvbm9teSlcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldE91dGdvaW5nQ2xhc3MgPSBcIkJ1c2luZXNzXCJcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRPdXRnb2luZ0NsYXNzID0gXCJFY29ub215XCJcblxuICAgICAgICAgICAgICAgIGlmICghYm9va2luZy5jbGFzcylcbiAgICAgICAgICAgICAgICAgICAgY2FiaW5ldFJldHVybmluZ0NsYXNzID0gXCJCdXNpbmVzc1wiXG5cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXRSZXR1cm5pbmdDbGFzcyA9IFwiRWNvbm9teVwiXG4gICAgICAgICAgICB9XG5cblxuXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IGJvb2tpbmc7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UGFzc2VuZ2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXNzZW5nZXJEYXRhO1xuICAgICAgICB9LFxuICAgICAgICBnZXRCb29raW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBib29raW5nRGF0YTtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3Nlbk91dGdvaW5nRmxpZ2h0O1xuICAgICAgICB9LFxuICAgICAgICBnZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNob3NlblJldHVybmluZ0ZsaWdodDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBvdXRnb2luZ1NlYXQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0UmV0dXJuU2VhdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gcmV0dXJuU2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0T3V0Z29pbmdTZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICBvdXRnb2luZ1NlYXQgPSBzZWF0O1xuICAgICAgICB9LFxuICAgICAgICBzZXRSZXRydW5TZWF0OiBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgICByZXR1cm5TZWF0ID0gc2VhdDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0SXNPdGhlckhvc3RzOiBmdW5jdGlvbihvdGhlckhvc3RzKSB7XG4gICAgICAgICAgICBpc090aGVySG9zdHMgPSBvdGhlckhvc3RzO1xuICAgICAgICB9LFxuICAgICAgICBJc090aGVySG9zdHM6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGlzT3RoZXJIb3N0cztcbiAgICAgICAgfSxcbiAgICAgICAgY2xlYXJMb2NhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjaG9zZW5SZXR1cm5pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgY2hvc2VuT3V0Z29pbmdGbGlnaHQgPSB7fVxuICAgICAgICAgICAgcGFzc2VuZ2VyRGF0YSA9IFtdXG4gICAgICAgICAgICBib29raW5nRGF0YSA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0T3V0Z29pbmdDbGFzcyA9IHt9XG4gICAgICAgICAgICBjYWJpbmV0UmV0dXJuaW5nQ2xhc3MgPSB7fVxuICAgICAgICAgICAgb3V0Z29pbmdTZWF0ID0ge31cbiAgICAgICAgICAgIHJldHVyblNlYXQgPSB7fVxuICAgICAgICAgICAgaXNpc090aGVySG9zdHMgPSBmYWxzZVxuXG4gICAgICAgIH0sXG4gICAgICAgIHN1Ym1pdEJvb2tpbmc6IGZ1bmN0aW9uKG90aGVySG9zdHMsdXJsKSB7XG4gICAgICAgICAgICB2YXIgcHJpY2UgPSAwO1xuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICAgICAgcHJpY2UgPSB0aGlzLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuZWNvbm9teUZhcmVcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBwcmljZSA9IHRoaXMuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0Q2FiaW5ldFJldHVybmluZ0NsYXNzKCkgPT0gJ0Vjb25vbXknKVxuICAgICAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgdGhpcy5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5lY29ub215RmFyZVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIHRoaXMuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgICAgIGlmICghb3RoZXJIb3N0cykge1xuICAgICAgICAgICAgICAgIHJldHVybiAkaHR0cCh7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vZWMyLTUyLTM4LTEwMS04OS51cy13ZXN0LTIuY29tcHV0ZS5hbWF6b25hd3MuY29tL2Jvb2tpbmcnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAneC1hY2Nlc3MtdG9rZW4nOiBhY2Nlc3NUb2tlbixcbiAgICAgICAgICAgICAgICAgICAgICAgICdvdGhlci1ob3N0cyc6IG90aGVySG9zdHNcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbSh7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzZW5nZXI6IHBhc3NlbmdlckRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICBib29raW5nOiBib29raW5nRGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBwcmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGdvaW5nU2VhdE51bWJlcjogb3V0Z29pbmdTZWF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuU2VhdE51bWJlcjogcmV0dXJuU2VhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRva2VuOiBzdHJpcGVUb2tlblxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJGh0dHAoe1xuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwgKyAnL2Jvb2tpbmcnLFxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3gtYWNjZXNzLXRva2VuJzogYWNjZXNzVG9rZW5cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogJC5wYXJhbShib29raW5nRGF0YSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICBnZXRTdHJpcGVUb2tlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaXBlVG9rZW47XG4gICAgICAgIH0sXG4gICAgICAgIHNldFN0cmlwZVRva2VuOiBmdW5jdGlvbih0b2tlbikge1xuICAgICAgICAgICAgc3RyaXBlVG9rZW4gPSB0b2tlbjtcbiAgICAgICAgfVxuICAgIH07XG59KTtcbiIsIiAgQXBwLmNvbmZpZyhmdW5jdGlvbigkdHJhbnNsYXRlUHJvdmlkZXIpIHtcbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIudHJhbnNsYXRpb25zKCdlbicsIHtcbiAgICAgIE1BSU46IHtcbiAgICAgICAgQk9PS19OT1c6ICdCb29rIE5vdycsXG4gICAgICAgIEZST006ICdGcm9tJyxcbiAgICAgICAgRkxZSU5HX0ZST006ICdGbHlpbmcgZnJvbScsXG4gICAgICAgIERFUEFSVFVSRV9EQVRFOiAnRGVwYXJ0dXJlIERhdGUnLFxuICAgICAgICBUTzogJ1RvJyxcbiAgICAgICAgRkxZSU5HX1RPOiAnRmx5aW5nIHRvJyxcbiAgICAgICAgUkVFTlRSWV9EQVRFOiAnUmUtZW50cnkgRGF0ZScsXG4gICAgICAgIFVOREVSXzJfWUVBUlM6ICdVbmRlciAyIHllYXJzJyxcbiAgICAgICAgUk9VTkRfVFJJUDogJ1JvdW5kIFRyaXAnLFxuICAgICAgICBPTkVfV0FZOiAnT25lIFdheScsXG4gICAgICAgIE9USEVSX0FJUkxJTkVTOiAnU2VhcmNoIG90aGVyIGFpcmxpbmVzJyxcbiAgICAgICAgU0VBUkNIX0ZPUl9GTElHSFRTOiAnU2VhcmNoIGZvciBmbGlnaHRzJyxcbiAgICAgICAgWUVBUlM6IFwieWVhcnNcIixcbiAgICAgICAgQ0hJTERSRU46ICdjaGlsZHJlbicsXG4gICAgICAgIENISUxEOiAnY2hpbGQnLFxuICAgICAgICBBRFVMVDogJ2FkdWx0JyxcbiAgICAgICAgQURVTFRTOiAnYWR1bHRzJyxcbiAgICAgICAgSU5GQU5UUzogJ2luZmFudHMnLFxuICAgICAgICBJTkZBTlQ6ICdpbmZhbnQnLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBRVU9URVNfSE9NRToge1xuICAgICAgICAgIE9ORTogXCJTaW1wbGUsIGNvbnZlbmllbnQsIGluc3RhbnQgY29uZmlybWF0aW9uLlwiLFxuICAgICAgICAgIFRXTzogXCJEZXN0aW5hdGlvbnMgYWxsIGFyb3VuZCB0aGUgZ2xvYmUuXCIsXG4gICAgICAgICAgVEhSRUU6IFwiRXhwZXJpZW5jZSBhdXRoZW50aWMgaG9zcGl0YWxpdHkuXCIsXG4gICAgICAgICAgRk9VUjogXCJUaW1lIHRvIGdldCBlbmNoYW50ZWQuXCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIEZMSUdIVFM6IHtcbiAgICAgICAgVElUTEU6ICdDaG9vc2UgYSBGbGlnaHQnLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBTRUFUU19MRUZUOiAnc2VhdHMgbGVmdCcsXG4gICAgICAgIE1PUkVfREVUQUlMUzogJ01vcmUgZGV0YWlscycsXG4gICAgICAgIEJPT0s6ICdCb29rJyxcbiAgICAgICAgU0VMRUNUOidTZWxlY3QnLFxuICAgICAgICBGTElHSFQ6ICdGbGlnaHQnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ09wZXJhdGVkIGJ5J1xuICAgICAgfSxcbiAgICAgIEZMSUdIVDoge1xuICAgICAgICBGTElHSFQ6IFwiRmxpZ2h0XCIsXG4gICAgICAgIEVDT05PTVk6ICdFY29ub215JyxcbiAgICAgICAgQlVTSU5FU1M6ICdCdXNpbmVzcycsXG4gICAgICAgIFRJVExFOiAnRmxpZ2h0IERldGFpbHMnLFxuICAgICAgICBPUEVSQVRFRF9CWTogJ09wZXJhdGVkIGJ5JyxcbiAgICAgICAgTlVNQkVSX09GX1BBU1NFTkdFUlM6ICdOdW1iZXIgb2YgcGFzc2VuZ2VycycsXG4gICAgICAgIEZMWUlOR19DQUxTUzogJ0ZseWluZyBjbGFzcycsXG4gICAgICAgIEZMSUdIVF9GQVJFOiAnRmxpZ2h0IGZhcmUnLFxuICAgICAgICBGTElHSFRfRkFDOiAnRmxpZ2h0IGZhY2lsaXRpZXMnLFxuICAgICAgICBQQVNTRU5HRVI6ICdwYXNzZW5nZXInLFxuICAgICAgICBQQVNTRU5HRVJTOiAncGFzc2VuZ2VycydcbiAgICAgIH0sXG4gICAgICBOQVY6IHtcbiAgICAgICAgR09fSE9NRTonR28gSG9tZScsXG4gICAgICAgIFNVQk1JVDogJ1N1Ym1pdCcsXG4gICAgICAgIE5FWFQ6ICdOZXh0JyxcbiAgICAgICAgQkFDSzogJ0JhY2snLFxuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZWNpYWwgT2ZmZXJzJyxcbiAgICAgICAgU0VSVklDRVM6ICdTZXJ2aWNlcycsXG4gICAgICAgIE9VUl9URUFNOiAnT3VyIFRlYW0nLFxuICAgICAgICBBQk9VVDogJ0Fib3V0JyxcbiAgICAgICAgQ09OVEFDVF9VUzogJ0NvbnRhY3QgVXMnLFxuICAgICAgICBDSE9PU0VfTEFOR1VBR0U6J0Nob29zZSBsYW5ndWFnZScsXG4gICAgICAgIEVOR0xJU0g6ICdFbmdsaXNoJyxcbiAgICAgICAgR0VSTUFOOidHZXJtYW4nXG4gICAgICB9LFxuXG4gICAgICBDT05GSVJNQVRJT046IHtcbiAgICAgICAgVEhBTktfWU9VOiAnVGhhbmsgeW91JyxcbiAgICAgICAgTkFNRTogJ05hbWUnLFxuICAgICAgICBQSE9ORTogJ1Bob25lJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCcsXG4gICAgICAgIEZMSUdIVE5POiAnRmxpZ2h0IG51bWJlcicsXG4gICAgICAgIERFUEFSVFVSRTogJ0RlcGFydHVyZScsXG4gICAgICAgIEFSUkFJVkFMOiAnQXJyaXZhbCcsXG4gICAgICAgIFBSSU5UOiAnUHJpbnQgdGlja2V0J1xuICAgICAgfSxcbiAgICAgIENPTlRBQ1RfVVM6IHtcblxuICAgICAgICBDT05UQUNUX1VTOiAnQ29udGFjdCBVcycsXG4gICAgICAgIFBIT05FOiAnUGhvbmUnLFxuICAgICAgICBNQUlMOiAnRS1tYWlsJyxcbiAgICAgICAgTEVBVkVfTVNHOiAnTGVhdmUgdXMgYSBtZXNzYWdlJyxcbiAgICAgICAgU0VORDogJ1NlbmQnXG4gICAgICB9LFxuICAgICAgZm91cl9vX2Zvcjoge1xuICAgICAgICAvL0RvIHlvdSBtZWFuIDQwNG5vdGZvdW5kIHRlYW0gPyAgaW4gNDA0Lmh0bWxcbiAgICAgICAgUVVFU1RJT046ICdEbyB5b3UgbWVhbiA0MDROb3RGb3VuZCBUZWFtPydcblxuICAgICAgfSxcblxuICAgICAgQUJPVVRfVVM6IHtcblxuICAgICAgICBBQk9VVDogJ0Fib3V0IEFpckJlcmxpbicsXG4gICAgICAgIEhJU1RPUlk6ICdIaXN0b3J5JyxcbiAgICAgICAgSElTVE9SWV9QQVJBOiAnVGhlIGZpcnN0IGFpcmJlcmxpbiBwbGFuZSB0b29rIG9mZiBvbiAyOHRoIEFwcmlsIDE5NzkuIEV4cGVyaWVuY2UgdGhlIGhpZ2hsaWdodHMgYW5kIG1pbGVzdG9uZXMgaW4gYWlyYmVybGlucyBoaXN0b3J5ICcsXG4gICAgICAgIE9VUl9HT0FMOiAnT3VyIGdvYWwnLFxuICAgICAgICBPVVJfR09BTF9QQVJBOiAnRmlyc3QgRXVyb3BlLCBhbmQgdGhlbiB0aGUgZ2xvYmUsIHdpbGwgYmUgbGlua2VkIGJ5IGZsaWdodCwgYW5kIG5hdGlvbnMgc28ga25pdCB0b2dldGhlciB0aGF0IHRoZXkgd2lsbCBncm93IHRvIGJlIG5leHQtZG9vciBuZWlnaGJvcnPigKYgLiBXaGF0IHJhaWx3YXlzIGhhdmUgZG9uZSBmb3IgbmF0aW9ucywgYWlyd2F5cyB3aWxsIGRvIGZvciB0aGUgd29ybGQuJyxcbiAgICAgICAgQV9QOiAnQWxsaWFuY2UvcGFydG5lcnMnLFxuICAgICAgICBBX1BfUEFSQTogJ2FpcmJlcmxpbiBndWFyYW50ZWVzIGEgZGVuc2UgY29ubmVjdGlvbiBuZXR3b3JrIGFuZCBjb25zdGFudCBncm93dGggdGhhbmtzIHRvIHRoZSBjby1vcGVyYXRpb24gd2l0aCBvdGhlciBhaXJsaW5lcy5haXJiZXJsaW4gZ3VhcmFudGVlcyBhIGRlbnNlIGNvbm5lY3Rpb24gbmV0d29yayBhbmQgY29uc3RhbnQgZ3Jvd3RoIHRoYW5rcyB0byB0aGUgY28tb3BlcmF0aW9uIHdpdGggb3RoZXIgYWlybGluZXMuJ1xuICAgICAgfSxcblxuICAgICAgT0ZGRVJTOiB7XG4gICAgICAgIFNQRUNJQUxfT0ZGRVJTOiAnU3BlY2lhbCBPZmZlcnMnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTOiAnRmxpZ2h0IE9mZmVycycsXG4gICAgICAgIEZMSUdIVF9PRkZFUlNfUEFSQTogJ0ZpbmQgdGhlIG1vc3QgYXR0cmFjdGl2ZSBmYXJlIGZvciB5b3VyIGZsaWdodCcsXG4gICAgICAgIExJS0VfRkFDRUJPT0s6ICdMaWtlIHVzIG9uIEZhY2Vib29rJyxcbiAgICAgICAgTElLRV9GQUNFQk9PS19QQVJBOiAnRG9udCBtaXNzIG91ciBzcGVjaWFsIG9mZmVycyBvbjogd2l0aCBvdXIgbmV3c2xldHRlciBhbmQgb24gRmFjZWJvb2snLFxuICAgICAgICBIT1RFTDogJ0hvdGVsJyxcbiAgICAgICAgSE9URUxfUEFSQTogJ1NwZWNpYWwgb2ZmZXJzIGZvciB5b3VyIGhvdGVsIHN0YXkgYXdheSBmcm9tIG91ciBwYXJ0bmVycyAuJ1xuICAgICAgfSxcblxuXG4gICAgICBQQVNTX0RFVEFJTFM6IHtcbiAgICAgICAgRklSU1RfTkFNRTogJ0ZpcnN0IE5hbWUnLFxuICAgICAgICBNSURETEVfTkFNRTogJ01pZGRsZSBOYW1lJyxcbiAgICAgICAgTEFTVF9OQU1FOiAnTGFzdCBOYW1lJyxcbiAgICAgICAgUEFTU19OTzogJ1Bhc3Nwb3J0IE51bWJlcicsXG4gICAgICAgIFBMQUNFX09GQklSVEg6ICdQbGFjZSBPZiBCaXJ0aCcsXG4gICAgICAgIFBIT05FX05POiAnUGhvbmUgTnVtYmVyJyxcbiAgICAgICAgRV9NQUlMOiAnRW1haWwnLFxuICAgICAgICBSRVBFQVRfRV9NQUlMOiAnUmVwZWF0IEVtYWlsJyxcbiAgICAgICAgVkVSSUZZX1BBUkE6ICdJIHZlcmlmeSB0aGUgaW5mb3JtYXRpb24gcHJvdmlkZWQgbWF0Y2hlcyB0aGUgcGFzc3BvcnQgaW5mb3JtYXRpb24uJ1xuXG4gICAgICB9LFxuICAgICAgUEFZTUVOVDoge1xuXG4gICAgICAgIFdFX0FDQ0VQVDogJ1dlIGFjY2VwdCcsXG4gICAgICAgIENBUkRfSU5GTzogJ0NhcmQgaW5mb3JtYXRpb246JyxcbiAgICAgICAgRVhQX0RBVEU6ICdFeHBpcmUgRGF0ZTonLFxuICAgICAgICBDT1NUOiAnWW91ciBib29raW5nIHRvdGFsIGNvc3QnXG5cbiAgICAgIH0sXG5cbiAgICAgIFNFQVRJTkc6IHtcblxuICAgICAgICBTRUFUX01BUDogJ1NlYXRtYXAnLFxuICAgICAgICBTRUxFQ1RFRDogJ1lvdSBzZWxlY3RlZCBzZWF0J1xuXG4gICAgICB9LFxuXG4gICAgICBTRVJWSUNFUzoge1xuXG4gICAgICAgIFNFUlZJQ0U6ICdTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1NFUlZJQ0VTOiAnSW5mbGlnaHQgU2VydmljZXMnLFxuICAgICAgICBJTkZMSUdIVF9QQVJBOiAnICBBaXJiZXJsaW4gcHJlc2VudHMgdGhlIGVjb25vbXkgYW5kIGJ1c2luZXNzIGNsYXNzLicsXG4gICAgICAgIEdfTUVBTFM6ICdHb3VybWV0IE1lYWxzJyxcbiAgICAgICAgR19NRUFMU19QQVJBOiAnQWlyYmVybGluIGlzIHRoZSByaWdodCBhaXJsaW5lIGZvciBjb25ub2lzc2V1cnM6IHRyZWF0IHlvdXJzZWxmIHRvIG9uZSBvZiB0aGUgZGVsaWNpb3VzIGdvdXJtZXQgbWVhbHMgZnJvbSBcIlNhbnNpYmFyXCIgb24gYm9hcmQnLFxuICAgICAgICBCQUdHQUdFOiAnQmFnZ2FnZScsXG4gICAgICAgIEJBR0dBR0VfUEFSQTogJ0V2ZXJ5dGhpbmcgeW91IG5lZWQgdG8ga25vdyBhYm91dCBmcmVlIGJhZ2dhZ2UgYWxsb3dhbmNlcywgY2FiaW4gYmFnZ2FnZSByZWd1bGF0aW9ucyBhbmQgc3BlY2lhbCBiYWdnYWdlLidcblxuICAgICAgfSxcblxuICAgIH0pO1xuICAgICR0cmFuc2xhdGVQcm92aWRlci50cmFuc2xhdGlvbnMoJ2RlJywge1xuICAgICAgTUFJTjoge1xuICAgICAgICBCT09LX05PVzogJ0pldHp0IGJ1Y2hlbicsXG4gICAgICAgIEZST006ICd2b24nLFxuICAgICAgICBGTFlJTkdfRlJPTTogJ0FiZmx1Z2hhZmVuJyxcbiAgICAgICAgREVQQVJUVVJFX0RBVEU6ICdIaW5mbHVnJyxcbiAgICAgICAgVE86ICduYWNoJyxcbiAgICAgICAgRkxZSU5HX1RPOiAnWmllbGZsdWdoYWZlbicsXG4gICAgICAgIFJFRU5UUllfREFURTogJ1LDvGNrZmx1ZycsXG4gICAgICAgIFVOREVSXzJfWUVBUlM6ICdKw7xuZ2VyIGFscyAyIEphaHJlbicsXG4gICAgICAgIFJPVU5EX1RSSVA6ICdIaW4tL1LDvGNrZmFocnQnLFxuICAgICAgICBPTkVfV0FZOiAnTnVyIEhpbmZsdWcnLFxuICAgICAgICBPVEhFUl9BSVJMSU5FUzogJ0FuZGVyZSBGbHVnZ2VzZWxsc2NoYWZ0ZW4nLFxuICAgICAgICBTRUFSQ0hfRk9SX0ZMSUdIVFM6ICdGbMO8Z2Ugc3VjaGVuJyxcbiAgICAgICAgWUVBUlM6IFwiSmFocmVcIixcbiAgICAgICAgQ0hJTERSRU46ICdLaW5kZXInLFxuICAgICAgICBDSElMRDogJ0tpbmQnLFxuICAgICAgICBBRFVMVDogJ0Vyd2FjaHNlbmVyJyxcbiAgICAgICAgQURVTFRTOiAnRXJ3YWNoc2VuZW4nLFxuICAgICAgICBJTkZBTlRTOiAnQmFieXMnLFxuICAgICAgICBJTkZBTlQ6ICdCYWJ5JyxcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgUVVPVEVTX0hPTUU6IHtcbiAgICAgICAgICBPTkU6IFwiRWluZmFjaCwgYmVxdWVtLCBzb2ZvcnRpZ2UgQmVzdMOkdGlndW5nLlwiLFxuICAgICAgICAgIFRXTzogXCJaaWVsZW4gYXVmIGRlciBXZWx0LlwiLFxuICAgICAgICAgIFRIUkVFOiBcIkF1dGhlbnRpc2NoZSBHYXN0ZnJldW5kc2NoYWZ0IGVybGViZW4uXCIsXG4gICAgICAgICAgRk9VUjogXCJWZXJ3dW5zY2hlbmUgWmVpdCBtaXQgdW5zLlwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBGTElHSFRTOiB7XG4gICAgICAgIFRJVExFOiAnRWluZW4gRmx1ZyBhdXNzdWNoZW4nLFxuICAgICAgICBFQ09OT01ZOiAnRWNvbm9teScsXG4gICAgICAgIEJVU0lORVNTOiAnQnVzaW5lc3MnLFxuICAgICAgICBTRUFUU19MRUZUOiAnZnJlaWUgU2l0enBsw6R0emUnLFxuICAgICAgICBNT1JFX0RFVEFJTFM6ICdNZWhyIERldGFpbHMnLFxuICAgICAgICBCT09LOiAnYnVjaGVuJyxcbiAgICAgICAgU0VMRUNUOidXw6RobGVuJyxcbiAgICAgICAgRkxJR0hUOiAnRmx1ZycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnYmV0cmllYmVuIHZvbidcbiAgICAgIH0sXG4gICAgICBGTElHSFQ6IHtcbiAgICAgICAgRkxJR0hUOiBcIkZsdWdcIixcbiAgICAgICAgRUNPTk9NWTogJ0Vjb25vbXknLFxuICAgICAgICBCVVNJTkVTUzogJ0J1c2luZXNzJyxcbiAgICAgICAgVElUTEU6ICdEZXRhaWxzIGRlcyBGbHVncycsXG4gICAgICAgIE9QRVJBVEVEX0JZOiAnYmV0cmllYmVuIHZvbicsXG4gICAgICAgIE5VTUJFUl9PRl9QQVNTRU5HRVJTOiAnQW56YWhsIGRlciBQYXNzYWdpZXJlJyxcbiAgICAgICAgRkxZSU5HX0NBTFNTOiAnQmVmw7ZyZGVydW5nc2tsYXNzZW4nLFxuICAgICAgICBGTElHSFRfRkFSRTogJ0ZsdWdwcmVpcycsXG4gICAgICAgIEZMSUdIVF9GQUM6ICdEaWVuc3RsZWlzdHVuZ2VuIGRlcyBGbHVncycsXG4gICAgICAgIFBBU1NFTkdFUjogJ1Bhc3NhZ2llcicsXG4gICAgICAgIFBBU1NFTkdFUlM6ICdQYXNzYWdpZXJlJ1xuICAgICAgfSxcbiAgICAgIE5BVjoge1xuICAgICAgICBHT19IT01FOidoZWltZ2VoZW4nLFxuICAgICAgICBTVUJNSVQ6ICdlaW5yZWljaGVuJyxcbiAgICAgICAgTkVYVDogJ3dlaXRlcicsXG4gICAgICAgIEJBQ0s6ICd6dXLDvGNrJyxcbiAgICAgICAgU1BFQ0lBTF9PRkZFUlM6ICdTcGV6aWVsbGUgQW5nZWJvdGUnLFxuICAgICAgICBTRVJWSUNFUzogJ0RpZW5zdGxlaXN0dW5nZW4nLFxuICAgICAgICBPVVJfVEVBTTogJ1Vuc2VyIFRlYW0nLFxuICAgICAgICBBQk9VVDogJ8OcYmVyIHVucycsXG4gICAgICAgIENPTlRBQ1RfVVM6ICdVbnNlciBLb250YWt0JyxcbiAgICAgICAgQ0hPT1NFX0xBTkdVQUdFOidXw6RobGUgZWluZSBTcHJhY2hlJyxcbiAgICAgICAgRU5HTElTSDogJ0VuZ2xpc2NoJyxcbiAgICAgICAgR0VSTUFOOidEZXV0c2NoJ1xuICAgICAgfSxcbiAgICAgIENPTkZJUk1BVElPTjoge1xuXG4gICAgICAgIFRIQU5LX1lPVTogJ0RhbmtlIHNjaMO2bicsXG4gICAgICAgIE5BTUU6ICdOYW1lJyxcbiAgICAgICAgUEhPTkU6ICdUZWxlZm9uJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgRkxJR0hUTk86ICdGbHVnIE51bW1lcicsXG4gICAgICAgIERFUEFSVFVSRTogJ0FiZmFocnQnLFxuICAgICAgICBBUlJBSVZBTDogJ0Fua3VuZnQnLFxuICAgICAgICBQUklOVDogJ0ZsdWdrYXJ0ZSBhYmRydWNrZW4nXG4gICAgICB9LFxuICAgICAgQ09OVEFDVF9VUzoge1xuXG4gICAgICAgIENPTlRBQ1RfVVM6ICdVbnNlciBLb250YWt0JyxcbiAgICAgICAgUEhPTkU6ICdUZWxlZm9uJyxcbiAgICAgICAgTUFJTDogJ0UtbWFpbCBhZHJlc3NlJyxcbiAgICAgICAgTEVBVkVfTVNHOiAnSWhyIEFubGllZ2VuJyxcbiAgICAgICAgU0VORDogJ2Fic2NoaWNrZW4nXG4gICAgICB9LFxuICAgICAgZm91cl9vX2Zvcjoge1xuICAgICAgICAvL0RvIHlvdSBtZWFuIDQwNG5vdGZvdW5kIHRlYW0gPyAgaW4gNDA0Lmh0bWxcbiAgICAgICAgUVVFU1RJT046ICdNZWludGVuIFNpZSBkaWUgR3J1cHBlIHZvbiA0MDROb3RGb3VuZCA/J1xuXG4gICAgICB9LFxuICAgICAgQUJPVVRfVVM6IHtcblxuICAgICAgICBBQk9VVDogJ8OcYmVyIEFpckJlcmxpbicsXG4gICAgICAgIEhJU1RPUlk6ICdHZXNjaGljaHRlJyxcbiAgICAgICAgSElTVE9SWV9QQVJBOiAnQW0gMjguIEFwcmlsIDE5Nzkgc3RhcnRldCBlaW5lIEJvZWluZyA3MDcgdm9uIEJlcmxpbi1UZWdlbCBuYWNoIFBhbG1hIGRlIE1hbGxvcmNhLiBEZXIgRXJzdGZsdWcgaXN0IGRlciBBbmZhbmcgZGVyIEVyZm9sZ3NnZXNjaGljaHRlIHZvbiBhaXJiZXJsaW4uICcsXG4gICAgICAgIE9VUl9HT0FMOiAnVW5zZXIgWmllbCcsXG4gICAgICAgIE9VUl9HT0FMX1BBUkE6ICdadWVydCBFdXJvcGEsIHp1bsOkY2hzdCBkaWUgZ2FuemUgV2VsdCwgd2VyZGVuIGR1cmNoIGRlbiBGbHVnIHp1c2FtbWVuIHZlcmJ1bmRlbiwgdW5kIE5hdGlvbmVuIGVuZyB6dXNhbW1lbiBkYW1pdCBzaWUgTmFjaGJhcm4gYXVmd2FjaHNlbuKApiAuIFdhcyBkaWUgRWlzYmFobmVuIGbDvHIgZGllIE5hdGlvbmVuIGdldGFuIGhhdCwgd2lyZCBkaWUgRmzDvGdlIGbDvHIgZGFzIGdhbnplIFdlbHQgdHVuLicsXG4gICAgICAgIEFfUDogJ0FsbGlhbmNlL3BhcnRuZXJzJyxcbiAgICAgICAgQV9QX1BBUkE6ICdhaXJiZXJsaW4gZXJ3ZWl0ZXJ0IGlociBpbnRlcm5hdGlvbmFsZXMgU3RyZWNrZW5uZXR6LCBpbmRlbSBzaWUgbWl0IG1laHJlcmVuIEFpcmxpbmVzIGFscyBDb2Rlc2hhcmUtUGFydG5lcm4ga29vcGVyaWVydC4nXG5cblxuICAgICAgfSxcbiAgICAgIE9GRkVSUzoge1xuICAgICAgICBTUEVDSUFMX09GRkVSUzogJ1NwZXppZWxsZSBBbmdlYm90ZScsXG4gICAgICAgIEZMSUdIVF9PRkZFUlM6ICdGbHVnYW5nZWJvdGUnLFxuICAgICAgICBGTElHSFRfT0ZGRVJTX1BBUkE6ICdGaW5kZW4gU2llIGRpZSBhdHRyYWt0aXZzdGVuIFRhcmlmZSBmw7xyIElocmVuIEZsdWcnLFxuICAgICAgICBMSUtFX0ZBQ0VCT09LOiAnRm9sZ2VuIFNpZSB1bnMgYXVmIEZhY2Vib29rJyxcbiAgICAgICAgTElLRV9GQUNFQk9PS19QQVJBOiAnVmVybWlzc2VuIFNpZSBuaWNodCB1bnNlcmUgc3BlemllbGxlIEFuZ2Vib3RlOiBtaXQgdW5zZXIgbmV3c2xldHRlciB1bmQgYXVmIEZhY2Vib29rJyxcbiAgICAgICAgSE9URUw6ICdIb3RlbCcsXG4gICAgICAgIEhPVEVMX1BBUkE6ICdTb25kZXJhbmdlYm90ZSBmw7xyIElociBIb3RlbCB3ZWcgdm9uIHVuc2VyZSBQYXJ0bmVybiAuJ1xuXG4gICAgICB9LFxuXG4gICAgICBQQVNTX0RFVEFJTFM6IHtcblxuICAgICAgICBGSVJTVF9OQU1FOiAnVm9ybmFtZScsXG4gICAgICAgIE1JRERMRV9OQU1FOiAnWndlaXRuYW1lJyxcbiAgICAgICAgTEFTVF9OQU1FOiAnTmFjaG5hbWUnLFxuICAgICAgICBQQVNTX05POiAnUmVpc2VwYXNzIE51bW1lcicsXG4gICAgICAgIFBMQUNFX09GQklSVEg6ICdPcnQgZGVzIEdlYnVydHMnLFxuICAgICAgICBQSE9ORV9OTzogJ1RlbGVmb24gTnVtbWVyJyxcbiAgICAgICAgRV9NQUlMOiAnRS1tYWlsIGFkcmVzc2UnLFxuICAgICAgICBSRVBFQVRfRV9NQUlMOiAnRS1tYWlsIHdpZWRlcmhvbGVuJyxcbiAgICAgICAgVkVSSUZZX1BBUkE6ICdIaWVybWl0LCBiZXN0w6R0aWdlIGljaCwgZGFzcyBkaWUgSW5mb3JtYXRpb25lbiwgZGllIHZvcmhpbiBnZWdlYmVuIHNpbmQsIG1laW5lIFBhc3NkYXRlbiBlbnRzcHJpY2hlbi4nXG5cbiAgICAgIH0sXG4gICAgICBQQVlNRU5UOiB7XG5cbiAgICAgICAgV0VfQUNDRVBUOiAnWmFobHVuZ3NtZXRob2RlbicsXG4gICAgICAgIENBUkRfSU5GTzogJ0tyZWRpdGthcnRlIGluZm9ybWF0aW9uZW46JyxcbiAgICAgICAgRVhQX0RBVEU6ICdBYmxhdWZkYXR1bSBJaHJlciBLYXJ0ZTonLFxuICAgICAgICBDT1NUOiAnR2VzYW10cHJlaXMnXG5cbiAgICAgIH0sXG4gICAgICBTRUFUSU5HOiB7XG5cbiAgICAgICAgU0VBVF9NQVA6ICdTaXR6cGxhdHpyZXNlcnZpZXJ1bmcnLFxuICAgICAgICBTRUxFQ1RFRDogJ1NpZSBoYWJlbiBlaW5lbiBTaXR6cGxhdHogcmVzZXJ2aWVydC4nXG5cbiAgICAgIH0sXG4gICAgICBTRVJWSUNFUzoge1xuXG4gICAgICAgIFNFUlZJQ0U6ICdTZXJ2aWNlcycsXG4gICAgICAgIElORkxJR0hUX1NFUlZJQ0VTOiAnU2VydmljZXMgYW4gYm9hcmQnLFxuICAgICAgICBJTkZMSUdIVF9QQVJBOiAnICBBaXJiZXJsaW4gaGVpw59lbiBTaWUgaGVyemxpY2ggd2lsbGtvbW1lbiBhbiBCb3JkOiBlY29ub215IHVuZCBidXNpbmVzcyBjbGFzcy4nLFxuICAgICAgICBHX01FQUxTOiAnR291cm1ldGVzc2VuJyxcbiAgICAgICAgR19NRUFMU19QQVJBOiAnRnJldWVuIFNpZSBzaWNoIGF1ZiBBaXJiZXJsaW5zIGEgbGEgY2FydGUtU3BlaXNlIDogV2lyIHNlcnZpZXJlbiBJaG5lbiB1bnNlcmUgd2FybWVuIE9uLVRvcC1TcGVpc2VuLCBkaWUgZXh0cmEgdm9tIFNhbnNpYmFyLVdpcnQgSGVyYmVydCBTZWNrbGVyIGtyZWllcnQgd3VyZGVuLicsXG4gICAgICAgIEJBR0dBR0U6ICdSZWlzZWdlcMOkY2snLFxuICAgICAgICBCQUdHQUdFX1BBUkE6ICdVbnNlcmUgUmVnbHVuZ2VuIMO8YmVyIEF1Znp1Z2ViZW5kZXMgR2Vww6Rja21lbmdlbiwgw7xiZXIgSGFuZGdlcMOkY2sgdW5kIFNvbmRlcmdlcMOkY2suJ1xuXG4gICAgICB9LFxuXG4gICAgfSk7XG5cbiAgICAkdHJhbnNsYXRlUHJvdmlkZXIucHJlZmVycmVkTGFuZ3VhZ2UoJ2RlJyk7XG4gICAgJHRyYW5zbGF0ZVByb3ZpZGVyLnVzZVNhbml0aXplVmFsdWVTdHJhdGVneSgnZXNjYXBlJyk7XG5cbiAgfSk7XG4iLCIvLyBAYWJkZWxyaG1hbi1lc3NhbVxudmFyIGNvbmZpcm1hdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbixhcGksICRyb3V0ZVBhcmFtcykge1xuICAgICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLWNvbmZpcm1hdGlvbic7XG4gICRzY29wZS50aXRsZSA9IFwiQ29uZmlybWF0aW9uXCI7XG5cbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIkdvIEhvbWVcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gIGlmKFR5cGUgPT0gJ2Rlc2t0b3AnKXtcbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBhcGkuc3VibWl0Qm9va2luZygnZmFsc2UnKS50aGVuKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgLy8gICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgIC8vICAgYWxlcnQoZGF0YS5kYXRhKVxuICAgICAgLy8gICBhcGkuY2xlYXJMb2NhbCgpO1xuICAgICAgLy8gfSxmdW5jdGlvbihlcnIpe1xuICAgICAgLy9cbiAgICAgIC8vIH0pXG4gICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnL3BheW1lbnQnKTtcbiAgICB9XG5cbiAgICBpZighYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpe1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXNzZW5nZXItZGV0YWlscycpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgICRzY29wZS5nb1NvY2lhbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvc29jaWFsJyk7XG5cbiAgICB9XG5cbiAgICAkKCcjcXVvdGVzLXRleHQnKS50eXBlSXQoe1xuICAgICAgc3RyaW5nczogW1xuICAgICAgICAnXCJUcmF2ZWwgYW5kIGNoYW5nZSBvZiBwbGFjZSBpbXBhcnQgbmV3IHZpZ29yIHRvIHRoZSBtaW5kLlwiLVNlbmVjYScsXG4gICAgICAgICAn4oCcVHJhdmVsaW5nIHRlbmRzIHRvIG1hZ25pZnkgYWxsIGh1bWFuIGVtb3Rpb25zLuKAnSDigJQgUGV0ZXIgSG9lZycsXG4gICAgICAgICAn4oCcVHJhdmVsaW5nIOKAkyBpdCBsZWF2ZXMgeW91IHNwZWVjaGxlc3MsIHRoZW4gdHVybnMgeW91IGludG8gYSBzdG9yeXRlbGxlci7igJ0gLSBJYm4gQmF0dHV0YScsXG4gICAgICAgICcg4oCcV2UgdHJhdmVsLCBzb21lIG9mIHVzIGZvcmV2ZXIsIHRvIHNlZWsgb3RoZXIgcGxhY2VzLCBvdGhlciBsaXZlcywgb3RoZXIgc291bHMu4oCdIOKAkyBBbmFpcyBOaW4nXG4gICAgICBdLFxuICAgICAgc3BlZWQ6IDgwLFxuICAgICAgYnJlYWtMaW5lczogZmFsc2UsXG4gICAgICBsb29wOiB0cnVlXG4gICAgfSk7XG5cbiAgfWVsc2V7XG5cbiAgfVxuICAkc2NvcGUuZmxpZ2h0ID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCk7XG5cblxuICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuXG4gICRzY29wZS5ib29raW5nID0gJHJvdXRlUGFyYW1zLmJvb2tpbmc7XG4gICRzY29wZS5ub3RPdGhlckhvc3RzID0gIWFwaS5Jc090aGVySG9zdHMoKTtcblxuICAkc2NvcGUucGFzc2VuZ2VyID0gYXBpLmdldFBhc3NlbmdlcigpWzBdO1xuXG5cbn1cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gIGNvbmZpcm1hdGlvbkNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRzdGF0ZScsICdhcGknLCAnJHN0YXRlUGFyYW1zJ107XG59IGVsc2Uge1xuICBjb25maXJtYXRpb25Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnYXBpJywgJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5BcHAuY29udHJvbGxlcignY29uZmlybWF0aW9uQ3RybCcsIGNvbmZpcm1hdGlvbkNvbnRyb2xsZXIpO1xuIiwiLy8gQE5hYmlsYVxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodERldGFpbHNDdHJsJywgZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSkge1xuICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtZmxpZ2h0JztcbiAgJHNjb3BlLnRpdGxlID0gXCJGbGlnaHQocykgRGV0YWlsc1wiO1xuICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cblxuXG4gIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICRzY29wZS5nb05leHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICB9XG4gICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgfVxuXG4gICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG4gIHZhciBvdXRnb2luZ0ZsaWdodCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpO1xuICB2YXIgcmV0dXJuRmxpZ2h0ID0gYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpO1xuXG4gIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcblxuICB2YXIgZmFjaWxpdGllcyA9IFtcIlNtb2tpbmcgYXJlYXMgYXZhaWxhYmxlXCIsIFwiV2ktRmkgYXZhaWxhYmlsaXR5XCIsXG4gICAgXCI0IGN1bHR1cmFsIGN1aXNpbmVzXCIsIFwiSW5mbGlnaHQgZW50ZXJ0YWlubWVudFwiLCBcIkV4dHJhIGNvenkgc2xlZXBlcmV0dGVcIixcbiAgICBcIlNjcmVlbnMgdG8gc2hvdyB5b3VyIGZsaWdodCBwYXR0ZXJuLCBhaXJjcmFmdCBhbHRpdHVkZSBhbmQgc3BlZWRcIlxuICBdO1xuaWYgKG91dGdvaW5nRmxpZ2h0KXtcbiAgdmFyIGRlcGFydHVyZURhdGUgPSBuZXcgRGF0ZShvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5kZXBhcnR1cmVVVEMgPSBkZXBhcnR1cmVEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIHZhciBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKG91dGdvaW5nRmxpZ2h0LmFycml2YWxVVEMpO1xuICBvdXRnb2luZ0ZsaWdodC5hcnJpdmFsVVRDID0gYXJyaXZhbERhdGUudG9VVENTdHJpbmcoKTtcblxuXG4gIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICBkZXBhcnR1cmVEYXRlID0gbmV3IERhdGUocmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyk7XG4gICAgcmV0dXJuRmxpZ2h0LmRlcGFydHVyZVVUQyA9IGRlcGFydHVyZURhdGUudG9VVENTdHJpbmcoKTtcbiAgICBhcnJpdmFsRGF0ZSA9IG5ldyBEYXRlKHJldHVybkZsaWdodC5hcnJpdmFsVVRDKTtcbiAgICByZXR1cm5GbGlnaHQuYXJyaXZhbFVUQyA9IGFycml2YWxEYXRlLnRvVVRDU3RyaW5nKCk7XG4gIH1cbiAgdmFyIGFpcmNyYWZ0cyA9IFtdO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNTbW9raW5nO1xuICB2YXIgb3V0QWlyY3JhZnRoYXNXaWZpO1xuICB2YXIgcmVBaXJjcmFmdGhhc1Ntb2tpbmc7XG4gIHZhciByZUFpcmNyYWZ0aGFzV2lmaSA7XG4gIGFwaS5nZXRBaXJjcmFmdHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzKHJlc3BvbnNlKSB7XG4gICAgYWlyY3JhZnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcmNyYWZ0cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSBvdXRnb2luZ0ZsaWdodC5yZWZBaXJjcmFmdFRhaWxOdW1iZXIpIHtcbiAgICAgICAgb3V0QWlyY3JhZnRoYXNTbW9raW5nID0gYWlyY3JhZnRzW2ldLmhhc1Ntb2tpbmc7XG4gICAgICAgIG91dEFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAkc2NvcGUub3V0QWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tpXS5tb2RlbDtcbiAgICAgIH1cbiAgICAgIGlmIChyZXR1cm5GbGlnaHQpIHtcbiAgICAgICAgaWYgKGFpcmNyYWZ0c1tpXS50YWlsTnVtYmVyID09PSByZXR1cm5GbGlnaHQucmVmQWlyY3JhZnRUYWlsTnVtYmVyKSB7XG4gICAgICAgICAgcmVBaXJjcmFmdGhhc1Ntb2tpbmcgPSBhaXJjcmFmdHNbaV0uaGFzU21va2luZztcbiAgICAgICAgICByZUFpcmNyYWZ0aGFzV2lmaSA9IGFpcmNyYWZ0c1tpXS5oYXNXaWZpO1xuICAgICAgICAgICRzY29wZS5yZUFpcmNyYWZ0TW9kZWwgPSBhaXJjcmFmdHNbaV0ubW9kZWw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgIH1cbiAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICB9KTtcblxuICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWU7XG4gICRzY29wZS5vdXRSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICB2YXIgYWlycG9ydHMgPSBbXTtcbiAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgIGFpcnBvcnRzID0gcmVzcG9uc2UuZGF0YTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gb3V0Z29pbmdGbGlnaHQucmVmT3JpZ2luQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tpXS5uYW1lO1xuICAgICAgfVxuICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IG91dGdvaW5nRmxpZ2h0LnJlZkRlc3RpbmF0aW9uQWlycG9ydCkge1xuICAgICAgICAkc2NvcGUub3V0UmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICB9XG4gICAgICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgICAgICRzY29wZS5yZVJlZk9yaWdpbkFpcnBvcnROYW1lO1xuICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lO1xuICAgICAgICBpZiAoYWlycG9ydHNbaV0uaWF0YSA9PT0gcmV0dXJuRmxpZ2h0LnJlZk9yaWdpbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2ldLm5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFpcnBvcnRzW2ldLmlhdGEgPT09IHJldHVybkZsaWdodC5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpIHtcbiAgICAgICAgICAkc2NvcGUucmVSZWZEZXN0aW5hdGlvbkFpcnBvcnROYW1lID0gYWlycG9ydHNbaV0ubmFtZTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gIH0pO1xuICB2YXIgb3V0YnVzaW5lc3NPckVjb24gPSBcIlwiO1xuICB2YXIgb3V0ZmFyZSA9IDA7XG5cbiAgaWYgKGJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgb3V0ZmFyZSA9IG91dGdvaW5nRmxpZ2h0LmVjb25vbXlGYXJlO1xuICB9IGVsc2Uge1xuICAgIG91dGJ1c2luZXNzT3JFY29uID0gXCJCdXNpbmVzc1wiO1xuICAgIG91dGZhcmUgPSBvdXRnb2luZ0ZsaWdodC5idXNpbmVzc0ZhcmU7XG4gIH1cbiAgaWYgKHJldHVybkZsaWdodCkge1xuICAgIHZhciByZWJ1c2luZXNzT3JFY29uID0gXCJcIjtcbiAgICB2YXIgcmVmYXJlID0gMDtcbiAgICBpZiAoYm9va2luZy5yZUVudHJ5SXNFY29ub215KSB7XG4gICAgICByZWJ1c2luZXNzT3JFY29uID0gXCJFY29ub215XCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuZWNvbm9teUZhcmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlYnVzaW5lc3NPckVjb24gPSBcIkJ1c2luZXNzXCI7XG4gICAgICByZWZhcmUgPSByZXR1cm5GbGlnaHQuYnVzaW5lc3NGYXJlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBvdXRmYWNpbGl0aWVzUmVzdWx0ID0gW107XG4gIGlmIChvdXRBaXJjcmFmdGhhc1Ntb2tpbmcpXG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICBpZiAob3V0QWlyY3JhZnRoYXNXaWZpKVxuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzFdKTtcblxuICBpZiAoIWJvb2tpbmcuZXhpdElzRWNvbm9teSkge1xuICAgIG91dGZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzJdKTtcbiAgICBvdXRmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1szXSk7XG4gICAgb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICB9XG4gb3V0ZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNV0pO1xuICBpZiAocmV0dXJuRmxpZ2h0KSB7XG4gICAgdmFyIHJlZmFjaWxpdGllc1Jlc3VsdCA9IFtdO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzU21va2luZylcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMF0pO1xuICAgIGlmIChyZUFpcmNyYWZ0aGFzV2lmaSlcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbMV0pO1xuXG4gICAgaWYgKCFib29raW5nLnJlRW50cnlJc0Vjb25vbXkpIHtcblxuICAgICAgcmVmYWNpbGl0aWVzUmVzdWx0LnB1c2goZmFjaWxpdGllc1syXSk7XG4gICAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzNdKTtcbiAgICAgIHJlZmFjaWxpdGllc1Jlc3VsdC5wdXNoKGZhY2lsaXRpZXNbNF0pO1xuICAgIH1cbiAgICByZWZhY2lsaXRpZXNSZXN1bHQucHVzaChmYWNpbGl0aWVzWzVdKTtcblxuICAgICRzY29wZS5yZXR1cm5GbGlnaHQgPSByZXR1cm5GbGlnaHQ7XG4gICAgJHNjb3BlLnJlYnVzaW5lc3NPckVjb24gPSByZWJ1c2luZXNzT3JFY29uO1xuICAgICRzY29wZS5yZWZhcmUgPSByZWZhcmU7XG4gICAgJHNjb3BlLnJlZmFjaWxpdGllc1Jlc3VsdCA9IHJlZmFjaWxpdGllc1Jlc3VsdDtcbiAgfVxuICAkc2NvcGUub3V0Z29pbmdGbGlnaHQgPSBvdXRnb2luZ0ZsaWdodDtcbiAgJHNjb3BlLm91dGJ1c2luZXNzT3JFY29uID0gb3V0YnVzaW5lc3NPckVjb247XG4gICRzY29wZS5vdXRmYXJlID0gb3V0ZmFyZTtcbiAgJHNjb3BlLm91dGZhY2lsaXRpZXNSZXN1bHQgPSBvdXRmYWNpbGl0aWVzUmVzdWx0O1xuXG59XG59KTtcbiIsIi8vIEBhYmRlbHJhaG1hbi1tYWdlZFxudmFyIGZsaWdodENvbnRyb2xsZXIgPSBmdW5jdGlvbigkc2NvcGUsICRsb2NhdGlvbiwgYXBpLCAkcm91dGVQYXJhbXMpIHtcblxuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIkNob29zZSBhIEZsaWdodFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgYXBpLnNldElzT3RoZXJIb3N0cyhmYWxzZSk7XG5cbiAgICB2YXIgb3JpZ2luID0gJHJvdXRlUGFyYW1zLm9yaWdpbjtcbiAgICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gICAgdmFyIGV4aXREYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLmV4aXREYXRlICogMTAwMCk7XG5cbiAgICAkc2NvcGUub3JpZ2luID0gb3JpZ2luO1xuICAgICRzY29wZS5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICRzY29wZS5leGl0RGF0ZSA9IGV4aXREYXRlO1xuXG4gICAgJHNjb3BlLnJvdW5kVHJpcCA9IGZhbHNlO1xuXG4gICAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgICAgIHZhciByZXR1cm5EYXRlID0gbmV3IERhdGUoJHJvdXRlUGFyYW1zLnJldHVybkRhdGUgKiAxMDAwKTtcbiAgICAgICAgJHNjb3BlLnJldHVybkRhdGUgPSByZXR1cm5EYXRlO1xuICAgICAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nID0ge1xuICAgICAgICBcInJlZlBhc3NlbmdlcklEXCI6IFtdLFxuICAgICAgICBcImlzc3VlRGF0ZVwiOiBudWxsLFxuICAgICAgICBcImlzT25lV2F5XCI6ICEkc2NvcGUucm91bmRUcmlwLFxuICAgICAgICBcInJlZkV4aXRGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgICBcInJlZlJlRW50cnlGbGlnaHRJRFwiOiBudWxsLFxuICAgICAgICBcInJlY2VpcHROdW1iZXJcIjogbnVsbFxuICAgIH07XG5cbiAgICB2YXIgZmxpZ2h0cztcbiAgICB2YXIgcmV0dXJuRGF0ZU1pbGw7XG5cbiAgICBpZiAocmV0dXJuRGF0ZSlcbiAgICAgICAgcmV0dXJuRGF0ZU1pbGwgPSByZXR1cm5EYXRlLmdldFRpbWUoKTtcblxuICAgICRzY29wZS5zZWxlY3RPdXRnb2luZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG4gICAgICAgICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRPdXRnb2luZ0ZsaWdodCA9IGZsaWdodDtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5leGl0SXNFY29ub215ID0gaXNFY29ub215O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZkV4aXRGbGlnaHRJRCA9IGZsaWdodC5faWQ7XG4gICAgfVxuXG4gICAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCwgaXNFY29ub215KSB7XG4gICAgICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkUmV0dXJuaW5nRmxpZ2h0ID0gZmxpZ2h0O1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlRW50cnlJc0Vjb25vbXkgPSBpc0Vjb25vbXk7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmUmVFbnRyeUZsaWdodElEID0gZmxpZ2h0Ll9pZDtcbiAgICB9XG5cbiAgICAkc2NvcGUuY29uc3RydWN0RGF0ZSA9IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgdmFyIGRhdGVPdXQgPSBuZXcgRGF0ZShkYXRlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBEYXRlKGRhdGVPdXQuZ2V0VVRDRnVsbFllYXIoKSwgZGF0ZU91dC5nZXRVVENNb250aCgpLCBkYXRlT3V0LmdldFVUQ0RhdGUoKSwgZGF0ZU91dC5nZXRVVENIb3VycygpLCBkYXRlT3V0LmdldFVUQ01pbnV0ZXMoKSwgZGF0ZU91dC5nZXRVVENTZWNvbmRzKCkpO1xuICAgIH07XG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICAgICAgYXBpLnNldFJldHVybmluZ0ZsaWdodCgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpO1xuXG4gICAgICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcucmVmRXhpdEZsaWdodElEID0gJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQuX2lkO1xuXG4gICAgICAgIGlmICgkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQpXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJlZlJlRW50cnlGbGlnaHRJRCA9ICRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodC5faWQ7XG5cbiAgICAgICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG5cbiAgICAgICAgaWYgKFR5cGUgPT0gXCJkZXNrdG9wXCIpXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodC1kZXRhaWxzJyk7XG5cbiAgICB9XG5cbiAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvJyk7XG4gICAgfVxuXG4gICAgaWYgKCFvcmlnaW4gfHwgIWRlc3RpbmF0aW9uIHx8ICFleGl0RGF0ZSkge1xuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xuICAgIH1cblxuICAgICRzY29wZS5jaGVja05leHRCdG5TdGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcClcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuaXNSZXR1cm5pbmdGbGlnaHRTZWxlY3RlZCAmJiAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZDtcbiAgICB9XG5cbiAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcblxuICAgICAgICAkc2NvcGUuaXNDb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAkc2NvcGUuaXNPdXRnb2luZ0ZsaWdodFNlbGVjdGVkID0gZmFsc2U7XG5cbiAgICAgICAgYXBpLmdldEZsaWdodHMob3JpZ2luLCBkZXN0aW5hdGlvbiwgZXhpdERhdGUuZ2V0VGltZSgpLCByZXR1cm5EYXRlTWlsbCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiAvIDYwKTtcbiAgICAgICAgICAgICAgICB2YXIgbWludXRlcyA9IGZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICAgICAgICBmbGlnaHRzLm91dGdvaW5nRmxpZ2h0c1tpXS5kdXJhdGlvbiA9IGhvdXJzICsgXCJoIFwiICsgbWludXRlcyArIFwibVwiO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICgkc2NvcGUucm91bmRUcmlwKSB7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGhvdXJzID0gTWF0aC5mbG9vcihmbGlnaHRzLnJldHVybkZsaWdodHNbaV0uZHVyYXRpb24gLyA2MCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBtaW51dGVzID0gZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uICUgNjA7XG5cbiAgICAgICAgICAgICAgICAgICAgZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLmR1cmF0aW9uID0gaG91cnMgKyBcImggXCIgKyBtaW51dGVzICsgXCJtXCI7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMgPSBmbGlnaHRzO1xuXG4gICAgICAgICAgICBhcGkuZ2V0QWlycG9ydHMoKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcnBvcnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJwb3J0c1tqXS5pYXRhID09PSAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydE5hbWUgPSBhaXJwb3J0c1tqXS5uYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkRlc3RpbmF0aW9uQWlycG9ydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCRzY29wZS5yb3VuZFRyaXApIHtcblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBhaXJwb3J0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcnBvcnRzW2pdLmlhdGEgPT09ICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmT3JpZ2luQWlycG9ydClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZPcmlnaW5BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWlycG9ydHNbal0uaWF0YSA9PT0gJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZEZXN0aW5hdGlvbkFpcnBvcnQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5mbGlnaHRzLnJldHVybkZsaWdodHNbaV0ucmVmRGVzdGluYXRpb25BaXJwb3J0TmFtZSA9IGFpcnBvcnRzW2pdLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBhcGkuZ2V0QWlyY3JhZnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2Nlc3MocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgICAgIGFpcmNyYWZ0cyA9IHJlc3BvbnNlLmRhdGE7XG5cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8ICRzY29wZS5mbGlnaHRzLm91dGdvaW5nRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgYWlyY3JhZnRzLmxlbmd0aDsgaisrKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhaXJjcmFmdHNbal0udGFpbE51bWJlciA9PT0gJHNjb3BlLmZsaWdodHMub3V0Z29pbmdGbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cy5vdXRnb2luZ0ZsaWdodHNbaV0ucmVmQWlyY3JhZnRNb2RlbCA9IGFpcmNyYWZ0c1tqXS5tb2RlbDtcblxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJHNjb3BlLnJvdW5kVHJpcCkge1xuXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0cy5sZW5ndGg7IGkrKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGFpcmNyYWZ0cy5sZW5ndGg7IGorKykge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFpcmNyYWZ0c1tqXS50YWlsTnVtYmVyID09PSAkc2NvcGUuZmxpZ2h0cy5yZXR1cm5GbGlnaHRzW2ldLnJlZkFpcmNyYWZ0VGFpbE51bWJlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZsaWdodHMucmV0dXJuRmxpZ2h0c1tpXS5yZWZBaXJjcmFmdE1vZGVsID0gYWlyY3JhZnRzW2pdLm1vZGVsO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2Uuc3RhdHVzVGV4dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG5cbiAgICAgICAgJHNjb3BlLmlzRWNvbm9teSA9IEJvb2xlYW4oJHJvdXRlUGFyYW1zLmlzRWNvbm9teSk7XG4gICAgICAgIGFwaS5nZXRGbGlnaHRzKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUubWluaUxvZ29QYXRoID0gZnVuY3Rpb24ob3BlcmF0b3JBaXJsaW5lKSB7XG4gICAgICAgICAgICBpZiAob3BlcmF0b3JBaXJsaW5lID09PSBcIkFpciBCZXJsaW5cIilcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJpbWcvYWlyLWJlcmxpbi1taW5pLWxvZ28ucG5nXCJcbiAgICAgICAgICAgIHJldHVybiBcImltZy9vdGhlci1haXJsaW5lLW1pbmktbG9nby5wbmdcIlxuICAgICAgICB9O1xuXG4gICAgfVxuXG59XG5cbmlmIChUeXBlID09ICdtb2JpbGUnKSB7XG4gICAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsICckc3RhdGVQYXJhbXMnXTtcbn0gZWxzZSB7XG4gICAgZmxpZ2h0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsICckcm91dGVQYXJhbXMnXTtcbn1cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNDdHJsJywgZmxpZ2h0Q29udHJvbGxlcik7XG4iLCJ2YXIgZmxpZ2h0TmV3Q29udHJvbGxlciA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGksICRyb3V0ZVBhcmFtcykge1xuXG4gICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1mbGlnaHRzJztcbiAgJHNjb3BlLnRpdGxlID0gXCJDaG9vc2UgYSBGbGlnaHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHROeHQgPSBcIk5leHRcIjtcbiAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gIGlmIChUeXBlID09IFwiZGVza3RvcFwiKSB7XG4gICAgJHNjb3BlLmlzQ29sbGFwc2VkID0gZmFsc2U7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IGZhbHNlO1xuICB9IGVsc2Uge1xuXG4gICAgU3RyaW5nLnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uKGl0KSB7XG4gICAgICByZXR1cm4gdGhpcy5pbmRleE9mKGl0KSAhPSAtMTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLm1pbmlMb2dvUGF0aCA9IGZ1bmN0aW9uKG9wZXJhdG9yQWlybGluZSkge1xuXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lID09PSBcIkFpciBCZXJsaW5cIilcbiAgICAgICAgcmV0dXJuIFwiaW1nL2Fpci1iZXJsaW4tbWluaS1sb2dvLnBuZ1wiXG4gICAgICAgIFxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwic3dpc3NcIikpXG4gICAgICAgIHJldHVybiBcImltZy9zd2lzcy1haXItbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJhdXN0cmlhblwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2F1c3RyaWFuLWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiaGF3YWlpYW5cIikpXG4gICAgICAgIHJldHVybiBcImltZy9oYXdhaWlhbi1haXJsaW5lcy1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcInplYWxhbmRcIikpXG4gICAgICAgIHJldHVybiBcImltZy9haXItbmV3LXplYWxhbmQtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJrbG1cIikpXG4gICAgICAgIHJldHVybiBcImltZy9rbG0tbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJtYWRhZ2FzY2FyXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlyLW1hZGFnYXNjYXItbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJpYmVyaWFcIikpXG4gICAgICAgIHJldHVybiBcImltZy9pYmVyaWEtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJ1bml0ZWRcIikpXG4gICAgICAgIHJldHVybiBcImltZy91bml0ZWQtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJkZWx0YVwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2RlbHRhLWFpcmxpbmVzLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwidHVya2lzaFwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL3R1cmtpc2gtYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJmcmFuY2VcIikpXG4gICAgICAgIHJldHVybiBcImltZy9haXItZnJhbmNlLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiY2FuYWRhXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvYWlybGluZS1jYW5hZGEtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJhbGFza2FcIikpXG4gICAgICAgIHJldHVybiBcImltZy9hbGFza2EtYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJhbGl0YWxpYVwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL2FsaXRhbGlhLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiY2F0aGF5XCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvY2F0aGF5LXBhY2lmaWMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJkcmFnb25cIikpXG4gICAgICAgIHJldHVybiBcImltZy9kcmFnb24tYWlyLW1pbmktbG9nby5wbmdcIlxuICAgICAgaWYgKG9wZXJhdG9yQWlybGluZS50b0xvd2VyQ2FzZSgpLmNvbnRhaW5zKFwiamFwYW5cIikpXG4gICAgICAgIHJldHVybiBcImltZy9qYXBhbi1haXJsaW5lcy1taW5pLWxvZ28ucG5nXCJcbiAgICAgIGlmIChvcGVyYXRvckFpcmxpbmUudG9Mb3dlckNhc2UoKS5jb250YWlucyhcIm1hbGF5c2lhXCIpKVxuICAgICAgICByZXR1cm4gXCJpbWcvbWFsYXlzaWEtYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJub3J0aHdlc3RcIikpXG4gICAgICAgIHJldHVybiBcImltZy9ub3J0aHdlc3QtYWlybGluZXMtbWluaS1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJzb3V0aFwiKSlcbiAgICAgICAgcmV0dXJuIFwiaW1nL3NvdXRoLWFmcmljYW4tYWlyd2F5cy1sb2dvLnBuZ1wiXG4gICAgICBpZiAob3BlcmF0b3JBaXJsaW5lLnRvTG93ZXJDYXNlKCkuY29udGFpbnMoXCJ2aXJnaW5cIikpXG4gICAgICAgIHJldHVybiBcImltZy92aXJnaW4tYXVzdHJhbGlhLW1pbmktbG9nby5wbmdcIlxuXG4gICAgICByZXR1cm4gXCJpbWcvb3RoZXItYWlybGluZS1taW5pLWxvZ28ucG5nXCJcblxuICAgIH07XG5cbiAgfVxuXG4gIGFwaS5zZXRJc090aGVySG9zdHModHJ1ZSk7XG5cbiAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgYXBpLnNldE91dEdvaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZE91dGdvaW5nRmxpZ2h0KTtcbiAgICBhcGkuc2V0UmV0dXJuaW5nRmxpZ2h0KCRzY29wZS5zZWxlY3RlZFJldHVybmluZ0ZsaWdodCk7XG4gICAgYXBpLnNldEJvb2tpbmcoJHNjb3BlLnNlbGVjdGVkQm9va2luZyk7XG5cbiAgICBpZiAoVHlwZSA9PSBcImRlc2t0b3BcIilcbiAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICBlbHNlXG4gICAgICAkbG9jYXRpb24uZ28oJ3RhYi5wYXNzZW5nZXItZGV0YWlscycpO1xuXG4gIH1cblxuICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcbiAgfVxuXG4gICRzY29wZS5zZWxlY3RlZEJvb2tpbmcgPSB7XG4gICAgXCJwYXNzZW5nZXJEZXRhaWxzXCI6IFt7XG4gICAgICBcImZpcnN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJsYXN0TmFtZVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydE51bVwiOiBudWxsLFxuICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgIFwiZGF0ZU9mQmlydGhcIjogbnVsbCxcbiAgICAgIFwibmF0aW9uYWxpdHlcIjogbnVsbCxcbiAgICAgIFwiZW1haWxcIjogbnVsbCxcbiAgICB9XSxcbiAgICBcImNsYXNzXCI6IG51bGwsXG4gICAgXCJvdXRnb2luZ0ZsaWdodElkXCI6IG51bGwsXG4gICAgXCJyZXR1cm5GbGlnaHRJZFwiOiBudWxsLFxuICAgIFwicGF5bWVudFRva2VuXCI6IG51bGxcbiAgfVxuXG4gIHZhciBvcmlnaW4gPSAkcm91dGVQYXJhbXMub3JpZ2luO1xuICB2YXIgZGVzdGluYXRpb24gPSAkcm91dGVQYXJhbXMuZGVzdGluYXRpb247XG4gIHZhciBleGl0RGF0ZSA9IG5ldyBEYXRlKCRyb3V0ZVBhcmFtcy5leGl0RGF0ZSAqIDEwMDApO1xuXG4gICRzY29wZS5vcmlnaW4gPSBvcmlnaW47XG4gICRzY29wZS5kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAkc2NvcGUuZXhpdERhdGUgPSBleGl0RGF0ZTtcblxuaWYoJHJvdXRlUGFyYW1zLmZsaWdodENsYXNzKVxuICB2YXIgaXNFY29ub215ID0gJHJvdXRlUGFyYW1zLmZsaWdodENsYXNzID09IFwiRWNvbm9teVwiO1xuaWYoJHJvdXRlUGFyYW1zLmlzRWNvbm9teSlcbnZhciBpc0Vjb25vbXkgPSBCb29sZWFuKCRyb3V0ZVBhcmFtcy5pc0Vjb25vbXkpO1xuXG4gIC8vIHZhciBpc0Vjb25vbXkgPSB0cnVlO1xuICAkc2NvcGUucm91bmRUcmlwID0gZmFsc2U7XG5cbiAgaWYgKCRyb3V0ZVBhcmFtcy5yZXR1cm5EYXRlKSB7XG4gICAgdmFyIHJldHVybkRhdGUgPSBuZXcgRGF0ZSgkcm91dGVQYXJhbXMucmV0dXJuRGF0ZSAqIDEwMDApO1xuICAgICRzY29wZS5yZXR1cm5EYXRlID0gcmV0dXJuRGF0ZTtcbiAgICAkc2NvcGUucm91bmRUcmlwID0gdHJ1ZTtcbiAgfVxuXG4gIHZhciByZXR1cm5EYXRlTWlsbDtcblxuICBpZiAocmV0dXJuRGF0ZSlcbiAgICByZXR1cm5EYXRlTWlsbCA9IHJldHVybkRhdGUuZ2V0VGltZSgpO1xuXG4gIGlmIChpc0Vjb25vbXkpIHtcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzRWNvKG9yaWdpbiwgZGVzdGluYXRpb24sIGV4aXREYXRlLmdldFRpbWUoKSwgcmV0dXJuRGF0ZU1pbGwpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXNzKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZmxpZ2h0cyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5kYXRhKTtcbiAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBhcGkuZ2V0T3RoZXJGbGlnaHRzQnVzaShvcmlnaW4sIGRlc3RpbmF0aW9uLCBleGl0RGF0ZS5nZXRUaW1lKCksIHJldHVybkRhdGVNaWxsKS50aGVuKGZ1bmN0aW9uIG15U3VjY2VzcyhyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmZsaWdodHMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0sIGZ1bmN0aW9uIG15RXJyb3IocmVzcG9uc2UpIHtcbiAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xuICAgIH0pO1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdE91dGdvaW5nRmxpZ2h0ID0gZnVuY3Rpb24oZmxpZ2h0KSB7XG4gICAgJHNjb3BlLmlzT3V0Z29pbmdGbGlnaHRTZWxlY3RlZCA9IHRydWU7XG4gICAgJHNjb3BlLnNlbGVjdGVkT3V0Z29pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5jbGFzcyA9IGlzRWNvbm9teSA9PT0gdHJ1ZSA/IFwiZWNvbm9teVwiIDogXCJidXNpbmVzc1wiO1xuICAgICRzY29wZS5zZWxlY3RlZEJvb2tpbmcub3V0Z29pbmdGbGlnaHRJZCA9IGZsaWdodC5mbGlnaHRJZDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nVXJsID0gZmxpZ2h0LnVybDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLm91dGdvaW5nQ29zdCA9IGZsaWdodC5jb3N0O1xuICB9XG5cbiAgJHNjb3BlLnNlbGVjdFJldHVybmluZ0ZsaWdodCA9IGZ1bmN0aW9uKGZsaWdodCkge1xuICAgICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkID0gdHJ1ZTtcbiAgICAkc2NvcGUuc2VsZWN0ZWRSZXR1cm5pbmdGbGlnaHQgPSBmbGlnaHQ7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5GbGlnaHRJZCA9IGZsaWdodC5mbGlnaHRJZDtcbiAgICAkc2NvcGUuc2VsZWN0ZWRCb29raW5nLnJldHVyblVybCA9IGZsaWdodC51cmw7XG4gICAgJHNjb3BlLnNlbGVjdGVkQm9va2luZy5yZXR1cm5Db3N0ID0gZmxpZ2h0LmNvc3Q7XG4gIH1cblxuICAkc2NvcGUuY2hlY2tOZXh0QnRuU3RhdGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGlmICgkc2NvcGUucm91bmRUcmlwKVxuICAgICAgcmV0dXJuICRzY29wZS5pc1JldHVybmluZ0ZsaWdodFNlbGVjdGVkICYmICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG4gICAgZWxzZVxuICAgICAgcmV0dXJuICRzY29wZS5pc091dGdvaW5nRmxpZ2h0U2VsZWN0ZWQ7XG5cbiAgfVxuXG59XG5cblxuaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgZmxpZ2h0TmV3Q29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJHN0YXRlJywgJ2FwaScsICckc3RhdGVQYXJhbXMnXTtcbn0gZWxzZSB7XG4gIGZsaWdodE5ld0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknLCAnJHJvdXRlUGFyYW1zJ107XG59XG5cblxuQXBwLmNvbnRyb2xsZXIoJ2ZsaWdodHNOZXdDdHJsJywgZmxpZ2h0TmV3Q29udHJvbGxlcik7XG4iLCIgdmFyIG1haW5Db250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sIGFwaSwkdHJhbnNsYXRlKSB7XG4gICAkc2NvcGUucGFnZUNsYXNzID0gJ3BhZ2UtbWFpbic7XG5cbiAgICRzY29wZS5nbyA9IGZ1bmN0aW9uKCkge1xuICAgICBjb25zb2xlLmxvZygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pO1xuICAgfVxuICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICRzY29wZS5yZXR1cm5EYXRlID0gbmV3IERhdGUoKTtcblxuICAgYXBpLmdldEFpcnBvcnRzKCkudGhlbihmdW5jdGlvbiBteVN1Y2NlcyhyZXNwb25zZSkge1xuICAgICAkc2NvcGUuYWlycG9ydHMgPSByZXNwb25zZS5kYXRhO1xuICAgfSwgZnVuY3Rpb24gbXlFcnJvcihyZXNwb25zZSkge1xuICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgIH0pO1xuXG5cbiAgICRzY29wZS5zZWxlY3RlZE9yaWdpbiA9IHVuZGVmaW5lZDtcbiAgICRzY29wZS5zZWxlY3RlZERlc3QgPSB1bmRlZmluZWQ7XG5cbiAgIGZ1bmN0aW9uIGFpcnBvcnNDb250YWlucyhpYXRhKSB7XG4gICAgLy8gIGlmKCAkc2NvcGUuYWlycG9ydHMpXG4gICAgLy8gIGZvciAodmFyIGkgPSAwOyBpIDwgJHNjb3BlLmFpcnBvcnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gICAgaWYgKGlhdGEgPT0gJHNjb3BlLmFpcnBvcnRzW2ldWydpYXRhJ10pXG4gICAgLy8gICAgICByZXR1cm4gdHJ1ZTtcbiAgICAvLyAgfVxuICAgICByZXR1cm4gdHJ1ZTtcbiAgIH1cblxuICAgJHNjb3BlLmJ1dHRvblN0YXRlID0gZnVuY3Rpb24oKSB7XG4gICAgIHJldHVybiAhJHNjb3BlLnNlbGVjdGVkT3JpZ2luIHx8ICEkc2NvcGUuc2VsZWN0ZWREZXN0IHx8ICEkc2NvcGUuZXhpdERhdGUgfHwgJHNjb3BlLnNlbGVjdGVkRGVzdCA9PSAkc2NvcGUuc2VsZWN0ZWRPcmlnaW4gfHwgIWFpcnBvcnNDb250YWlucygkc2NvcGUuc2VsZWN0ZWRPcmlnaW4pIHx8ICFhaXJwb3JzQ29udGFpbnMoJHNjb3BlLnNlbGVjdGVkRGVzdCk7XG4gICB9XG5cbiAgICRzY29wZS5mbGlnaHQgPSB7XG4gICAgIHR5cGU6IFwib25lXCJcbiAgIH1cbiAgICRzY29wZS5vdGhlckFpcmxpbmUgPSB7XG4gICAgIHZhbHVlOiBmYWxzZVxuICAgfVxuXG5cblxuICAgJHNjb3BlLmdvVG9GbGlnaHRzID0gZnVuY3Rpb24oKSB7XG4gICAgIHZhciBleGl0RGF0ZSwgcmV0dXJuRGF0ZTtcblxuICAgICBleGl0RGF0ZSA9ICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcbiAgICAgaWYgKCRzY29wZS5yZXR1cm5EYXRlKVxuICAgICAgIHJldHVybkRhdGUgPSAoJHNjb3BlLnJldHVybkRhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKTtcblxuICAgICBpZiAoJHNjb3BlLm90aGVyQWlybGluZS52YWx1ZSkge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzLW5ldycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsIGV4aXREYXRlKVxuICAgICAgICAgICAuc2VhcmNoKCdmbGlnaHRDbGFzcycsJHNjb3BlLmNsYXNzZUJ0blRleHQpO1xuXG4gICAgICAgICBlbHNlXG4gICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmZsaWdodHMtbmV3Jywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiBleGl0RGF0ZSxcbiAgICAgICAgICAgICBpc0Vjb25vbXk6ICEkc2NvcGUuaXNCdXNpbmVzc1xuICAgICAgICAgICB9KVxuICAgICAgIGVsc2Uge1xuICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMtbmV3JylcbiAgICAgICAgICAgLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKVxuICAgICAgICAgICAuc2VhcmNoKCdkZXN0aW5hdGlvbicsICRzY29wZS5zZWxlY3RlZERlc3QpXG4gICAgICAgICAgIC5zZWFyY2goJ2V4aXREYXRlJywgZXhpdERhdGUpXG4gICAgICAgICAgIC5zZWFyY2goJ3JldHVybkRhdGUnLCByZXR1cm5EYXRlKVxuICAgICAgICAgICAuc2VhcmNoKCdmbGlnaHRDbGFzcycsJHNjb3BlLmNsYXNzZUJ0blRleHQpO1xuICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzLW5ldycsIHtcbiAgICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgICBkZXN0aW5hdGlvbjogJHNjb3BlLnNlbGVjdGVkRGVzdCxcbiAgICAgICAgICAgICBleGl0RGF0ZTogZXhpdERhdGUsXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogcmV0dXJuRGF0ZSxcbiAgICAgICAgICAgICBpc0Vjb25vbXk6ICEkc2NvcGUuaXNCdXNpbmVzc1xuXG4gICAgICAgICAgIH0pXG4gICAgICAgfVxuICAgICB9IGVsc2Uge1xuICAgICAgIGlmICgkc2NvcGUuZmxpZ2h0LnR5cGUgPT0gXCJvbmVcIilcbiAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpLnNlYXJjaCgnb3JpZ2luJywgJHNjb3BlLnNlbGVjdGVkT3JpZ2luKS5zZWFyY2goJ2Rlc3RpbmF0aW9uJywgJHNjb3BlLnNlbGVjdGVkRGVzdCkuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSk7XG4gICAgICAgICBlbHNlXG4gICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICBvcmlnaW46ICRzY29wZS5zZWxlY3RlZE9yaWdpbixcbiAgICAgICAgICAgZGVzdGluYXRpb246ICRzY29wZS5zZWxlY3RlZERlc3QsXG4gICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCksXG4gICAgICAgICAgIGlzRWNvbm9teTogISRzY29wZS5pc0J1c2luZXNzXG5cbiAgICAgICAgIH0pXG4gICAgICAgZWxzZSB7XG4gICAgICAgICBpZihUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpXG4gICAgICAgICAgIC5zZWFyY2goJ29yaWdpbicsICRzY29wZS5zZWxlY3RlZE9yaWdpbilcbiAgICAgICAgICAgLnNlYXJjaCgnZGVzdGluYXRpb24nLCAkc2NvcGUuc2VsZWN0ZWREZXN0KVxuICAgICAgICAgICAuc2VhcmNoKCdleGl0RGF0ZScsICgkc2NvcGUuZXhpdERhdGUuZ2V0VGltZSgpIC8gMTAwMCkudG9GaXhlZCgwKSlcbiAgICAgICAgICAgLnNlYXJjaCgncmV0dXJuRGF0ZScsICgkc2NvcGUucmV0dXJuRGF0ZS5nZXRUaW1lKCkgLyAxMDAwKS50b0ZpeGVkKDApKTtcbiAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5mbGlnaHRzJywge1xuICAgICAgICAgICAgIG9yaWdpbjogJHNjb3BlLnNlbGVjdGVkT3JpZ2luLFxuICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiAkc2NvcGUuc2VsZWN0ZWREZXN0LFxuICAgICAgICAgICAgIGV4aXREYXRlOiAoJHNjb3BlLmV4aXREYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgcmV0dXJuRGF0ZTogKCRzY29wZS5yZXR1cm5EYXRlLmdldFRpbWUoKSAvIDEwMDApLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgaXNFY29ub215OiAhJHNjb3BlLmlzQnVzaW5lc3NcblxuICAgICAgICAgICB9KVxuICAgICAgIH1cblxuICAgICB9XG5cbiAgIH07XG5cblxuXG5cbiAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAkKCcjbWFpbi10ZXh0JykudHlwZUl0KHtcbiAgICAgICBzdHJpbmdzOiBbJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLlFVT1RFU19IT01FLk9ORScpLCR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5RVU9URVNfSE9NRS5UV08nKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuVEhSRUUnKSwkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uUVVPVEVTX0hPTUUuRk9VUicpXSxcbiAgICAgICBzcGVlZDogMTIwLFxuICAgICAgIGJyZWFrTGluZXM6IGZhbHNlLFxuICAgICAgIGxvb3A6IHRydWVcbiAgICAgfSk7XG5cblxuICAgICAkbG9jYXRpb24udXJsKCRsb2NhdGlvbi5wYXRoKCkpO1xuICAgICBzZXRVcERhdGUoJHNjb3BlKTtcblxuICAgICAkc2NvcGUuY2hpbGRyZW4gPSBbJzAgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnMSAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEJyksICcyICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQ0hJTERSRU4nKSwgJzMgJyArICR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5DSElMRFJFTicpLCAnNCAnICsgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkNISUxEUkVOJyldO1xuICAgICAkc2NvcGUuY2hpbGRyZW5CdG5UZXh0ID0gJHNjb3BlLmNoaWxkcmVuWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQ2hpbGRyZW4gPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmNoaWxkcmVuQnRuVGV4dCA9IHRleHQ7XG4gICAgIH1cblxuXG5cbiAgICAgJHNjb3BlLmFkdWx0cyA9IFsnMSAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5BRFVMVCcpICwgJzIgJyskdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRTJyksICczICcgKyAkdHJhbnNsYXRlLmluc3RhbnQoJ01BSU4uQURVTFRTJyksICc0ICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkFEVUxUcycpXTtcbiAgICAgJHNjb3BlLmFkdWx0QnRuVGV4dCA9ICRzY29wZS5hZHVsdHNbMF07XG4gICAgICRzY29wZS5jaGFuZ2VBZHVsdCA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICAgICAkc2NvcGUuYWR1bHRCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG4gICAgICRzY29wZS5pbmZhbnRzID0gWycwICcrJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLklORkFOVCcpLCAnMSAnKyR0cmFuc2xhdGUuaW5zdGFudCgnTUFJTi5JTkZBTlRTJyldO1xuICAgICAkc2NvcGUuaW5mYW50QnRuVGV4dCA9ICRzY29wZS5pbmZhbnRzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlSW5mYW50ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICRzY29wZS5pbmZhbnRCdG5UZXh0ID0gdGV4dDtcbiAgICAgfVxuXG5cbiAgICAgJHNjb3BlLmNsYXNzZXMgPSBbJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkVDT05PTVknKSwgJHRyYW5zbGF0ZS5pbnN0YW50KCdNQUlOLkJVU0lORVNTJyldO1xuICAgICAkc2NvcGUuY2xhc3NlQnRuVGV4dCA9ICRzY29wZS5jbGFzc2VzWzBdO1xuICAgICAkc2NvcGUuY2hhbmdlQ2xhc3MgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgJHNjb3BlLmNsYXNzZUJ0blRleHQgPSB0ZXh0O1xuICAgICB9XG4gICB9XG5cblxuIH07XG5cbiBmdW5jdGlvbiBzZXRVcERhdGUoJHNjb3BlKSB7XG4gICAkc2NvcGUudG9kYXkgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLmV4aXREYXRlID0gbmV3IERhdGUoKTtcbiAgICAgJHNjb3BlLnJldHVybkRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgfTtcbiAgICRzY29wZS50b2RheSgpO1xuXG4gICAkc2NvcGUub3BlbjIgPSBmdW5jdGlvbigpIHtcbiAgICAgJHNjb3BlLnBvcHVwMi5vcGVuZWQgPSB0cnVlO1xuICAgfTtcbiAgICRzY29wZS5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgICRzY29wZS5wb3B1cC5vcGVuZWQgPSB0cnVlO1xuICAgfTtcblxuXG4gICBmdW5jdGlvbiBkaXNhYmxlZChkYXRhKSB7XG4gICAgIHZhciBkYXRlID0gZGF0YS5kYXRlLFxuICAgICAgIG1vZGUgPSBkYXRhLm1vZGU7XG4gICAgIHJldHVybiBtb2RlID09PSAnZGF5JyAmJiAoZGF0ZS5nZXREYXkoKSA9PT0gMCB8fCBkYXRlLmdldERheSgpID09PSA2KTtcbiAgIH1cbiAgICRzY29wZS5kYXRlT3B0aW9ucyA9IHtcbiAgICAgZm9ybWF0WWVhcjogJ3l5JyxcbiAgICAgbWF4RGF0ZTogbmV3IERhdGUoMjAyMCwgNSwgMjIpLFxuICAgICBtaW5EYXRlOiBuZXcgRGF0ZSgpLFxuICAgICBzdGFydGluZ0RheTogMVxuICAgfTtcbiAgICRzY29wZS5wb3B1cDIgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gICAkc2NvcGUucG9wdXAgPSB7XG4gICAgIG9wZW5lZDogZmFsc2VcbiAgIH07XG4gfVxuXG4gaWYgKFR5cGUgPT0gJ21vYmlsZScpIHtcbiAgIG1haW5Db250cm9sbGVyLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnYXBpJywnJHRyYW5zbGF0ZSddO1xuIH0gZWxzZSB7XG4gICBtYWluQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyR0cmFuc2xhdGUnXTtcbiB9XG5cbiBBcHAuY29udHJvbGxlcignbWFpbkN0cmwnLCBtYWluQ29udHJvbGxlcik7XG4iLCIvLyBAeWFzc21pbmVcbkFwcC5jb250cm9sbGVyKCdwYXNzZW5nZXJEZXRhaWxzQ3RybCcsIGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCBhcGkpIHtcbiAgICAkc2NvcGUudGl0bGUgPSBcIkZpbGwgaW4geW91ciBkZXRhaWxzXCI7XG5cbiAgICAkc2NvcGUuYnV0dG9uVGV4dE54dCA9IFwiTmV4dFwiO1xuICAgICRzY29wZS5idXR0b25UZXh0QmsgPSBcIkJhY2tcIjtcblxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG4gICAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvZmxpZ2h0cycpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLnRpdGxlcyA9IFsnTXInLCAnTXJzJywgJ01zJywgJ0RyJ107XG4gICAgICAgICRzY29wZS50aXRsZXNCdG5UZXh0ID0gJHNjb3BlLnRpdGxlc1swXTtcbiAgICAgICAgJHNjb3BlLmNoYW5nZVRpdGxlID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgICAgJHNjb3BlLnRpdGxlc0J0blRleHQgPSB0ZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgYXBpLmdldENvdW50cmllcygpLnRoZW4oZnVuY3Rpb24gbXlTdWNjZXMocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICRzY29wZS5jb3VudHJpZXMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICB9LCBmdW5jdGlvbiBteUVycm9yKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5zdGF0dXNUZXh0KTtcbiAgICAgICAgfSk7XG5cblxuXG5cbiAgICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuXG5cblxuICAgICAgICAgICAgJHNjb3BlLnBhc3NlbmdlciA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICAgICAgICAgIGNvdW50cnlDb2RlOiBudWxsLCAvL2FjY29yZGluZyB0byBjb3VudHJ5XG4gICAgICAgICAgICAgICAgbmF0aW9uYWxpdHk6ICRzY29wZS5uYXRpb25hbGl0eSxcbiAgICAgICAgICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICAgICAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgICAgICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICAgICAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICRzY29wZS50aXRsZXNCdG5UZXh0LFxuICAgICAgICAgICAgICAgIGZpcnN0TmFtZTogJHNjb3BlLmZpcnN0TmFtZSxcbiAgICAgICAgICAgICAgICBtaWRkbGVOYW1lOiAkc2NvcGUubWlkZGxlTmFtZSxcbiAgICAgICAgICAgICAgICBsYXN0TmFtZTogJHNjb3BlLmxhc3ROYW1lLFxuICAgICAgICAgICAgICAgIHBhc3Nwb3J0TnVtYmVyOiAkc2NvcGUucGFzc3BvcnROdW1iZXIsXG4gICAgICAgICAgICAgICAgcGhvbmVOdW1iZXI6ICRzY29wZS5waG9uZU51bWJlcixcbiAgICAgICAgICAgICAgICBlbWFpbDogJHNjb3BlLmVtYWlsMVxuXG5cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICAvLy9iZWZvcmUgeW91IGxlYXZlIHRoZSBwYWdlIG1ha2Ugc3VyZSB0aGF0IHRoZSBwYXNzZW5nZXIgb2JqZWN0IGlzIGNvbXBsZXRlIG90aGVyd2lzZSBzaG93IGFsZXJ0KFwiRmlsbCBpbiBhbGwgZGF0YVwiKTtcblxuXG5cbiAgICAgICAgICAgIC8vIGlmIChjb21wbGV0ZSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgLy8gICAkc2NvcGUuYWxlcnREYXRhID0gZmFsc2U7XG4gICAgICAgICAgICAvLyAgIGlmICgoJHNjb3BlLmZpcnN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkgfHwgKCRzY29wZS5sYXN0TmFtZSA9PSBudWxsKSB8fCAoJHNjb3BlLnBob25lTnVtYmVyID09IG51bGwpIHx8ICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbDEgPT0gbnVsbCkgfHwgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSkge1xuICAgICAgICAgICAgLy8gICAgICRzY29wZS5hbGVydERhdGEgPSB0cnVlO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gZmFsc2U7XG4gICAgICAgICAgICAvLyAgICAgaWYgKCRzY29wZS5lbWFpbDEgIT0gJHNjb3BlLmVtYWlsdmVyKVxuICAgICAgICAgICAgLy8gICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgICAgaWYgKCgkc2NvcGUuY2hlY2sgPT0gbnVsbCkpXG4gICAgICAgICAgICAvLyAgICAgICAgICRzY29wZS5hbGVydENoZWNrID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gICAgICAgICBjb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUgPT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuICAgICAgICAgICAgLy8gICBpZiAoIWFwaS5pc090aGVySG9zdHMpXG4gICAgICAgICAgICAvLyAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAgICAgICAvLyAgIGVsc2UgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50JylcbiAgICAgICAgICAgIC8vIH1cblxuICAgICAgICAgICAgdmFyIGZpZWxkcyA9IFt0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlLCB0cnVlXTtcblxuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Rk5hbWUgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydE1OYW1lID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRMTmFtZSA9IGZhbHNlO1xuICAgICAgICAgICAgJHNjb3BlLmFsZXJ0UGhOdW1iZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydFBOdW1iZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydENvdW50cnkgPSBmYWxzZTtcbiAgICAgICAgICAgICRzY29wZS5hbGVydEVtYWlsID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRDb25maXJtID0gZmFsc2U7XG4gICAgICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IGZhbHNlO1xuXG5cbiAgICAgICAgICAgIGlmICgkc2NvcGUuZmlyc3ROYW1lID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbMF0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRGTmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLm1pZGRsZU5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1sxXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydE1OYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubGFzdE5hbWUgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1syXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydExOYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGhvbmVOdW1iZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1szXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydFBoTnVtYmVyID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUucGFzc3BvcnROdW1iZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc1s0XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICRzY29wZS5hbGVydFBOdW1iZXIgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5uYXRpb25hbGl0eSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzVdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q291bnRyeSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmVtYWlsMSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzZdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0RW1haWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbHZlciA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzddID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0RW1haWwgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDEgIT0gJHNjb3BlLmVtYWlsdmVyKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzWzhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmFsZXJ0Q29uZmlybSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoJHNjb3BlLmNoZWNrID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNbOV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAkc2NvcGUuYWxlcnRDaGVjayA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBhbGxwYXNzaW5nID0gdHJ1ZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWVsZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZmllbGRzW2ldID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsbHBhc3NpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoYWxscGFzc2luZyA9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldFBhc3Nlbmdlcigkc2NvcGUucGFzc2VuZ2VyKTtcbiAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nL291dGdvaW5nJyk7XG5cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYm9va2luZyA9IGFwaS5nZXRCb29raW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYm9va2luZy5wYXNzZW5nZXJEZXRhaWxzWzBdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlyc3ROYW1lXCI6ICRzY29wZS5maXJzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJsYXN0TmFtZVwiOiAkc2NvcGUubGFzdE5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXNzcG9ydE51bVwiOiAkc2NvcGUucGFzc3BvcnROdW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwYXNzcG9ydEV4cGlyeURhdGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGVPZkJpcnRoXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYXRpb25hbGl0eVwiOiAkc2NvcGUubmF0aW9uYWxpdHksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJlbWFpbFwiOiAkc2NvcGUuZW1haWwxXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcoYm9va2luZyk7XG4gICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgfVxuICAgICAgICAkc2NvcGUuZ29CYWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2V4aXQtZmxpZ2h0Jyk7XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuXG5cblxuICAgICAgICB2YXIgY29tcGxldGUxID0gZmFsc2U7XG5cbiAgICAgICAgJHNjb3BlLk5leHQgPSBmdW5jdGlvbigpIHtcblxuXG4gICAgICAgICAgICAkc2NvcGUucGFzc2VuZ2VyID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgICAgICAgICAgY291bnRyeUNvZGU6IG51bGwsIC8vYWNjb3JkaW5nIHRvIGNvdW50cnlcbiAgICAgICAgICAgICAgICBuYXRpb25hbGl0eTogJHNjb3BlLmNvdW50cmllc01vYixcbiAgICAgICAgICAgICAgICBzZXg6IG51bGwsXG4gICAgICAgICAgICAgICAgYmlydGhEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIGJpcnRoUGxhY2U6IG51bGwsXG4gICAgICAgICAgICAgICAgbmF0aW9uYWxJRDogbnVsbCxcbiAgICAgICAgICAgICAgICBhdXRob3JpdHk6IG51bGwsXG4gICAgICAgICAgICAgICAgaXNzdWVEYXRlOiBudWxsLFxuICAgICAgICAgICAgICAgIGV4cGlyeURhdGU6IG51bGwsXG4gICAgICAgICAgICAgICAgcG9pbnRzOiBudWxsLFxuICAgICAgICAgICAgICAgIG1lbWJlcnNoaXA6IG51bGwsXG4gICAgICAgICAgICAgICAgdGl0bGU6ICRzY29wZS5UaXRsZU1vYixcbiAgICAgICAgICAgICAgICBmaXJzdE5hbWU6ICRzY29wZS5maXJzdE5hbWVNb2IsXG4gICAgICAgICAgICAgICAgbWlkZGxlTmFtZTogJHNjb3BlLm1pZGRsZU5hbWVNb2IsXG4gICAgICAgICAgICAgICAgbGFzdE5hbWU6ICRzY29wZS5sYXN0TmFtZU1vYixcbiAgICAgICAgICAgICAgICBwYXNzcG9ydE51bWJlcjogJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iLFxuICAgICAgICAgICAgICAgIHBob25lTnVtYmVyOiAkc2NvcGUucGhvbmVOdW1iZXJNb2IsXG4gICAgICAgICAgICAgICAgZW1haWw6ICRzY29wZS5lbWFpbDFNb2JcblxuXG4gICAgICAgICAgICB9O1xuXG5cblxuXG4gICAgICAgICAgICAvLyBpZiAoY29tcGxldGUxID09IGZhbHNlKSB7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICBpZiAoKCRzY29wZS5maXJzdE5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5taWRkbGVOYW1lTW9iID09IG51bGwpIHx8ICgkc2NvcGUubGFzdE5hbWVNb2IgPT0gbnVsbCkgfHwgKCRzY29wZS5waG9uZU51bWJlck1vYiA9PSBudWxsKSB8fCAoJHNjb3BlLnBhc3Nwb3J0TnVtYmVyTW9iID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWwxTW9iID09IG51bGwpIHx8ICgkc2NvcGUuZW1haWx2ZXJNb2IgPT0gbnVsbCkpIHtcbiAgICAgICAgICAgIC8vICAgICBhbGVydChcIlBsZWFzZSBmaWxsIGluIGRhdGE6XCIgKyBcIlxcblwiICsgXCJQYXNzcG9ydCBOdW1iZXIgbXVzdCBiZSA4IG51bWJlcnNcIiArIFwiXFxuXCIgK1xuICAgICAgICAgICAgLy8gICAgICAgXCJQaG9uZSBOdW1iZXIgbXVzdCBiZSAxMCBudW1iZXJzXCIgKyBcIlxcblwiICsgXCJFbWFpbHMgbXVzdCBiZSBpbiBhQHh5ei5jb20gZm9ybWF0XCIpO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgIT0gJHNjb3BlLmVtYWlsdmVyTW9iKVxuICAgICAgICAgICAgLy8gICAgICAgYWxlcnQoXCJUaGUgZW50ZXJlZCBlbWFpbHMgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgICAgLy8gICAgIGVsc2Uge1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgICAgIGlmICgoJHNjb3BlLmNoZWNrTW9iID09IG51bGwpKVxuICAgICAgICAgICAgLy8gICAgICAgICBhbGVydChcIlBsZWFzZSB2ZXJpZnkgdGhlIGluZm9ybWF0aW9uIHlvdSBlbnRlcmVkXCIpXG4gICAgICAgICAgICAvLyAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgY29tcGxldGUxID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vICAgfVxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gaWYgKGNvbXBsZXRlMSA9PSB0cnVlKSB7XG4gICAgICAgICAgICAvLyAgIGFwaS5zZXRQYXNzZW5nZXIoJHNjb3BlLnBhc3Nlbmdlcik7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gICAkbG9jYXRpb24ucGF0aCgnL3RhYi9zZWF0aW5nL291dGdvaW5nJyk7XG4gICAgICAgICAgICAvLyB9XG5cblxuXG4gICAgICAgICAgICB2YXIgZmllbGRzTW9iID0gW3RydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWUsIHRydWVdO1xuXG5cblxuXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmZpcnN0TmFtZU1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzBdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgRW50ZXIgeW91ciBmaXJzdCBuYW1lLlwiKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5taWRkbGVOYW1lTW9iID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmaWVsZHNNb2JbMV0gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBlbnRlciB5b3VyIG1pZGRsZSBuYW1lLlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICgkc2NvcGUubGFzdE5hbWVNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYlsyXSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgbGFzdCBuYW1lLlwiKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5waG9uZU51bWJlck1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzNdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBwaG9uZSBudW1iZXIsIGl0IG11c3QgYmUgMTAgZGlnaXRzXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5wYXNzcG9ydE51bWJlck1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzRdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgZW50ZXIgeW91ciBwYXNzcG9ydCBudW1iZXIsIGl0IG11c3QgYmUgOCBkaWdpdHMuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZpZWxkc01vYls1XSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGVudGVyIHlvdXIgZW1haWwsIGl0IG11c3QgYmUgaW4gdGhpcyBmb3JtYXQgJ2FAeHl6LmNvbScgXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbHZlck1vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzZdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgY29uZmlybSB5b3VyIGVtYWlsLCBpdCBtdXN0IGJlIGluIHRoaXMgZm9ybWF0ICdhQHh5ei5jb20nIFwiKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5lbWFpbDFNb2IgIT0gJHNjb3BlLmVtYWlsdmVyTW9iKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzddID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJUaGUgZW50ZXJlZCBlbWFpbHMgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCRzY29wZS5jaGVja01vYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZmllbGRzTW9iWzhdID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgdmVyaWZ5IHRoZSBpbmZvcm1hdGlvbiB5b3UndmUgZW50ZXJlZFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGFsbHBhc3NpbmdNb2IgPSB0cnVlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZpZWxkc01vYi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChmaWVsZHNNb2JbaV0gPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxscGFzc2luZ01vYiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChhbGxwYXNzaW5nTW9iID09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBhcGkuc2V0UGFzc2VuZ2VyKCRzY29wZS5wYXNzZW5nZXIpO1xuXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy90YWIvcGF5bWVudCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH07XG4gICAgfVxuXG5cblxufSk7XG4iLCIvLyBAbWlybmFcbnZhciBwYXltZW50Q3RybCA9IGZ1bmN0aW9uKCRzY29wZSwgJGxvY2F0aW9uLCAkaHR0cCwgYXBpKSB7XG4gICAgJHNjb3BlLnBhZ2VDbGFzcyA9ICdwYWdlLXBheW1lbnQnO1xuICAgICRzY29wZS50aXRsZSA9IFwiQ2hvb3NlIHlvdXIgcGF5bWVudCBvcHRpb25cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJTdWJtaXRcIjtcbiAgICAkc2NvcGUuYnV0dG9uVGV4dEJrID0gXCJCYWNrXCI7XG5cbiAgICAkc2NvcGUuZm9ybSA9IHtcbiAgICAgICAgbnVtYmVyOiBudWxsLFxuICAgICAgICBjdmM6IG51bGwsXG4gICAgICAgIGV4cF9tb250aDogbnVsbCxcbiAgICAgICAgZXhwX3llYXI6IG51bGxcbiAgICB9O1xuXG5cblxuXG5cbiAgICAkc2NvcGUuZ29OZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciByID0gY29uZmlybShcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCBwYXk/XCIpO1xuICAgICAgICBpZiAociA9PSB0cnVlKSB7XG5cblxuXG4gICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5leHBfeWVhciA9ICRzY29wZS55ZWFyc0J0blRleHRcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5leHBfbW9udGggPSBwYXJzZUludCgkc2NvcGUubW9udGhzLmluZGV4T2YoJHNjb3BlLm1vbnRoc0J0blRleHQpKSArIDFcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUuZm9ybS5leHBfeWVhciA9IChwYXJzZUludChuZXcgRGF0ZSgkc2NvcGUuZGF0ZSkuZ2V0WWVhcigpKSkgKyAyMDAwIC0gMTAwXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uZXhwX21vbnRoID0gbmV3IERhdGUoJHNjb3BlLmRhdGUpLmdldE1vbnRoKClcblxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mb3JtKVxuICAgICAgICAgICAgfVxuXG5cblxuICAgICAgICAgICAgaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZS5pZClcbiAgICAgICAgICAgICAgICAgICAgYXBpLnNldFN0cmlwZVRva2VuKHJlc3BvbnNlLmlkKVxuICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyhhcGkuSXNPdGhlckhvc3RzKCkpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChUeXBlID09ICdkZXNrdG9wJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbi5nbygndGFiLmNvbmZpcm1hdGlvbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YS5lcnJvck1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXBpLmNsZWFyTG9jYWwoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBib29raW5nID0gYXBpLmdldEJvb2tpbmcoKTtcbiAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5VcmwgPT0gYm9va2luZy5vdXRnb2luZ1VybCB8fCAhYm9va2luZy5yZXR1cm5VcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuQ29zdClcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcucmV0dXJuQ29zdCkgKyBwYXJzZUludChib29raW5nLm91dGdvaW5nQ29zdCk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybCA9IFwiaHR0cDovL1wiICsgYm9va2luZy5vdXRnb2luZ1VybDtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codXJsICsgJy9zdHJpcGUvcHVia2V5LycpXG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRTdHJpcGVLZXkodXJsICsgJy9zdHJpcGUvcHVia2V5LycpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBib29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zZXRCb29raW5nKGJvb2tpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5zdWJtaXRCb29raW5nKHRydWUsIHVybCkudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoJ3BrX3Rlc3RfU2lZMHhhdzdxM0xObHBDbmtocG82MGp0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoVHlwZSA9PSAnZGVza3RvcCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24uZ28oJ3RhYi5jb25maXJtYXRpb24nLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoZGF0YS5kYXRhLmVycm9yTWVzc2FnZSlcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHN0YXR1cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKVxuICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9oZXJlIHdlIHNob3VsZCBzZW5kIHR3byByZXFldXN0c1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3V0Z29pbmdCb29raW5nID0gYm9va2luZztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHVybkJvb2tpbmcgPSBib29raW5nO1xuICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0Jvb2tpbmcuY29zdCA9IHBhcnNlSW50KGJvb2tpbmcub3V0Z29pbmdDb3N0KTtcbiAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdCb29raW5nLnJldHVybkZsaWdodElkID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJvb2tpbmcucmV0dXJuVXJsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLmNvc3QgPSBwYXJzZUludChib29raW5nLnJldHVybkNvc3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuQm9va2luZy5vdXRnb2luZ0ZsaWdodElkID0gYm9va2luZy5yZXR1cm5GbGlnaHRJZDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHZhciB1cmwgPSBcImh0dHA6Ly9cIiArIGJvb2tpbmcub3V0Z29pbmdVcmw7XG4gICAgICAgICAgICAgICAgICAgIGFwaS5nZXRTdHJpcGVLZXkodXJsICsgJy9zdHJpcGUvcHVia2V5JykudGhlbihmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgU3RyaXBlLmNhcmQuY3JlYXRlVG9rZW4oJHNjb3BlLmZvcm0sIGZ1bmN0aW9uKHN0YXR1cywgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRnb2luZ0Jvb2tpbmcucGF5bWVudFRva2VuID0gcmVzcG9uc2UuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcob3V0Z29pbmdCb29raW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuZGF0YS5yZWZOdW0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYm9va2luZy5yZXR1cm5VcmwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdXJsID0gXCJodHRwOi8vXCIgKyBib29raW5nLnJldHVyblVybDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuZ2V0U3RyaXBlS2V5KHVybCArICcvc3RyaXBlL3B1YmtleScpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuc2V0UHVibGlzaGFibGVLZXkoZGF0YS5kYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBTdHJpcGUuY2FyZC5jcmVhdGVUb2tlbigkc2NvcGUuZm9ybSwgZnVuY3Rpb24oc3RhdHVzLCByZXNwb25zZSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5Cb29raW5nLnBheW1lbnRUb2tlbiA9IHJlc3BvbnNlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnNldEJvb2tpbmcocmV0dXJuQm9va2luZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGkuc3VibWl0Qm9va2luZyh0cnVlLCB1cmwpLnRoZW4oZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRhdGEucmVmTnVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmlwZS5zZXRQdWJsaXNoYWJsZUtleSgncGtfdGVzdF9TaVkweGF3N3EzTE5scENua2hwbzYwanQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9jb25maXJtYXRpb24nKS5zZWFyY2goJ2Jvb2tpbmcnLCBkYXRhLmRhdGEucmVmTnVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLmdvKCd0YWIuY29uZmlybWF0aW9uJywge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvb2tpbmc6IGRhdGEuZGF0YS5yZWZOdW1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YS5lcnJvck1lc3NhZ2UpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oc3RhdHVzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihzdGF0dXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHN0YXR1cylcbiAgICAgICAgICAgICAgICAgICAgfSlcblxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgKCFhcGkuSXNPdGhlckhvc3RzKCkpXG4gICAgfVxuICAgICRzY29wZS5nb0JhY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9zZWF0aW5nJyk7XG4gICAgfVxuXG4gICAgaWYgKFR5cGUgPT0gJ2Rlc2t0b3AnKSB7XG5cbiAgICAgICAgaWYgKCFhcGkuZ2V0Q2hvc2VuT3V0R29pbmdGbGlnaHQoKSB8fCAhYXBpLmdldEJvb2tpbmcoKSkge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9mbGlnaHRzJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFhcGkuZ2V0UGFzc2VuZ2VyKCkpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS55ZWFycyA9IFsnMjAxNicsICcyMDE3JywgJzIwMTgnLCAnMjAxOScsICcyMDIwJywgJzIwMjEnLCAnMjAyMicsICcyMDIzJywgJzIwMjQnXTtcbiAgICAgICAgJHNjb3BlLnllYXJzQnRuVGV4dCA9ICRzY29wZS55ZWFyc1swXTtcbiAgICAgICAgJHNjb3BlLmNoYW5nZVllYXIgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUueWVhcnNCdG5UZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgICRzY29wZS5tb250aHMgPSBbJ0phbnVhcnknLCAnRmVidXJhcnknLCAnTWFyY2gnLCAnQXByaWwnLCAnTWF5JywgJ0p1bmUnLCAnSnVseScsICdBdWd1c3QnLCAnU2VwdGVtYmVyJywgJ09jdG9iZXInLCAnTm92ZW1iZXInLCAnRGVjZW1iZXInXTtcbiAgICAgICAgJHNjb3BlLm1vbnRoc0J0blRleHQgPSAkc2NvcGUubW9udGhzWzBdO1xuICAgICAgICAkc2NvcGUuY2hhbmdlTW9udGggPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuVGV4dCA9IHRleHQ7XG4gICAgICAgICAgICAkc2NvcGUubW9udGhzQnRuTm8gPSAkc2NvcGUubW9udGhzLmluZGV4T2YodGV4dCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgJHNjb3BlLm90aGVySG9zdHMgPSBhcGkuSXNPdGhlckhvc3RzKCk7XG4gICAgY29uc29sZS5sb2coYXBpLmdldEJvb2tpbmcoKS5vdXRnb2luZ0Nvc3QpXG4gICAgaWYgKCRzY29wZS5vdGhlckhvc3RzKSB7XG4gICAgICAgIGlmIChhcGkuZ2V0Qm9va2luZygpLnJldHVybkNvc3QpXG4gICAgICAgICAgICAkc2NvcGUucHJpY2UgPSBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLm91dGdvaW5nQ29zdCkgKyBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLnJldHVybkNvc3QpO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgICAkc2NvcGUucHJpY2UgPSBwYXJzZUludChhcGkuZ2V0Qm9va2luZygpLm91dGdvaW5nQ29zdClcbiAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByaWNlKVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwcmljZSA9IDA7XG4gICAgICAgIGlmIChhcGkuZ2V0Q2FiaW5ldE91dGdvaW5nQ2xhc3MoKSA9PSAnRWNvbm9teScpXG4gICAgICAgICAgICBwcmljZSA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHByaWNlID0gYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkuYnVzaW5lc3NGYXJlXG5cbiAgICAgICAgaWYgKGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKSkge1xuXG4gICAgICAgICAgICBpZiAoYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpID09ICdFY29ub215JylcbiAgICAgICAgICAgICAgICBwcmljZSA9IHByaWNlICsgYXBpLmdldENob3NlblJldHVybmluZ0ZsaWdodCgpLmVjb25vbXlGYXJlXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcHJpY2UgPSBwcmljZSArIGFwaS5nZXRDaG9zZW5SZXR1cm5pbmdGbGlnaHQoKS5idXNpbmVzc0ZhcmVcblxuXG4gICAgICAgIH1cblxuXG4gICAgICAgICRzY29wZS5wcmljZSA9IHByaWNlO1xuICAgIH1cbn1cblxuXG5pZiAoVHlwZSA9PSAnbW9iaWxlJykge1xuICAgIHBheW1lbnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckc3RhdGUnLCAnJGh0dHAnLCAnYXBpJ107XG59IGVsc2Uge1xuICAgIHBheW1lbnRDdHJsLiRpbmplY3QgPSBbJyRzY29wZScsICckbG9jYXRpb24nLCAnJGh0dHAnLCAnYXBpJ107XG59XG5cbkFwcC5jb250cm9sbGVyKCdwYXltZW50Q3RybCcsIHBheW1lbnRDdHJsKTtcbiIsIi8vIEBhaG1lZC1lc3NtYXRcbiAgdmFyIHNlYXRpbmdDb250cm9sbGVyID0gZnVuY3Rpb24oJHNjb3BlLCAkbG9jYXRpb24sYXBpLCRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wYWdlQ2xhc3MgPSAncGFnZS1zZWF0aW5nJztcbiAgICAkc2NvcGUudGl0bGUgPSBcIldoZXJlIHdvdWxkIHlvdSBsaWtlIHRvIHNpdD9cIjtcblxuICAgICRzY29wZS5idXR0b25UZXh0Tnh0ID0gXCJOZXh0XCI7XG4gICAgJHNjb3BlLmJ1dHRvblRleHRCayA9IFwiQmFja1wiO1xuXG4gICAgaWYoVHlwZSA9PSAnZGVza3RvcCcpe1xuICAgICAgJHNjb3BlLmdvTmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmIChhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkpXG4gICAgICAgICAgICAgIGlmICgkcm91dGVQYXJhbXMub3V0Z29pbmcgPT0gXCJvdXRnb2luZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3NlYXRpbmcvcmV0dXJpbmcnKTtcbiAgICAgICAgICAgICAgICAgIGFwaS5zZXRPdXRnb2luZ1NlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYXBpLnNldFJldHJ1blNlYXQoJHNjb3BlLnNlYXQpO1xuICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9wYXltZW50Jyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYXBpLnNldE91dGdvaW5nU2VhdCgkc2NvcGUuc2VhdCk7XG4gICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGF5bWVudCcpO1xuICAgICAgICAgIH1cblxuICAgICAgfVxuICAgICAgJHNjb3BlLmdvQmFjayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgIH1cblxuXG5cbiAgICAgIGlmICghYXBpLmdldENob3Nlbk91dEdvaW5nRmxpZ2h0KCkgfHwgIWFwaS5nZXRCb29raW5nKCkpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL2ZsaWdodHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoIWFwaS5nZXRQYXNzZW5nZXIoKSkge1xuICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvcGFzc2VuZ2VyLWRldGFpbHMnKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB2YXIgc2VhdG1hcDtcblxuICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5vdXRnb2luZyA9PSBcIm91dGdvaW5nXCIpIHtcblxuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRPdXRnb2luZ0NsYXNzKCk7XG4gICAgICAgICAgc2VhdG1hcCA9IGFwaS5nZXRDaG9zZW5PdXRHb2luZ0ZsaWdodCgpLnNlYXRtYXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzY29wZS5pc0Vjb25vbXlUZXh0ID0gYXBpLmdldENhYmluZXRSZXR1cm5pbmdDbGFzcygpO1xuICAgICAgICAgIHNlYXRtYXAgPSBhcGkuZ2V0Q2hvc2VuUmV0dXJuaW5nRmxpZ2h0KCkuc2VhdG1hcDtcbiAgICAgIH1cblxuXG5cbiAgICAgIHZhciBhbHBoYWJpdHMgPSBbJ0EnLCAnQicsICdDJywgJ0QnLCAnRScsICdGJywgJ0cnLCAnSCcsICdJJywgJ0onLCAnSycsICdMJywgXCJNXCIsIFwiTlwiXTtcbiAgICAgIHZhciBzY2hlbWEgPSBbMywgNSwgMywgMjBdO1xuXG4gICAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAgICRzY29wZS5hcnJheTIgPSBbXTtcblxuICAgICAgJHNjb3BlLmFycmF5MyA9IFtdO1xuXG4gICAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzBdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkxLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVsxXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgICAgYWxwaGFiaXRzLnNwbGljZSgwLCAxKTtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgICAkc2NvcGUuYXJyYXkzLnB1c2goYWxwaGFiaXRzWzBdKTtcbiAgICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVszXTsgaSsrKSB7XG4gICAgICAgICAgJHNjb3BlLmJvYi5wdXNoKGkpO1xuXG4gICAgICB9XG5cblxuXG4gICAgICAkc2NvcGUuc2VhcmNoQ29sb3IgPSBmdW5jdGlvbih0ZXh0KSB7XG4gICAgICAgICAgaWYgKCEkc2NvcGUuaXNFbXB0eSh0ZXh0KSlcbiAgICAgICAgICAgICAgcmV0dXJuICdzZWF0T2N1JztcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIHJldHVybiAnc2VhdEVtcHR5JztcbiAgICAgIH1cbiAgICAgICRzY29wZS5pc0VtcHR5ID0gZnVuY3Rpb24odGV4dCkge1xuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VhdG1hcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoc2VhdG1hcFtpXVsnbnVtYmVyJ10gPT0gdGV4dCkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlYXRtYXBbaV1bJ2lzRW1wdHknXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgJHNjb3BlLnNlbGVjdFNlYXQgPSBmdW5jdGlvbihzZWF0KSB7XG4gICAgICAgICAgJHNjb3BlLnNlYXQgPSBzZWF0O1xuICAgICAgfTtcbiAgICB9XG5cblxuXG4gICAgdmFyIGFscGhhYml0cyA9IFsnQScsICdCJywgJ0MnLCAnRCcsICdFJywgJ0YnLCAnRycsICdIJywgJ0knLCAnSicsICdLJywgJ0wnLCBcIk1cIiwgXCJOXCJdO1xuICAgIHZhciBzY2hlbWEgPSBbMiwgNCwgMiwgOV07XG5cbiAgICAkc2NvcGUuYXJyYXkxID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkyID0gW107XG5cbiAgICAkc2NvcGUuYXJyYXkzID0gW107XG5cbiAgICAkc2NvcGUuYm9iID0gW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNjaGVtYVswXTsgaSsrKSB7XG4gICAgICAgICRzY29wZS5hcnJheTEucHVzaChhbHBoYWJpdHNbMF0pO1xuICAgICAgICBhbHBoYWJpdHMuc3BsaWNlKDAsIDEpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzFdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5Mi5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2NoZW1hWzJdOyBpKyspIHtcbiAgICAgICAgJHNjb3BlLmFycmF5My5wdXNoKGFscGhhYml0c1swXSk7XG4gICAgICAgIGFscGhhYml0cy5zcGxpY2UoMCwgMSk7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFbM107IGkrKykge1xuICAgICAgICAkc2NvcGUuYm9iLnB1c2goaSk7XG5cbiAgICB9XG5cblxufTtcblxuXG5pZihUeXBlID09ICdtb2JpbGUnKXtcbiAgc2VhdGluZ0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRsb2NhdGlvbicsICdhcGknXTtcbn1lbHNle1xuICBzZWF0aW5nQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCAnJGxvY2F0aW9uJywgJ2FwaScsJyRyb3V0ZVBhcmFtcyddO1xufVxuXG5cbkFwcC5jb250cm9sbGVyKCdzZWF0aW5nQ3RybCcsIHNlYXRpbmdDb250cm9sbGVyKTtcbiJdfQ==
