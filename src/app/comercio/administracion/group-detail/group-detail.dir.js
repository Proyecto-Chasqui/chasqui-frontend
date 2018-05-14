angular.module('chasqui').directive('groupDetail', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'GroupDetailCtrl',
        scope: {
            group: '=group'
        },
        templateUrl: 'app/comercio/administracion/group-detail/group-detail.tmpl.html'
      };
        
}]);