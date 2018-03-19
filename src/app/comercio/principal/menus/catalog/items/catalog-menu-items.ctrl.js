(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, $stateParams, itemsBuilder, navigation_state, usuario_dao, catalogs_dao) {
       
        
        $scope.catalog;
        $scope.isLogued;
        $scope.menuItems;
        $scope.classFor = classFor;
        $scope.toTop = toTop;
        
        function init(){
            $scope.catalog = catalogs_dao.getCatalogByShortName($stateParams.catalogShortName);
            $scope.isLogued = usuario_dao.isLogged();
            $scope.menuItems = itemsBuilder($scope.catalog.estrategia.few);
        }
        
        
        //////////////// Implementations
        
        function classFor(page) {
			return (navigation_state.getSelectedTab() == page)?"md-accent":"";
		}           
        
        function toTop(){
            window.scrollTo(0,0);
        }
        
        $scope.$on('logout', function(event, msg) {
			init();
		});
        
        $scope.$on('resetHeader', function(event, msg) {
			init();
		});
        
        init();
	}
})();