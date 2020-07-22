// loops through each offer on page and sets the current days remaining
$(document).ready(function(){
  // ensure deals are loaded before running script
  setTimeout(function(){

    $('.js-offer-expires').each(function() {

      // gets the expires date from the object
      var rawDate = $(this).data('expires');
      var processedDate = rawDate.split("/").reverse().join("/");

      var date = new Date( processedDate );
      var expires = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()+1
      );

      $(this).countdown(expires, function(event) {
        if (event.elapsed || event.offset.totalDays > 14 ) {
          // the expired date is in the past, or more than 14 days remaining
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

  }, 1000);
});