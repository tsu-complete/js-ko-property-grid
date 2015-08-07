
;(function ( factory ) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["knockout"], factory);
    } else if ("undefined" !== typeof module) {
        factory(require("knockout"));
    } else {
        factory(window.ko);
    }

})(function ( ko ) {
    "use strict";

    var PropertyModel, PropertyGridViewModel;

    PropertyModel = (function ( ) {
        var proto;

        /**
         * model normalization for properties
         * @class PropertyModel
         * @param {Object} options              property settings
         * @param {String} options.key          property key
         * @param {String} [options.name]       alias for key
         * @param {String} [options.id]         alias for key
         * @param {String} [options.title=name] property display name
         * @param {String} [options.display]    alias for title
         * @param {String} [options.type="string"] property expected type
         * @param {String} [options.group]      used for groupby
         * @param {String} [options.set]        alias for group
         * @param {String} [options.list]       alias for group
         * @param {*}      [options.value]      initial value
         * @param {*}      [options.initial]    alias for value
         * @param {*}      [options.default]    alias for value
         */
        function PropertyModel ( options ) { // jshint maxcomplexity:20
            if (!options) {
                throw new TypeError(
                    "PropertyModel#constructor: expected options");
            }

            if ("string" === typeof options) {
                options = { key: options };
            }

            this.key = String(options.key || options.name || options.id || "");

            if (!this.key) {
                throw new TypeError(
                    "PropertyModel#constructor: expected key|name|id");
            }

            this.title = String(options.title || options.display || "") ||
                this.name.replace(/([a-z])([A-Z])|_/g, "$1 $2")
                    .replace(/\b\w+/g, function( title ) {
                        return title.charAt(0).toUpperCase() +
                            title.substr(1).toLowerCase();
                    });

            this.type = String(options.type || "string");

            this.group = String(
                options.group || options.set || options.list || "");

            this.value = String(
                options.value || options.initial || options["default"] || "");
        }

        proto = PropertyModel.prototype;

        return PropertyModel;
    })();

    PropertyGridViewModel = (function (  ) {
        var proto;

        function PropertyGridViewModel ( params ) {
            // TODO: implement
            this.params = params;

        }

        proto = PropertyGridViewModel.prototype;

        return PropertyGridViewModel;
    })();

    ko.components.register("property-grid", {
        viewModel: PropertyGridViewModel
    ,   synchronous: true
    ,   template: "<!-- TODO -->"
    });

    ko.property_grid = {
        PropertyModel: PropertyModel
    };

    return ko;
});

