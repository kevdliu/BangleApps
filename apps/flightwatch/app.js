{
    const LISTENER_NAME = "flightwatch_app";

    let root = null;

    let displaySettings = function() {
        require("flightwatch.menu.js").displayAppSettings(function() {
            refreshFlight();
        });
    };

    let refreshFlight = function() {
        g.clearRect(Bangle.appRect);
        displayFlight();
        subscribe();
    };

    let swipeHandler = function(directionLR, directionUD) {
        if (directionLR != 0) {
            displaySettings();
        }
    };

    let subscribe = function() {
        Bangle.on("swipe", swipeHandler);
        global.qsFlightListeners[LISTENER_NAME] = refreshFlight;
    };

    let unsubscribe = function() {
        Bangle.removeListener("swipe", swipeHandler);
        delete global.qsFlightListeners[LISTENER_NAME];
    };

    let createLayout = function(flight) {
        let options = {
            lazy: true,
            back: function() { Bangle.showClock(); },
            remove: function() { unsubscribe(); }
        };

        let Layout = require("Layout");
        if (flight.id) {
            root = new Layout(
                {
                    type:"v", c: [
                        {
                            type: "h", c: [
                                {type: "img", pad: 4, src: function() {
                                    return require("flightwatch.lib.js").getIdIcon();
                                }},
                                {type: "txt", font: "12%", id: "id", pad: 4}
                            ]
                        },
                        {
                            type: "h", c: [
                                {type: "img", pad: 4, src: function() {
                                    return require("flightwatch.lib.js").getGateIcon();
                                }},
                                {type: "txt", font: "12%", id: "gate", pad: 4}
                            ]
                        },
                        {
                            type: "h", c: [
                                {type: "img", pad: 4, src: function() {
                                    return require("flightwatch.lib.js").getBoardingIcon();
                                }},
                                {type: "txt", font: "12%", id: "boarding", pad: 4}
                            ]
                        },
                        {
                            type: "h", c: [
                                {type: "img", pad: 4, src: function() {
                                    return require("flightwatch.lib.js").getDepartureIcon();
                                }},
                                {type: "txt", font: "12%", id: "departure", pad: 4}
                            ]
                        },
                        {
                            type: "h", c: [
                                {type: "img", pad: 4, src: function() {
                                    return require("flightwatch.lib.js").getArrivalIcon();
                                }},
                                {type: "txt", font: "12%", id: "arrival", pad: 4}
                            ]
                        }
                    ]
                },
                options
            );
        } else {
            root = new Layout(
                {
                    type: "h", c: [
                        {type: "img", pad: 4, src: function() {
                            return require("flightwatch.lib.js").getIdIcon();
                        }},
                        {type: "txt", font: "12%", id: "id", pad: 4}
                    ]
                },
                options
            );
        }
    };

    let displayFlight = function() {
        let lib = require("flightwatch.lib.js");
        let flight = lib.getAllFlightData();
        createLayout(flight);

        if (flight.id) {
            root.id.label = flight.id;
            root.gate.label = flight.gate || "N/A";
            root.boarding.label = flight.boarding || "N/A";
            root.departure.label = flight.departure || "N/A";
            root.arrival.label = flight.arrival || "N/A";
            root.render();
        } else {
            root.id.label = "No flight info";
            root.render();
        }
    };

    // START

    g.clear();
    Bangle.loadWidgets();
    Bangle.drawWidgets();

    refreshFlight();

    // END
}