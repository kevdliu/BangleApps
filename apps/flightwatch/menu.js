
var selected = null;

function selectWidget(type) {
    let lib = require("flightwatch.lib.js");
    lib.selectWidget(type);
    lib.refreshWidget();
}

function clearFlightData() {
    let lib = require("flightwatch.lib.js");
    require("Storage").writeJSON(lib.APP_DATA_PATH, {});
    lib.refreshWidget();
}

function displayAppSettings(backHandler) {
    let lib = require("flightwatch.lib.js");

    let types = lib.WIDGET_TYPES;
    selected = lib.getSelectedWidget();

    let menu = {
        "": {
            title: "Settings",
            back: function() { backHandler(); }
        },
        "Widget": {
            value: types.findIndex(e => e.key == selected),
            format: v => types[v].title,
            min: 0,
            max: types.length - 1,
            step: 1,
            onchange: function(v) {
                let key = types[v].key;
                selected = key;
                selectWidget(key);
            }
        },
        "Delete Flight": function() {
            E.showPrompt("Delete all flight data?",
            {
                buttons: {"Delete": true, "Cancel": false}
            }).then(function(v) {
                if (v) {
                    clearFlightData();
                }
                backHandler();
            });
        },
        "Home": function() { Bangle.showClock(); }
    };

    E.showMenu(menu);
}
exports.displayAppSettings = displayAppSettings;
