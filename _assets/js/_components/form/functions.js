var formFunctions = (function functionName(form) {

  //////////////////////////////////////////////////////////// private functions

  // add specifc status messages for this form
  function formAddStatusMessages() {
    var formMessagesClass = 'js-form-messages';
    var formMessagesElement = $(form.element).find('.'+formMessagesClass);
    // loop through all messages and make html element
    for (var i = 0; i < form.statusMessages.length; i++) {
      // create elements
      var container = document.createElement('div');
      var wrap = document.createElement('div');
      var title = document.createElement('h3');
      var description = document.createElement('p');
      // add classes
      container.className = 'message message--' + form.statusMessages[i].id;
      wrap.className = 'width width--lg';
      title.className = 'title title--md';
      description.className = 'text--xl text--normal';
      // add content
      title.textContent = form.statusMessages[i].title;
      description.textContent = form.statusMessages[i].description;
      // create structure
      container.appendChild(wrap);
      wrap.appendChild(title);
      wrap.appendChild(description);
      // add to page
      formMessagesElement.append(container);
    }
  }

  // apply a class for selected radio or checkbox input
  function formSelectedInputClass() {
    var inputButtonClass = 'js-input-button';
    $(form.element).find('.' + inputButtonClass).on('change',function () {
      var $input = $(this).find('input').not('input[type="hidden"]');
      var inputType = $input.attr('type');
      var selectedLabel = $input.closest('.' + inputButtonClass);
      var selectedClass = 'is-selected';
      if (inputType === 'checkbox') {
        // checkbox function
        if (selectedLabel.hasClass(selectedClass)) {
          selectedLabel.removeClass(selectedClass);
        } else {
          selectedLabel.addClass(selectedClass);
        }
      } else if (inputType === 'radio') {
        // radio function
        var radioGroup = $input.closest('.' + form.inputClass);
        // check if it is already selected
        if (!(selectedLabel.hasClass(selectedClass))) {
          radioGroup.find('.' + inputButtonClass + '.' + selectedClass).removeClass(selectedClass);
          selectedLabel.addClass(selectedClass);
        }
      }
    });
  }


  ///////////////////////////////////////////////////////////// public functions

  function submissionInProgress() {
    form.element.find('button').prop("disabled", true).addClass('is-loading').html('Sending <div class="loading-icon"></div>');
  }

  function formInit() {
    // setting up the form
    form.element.trigger('reset'); // reset form values
    $(form.element).find('button[type="submit"]').prop("disabled", false); // enable submit button - disabled for no js
    formAddStatusMessages(); // add all form status messages
    formSelectedInputClass(); // add function to detect selected radio or checkbox
    formValidation(form).invalidAnswer(); // there is an invalid answer in the form, add the message if selected
  }

  // show status message on form
  function formShowMessage(messageID) {
    form.element.addClass('form-message-is-visible'); // set class on entire form for css
    form.element.find('input, button, select, textarea').prop("disabled", true); // disable all of the form so people cant enter or tab through it
    form.element.find('a').removeAttr('href'); // remove all links so user cant keyboard nav through them either
    form.element.find('.message--' + messageID).addClass('is-visible'); // show specific form message
  }


  ////////////////////////////////////////////////////// export public functions

  return {
    init: formInit,
    showMessage: formShowMessage,
    submissionInProgress: submissionInProgress,
  };

});