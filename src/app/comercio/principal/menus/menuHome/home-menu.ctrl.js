(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeMenuController', HomeMenuController);

    
	function HomeMenuController(URLS, $scope, usuario_dao) {

    $scope.urlBase = URLS.be_base;
    $scope.urlLogo = "assets/images/chasqui_logo.png";
        
    
    $scope.logOut = function() {
      $log.debug("Log Out ..... ");

      usuario_dao.logOut();
      contextPurchaseService.clean();

      $interval.cancel(llamadoPeriodico);

      init();
      $scope.$broadcast('logout');
      $state.go('catalog.landingPage');
    }

    function init() {
      $scope.usuario = usuario_dao.getUsuario();
      $scope.isLogued = usuario_dao.isLogged();
    }

    init();
	}
})();
