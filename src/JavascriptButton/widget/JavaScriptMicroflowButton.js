require([
    "dojo/_base/declare", "JavaScriptButton/widget/JavaScriptButton"
], function(declare, _jsButtonWidget) {
    return declare("JavaScriptButton.widget.JavaScriptMicroflowButton", [_jsButtonWidget], {
    })
});
require(["JavaScriptButton/widget/JavaScriptMicroflowButton"], function() {
    "use strict";
});
