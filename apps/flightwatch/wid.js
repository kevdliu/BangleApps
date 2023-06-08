
(() => {
    // START

    const MAX_WIDGET_HEIGHT = Bangle.appRect.y;
    const WIDGET_TAP_VERTICAL_PADDING = 4;

    function displayFlight() {
        let lib = require("flightwatch.lib.js");
        let flight = lib.getWidgetFlightData();
        if (!flight) {
            return;
        }

        let visible = this.width > 0;
        let clock = Bangle.CLOCK == 1;
        if (clock != visible) {
            this.width = clock ? lib.calculateWidgetWidth() : 0;
            setTimeout(Bangle.drawWidgets, 0);
            return;
        }

        if (!visible) {
            return;
        }

        g.reset();
        lib.applyWidgetFont(g).setFontAlign(-1, 0);

        g.drawImage(flight.icon, this.x + lib.WIDGET_HORIZONTAL_PADDING, this.y);
        g.drawString(flight.label, this.x + lib.WIDGET_HORIZONTAL_PADDING + lib.ICON_SIZE + lib.WIDGET_SEPARATOR_WIDTH,
                this.y + (MAX_WIDGET_HEIGHT / 2) + 1);
    }

    function onTap(_, tap) {
        let widget = WIDGETS.flightwatch;
        if (!widget || widget.width == 0) {
            return;
        }

        let lib = require("flightwatch.lib.js");
        if (tap.x >= widget.x && tap.x <= (widget.x + widget.width)
                && tap.y >= (widget.y - WIDGET_TAP_VERTICAL_PADDING)
                && tap.y <= (widget.y + MAX_WIDGET_HEIGHT + WIDGET_TAP_VERTICAL_PADDING)) {
            lib.loadApp();
        } else if (tap.y > MAX_WIDGET_HEIGHT) {
            Bangle.buzz(100, 0.3);

            lib.cycleWidgetType();
            lib.refreshWidget();
        }
    }

    WIDGETS.flightwatch = {
        area: "tr",
        width: require("flightwatch.lib.js").calculateWidgetWidth(),
        draw: displayFlight,
        onTap: onTap
    };

    Bangle.on("touch", WIDGETS.flightwatch.onTap);

    // END
})();