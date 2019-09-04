angular.module('chasqui').directive('continueBuying', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'ContinueBuyingController',
        templateUrl: 'app/comercio/carrito/continue-buying/continue-buying.tmpl.html'
      };
        
}]);