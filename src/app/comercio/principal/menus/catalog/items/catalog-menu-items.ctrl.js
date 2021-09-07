(function() {
	'use strict';

	angular
		.module('chasqui')
		.controller('CatalogMenuItemsController', CatalogMenuItemsController);

    
	function CatalogMenuItemsController($scope, $stateParams, itemsBuilder, navigation_state, usuario_dao, 
        contextCatalogsService, $log, vendedorService) {
       
        
    $scope.catalog;
    $scope.isLogued;
    $scope.menuItems;
    $scope.classFor = classFor;
    $scope.toTop = toTop;

    function init(){
        $scope.isLogued = usuario_dao.isLogged();
        contextCatalogsService.getCatalogByShortName($stateParams.catalogShortName).then(function(catalog){
            $scope.catalog = catalog;
            // console.log(contextCatalogsService)
            // console.log("general items: ", $scope.general);
            // $log.debug("catalog: ", $scope.catalog);
            vendedorService.verDatosDePortada().then(function (response) {
                $scope.menuItems = $scope.general
                    ? itemsBuilder.general($scope.catalog.few, response.data.portadaVisible.data[0])
                    : itemsBuilder.catalog($scope.catalog.few);
            });
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