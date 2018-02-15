// general js for the project that wouldn't be a reuseable component


// a very quick version of auto hide the nav
// real version should happen on scroll up or mouse position

function toggleNav() {
  $('.js-hide-site-header').fadeToggle(400);
  $('.js-hide-site-nav').fadeToggle(400);
}

toggleNav();

$('.banner').on('click', toggleNav);