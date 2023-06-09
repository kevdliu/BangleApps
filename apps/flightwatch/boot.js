
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

    global.qsUpdateAGPS = (data, gnss) => {
        let decoded = decodeURIComponent(data);
        let bin = atob(decoded);

        function appendCasicChecksum(cmd) {
            var cs = 0;
            for (var i = 1; i < cmd.length; i++) {
                cs = cs ^ cmd.charCodeAt(i);
            }
            return cmd + "*" + cs.toString(16).toUpperCase().padStart(2, '0');
        }

        const appTag = "QS";
        try {
            Bangle.setGPSPower(true, appTag);

            let serial = appendCasicChecksum("$PCAS04," + gnss);
            Serial1.println(serial);

            serial = appendCasicChecksum("$PCAS03,1,0,0,1,1,0,0,0");
            Serial1.println(serial);

            const chunkSize = 128;
            for (var i = 0; i < bin.length; i += chunkSize) {
                let chunk = bin.substr(i, chunkSize);
                Serial1.write(atob(btoa(chunk)));
            }

            Bluetooth.println(`qs://result/ok?message=${encodeURIComponent("Updated AGPS")}`);
        } catch(e) {
            Bluetooth.println(`qs://result/error?message=${encodeURIComponent(e.message)}`);
        } finally {
            Bangle.setGPSPower(false, appTag);
        }
    };

    // END
})();
