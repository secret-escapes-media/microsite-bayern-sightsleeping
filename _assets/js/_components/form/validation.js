var formValidation = (function functionName(form) {

  /////////////////////////////////////////////////////// set function variables

  var invalidData; // stores boolean of if data is ready to submit
  var inputErrorClass = 'has-error';
  var inputErrorMessageClass = 'input__error-message';
  var errorMessages = {
    'text': 'Please fill in',
    'email': {
      'blank': 'Please enter your email address',
      'wrong': 'Please enter a valid email address'
    },
    'radio': 'Please select an answer for this question',
    'checkbox': 'Please select an answer for this question',
    'select': 'Please select an option from this list',
    'textarea': 'Please fill in a response over 100 characters',
  };


  //////////////////////////////////////////////////////////// private functions

  // is this input required for form submission?
  function isInputRequired(formInput, inputErrorMessage){
    if ( typeof $(formInput).data('required') !== 'undefined' ) { // does this input have the required attribute?
      showInputErrorMessage(formInput, inputErrorMessage);
    }
  }

  // show error message for specific form input
  function showInputErrorMessage(input, inputErrorMessage){
    var inputParentElement = $(input).closest('.' + form.inputClass); // find parent container
    var inputErrorElement = inputParentElement.find('.' + inputErrorMessageClass); // look for an existing error message element
    // is there an error message already in this input and does the parent have the class?
    if ( inputParentElement.hasClass(inputErrorClass) && inputErrorElement.length) {
      // find the error message
      var existingInputErrorMessage = inputErrorElement.text();
      // if the messages are not the same, update the element
      if (inputErrorMessage !== existingInputErrorMessage) {
        inputErrorElement.text(inputErrorMessage);
      }
    } else {
      // create element
      var errorElement = document.createElement('div');
       // add class
      errorElement.className = inputErrorMessageClass;
       // add content
      var errorMessage = document.createTextNode(inputErrorMessage);
      errorElement.append(errorMessage);
      // add to page
      $(inputParentElement).append(errorElement).addClass(inputErrorClass);
    }
    // if an error is shown that means there is invalid content, set the global status so that the form isn't submitted
    invalidData = true;
    watchInputForCorrectedData(input, inputParentElement);
  }

  function removeInputErrorMessage(input) {
    // find the parent and the error elements
    var inputParent = $(input).closest('.' + form.inputClass);
    var inputParentErrorClass = inputParent.hasClass(inputErrorClass);
    var inputParentErrorElement = inputParent.find('.' + inputErrorMessageClass);
    // does the input element have an error shown to remove?
    if (inputParentErrorClass && inputParentErrorElement ) {
      inputParent.removeClass(inputErrorClass);
      inputParentErrorElement.remove();
      $(input).off();
    }
  }

  function watchInputForCorrectedData(input, inputParentElement) {
    var $input = $(input);
    var $parent = $(inputParentElement);
    $input.off(); // remove event hanlder if input is already watched
    // find the type of input as interaction differs
    var inputType;
    var inputElement = $input[0].tagName;
    switch (inputElement) {
      case 'INPUT':
        inputType = $input.attr('type');
      break;
      case 'SELECT':
        inputType = 'select';
      break;
      case 'TEXTAREA':
        inputType = 'textarea';
      break;
    }
    // choose method of watching depending on input type
    switch (inputType) {
      case 'text':
        $input.on('keyup',function() {
          formValidateText();
        });
      break;
      case 'email':
        $input.on('keyup',function() {
          formValidateEmail();
        });
      break;
      case 'radio':
        $parent.find('input[type=radio]').on('click',function() {
          removeInputErrorMessage(this); // any click on a radio button selects, so no need to check if its a valid entry
        });
      break;
      case 'checkbox':
        $parent.find('input[type=checkbox]').on('click',function() {
          removeInputErrorMessage(this); // any click on a checkbox selects, so no need to check if its a valid entry
        });
      break;
      case 'select':
        $input.on('change',function() {
          formValidateSelect();
        });
      break;
      case 'textarea':
        $input.on('keyup',function() {
          formValidateTextLong();
        });
      break;

    }
  }

  function formValidateText() {
    // check all text inputs in form aren't blank
    form.element.find('input[type=text]').each(function() { // validate all text inputs
      var inputValue = $(this).val();
      if ( inputValue === '' || (/^\s+$/).test(inputValue) ) { // if empty or just whitespace - check if required
        isInputRequired(this, errorMessages.text);
      } else {
        // there is no error with input
        removeInputErrorMessage(this);
      }
    });
  }

  function formValidateEmail() {
    // check all email inputs in form aren't blank and are a valid email format
    form.element.find('input[type=email]').each(function() {
      var inputValue = $(this).val();
      var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // this regex formula can test the string against the correct email format of "string@string.string"
      if ( inputValue === '' ) { // if empty or whitespace - check if required
        isInputRequired(this, errorMessages.email.blank);
      } else if (!(emailRegex.test(inputValue))) {
        // reguardless of if its not required the format need to be correct wrong
        showInputErrorMessage(this, errorMessages.email.wrong);
      } else {
        // there is no error with input
        removeInputErrorMessage($(this));
      }
    });
  }

  function formValidateRadio() {
    // find and check that the radio button questions have been answered
    var radioGroups = [];
    // find all groups of radio button inputs
    form.element.find('input[type=radio]').each(function() {
      var radioGroup = $(this).attr('name');
      if ( radioGroups.indexOf(radioGroup) === -1 ) { // -1 means its not in array
        // if its a new group id, add it to the array
        radioGroups.push(radioGroup);
      }
    });
    // now groups are defined, loop through each to validate
    for (var i = 0; i < radioGroups.length; i++) {
      // find all of the inputs related to this group
      var radioGroupInputs = $('input[type=radio][name=' + radioGroups[i] + ']');
      var radioGroupSelected = false; // set status if an input has been selected
      // if input is selected, change the status for this group
      for (var j = 0; j < radioGroupInputs.length; j++) {
        if (radioGroupInputs[j].checked) {
          radioGroupSelected = true;
        }
      }
      // has no input been selected for this radio group?
      if (!(radioGroupSelected)) {
        // check if this radio group is required
        isInputRequired(radioGroupInputs[0], errorMessages.radio);
      }
    }
  }

  function formValidateCheckbox() {
    // at least one checkbox needs to be selected for each question
    var checkboxGroups = form.element.find('.js-checkbox-question');
    // loop through each checkbox question group
    checkboxGroups.each(function () {
      var checkboxes = $(this).find('input[type=checkbox]');
      var isCheckboxSelected = false;
      // loop through group to check if one option is selected
      for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
          isCheckboxSelected = true;
          break; // stop the loop as requirement is met
        }
      }
      // has no answer been selected for this checkbox question group
      if (!(isCheckboxSelected)) {
        // check if this radio group is required
        isInputRequired(checkboxes[0], errorMessages.checkbox);
      }
    });
  }

  function formValidateSelect() {
    // check all select inputs in form
    form.element.find('select').each(function() {
      var selectedOption = $(this)[0].selectedOptions[0].value;
      if (selectedOption === '') { // pre selected first option has no value
        isInputRequired(this, errorMessages.select);
      } else {
        removeInputErrorMessage(this);
      }
    });
  }

  function formValidateTextLong() {
    // check all text inputs in form aren't blank
    form.element.find('textarea').each(function() { // validate all text inputs
      var inputValue = $(this).val();
      if ( inputValue === '' || (/^\s+$/).test(inputValue) || inputValue.length < 100 ) {
        // input is empty, just whitespace or under 100 characters
        isInputRequired(this, errorMessages.textarea);
      } else { // there is no error with input
        removeInputErrorMessage(this);
      }
    });
  }


  ///////////////////////////////////////////////////////////// public functions

  function isFormDataValid() {
    // set status to false for this round of checks
    invalidData = false;
    // check all input types
    formValidateText();
    formValidateEmail();
    formValidateRadio();
    formValidateCheckbox();
    formValidateSelect();
    formValidateTextLong();
    // is data valid?
    if (invalidData) {
      return false;
    } else {
      return true;
    }
  }

  function scrollToFirstError() {
    // find first error
    var firstError = $(form.element).find('.' + form.inputClass + '.' + inputErrorClass).first();
    // scroll top of screen to first error
    $('html,body').animate({scrollTop: firstError.offset().top}, 500);
    // focus on first error input
    var firstErrorInput = firstError.find('input, select, textarea').not('input[type="hidden"]').first();
    firstErrorInput.focus();
  }


  ////////////////////////////////////////////////////// export public functions

  return {
    isValid: isFormDataValid,
    scrollToFirstError: scrollToFirstError,
  };

});






































