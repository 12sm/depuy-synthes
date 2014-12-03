(function(){
  'use strict';
  var lastElement = false;

  $(document).ready(initialize);

  function initialize(){
    $(".imgLiquidFill").imgLiquid();
    $('.flexslider').flexslider();
    addBullet();
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
