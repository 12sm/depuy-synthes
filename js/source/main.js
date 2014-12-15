(function(){
  'use strict';

  var mapKey = 'AIzaSyCYPGCX6jqcCeTVYyiPZ8Epsh6HqP3j_nk';
  var infowindows = [], allMarkers = [], stories = [], filtered = [], map, oms, geocoder, lastElement = false;

  window.onload = loadMap;
  $(document).ready(initialize);

  function initialize(){
    $('.imgLiquidFill').imgLiquid();
    $('.flexslider').flexslider();
    $('.state-items > li').click(filterStates);
    $('.joint-items > li').click(filterJoints);
    $('.hobby-items > li').click(filterHobbies);
    addBullet();
    $(".drop-down").chosen({
      disable_search_threshold: 1.5,
      width: "95%"
    });
  }

  function loadMap(){
    geocoder       = new google.maps.Geocoder();
    var mapOptions = {
      zoom         : 5,
      scrollwheel  : false,
      center       : {lat : 39.489, lng : -97.336}
    };
    map            = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    oms            = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied : true});
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
      story.push($(this).find(".hobby").attr("value"));
      stories.push(story);
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
      joint    : story[5],
      hobby    : story[6]
    });
    allMarkers.push(marker);
    getInfoWindow(marker);
    oms.addMarker(marker);
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
    // oms.addListener('click', function(marker, event) {
    //   iw.setContent(marker.desc);
    //   iw.open(map, marker);
    // });
    // google.maps.event.addListener(marker, 'click', function(){
    oms.addListener('click', function(marker, event) {
      console.log(marker);
      closeInfoWindows();
      var contentString = '<div class="row tool-tip">'+
                            '<div class="col-xs-4">'+
                              '<img src="'+marker.photo+'" class="marker-photo">'+
                            '</div>'+
                            '<div class="col-xs-6">'+
                              '<h2 class="marker-name">'+marker.name+'</h2>'+
                              '<h2 class="marker-city">'+marker.city+'</h2>'+
                              '<h2 class="marker-joint">'+marker.joint+'</h2>'+
                            '</div>'+
                            '<div class="col-xs-2">'+
                              '<a href="storyShow.html"><img src="../images/pool/RightArrow@2x.png" class="toop-tip-arrow"></a>'+
                            '</div>'+
                          '</div>';
      var infowindow = new google.maps.InfoWindow({content : contentString});
      console.log(infowindow);
      infowindows.push(infowindow);
      infowindow.open(map, marker);
    });
  }

  function closeInfoWindows(){
    for(var i = 0; i < infowindows.length; i++){
      infowindows[i].close();
    }
  }

  function markers(set){
    for (var i = 0; i < allMarkers.length; i++){
      allMarkers[i].setMap(set);
    }
  }

  function filterStates(e){
    var value = $(this).text();
    var str = '.state';
    var num = 1;
    filter(value, str, num);
    e.preventDefault();
  }

  function filterJoints(e){
    var value = $(this).text();
    var str = '.joint';
    var num = 5;
    filter(value, str, num);
    e.preventDefault();
  }

  function filterHobbies(e){
    var value = $(this).text();
    var str = '.hobby';
    var num = 6;
    filter(value, str, num);
    e.preventDefault();
  }

  function filter(value, str, num){
    console.log(value);
    markers(null);
    for(var i = 0; i < stories.length; i++){
      if(stories[i][num] == value){
        codeAddress(stories[i]);
        showCards(value, str);
      }
    }
    if(value == 'All' || value == 'All  \u2713'){
      markers(map);
      showCards(value, str);
    }
  }

  function showCards(value, str){
    $(".card-unit").each(function(){
      var that = $(this).parent();
      $(that).addClass('hidden');
      if($(that).find(str).attr('value') == value || $(that).find(str).text() == value || value == 'All' || value == 'All  \u2713'){
        $(that).removeClass('hidden');
      }
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
