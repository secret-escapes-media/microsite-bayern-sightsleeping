$('.js-modal-nav').on('click', function(event) {
  event.preventDefault();

  var navDirection          = $(this).data('nav-direction'),
      currentModalClass     = '.modal',
      modalCategory         = 'modal-group',
      currentModal          = $(currentModalClass + '.is-open'),
      currentModalCategory  = currentModal.data(modalCategory),
      nextModal             = currentModal.next(currentModalClass),
      nextModalCategory     = nextModal.data(modalCategory),
      previousModal         = currentModal.prev(currentModalClass),
      previousModalCategory = previousModal.data(modalCategory),
      firstModal            = $(currentModalClass + '[data-' + modalCategory + '="' + currentModalCategory + '"]:first'),
      lastModal             = $(currentModalClass + '[data-' + modalCategory + '="' + currentModalCategory + '"]:last');

  function launchNextModal(){
    // hides the current modal
    currentModal.addClass('is-closed').removeClass('is-open');
    // // reset scroll position
    // $('.modal__bg').scrollTop(0);
    if (nextModal && currentModalCategory === nextModalCategory ) {
      // shows next in category
      nextModal.addClass('is-open').removeClass('is-closed');
    } else {
      // isn't another modal in category so goes back to beginning
      firstModal.addClass('is-open').removeClass('is-closed');
    }
  }

  function launchPreviousModal(){
    // hides the current modal
    currentModal.addClass('is-closed').removeClass('is-open');
    // // reset scroll position
    // $('.modal__bg').scrollTop(0);
    if (previousModal && currentModalCategory === previousModalCategory ) {
      // shows next in category
      previousModal.addClass('is-open').removeClass('is-closed');
    } else {
      // isn't another modal in category so goes back to beginning
      lastModal.addClass('is-open').removeClass('is-closed');
    }
  }

  // checks which button has been clicked and runs function
  switch (navDirection) {
    case 'next':
      launchNextModal();
      break;
    case 'previous':
      launchPreviousModal();
      break;
  }

});