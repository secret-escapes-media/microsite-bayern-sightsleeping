////////////////////////////////////////////////////////////////////////////////
//    Sticky Comp Enter button
////////////////////////////////////////////////////////////////////////////////

// create elements
var container = document.createElement('div'),
    link      = document.createElement('a');

// set data & attributes
container.className = 'sticky-enter';
link.id             = 'track-cta-sticky-enter';
link.href           = '#entry-form';
link.className      = 'btn btn--orange';
link.innerHTML      = 'Enter Now';

// add link to container
container.appendChild(link);

// add to page
$('body').append(container);


// Show and hide enter button based on page scroll position
function enterbar(){

  // classes
  var containerClass = '.sticky-enter';
  var contentClass   = '#content';
  var entryFormClass = '#entry-form';
  var modifierClass  = 'is-stuck';

  // element scroll positions
  var scrollTop = $(document).scrollTop();
  var content = $(contentClass).offset().top;
  var entryForm = ($(entryFormClass).offset().top)-400;

  // toggle class on element
  if( (scrollTop > content) && (scrollTop < entryForm) ){
    $(containerClass).addClass(modifierClass);
  } else {
    $(containerClass).removeClass(modifierClass);
  }

}


// runs on page load and scroll
enterbar();
$(document).scroll(function(){ enterbar(); });

// removes sticky enter button if main enter now has been clicked
$('.js-remove-sticky-enter').on('click', function() {
  $(container).remove();
})