(function(){
  'use strict';
  var lastElement = false;
  var mapKey      = 'AIzaSyCYPGCX6jqcCeTVYyiPZ8Epsh6HqP3j_nk';
  var mapOptions  = {};
  var zips        = [];
  var states      = [];
  var map, geocoder;

  $(document).ready(initialize);
  window.onload = loadMap;

  function initialize(){
    $(".imgLiquidFill").imgLiquid();
    $('.flexslider').flexslider();
    addBullet();
    getStates();
  }

  function addBullet(){
    $("#foottopnav > li > a > h6").each(function(){
      if (lastElement && lastElement.offset().top != $(this).offset().top) {
        $(lastElement).addClass("nobullet");
      }
      lastElement = $(this);
    }).last().addClass("nobullet");
  }

  function loadMap(){
    geocoder = new google.maps.Geocoder();
    mapOptions = {
      zoom     : 5,
      center   : {lat : 39.489, lng : -97.336}
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    getZips();
  }

  function codeAddress(){
    for(var i = 8; i < zips.length; i++){
      var address = zips[i];
      geocoder.geocode({'address': address}, function(results, status){
        if (status == google.maps.GeocoderStatus.OK) {
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    }
  }

  function getZips(){
    $(".zip").map(function(){zips.push(this.value);});
    codeAddress();
  }

  function getStates(){
    $(".state").map(function(){states.push(this.value);});
    console.log(states);
  }

})();
