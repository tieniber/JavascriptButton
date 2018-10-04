require([
    "dojo/_base/declare", "JavaScriptButton/widget/JavaScriptButton"
], function (declare, _jsButtonWidget) {
    return declare("JavaScriptButton.widget.JavaScriptNanoflowButton", [_jsButtonWidget], {
    })
});
require(["JavaScriptButton/widget/JavaScriptNanoflowButton"], function () {
    "use strict";
});
