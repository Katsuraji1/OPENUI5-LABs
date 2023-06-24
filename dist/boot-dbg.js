// configuration object
window["sap-ui-config"] = {
    "theme": (function () {
        // determine the proper theme for UI5 from current color scheme
        try {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "sap_horizon_dark" : "sap_horizon";
        } catch (ex) {
            console.warn("window.matchMedia not supported - keep default theme");
            return "sap_horizon";
        }
    })()
};