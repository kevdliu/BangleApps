const GNSS_TYPES = [
    {type: "1", label: "GPS"},
    {type: "2", label: "BAIDU"},
    {type: "3", label: "GPS & BAIDU"},
    {type: "4", label: "GLONASS"},
    {type: "5", label: "GPS & GLONASS"},
    {type: "6", label: "BAIDU & GLONASS"},
    {type: "7", label: "GPS & BAIDU & GLONASS"}
];

const GPS_TAG = "QS_AGPS";

function removeDataFile() {
    let lib = require("flightwatch.lib.js");
    require("Storage").erase(lib.AGPS_DATA_FILE);
}

function appendCasicChecksum(cmd) {
    var cs = 0;
    for (var i = 1; i < cmd.length; i++) {
        cs = cs ^ cmd.charCodeAt(i);
    }
    return cmd + "*" + cs.toString(16).toUpperCase().padStart(2, '0');
}

function updateAGPS(data, gnss, label) {
    let decoded = decodeURIComponent(data);
    let bin = atob(decoded);

    try {
        Bangle.setGPSPower(true, GPS_TAG);

        let serial = appendCasicChecksum("$PCAS04," + gnss);
        Serial1.println(serial);
        Serial1.flush();

        serial = appendCasicChecksum("$PCAS03,1,0,0,1,1,0,0,0");
        Serial1.println(serial);
        Serial1.flush();

        const chunkSize = 128;
        for (var i = 0; i < bin.length; i += chunkSize) {
            let chunk = bin.substr(i, chunkSize);
            Serial1.write(atob(btoa(chunk)));
            Serial1.flush();
        }

        return {title: "Success", message: `Updated AGPS data for ${label}`};
    } catch(e) {
        return {title: "Update Failed", message: e.message};
    } finally {
        setTimeout(() => {
            Bangle.setGPSPower(false, GPS_TAG);
        }, 1000);
    }
}

function readAGPS(gnss, label) {
    let lib = require("flightwatch.lib.js");
    let agps = require("Storage").readJSON(lib.AGPS_DATA_FILE, true) || {};
    if (agps.data) {
        showProgress();

        let result = updateAGPS(agps.data, gnss, label);
        E.showMessage();
        showResult(result.title, result.message);
    } else {
        showResult("Update Failed", "Cannot find AGPS data file");
    }
}

function showResult(title, message) {
    let options = {
        buttons: {"OK": true, "Back": false}
    };

    if (title) {
        options.title = title;
    }

    E.showPrompt(message, options).then(function(v) {
        if (v) {
            removeDataFile();
            Bangle.showClock();
        } else {
            showMenu();
        }
    });
}

function showProgress() {
    E.showMessage("Updating AGPS data");
}

function showConfirmation(gnss, label) {
    E.showPrompt(`Update AGPS data for ${label}?`,
    {
        buttons: {"Update": true, "Cancel": false}
    }).then(function(v) {
        if (v) {
            readAGPS(gnss, label);
        } else {
            showMenu();
        }
    });
}

function showMenu() {
    let menu = [];
    GNSS_TYPES.forEach(function(gnss) {
        menu[gnss.label] = function() {
            E.showMenu();
            showConfirmation(gnss.type, gnss.label);
        };
    });
    menu[""] = {
        title: "AGPS Update",
        back: function() {
            removeDataFile();
            Bangle.showClock();
        }
    };

    E.showMenu(menu);
}

g.clear();
showMenu();
