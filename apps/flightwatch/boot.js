
(function() {
    // START

    global.qsFlightListeners = {};

    global.qsFlight = (flight) => {
        let lib = require("flightwatch.lib.js");
        require("Storage").write(lib.APP_DATA_PATH, flight);

        Bluetooth.println(`qs://result/ok?message=${encodeURIComponent("Flight Saved")}\n`);

        lib.refreshWidget();

        for (let k in global.qsFlightListeners) {
            let l = global.qsFlightListeners[k];
            l();
        }
    };

    // END
})();
