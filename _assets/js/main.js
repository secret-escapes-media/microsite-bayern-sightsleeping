// general js for the project that wouldn't be a reuseable component

$('.js-image-attribution').each(function() {
  var $this = $(this);
  var contents = $this.html();
  $this.css('cursor', 'pointer');
  $this.html("<img style=\"width: 15px; height: 15px;\" src=\"_assets/img/icons/info.svg\" alt=\"picture information\">");
  $this.on('click',function(){
    $this.html(contents);
    $this.css('cursor', 'auto');
  });
});