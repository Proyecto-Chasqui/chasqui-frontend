(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, $stateParams, itemsBuilder, navigation_state, usuario_dao, contextCatalogsService) {
       
        
    $scope.catalog;
    $scope.isLogued;
    $scope.menuItems;
    $scope.classFor = classFor;
    $scope.toTop = toTop;

    function init(){
        $scope.isLogued = usuario_dao.isLogged();
        contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
            $scope.catalog = catalog;
            $scope.menuItems = itemsBuilder($scope.catalog.few);
        })
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