angular.module('chasqui').directive('homeMenu', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'HomeMenuController',
        scope: {
            
        },
        templateUrl: 'app/comercio/principal/menus/menuHome/home-menu.tmpl.html'
      };
        
}]);