
;(function ( factory ) {
    "use strict";

    if ("function" === typeof define && define.amd) {
        define(["knockout", "underscore"], factory);
    } else if ("undefined" !== typeof module) {
        factory(require("knockout"), require("underscore"));
    } else {
        factory(window.ko, window._);
    }

})(function ( ko, _ ) {
    "use strict";

    var PropertyModel, PropertyGridViewModel, make_anonymous;

    make_anonymous = function ( template ) {
        var element;
        if ("string" === typeof template) {
            element = document.createElement("div");
            element.innerHTML = template;
        }
        new ko.templateSources.anonymousTemplate(element).nodes(element);
        return element;
    };

    if (!ko.isObservableArray) {
        ko.isObservableArray = function ( object ) {
            return ko.isObservable(object) && "function" === typeof object.push;
        };
    }

    ko.PropertyModel = PropertyModel = (function ( ) {
        var proto;

        /**
         * model normalization for properties
         * @class PropertyModel
         * @param {Object|String} options       property settings
         * @param {String} options.key          property key
         * @param {String} [options.name]       alias for key
         * @param {String} [options.id]         alias for key
         * @param {String} [options.title=key]  property display name
         * @param {String} [options.display]    alias for title
         * @param {String} [options.type]       property expected type
         * @param {String} [options.template]   override type based template
         * @param {String} [options.group=""]   used for groupby
         * @param {String} [options.set]        alias for group
         * @param {String} [options.list]       alias for group
         * @param {*}      [options.value]      initial value or observable
         * @param {*}      [options.initial]    starting value for property
         * @param {*}      [options.default]    alias for initial
         */
        function PropertyModel ( options ) { // jshint maxcomplexity:20
            if (!options) {
                throw new TypeError("PropertyModel#constructor: " +
                "expected options");
            }

            if ("string" === typeof options) {
                options = { key: options };
            }

            this.key = String(options.key || options.name || options.id || "");

            if (!this.key) {
                throw new TypeError("PropertyModel#constructor: " +
                "expected key | name | id");
            }

            this.title = options.title || options.display || this.key;

            this.group = String(
                options.group || options.set || options.list || "");

            if (ko.isObservable(options.value)) {
                this.value = options.value;
            } else {
                this.value = ko.observable(
                    options.value || options.initial ||
                    options["default"] || "");
            }

            this.type = String(options.type || typeof this.value.peek());

            this.template = make_anonymous(options.template ||
                PropertyModel.templates[this.type] ||
                PropertyModel.templates.string);
        }

        /**
         * store default templates
         * @memberof PropertyModel
         * @property templates
         * @static
         */
        PropertyModel.templates = {
            "string": "<input data-bind='value:$data'/>"
        ,   "number": "<input data-bind='value:$data'/>"
        ,   "boolean": "<input type='checkbox' data-bind='checked:value'/>"
        ,   "object": "<span data-bind='text:value.constructor.name'></span>"
        ,   "function": "<span data-bind='text:value.name'></span>"
        };

        proto = PropertyModel.prototype;

        return PropertyModel;
    })();

    PropertyGridViewModel = (function (  ) {
        var proto;

        /**
         * view model for property grid component
         * @class PropertyGridViewModel
         * @param {Object}               params           component parameters
         * @param {Object|Array<Object>} params.schema         property models
         * @param {Object|Array<Object>} [params.definitions] alias for schema
         * @param {Object|Array<Object>} [params.defs]        alias for schema
         * @param {Object|Array<Object>} [params.properties]  alias for schema
         * @param {Object|Array<Object>} [params.props]       alias for schema
         * @param {String}               [params.header]   template for header
         * @param {String}               [params.label]    template for labels
         */
        function PropertyGridViewModel ( params ) {
            var schema;

            if (!params) {
                throw new TypeError("PropertyGridViewModel#constructor: " +
                "expected params");
            }

            params.schema = params.schema ||
                params.definitions || params.defs ||
                params.properties  || params.props;

            if (!params.schema) {
               throw new TypeError("PropertyGridViewModel#constructor: " +
                "expected schema | definitions | defs | properties | props");
            }

            schema = ko.isObservable(params.schema) ? params.schema
                : ko.observable(params.schema);

            this.groups = ko.computed(function ( ) {
                return _.chain(schema())
                    .map(function ( scheme, name ) {
                        if ("string" === typeof name) {
                            // must be key to override all other aliases
                            scheme.key = name;
                        }
                        return new PropertyModel(scheme);
                    })
                    .groupBy("group")
                    .map(function ( group, name ) {
                        return {
                            name: name
                        ,   data: ko.observableArray(group)
                        };
                    })
                    .value();
            });

            this.header = make_anonymous(params.header ||
                "<header data-bind='text:name'></header>");
            this.label = make_anonymous(params.label ||
                "<label data-bind='text:title'></label>");
        }

        proto = PropertyGridViewModel.prototype;

        return PropertyGridViewModel;
    })();

    ko.bindingHandlers.anonymous_replace = {
        init: function (
                element
            ,   valueAccessor
            // jshint unused: false
            // reason; need last perameter but not these
            ,   allBindingsAccessor
            ,   viewModel
            // jshint unused: true
            ,   bindingContext
        ) {
            var property = valueAccessor();
            ko.renderTemplate(property.template,
                bindingContext.createChildContext(property.data, "value"),
                { }, element, "replaceNode");
        }
    };


    ko.components.register("property-grid", {
        viewModel: PropertyGridViewModel
    ,   synchronous: true
    ,   template:
    "<!-- ko foreach: {data:groups, as:'group'} -->" +
    "<section data-bind='attr:{group:group.name}'>" +
        "<div data-bind='" +
            "anonymous_replace:{template:$parent.header,data:group}" +
        "'></div>" +
        "<ul><!--ko foreach:{data:group.data,as:'property'}-->" +
        "<li data-bind='attr:{type:property.type,name:property.key}'>" +
            "<div data-bind='" +
                "anonymous_replace:{template:$parents[1].label,data:property}" +
            "'></div>" +
            "<div data-bind='" +
                "anonymous_replace:{template:template,data:property.value}" +
            "'></div>" +
        "</li><!-- /ko --></ul>" +
    "</section><!--/ko-->"
    });

    return ko;
});

