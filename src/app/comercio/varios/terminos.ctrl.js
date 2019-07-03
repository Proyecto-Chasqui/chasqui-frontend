(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('TerminosCtrl', TerminosCtrl);

  /** @ngInject */
  function TerminosCtrl() {
    
    function toTop(){
        window.scrollTo(0,0);
    }

    function init(){
      toTop();
    }

    init();
  }
})();
