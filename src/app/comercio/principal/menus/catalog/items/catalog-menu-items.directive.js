angular.module('chasqui').directive('catalogMenuItems', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'CatalogMenuItemsController',
        scope: {
        },
        templateUrl: 'app/comercio/principal/menus/catalog/items/catalog-menu-items.tmpl.html'
      };
        
}]);