(function(){
  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#true').click(changeBG);
  }

  function changeBG(){
    document.body.style.backgroundColor = 'orange';
  }

})();
