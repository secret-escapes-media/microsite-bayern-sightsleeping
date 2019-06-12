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
    'compInvalid': 'Sorry, but you must meet this requirement to enter the competition'
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
      $(errorElement).append(errorMessage);
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
      var radioGroupInputs = form.element.find('input[type=radio][name=' + radioGroups[i] + ']');
      var radioGroupSelected = false; // set status if an input has been selected
      // if input is selected, change the status for this group
      for (var j = 0; j < radioGroupInputs.length; j++) {
        if (radioGroupInputs[j].checked) {
          radioGroupSelected = true;
        }
      }
      // has no input been selected for this radio group?
      if (radioGroupSelected) {
        // check if an invalid answer is selected
        for (var k = 0; k < radioGroupInputs.length; k++) {
          // if this input has the class and is selected
          if (radioGroupInputs[k].classList.contains('js-form-invalid-answer') && radioGroupInputs[k].checked) {
            invalidData = true;
          }
        }
      } else {
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
      var $this = $(this).get(0);
      var selectedOption = $this.options[$this.selectedIndex].value;
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
    // scroll the first error to the top of screen
    $('html,body').stop(true, true).animate({scrollTop: firstError.offset().top}, 250, function() {
      // focus on first error input, after animation has happened
      var firstErrorInput = firstError.find('input, select, textarea').not('input[type="hidden"]').first();
      firstErrorInput.focus();
    });
  }

  function invalidAnswer() {
    form.element.find('.js-form-invalid-answer').each(function() {
      var $input = $(this);
      var $parent = $input.closest('.' + form.inputClass);
      $parent.on('click', 'input', function(e) {
        var invalidAnswer = $parent.find('.js-form-invalid-answer');
        var isChecked = invalidAnswer[0].checked;
        if (isChecked) {
          showInputErrorMessage($input, errorMessages.compInvalid);
        } else {
          removeInputErrorMessage($input);
        }
      });
    });
  }


  ////////////////////////////////////////////////////// export public functions

  return {
    isValid: isFormDataValid,
    scrollToFirstError: scrollToFirstError,
    invalidAnswer: invalidAnswer,
  };

});