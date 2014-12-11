(function(){
  'use strict';

  var mapKey = 'AIzaSyCYPGCX6jqcCeTVYyiPZ8Epsh6HqP3j_nk';
  var infowindows = [], map, geocoder, lastElement = false;

  window.onload = loadMap;
  $(document).ready(initialize);

  function initialize(){
    $('.imgLiquidFill').imgLiquid();
    $('.flexslider').flexslider();
    $('#wrap').click(closeInfoWindows);
    addBullet();
  }

  function loadMap(){
    geocoder       = new google.maps.Geocoder();
    var mapOptions = {
      zoom         : 5,
      center       : {lat : 39.489, lng : -97.336}
    };
    map            = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
      if(status == google.maps.GeocoderStatus.OK){
        setMarker(results[0], story);
      }else{
        console.log(status);
      }
    });
  }

  function setMarker(result, story){
    var dot    = getPath(story[5]);
    var marker = new google.maps.Marker({
      map      : map,
      position : result.geometry.location,
      icon     : dot,
      photo    : story[2],
      name     : story[3],
      city     : story[4],
      joint    : story[5]
    });
    getInfoWindow(marker);
  }

  function getPath(joint){
    var path;
    switch (joint){
      case 'Knee':
        path = '../images/blue-point.png';
        break;
      case 'Shoulder':
        path = '../images/red-point.png';
        break;
      case 'Hip':
        path = '../images/gold-point.png';
        break;
      case 'Multiple Joints':
        path = '../images/purple-point.png';
        break;
    }
    return path;
  }

  function getInfoWindow(marker){
    google.maps.event.addListener(marker, 'mouseover', function(){
      closeInfoWindows();
      var contentString = '<div class="row">'+
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
      infowindows.push(infowindow);
      infowindow.open(map, marker);
    });
  }

  function closeInfoWindows(){
    for(var f = 0; f < infowindows.length; f++){
      infowindows[f].close();
    }
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
