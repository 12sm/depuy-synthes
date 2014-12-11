(function(){
  'use strict';

  var lastElement = false;
  var map, geocoder;
  var mapKey = 'AIzaSyCYPGCX6jqcCeTVYyiPZ8Epsh6HqP3j_nk';
  var info = [], infowindows = [], counter = 0, story;

  window.onload = loadMap;
  $(document).ready(initialize);

  function initialize(){
    $(".imgLiquidFill").imgLiquid();
    $('.flexslider').flexslider();
    addBullet();
  }

  function loadMap(){
    geocoder   = new google.maps.Geocoder();
    var mapOptions = {
      zoom     : 5,
      center   : {lat : 39.489, lng : -97.336}
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    getInfo();
  }

  function getInfo(){
    $(".mapped").each(function(){
      var story = [];
      story.push($(this).find(".zip").attr("value"));
      story.push($(this).find(".state").attr("value"));
      story.push($(this).find(".card-photo").attr("src"));
      story.push($(this).find(".name").text());
      story.push($(this).find(".city").text());
      story.push($(this).find(".joint").text());
      codeAddress(story);
    });
  }

  function codeAddress(story){
    geocoder.geocode({'address': story[0]}, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        setMarker(results[0], story);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }

  function setMarker(result, story){
    var marker = new google.maps.Marker({
      map      : map,
      position : result.geometry.location,
      photo    : story[2],
      name     : story[3],
      city     : story[4],
      joint    : story[5]
    });
    getInfoWindow(marker);
  }

  function getInfoWindow(marker){
    google.maps.event.addListener(marker, 'click', function(){
      var contentString = '<div class="r"ow">'+
                            '<div class="col-xs-12">'+
                              '<img src="'+marker.photo+'">'+
                              '<div class="row">'+
                                '<div class="col-xs-7">'+
                                  '<h2>'+marker.name+'</h2>'+
                                '</div>'+
                                '<div class="col-xs-7">'+
                                  '<h2>'+marker.city+'</h2>'+
                                '</div>'+
                                '<div class="col-xs-5">'+
                                  '<h2>></h2>'+
                                '</div>'+
                                '<div class="col-xs-7">'+
                                  '<h2>'+marker.joint+'</h2>'+
                                '</div>'+
                              '</div>'+
                            '</div>'+
                          '</div>';

      var infowindow = new google.maps.InfoWindow({content : contentString});
      infowindow.open(map, marker);
    });
  }

  function addBullet(){
    $("#foottopnav > li > a > h6").each(function(){
      if (lastElement && lastElement.offset().top != $(this).offset().top) {
        $(lastElement).addClass("nobullet");
      }
      lastElement = $(this);
    }).last().addClass("nobullet");
  }

})();
