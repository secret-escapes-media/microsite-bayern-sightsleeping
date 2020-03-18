

///////////////////////////////////////
// GET OFFERS FROM GOOGLE SHEET
///////////////////////////////////////



// get all offer sections on page
var offerSections = $('.js-dynamic-offers');


// loop over offer sections to gather deals from correct sheet
$(offerSections).each(function(){
  var offerSection = $(this);
  var sheetName = offerSection.data('offer-sheet');
  var limiter = offerSection.data('offer-limit') - 1;// -1 to balance against index number

  /*===== QUERY GOOGLE SHEET =====*/
  var spreadsheetID = "14g1IiRy-0A3yFke6WRhvB_AOn_bNVESIDasUVcc93PM"; // ID of Google Spreadsheet
  var apiKey = "AIzaSyBww8fHIRizAYPWsYyNGcRvLvzTLvvKmkw"; // API key for accessing G Sheet
  var url = "https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetID + "/values/" + sheetName + "!A3:Z?&key=" + apiKey;

  // JSON request
  $.getJSON(url, function(data) {
    var rawData = data.values;
    var deals = rawData.filter(function(item){
      return item[0] != 0;
    });

    var sortedDeals = deals.sort(function(a,b){ return a[6] > b[6] ?1 :-1 });

    // loop through deals and build HTML for output
    $(deals).each(function(i){
      // check deal "end date" to ensure it exists
      if(this[7]){
        // limit iteration
        if(i>limiter) return false;

        var saleTitle             = this[1];
        var saleLocation          = this[2];
        var saleDescription       = this[3];
        var salePrice             = this[4];
        var salePriceDescription  = this[5];
        var saleDiscount          = this[6];
        var saleEndDate           = this[7];
        var saleURL               = this[9];
        var saleImage             = this[10];

        offerSection.prepend('<div class="col"><div class="offer"><a class="offer__link" href="'+saleURL+'"><span class="btn btn--orange">View Offer</span></a><div class="bg-img bg-img--3-2" style="background-image: url('+saleImage+')"></div><div class="offer__content"><h3 class="title title--xs">'+saleTitle+'</h3><h4 class="offer__location">'+saleLocation+'</h4><div class="offer__description">'+saleDescription+'</div><div class="offer__bottom"><div class="offer__bottom-left"><div class="offer__saved"><div class="offer__saved-label">Save up to&nbsp;</div><div class="offer__saved-percent">'+saleDiscount+'%</div></div><div class="offer__separator"></div><div class="offer__details"><div>From <span class="offer__price">£'+salePrice+'</span></div><div class="text--sm">'+salePriceDescription+'</div><div class="js-offer-expires text--sm" data-expires="'+saleEndDate+'"></div></div></div><div class="offer__bottom-right"><div class="offer__arrow"></div></div></div></div></div></div>');
      }// end if
    });// end forloop of deals
  });// end JSON request
});//end forloop of offerSections



/*----- EXPANDED OFFER HTML -----

<div class="col">
  <div class="offer">
    <a class="offer__link" href="'+saleURL+'"><span class="btn btn--orange">View Offer</span></a>
    <div class="bg-img bg-img--3-2" style="background-image: url('+saleImage+')"></div>
    <div class="offer__content">
      <h3 class="title title--xs">'+saleTitle+'</h3>
      <h4 class="offer__location">'+saleLocation+'</h4>
      <div class="offer__description">'+saleDescription+'</div>
      <div class="offer__bottom">
        <div class="offer__bottom-left">
          <div class="offer__saved">
            <div class="offer__saved-label">Save up to&nbsp;</div>
            <div class="offer__saved-percent">'+saleDiscount+'%</div>
          </div>
          <div class="offer__separator"></div>
          <div class="offer__details">
            <div>From <span class="offer__price">£'+salePrice+'</span></div>
            <div class="text--sm">'+salePriceDescription+'</div>
            <div class="js-offer-expires text--sm" data-expires="'+saleEndDate+'"></div>
          </div>
        </div>
        <div class="offer__bottom-right">
          <div class="offer__arrow"></div>
        </div>
      </div>
    </div>
  </div>
</div>
*/

