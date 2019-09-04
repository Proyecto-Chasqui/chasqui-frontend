(function(){
  'use strict';

  angular.module('chasqui').controller('ChqColapsableCtrl', ChqColapsableCtrl);

  function ChqColapsableCtrl($scope){
    $scope.color = angular.isDefined($scope.color) ? $scope.color: '#43a047';
    $scope.ancho = angular.isDefined($scope.ancho) ? $scope.ancho: '100%';
    $scope.visible = "invisible";

    $scope.mostrar = function(){
      if($scope.visible === "visible"){
        $scope.visible = "invisible";
      }else{
        $scope.visible = "visible";
      }
    }

  }
})();
