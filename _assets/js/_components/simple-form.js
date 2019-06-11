////////////////////////////////////////////////////////////////////////////////
//    Simple form
////////////////////////////////////////////////////////////////////////////////
var simpleForm = (function functionName() { // IIFE to control scope of form code

  var form = {
    element: $('.signup-form'),
    inputClass: 'js-form-input',
    isOnPage: function () { return this.element.length > 0; },
    statusMessages: [],
  };

  // is the competition form on the page?
  if (form.isOnPage()) {
    // setting up the form
    formFunctions(form).init();
    // submit form function
    form.element.submit(function(e){
      if (formValidation(form).isValid()) {
        formFunctions(form).addEntryTimestamp();
        formFunctions(form).submissionInProgress();
      } else {
        e.preventDefault(); // stop the default submit function
        formValidation(form).scrollToFirstError();
      }
    });
  }

}());