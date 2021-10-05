/*global logger, define, require, alert, mx*/
/*jslint nomen:true, evil:true*/
/*
    JavaScriptButton
    ========================

    @file      : JavaScriptButton.js
    @version   :
    @author    : Eric Tieniber
    @date      : Thu, 3 Nov 2016 17:22:29 GMT
    @copyright :
    @license   : Apache 2

    Documentation
    ========================
    A Mendix button that runs some custom JavaScript as defined in the modeler.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/_base/event",
	"dijit/registry",
	"dojo/query",
    "dojo/text!JavaScriptButton/widget/template/JavaScriptButton.html"
], function (declare, _WidgetBase, _TemplatedMixin, dojoClass, dojoConstruct, dojoLang, dojoText, dojoEvent, dojoRegistry, dojoQuery, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("JavaScriptButton.widget.JavaScriptButton", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        theButton: null,

        // Parameters configured in the Modeler.
        contenttype: "",
		jsToExecute: "",
		jsToExecuteAfter: "",
		mfToExecute: "",
		buttonClass: "",
		buttonText:	 "",
		confirmation: false,
		confirmQuestion: "",
		okButton: "",
		cancelButton: "",
		buttonTabIndex: 0,

		//Internal variables
		_contextObj: null,
		_listener: null,

		
        /**
         * @param  {...any} args
         */
		 log(...args) {
            if (this.id) {
                args.unshift(this.id);
            }
            if (mx && mx.logger && mx.logger.debug) {
                mx.logger.debug.apply(mx.logger, args);
            } else {
                logger.debug.apply(logger, args);
            }
        },

        /**
         * @param  {...any} args
         */
        error(...args) {
            if (this.id) {
                args.unshift(this.id);
            }
            if (mx && mx.logger && mx.logger.error) {
                mx.logger.error.apply(mx.logger, args);
            } else {
                logger.error.apply(logger, args);
            }
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            this.log(".update");

			this._contextObj = obj;
            this._setupEvents();
			this._updateRendering();

            callback();
        },

        // Rerender the interface.
        _updateRendering: function () {
            this.log("._updateRendering");
			this.theButton.innerHTML = this.buttonText;

			this.theButton.setAttribute("tabIndex", this.buttonTabIndex);

			if (this.buttonClass !== "") {
				dojoClass.add(this.theButton, this.buttonClass);
			}
        },

		_setupEvents: function () {
			if (this._listener) {
				this.disconnect(this._listener);
			}

			if (this.confirmation) {
				if (this.jsToExecute) {
					this._listener = this.connect(this.theButton, "click", this._confirm(this._executeJSBefore));
				} else if (this.mfToExecute) {
					this._listener = this.connect(this.theButton, "click", this._confirm(this._executeMicroflow));
				}
			} else {
				if (this.jsToExecute) {
					this._listener = this.connect(this.theButton, "click", this._executeJSBefore);
				} else if (this.mfToExecute) {
					this._listener = this.connect(this.theButton, "click", this._executeMicroflow);
				}
			}
		},

		_confirm: function (callback) {
			return function () {
				mx.ui.confirmation({
					content: this.confirmQuestion,
					proceed: this.okButton,
					cancel: this.cancelButton,
					handler: dojoLang.hitch(this, callback)
				});
			};
		},

		_executeMicroflow: function () {
			if (this.mfToExecute && this._contextObj) {
				mx.data.action({
					params: {
						actionname: this.mfToExecute,
						applyto: "selection",
						guids: [ this._contextObj.getGuid() ]
					},
					origin: this.mxform,
					callback: dojoLang.hitch(this, function (obj) {
						if (this.jsToExecuteAfter) {
							this._executeJSAfter();
						}
					}),
					error: dojoLang.hitch(this, function (error) {
						this.error(": An error occurred while executing microflow: " + error.description);
					})
				});
			}
		},

		_executeJSBefore: function() {
			this._executeJS(this.jsToExecute);
			if (this.mfToExecute) {
				this._executeMicroflow();
			}
		},
		_executeJSAfter: function() {
			this._executeJS(this.jsToExecuteAfter);
		},
		_executeJS: function(js) {
			if (this.contenttype == "jsjQuery") {
				require(["JavaScriptButton/lib/jquery-1.11.2"], this._evalJS.bind(this,js));
			} else {
				this._evalJS(js);
			}
		},

		_evalJS: function (js) {
			try {
				eval(js + "\r\n//# sourceURL=" + this.id + ".js");
			} catch (e) {
				dojoConstruct.place("<div class=\"alert alert-danger\">Error while evaluating javascript input: " + e + "</div>", this.domNode, "only");
			}
		}


	});
});

require(["JavaScriptButton/widget/JavaScriptButton"], function () {
    "use strict";
});
