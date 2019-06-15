(function() {
	'use strict';

	angular.module('chasqui').controller('CollaborateCtrl', CollaborateCtrl);

	/** @ngInject */
	function CollaborateCtrl($scope, dialogCommons, $mdDialog) {
    
    $scope.ok = function(){
      $mdDialog.hide();
      
      $mdDialog.show(
        $mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('Muchas gracias por colaborar!')
          .textContent('Tus sugerencias seran tomadas en cuenta para futuras actualizaciones')
          .ariaLabel('gracias')
          .ok('De nada!')
        );
    }
    
    function init(){
      if(window.innerWidth < 768){
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSflPwAa18nhTdNSMCU1NhJSe1Vl_WwOm5kC4PH5Sk7NrC6diQ/viewform','_blank');
        $mdDialog.hide();
      }
    }
    
    init()
  }
  
})();