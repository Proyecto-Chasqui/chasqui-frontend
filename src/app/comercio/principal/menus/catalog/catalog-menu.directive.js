angular.module('chasqui').directive('catalogMenu', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'CatalogMenuController',
        scope: {
            catalog: '=catalog'
        },
        templateUrl: 'app/comercio/principal/menus/catalog/catalog-menu.tmpl.html'
      };
        
}]);