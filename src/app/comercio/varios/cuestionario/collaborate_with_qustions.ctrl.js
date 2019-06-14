(function() {
	'use strict';

	angular.module('chasqui').controller('CollaborateCtrl', CollaborateCtrl);

	/** @ngInject */
	function CollaborateCtrl($scope, dialogCommons, $mdDialog) {
    
    function init(){
      if(window.innerWidth < 768){
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSflPwAa18nhTdNSMCU1NhJSe1Vl_WwOm5kC4PH5Sk7NrC6diQ/viewform','_blank');
        $mdDialog.hide();
      }
    }
    
    init()
  }
  
})();