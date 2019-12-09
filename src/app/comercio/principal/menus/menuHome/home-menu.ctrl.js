(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('HomeMenuController', HomeMenuController);

    
	function HomeMenuController(URLS, $scope, usuario_dao, $state, $log, contextPurchaseService) {

    $scope.urlBase = URLS.be_base;
    $scope.urlLogo = "assets/images/chasqui_logo.png";
        
    
    $scope.logOut = function() {
      $log.debug("Log Out ..... ");

      usuario_dao.logOut();
      contextPurchaseService.clean();

      init();
      $scope.$broadcast('logout');
      $state.go('home');
    }

    $scope.login = function(){
      $state.go('login', {toPage: "home"});
    }

    function init() {
      $scope.usuario = usuario_dao.getUsuario();
      $scope.isLogued = usuario_dao.isLogged();
    }

    init();
	}
})();