// function showError(){
//   // scroll to first error
//   var firstError = $('.' + formInputClass + '.' + inputErrorClass).first();
//   $('html,body').animate({scrollTop: firstError.offset().top}, 500);
//   firstError.find('input').first().focus();// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! will need to update this at some point so it doesn't just get inputs, and gets textarea and select as well. all the types, also need to test how it comes out in mobile
// }
//
//
// function doacheckthing() {
//   validData = 'yeppy yep yep';
//   console.log(validData);
//
// }
//
//
// // function isItValid(form){
// //   return false;
// // }
//
//
// function isFormValid(form){
//
//   console.log('doing all dat validating');
//
//
//
//   // // reset unvalidInputs status as they need to be checked again
//   // var invalidInputs = false;
//
//   // // check through all form inputs
//   // checkAllTextInputs();
//   // checkAllEmailInputs();
//   // checkAllRadioButtonGroups();
//
//
//
//
//   // // return if form is valid and ready for submitting
//   // if (thing) {
//   //   return true;
//   // } else {
//   //   return false;
//   // }
//
//
//
// }
//
// // // // setting global variables
// // // var form = $('.form'); // single form focus
// // // var unvalidInputs = false; // status for at least one required element missing
// // // var formInputClass = 'js-form-input';
// // // var formStepClass = 'js-form-step';
// // // var formHiddenInputClass = 'js-hidden-inputs';
// // // var formResultStatementClass = 'js-result-statements';
// // // var radioButtonClass = 'js-radio-button';
// // // var inputErrorClass = 'has-error';
// // // var inputErrorMessageClass = 'input__error-message';
// // // var errorMessage = {
// // //   'text': 'Please fill in',
// // //   'email': {
// // //     'blank': 'Please enter your email address',
// // //     'wrong': 'Please enter a valid email address'
// // //   },
// // //   'radio': 'Please select an answer for this question'
// // // };
// //
// //
// //
// // // is this input required for form submission?
// // function isInputRequired(formInput, inputErrorMessage){
// //   if ( typeof $(formInput).data('required') !== 'undefined' ) { // does this input have the required attribute?
// //     showInputErrorMessage(formInput, inputErrorMessage);
// //   }
// // }
// //
// // function showInputErrorMessage(input, inputErrorMessage){
// //   var inputParentElement = $(input).closest('.' + formInputClass); // find parent container
// //   var inputErrorElement = inputParentElement.find('.' + inputErrorMessageClass); // look for an existing error message element
// //   // is there an error message already in this input and does the parent have the class?
// //   if ( inputParentElement.hasClass(inputErrorClass) && inputErrorElement.length) {
// //     // find the error message
// //     var existingInputErrorMessage = inputErrorElement.text();
// //     // if the messages are not the same, update the element
// //     if (inputErrorMessage !== existingInputErrorMessage) {
// //       inputErrorElement.text(inputErrorMessage);
// //     }
// //   } else {
// //     // add in the new element along with the new content
// //     $(inputParentElement).append('<div class="'+ inputErrorMessageClass + '">' + inputErrorMessage + '</div>'); // add the error message
// //     $(inputParentElement).addClass(inputErrorClass);
// //   }
// //   // if an error is shown that means there is invalid content, set the global status so that the form isn't submitted
// //   unvalidInputs = true;
// //   watchInputForCorrectedData(input);
// // }
// //
// //
// // function removeInputErrorMessage(input) {
// //   // find the parent and the error elements
// //   var inputParent = $(input).closest('.' + formInputClass);
// //   var inputParentErrorClass = inputParent.hasClass(inputErrorClass);
// //   var inputParentErrorElement = inputParent.find('.' + inputErrorMessageClass);
// //   // does the input element have an error shown to remove?
// //   if (inputParentErrorClass && inputParentErrorElement ) {
// //     inputParent.removeClass(inputErrorClass);
// //     inputParentErrorElement.remove();
// //     $(input).off();
// //   }
// // }
// //
// //
// // function watchInputForCorrectedData(input) {
// //   $(input).off(); // remove event hanlder if input is already watched
// //   // find the type of input as interaction differs
// //   var inputType = $(input).attr('type');
// //   // choose method of watching depending on input type
// //   switch (inputType) {
// //     case 'text':
// //       $(input).on('keyup',function() {
// //         checkAllTextInputs();
// //       });
// //     break;
// //     case 'email':
// //       $(input).on('keyup',function() {
// //         checkAllEmailInputs();
// //       });
// //     break;
// //     case 'radio':
// //       // find the parent option so both can be clicked
// //       var radioGroup = $(input).closest('.' + formInputClass); // find parent container
// //       var radioGroupInputs = radioGroup.find('input[type=radio]'); // find all the input options
// //       $(radioGroupInputs).on('click',function() {
// //         // any click on a radio button selects, so no need to check if its a valid entry
// //         removeInputErrorMessage(this);
// //       });
// //     break;
// //   }
// // }
// //
// //
// // // check all text inputs in form aren't blank
// // function checkAllTextInputs() {
// //   form.find('input[type=text]').each(function() { // validate all text inputs
// //     var inputValue = $(this).val();
// //     if ( inputValue === '' || (/^\s+$/).test(inputValue) ) { // if empty or just whitespace - check if required
// //       isInputRequired(this, errorMessage.text);
// //     } else {
// //       // there is no error with input
// //       removeInputErrorMessage(this);
// //     }
// //   });
// // }
// //
// //
// // // check all email inputs in form aren't blank and are a valid email format
// // function checkAllEmailInputs() {
// //   form.find('input[type=email]').each(function() {
// //     var inputValue = $(this).val();
// //     var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // this regex formula can test the string against the correct email format of "string@string.string"
// //     if ( inputValue === '' ) { // if empty or whitespace - check if required
// //       isInputRequired(this, errorMessage.email.blank);
// //     } else if (!(emailRegex.test(inputValue))) {
// //       // reguardless of if its not required the format need to be correct wrong
// //       showInputErrorMessage(this, errorMessage.email.wrong);
// //     } else {
// //       // there is no error with input
// //       removeInputErrorMessage($(this));
// //     }
// //   });
// // }
// //
// //
// // // find and check that the radio button questions have been answered
// // function checkAllRadioButtonGroups() {
// //   var radioGroups = [];
// //   // find all groups of radio button inputs
// //   form.find('input[type=radio]').each(function() {
// //     var radioGroup = $(this).attr('name');
// //     if ( radioGroups.indexOf(radioGroup) === -1 ) { // -1 means its not in array
// //       // if its a new group id, add it to the array
// //       radioGroups.push(radioGroup);
// //     }
// //   });
// //   // now groups are defined, loop through each to validate
// //   for (var i = 0; i < radioGroups.length; i++) {
// //     // find all of the inputs related to this group
// //     var radioGroupInputs = $('input[type=radio][name=' + radioGroups[i] + ']');
// //     var radioGroupSelected = false; // set status if an input has been selected
// //     // if input is selected, change the status for this group
// //     for (var j = 0; j < radioGroupInputs.length; j++) {
// //       if (radioGroupInputs[j].checked) {
// //         radioGroupSelected = true;
// //       }
// //     }
// //     // has no input been selected for this radio group?
// //     if (!(radioGroupSelected)) {
// //       // check if this radio group is required
// //       if ( typeof $(radioGroupInputs[0]).data('required') !== 'undefined' ) {
// //         showInputErrorMessage(radioGroupInputs[0], errorMessage.radio);
// //       }
// //     }
// //   }
// // }