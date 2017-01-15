# JavaScript Button + JavaScript Microflow Button

This widget package offers 2 widgets:
 - JavaScript Button
 - JavaScript Microflow Button

## Contributing

For more information on contributing to this repository visit [Contributing to a GitHub repository](https://world.mendix.com/display/howto50/Contributing+to+a+GitHub+repository)!

## Description

### JavaScript Button

Renders a button, and allows you to run some custom JS on click of that button.
Does not require a context object.

### JavaScript Microflow Button

Renders a button, and allows you to run some custom JS on click of that button. After the JS executes, a microflow is also called.
Requires a context object.

## Configurations

Both widgets have similar properties, with the exception of the microflow that can be selected for the JS Microflow Buttton:

Behavior:
 - Content type: Choose plain JavaScript or JS with the JQuery library loaded. JQuery is available as the standard $ variable.
 - JavaScript: the JavaScript to execute. The context object is avaialble at "this.\_contextObj".
 - Prompt for confirmation: whether the button prompts for confirmation before executing the JavaScript or JS + Microflow.
 - Confirm question: If Prompt for confirmation is selected, this is the question that will be asked
 - Proceed text: If Prompt for confirmation is selected, this is the Proceed/OK/Yes button text
 - Cancel text: If Prompt for confirmation is selected, this is the Cancel/No button text

Appearance:
 - Button text: The label on the button
 - Button CSS Class: A list of CSS classes applied to the button. Add spaces between classes like in the modeler
 - Button Tab Index: The tab index of the button (Default 0)
