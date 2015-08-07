
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

        function PropertyModel ( options ) {
            // TODO: implement
            this.options = options;

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

