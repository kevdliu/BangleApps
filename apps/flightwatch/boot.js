(function() {
    // START

    global.qsFlightListeners = {};

    global.qsFlight = (flight) => {
        let lib = require("flightwatch.lib.js");
        require("Storage").write(lib.APP_DATA_PATH, flight);

        Bluetooth.println(`qs://result/ok?message=${encodeURIComponent("Flight Saved")}`);

        lib.refreshWidget();

        for (let k in global.qsFlightListeners) {
            let l = global.qsFlightListeners[k];
            l();
        }
    };

    global.qsUpdateAGPS = (data) => {
        let lib = require("flightwatch.lib.js");
        require("Storage").writeJSON(lib.AGPS_DATA_FILE, {
            data: data
        });

        Bluetooth.println(`qs://result/ok?message=${encodeURIComponent("AGPS Data Downloaded")}`);

        Bangle.load("flightwatch.agps.js");
    };

    // END
})();
