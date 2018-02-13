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

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function (obj, callback) {
            logger.debug(this.id + ".update");

			this._contextObj = obj;
            this._setupEvents();
			this._updateRendering();

            callback();
        },

        // Rerender the interface.
        _updateRendering: function () {
            logger.debug(this.id + "._updateRendering");
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
					this._listener = this.connect(this.theButton, "click", this._confirm(this._executeJS));
				} else if (this.mfToExecute) {
					this._listener = this.connect(this.theButton, "click", this._confirm(this._executeMicroflow));
				}
			} else {
				if (this.jsToExecute) {
					this._listener = this.connect(this.theButton, "click", this._executeJS);
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
			if (this.mfToExecute) {
				mx.ui.action(this.mfToExecute, {
					progress: "nonmodal",
					progressMsg: "",
					params: {
						applyto: "selection",
						//actionname: this.mfToExecute,
						guids: [ this._contextObj.getGuid() ]
					},
					origin: this.mxform,
					callback: function (obj) {
						//TODO what to do when all is ok!
					},
					error: dojoLang.hitch(this, function (error) {
						logger.error(this.id + ": An error occurred while executing microflow: " + error.description);
					})
				}, this);
			}
		},

		_executeJS: function() {
			if (this.contenttype == "jsjQuery") {
				require(["JavaScriptButton/lib/jquery-1.11.2"], dojoLang.hitch(this, this._evalJS));
			} else {
				this._evalJS();
			}
		},

		_evalJS: function () {
			try {
				eval(this.jsToExecute + "\r\n//# sourceURL=" + this.id + ".js");
			} catch (e) {
				dojoConstruct.place("<div class=\"alert alert-danger\">Error while evaluating javascript input: " + e + "</div>", this.domNode, "only");
			}
			this._executeMicroflow();
		}


	});
});

require(["JavaScriptButton/widget/JavaScriptButton"], function () {
    "use strict";
});
