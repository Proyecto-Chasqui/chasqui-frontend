(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, $stateParams, itemsBuilder, navigation_state, usuario_dao, 
                                       contextCatalogsService, $log) {
       
        
    $scope.catalog;
    $scope.isLogued;
    $scope.menuItems;
    $scope.classFor = classFor;
    $scope.toTop = toTop;

    function init(){
        $scope.isLogued = usuario_dao.isLogged();
        contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
            $scope.catalog = catalog;
            $log.debug("general items: ", $scope.general);
            $scope.menuItems = $scope.general? 
                                    itemsBuilder.general($scope.catalog.few, $scope.catalog.portadaVisible):
                                    itemsBuilder.catalog($scope.catalog.few);
        })
    }


    //////////////// Implementations

    function classFor(page) {
        return (navigation_state.getSelectedTab() == page)?"md-accent":"";
    }           

    function toTop(){
        window.scrollTo(0,0);
    }

    $scope.$on('logout', function() {
        init();
    });

    $scope.$on('resetHeader', function() {
        init();
    });

    init();
	}
})();