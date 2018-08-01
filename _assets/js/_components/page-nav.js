////////////////////////////////////////////////////////////////////////////////
//      Sticky microsite nav
////////////////////////////////////////////////////////////////////////////////

// elements and classes
var pageNavClass     = '.js-sticky-page-nav';
var pageNavContainer = '.js-sticky-page-nav-wrap';
var pageNavModifier  = 'is-stuck';

function pageNav(){
  var scrollTop = $(document).scrollTop();
  var nav       = $(pageNavClass);
  var navHeight = nav.outerHeight();
  var distance  = $(pageNavContainer).offset().top;

  if( scrollTop > distance ){
    nav.addClass(pageNavModifier);
  }else{
    nav.removeClass(pageNavModifier);
  }
}

// runs on page load and scroll if element is on page
if ($(pageNavClass).length > 0) {
  pageNav();
  $(document).scroll(function(){ pageNav(); });
}



// ////////////////////////////////////////////////////////////////////////////////
// //    Current section nav highlight
// ////////////////////////////////////////////////////////////////////////////////
//
// $('.js-nav-section').waypoint(function(direction) {
//
//   // classes
//   var navClass       = 'site-nav__link';
//   var activeNavClass = 'is-current';
//
//   // swaps the active class between nav elements
//   function swapClasses(sectionId) {
//     $('.' + navClass + '.' + activeNavClass).removeClass(activeNavClass);
//     $('.' + navClass + '--' + sectionId).addClass(activeNavClass);
//   }
//
//   if (direction === 'up') {
//     // highlight previous region
//     var previousSectionId = $('#' + this.element.id).prev().attr('id');
//     swapClasses(previousSectionId);
//   } else if (direction === 'down') {
//     // highlight current section
//     var currentSectionId = this.element.id;
//     swapClasses(currentSectionId);
//   }
//
// })