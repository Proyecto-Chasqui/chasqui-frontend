(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, globalConfigurations, navigation_state, usuario_dao) {
       
        $scope.isLogued = usuario_dao.isLogged();
        
        $scope.classFor = function(page) {
			return (navigation_state.getSelectedTab() == page)?"md-accent":"";
		}
           
        $scope.menuItems = globalConfigurations[$scope.catalog.id].menus;
        
	}
})();
