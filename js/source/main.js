(function(){
  'use strict';

  $(document).ready(initialize);

  function initialize(){
    $('#true').click(changeBG);
  }

  function changeBG(){
    if(document.body.style.backgroundColor == 'yellow'){
      document.body.style.backgroundColor = 'orange';
    }else if(document.body.style.backgroundColor == 'orange'){
      document.body.style.backgroundColor = 'blue';
    }else{
      document.body.style.backgroundColor = 'yellow';
    }
  }

})();
