angular.module('chasqui').directive('historialGcc', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'HistorialGCCController',
        scope: {
            group: '=group'
        },
        templateUrl: 'app/comercio/administracion/gcc-tab/historial-gcc.html'
      };
        
}]);