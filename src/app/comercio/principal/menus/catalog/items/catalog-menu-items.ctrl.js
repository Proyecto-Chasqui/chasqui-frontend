(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, $stateParams, itemsBuilder, navigation_state, usuario_dao, catalogs_dao) {
       
        $scope.catalog = catalogs_dao.getCatalog($stateParams.idCatalog);
        
        $scope.isLogued = usuario_dao.isLogged();
        
        $scope.classFor = function(page) {
			return (navigation_state.getSelectedTab() == page)?"md-accent":"";
		}
           
        $scope.menuItems = itemsBuilder($scope.catalog.estrategia.few);
        
        $scope.toTop = function(){
            window.scrollTo(0,0);
        }
        
	}
})();