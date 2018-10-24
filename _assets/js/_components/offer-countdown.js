// loops through each offer on page and sets the current days remaining
$('.js-offer-expires').each(function() {

  // gets the expires date from the object
  var date = new Date( $(this).data('expires') );
  var expires = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()+1
  );

  $(this).countdown(expires, function(event) {
    if (event.elapsed) {
      // the expired date is in the past so the expired message is removed
      $(this).remove();
    } else if (event.offset.totalDays === 0) {
      // there is 0 days left, just hours, so ends today
      $(this).html(event.strftime('Ending <strong>Today</strong>'));
    } else {
      // there are days left, outputs with either day or days
      $(this).html(event.strftime('Ending in <strong>%-D day%!D</strong>'));
    }
  });
});