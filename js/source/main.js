(function(){
  'use strict';

  var mapKey = 'AIzaSyCYPGCX6jqcCeTVYyiPZ8Epsh6HqP3j_nk';
  var infowindows = [], allMarkers = [], stories = [], filtered = [], map, oms, geocoder, lastElement = false;

  window.onload = loadMap;
  $(document).ready(initialize);

  function initialize(){
    $('.flexslider').flexslider({
      controlsContainer : ".flexslider-container",
      manualControls    : ".flex-control-nav li"
    });
    
    $('.imgLiquidFill').imgLiquid();
    $('#expander').click(collapseMap);
    $('.state-items').change(filterStates);
    $('.joint-items').change(filterJoints);
    $('.hobby-items').change(filterHobbies);
    $('.state-items > li').click(filterStates);
    $('.joint-items > li').click(filterJoints);
    $('.hobby-items > li').click(filterHobbies);
    $('.select24').select2({placeholder: "States:"});
    $('.select21').select2({placeholder: "States:"});
    $('.select22').select2({placeholder: "Joint Replacement:"});
    $('.select23').select2({placeholder: "Activity/Hobby:"});
  }

  function loadMap(){
    geocoder       = new google.maps.Geocoder();
    var mapOptions = {
      zoom         : 5,
      scrollwheel  : false,
      center       : {lat: 39.489, lng: -97.336}
    };
    map            = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    oms            = new OverlappingMarkerSpiderfier(map, {markersWontMove: true, markersWontHide: true, keepSpiderfied: true, legWeight: '1'});
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
      state    : story[1],
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
    oms.addListener('click', function(marker, event) {
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
                              '<a href="storyShow.html"><img src="../images/pool/rightarrow@2x.png" class="toop-tip-arrow"></a>'+
                            '</div>'+
                          '</div>';
      var infowindow = new google.maps.InfoWindow({content : contentString});
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
    for(var i = 0; i < allMarkers.length; i++){
      allMarkers[i].setMap(set);
    }
  }

  function dropStates(value){
    var marks = [];
    var arr = allMarkers.map(function(mark){
      if(mark.state != value){
        marks.push(mark);
      }else{
        mark.setMap(null);
      }
    });
    allMarkers = marks;
  }

  function dropJoints(value){
    var marks = [];
    var arr = allMarkers.map(function(mark){
      if(mark.joint != value){
        marks.push(mark);
      }else{
        mark.setMap(null);
      }
    });
    allMarkers = marks;
  }

  function dropHobbies(value){
    var marks = [];
    var arr = allMarkers.map(function(mark){
      if(mark.hobby != value){
        marks.push(mark);
      }else{
        mark.setMap(null);
      }
    });
    allMarkers = marks;
  }

  function collapseMap(){
    if($('#map-canvas').css('height') == '600px'){
      $('#map-canvas').css('height', '150px');
      $('#collapseText').text('Expand Map ');
      var fontArrow = $('<i>');
      fontArrow.addClass('fa fa-long-arrow-down');
      $('#collapseText').append(fontArrow);
    }else{
      $('#map-canvas').css('height', '600px');
      $('#collapseText').text('Collapse Map ');
      var fontArrow = $('<i>');
      fontArrow.addClass('fa fa-long-arrow-up');
      $('#collapseText').append(fontArrow);
    }
  }

  function filterStates(e){
    $('.select22').select2('val', '');
    $('.select23').select2('val', '');
    var value = $(this).find('option:selected').text();
    $('.checkyCheck').children().children().removeClass('filter-item-active');
    var str = '.state';
    var num = 1;
    dropStates(value);
    filter(value, str, num);
    e.preventDefault();
  }

  function filterJoints(e){
    $('.select21').select2('val', '');
    $('.select23').select2('val', '');
    if($(this).is("select")){
      var value = $(this).find("option:selected").text();
      var that  = $('.checkyCheck > li > a:contains(' + value + ')');
      $('.checkyCheck').children().children().removeClass('filter-item-active');
      $(that).addClass('filter-item-active');
    }else{
      var value = $(this).text();
      $('.select22').select2('val', value);
      $(this).children().addClass('filter-item-active');
      $(this).siblings().children().removeClass('filter-item-active');
    }
    var str = '.joint';
    var num = 5;
    dropJoints(value);
    filter(value, str, num);
    e.preventDefault();
  }

  function filterHobbies(e){
    $('.select21').select2('val', '');
    $('.select22').select2('val', '');
    var value = $(this).find("option:selected").text();
    $('.checkyCheck').children().children().removeClass('filter-item-active');
    var str = '.hobby';
    var num = 6;
    dropHobbies(value);
    filter(value, str, num);
    e.preventDefault();
  }

  function filter(value, str, num){
    oms.unspiderfy();
    markers(null);
    for(var i = 0; i < stories.length; i++){
      if(stories[i][num] == value){
        codeAddress(stories[i]);
        showCards(value, str);
      }
    }
    if ( value == 'All' || value == 'All  \u2713'){
      markers(map);
      showCards(value, str);
    }
  }

  function showCards(value, str){
    $(".card-unit").each(function(){
      var that = $(this).parent();
      $(that).addClass('hidden');
      if ( value == $(that).find(str).attr('value')
        || value == $(that).find(str).text()
        || value == 'All'
        || value == 'All  \u2713'){
        $(that).removeClass('hidden');
      }
    });
  }
})();
