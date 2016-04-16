  App.config(function($translateProvider) {
    $translateProvider.translations('en', {
        MAIN: {
            BOOK_NOW: 'Jetzt buchen',
            FROM: 'von',
            DEPARTURE_DATE: 'Hinflug',
            TO: 'nach',
            UNDER_2_YEARS: 'Jünger als 2 Jahren',
            ROUND_TRIP: 'Round Trip',
            ONE_WAY: 'Nur Hinflug',
            SEARCH_FOR_FLIGHTS: 'Flüge suchen',
            YEARS: "Jahre",
            CHILDREN: 'Kinder',
            CHILD: 'Kind',
            ADULT: 'Erwachsener',
            ADULTS: 'Erwachsenen',
            INFANTS: 'Babys',
            INFANT: 'Baby',
            QUOTES_HOME: {
                1: "Simple, convenient, instant confirmation.",
                2: "Destinations all around the globe.",
                3: "Experience authentic hospitality.",
                4: "Time to get enchanted."
            }
        },
        FLIGHTS: {
          TITLE: 'Einen Flug aussuchen',
          ECONOMY: 'Economy',
          BUSINESS: 'Business',
          SEATS_LEFT: 'freie Sitzplätze',
          MORE_DETAILS: 'Mehr Detais',
          BOOK: 'buchen',
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
          PASSENGER : 'Passagier',
          PASSENGERS : 'Passagiere'
        },
        NAV: {
          NEXT: 'weiter',
          BACK: 'Zurück',
          SPECIAL_OFFERS: 'Spezielle Angebote',
          SERVICES: 'Dienstleistungen',
          OUR_TEAM: 'Unser Team',
          ABOUT: 'Über uns',
          CONTACT_US: 'Unser Kontakt'
        }

    });
    $translateProvider.translations('de', {

    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escape');

});
