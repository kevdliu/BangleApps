// Constants

const MAX_WIDGET_WIDTH = Bangle.appRect.w * 0.75;

const WIDGET_HORIZONTAL_PADDING = 4;
exports.WIDGET_HORIZONTAL_PADDING = WIDGET_HORIZONTAL_PADDING;

const WIDGET_SEPARATOR_WIDTH = 4;
exports.WIDGET_SEPARATOR_WIDTH = WIDGET_SEPARATOR_WIDTH;

const APP_DATA_PATH = "flightwatch.app.data.json";
exports.APP_DATA_PATH = APP_DATA_PATH;

const WID_DATA_PATH = "flightwatch.wid.data.json";
exports.WID_DATA_PATH = WID_DATA_PATH;

// Icons

const ICON_SIZE = 24;
exports.ICON_SIZE = ICON_SIZE;

function getIcon(icon) {
    return require("heatshrink").decompress(atob(icon));
}

function getIdIcon() {
    return getIcon("jEY4MA/4ACCps4AQN4g8A+EH/PggP/4AfBwEAn4CBj4FEv4CB+fAh/h4ED4PAgPADQPA8ACBoA5L");
}
exports.getIdIcon = getIdIcon;

function getGateIcon() {
    return getIcon("jEY4MA/4ACB49AgEB8EYgfgn+H4EP/+AgYWC/wCBvwFDgICBgfsuEf4H4j+B7kHgOMgcB7kDgH4gICBDYNwAQkgH4oA=");
}
exports.getGateIcon = getGateIcon;

function getBoardingIcon() {
    return getIcon("jEY4MA/4ACBw3AgEB8ACDBAQAChgIBhoCU/waBGIICBwEGE4MD/1ggP+mBPI");
}
exports.getBoardingIcon = getBoardingIcon;

function getDepartureIcon() {
    return getIcon("jEY4MA/4ACCZcDwEAgPAAwPgAQPwAQN4AQN8vkAn/8mF//Eb/+Aj/4gEPDQMMFhUf//4AQQOIA==");
}
exports.getDepartureIcon = getDepartureIcon;

function getArrivalIcon() {
    return getIcon("jEY4MA/4ACBw0wAQk4AQ0QngfBAQMeAQMf/gCB/0AgP/4AGB/AGBAQIkDAA0f//4AQQOIA==");
}
exports.getArrivalIcon = getArrivalIcon;

// Widget Types

const WIDGET_TYPES = [
    {title: "Flight", key: "id", icon: getIdIcon},
    {title: "Gate", key: "gate", icon: getGateIcon},
    {title: "Boarding", key: "boarding", icon: getBoardingIcon},
    {title: "Departure", key: "departure", icon: getDepartureIcon},
    {title: "Arrival", key: "arrival", icon: getArrivalIcon}
];
exports.WIDGET_TYPES = WIDGET_TYPES;

// Functions

exports.loadApp = function() {
    Bangle.load("flightwatch.app.js");
};

function getSelectedWidget() {
    let widgetSettings = require("Storage").readJSON(WID_DATA_PATH, true) || {};
    return widgetSettings.selected || "id";
}
exports.getSelectedWidget = getSelectedWidget;

function selectWidget(type) {
    require("Storage").writeJSON(WID_DATA_PATH, {selected: type});
}
exports.selectWidget = selectWidget;

function cycleWidgetType() {
    let selected = getSelectedWidget();
    var index = WIDGET_TYPES.findIndex(e => e.key == selected);
    index++;
    if (index >= WIDGET_TYPES.length) {
        index = 0;
    }
    selectWidget(WIDGET_TYPES[index].key);
}
exports.cycleWidgetType = cycleWidgetType;

function getAllFlightData() {
    return require("Storage").readJSON(APP_DATA_PATH, true) || {};
}
exports.getAllFlightData = getAllFlightData;

function getWidgetFlightData() {
    let flight = getAllFlightData();
    if (!flight.id) {
        return null;
    }

    let selected = getSelectedWidget();
    let type = WIDGET_TYPES.find(e => e.key == selected);
    let label = flight[selected] || "N/A";
    return {label: label, icon: type.icon()};
}
exports.getWidgetFlightData = getWidgetFlightData;

function applyWidgetFont(g) {
    return g.setFont("Vector", 18);
}
exports.applyWidgetFont = applyWidgetFont;

function calculateWidgetWidth() {
    let flight = getWidgetFlightData();
    if (!flight) {
        return 0;
    }

    let gg = g;

    g.reset();
    let width = applyWidgetFont(g).stringWidth(flight.label);

    g = gg;
    return Math.min(width + ICON_SIZE + WIDGET_SEPARATOR_WIDTH + (WIDGET_HORIZONTAL_PADDING * 2),
            MAX_WIDGET_WIDTH);
}
exports.calculateWidgetWidth = calculateWidgetWidth;

function refreshWidget() {
    if (WIDGETS.flightwatch) {
        WIDGETS.flightwatch.width = calculateWidgetWidth();
        Bangle.drawWidgets();
    }
}
exports.refreshWidget = refreshWidget;
