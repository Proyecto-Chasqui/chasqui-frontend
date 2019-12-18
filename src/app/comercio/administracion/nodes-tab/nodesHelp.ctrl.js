(function() {
  'use strict';

  angular.module('chasqui').controller('NodeHelpCtrl', NodeHelpCtrl);

  
  function NodeHelpCtrl($scope) {

    $scope.showHelpsAnswer = showHelpsAnswer;

    $scope.preguntas = [
      {
        titulo: "pregunta 1",
        respuesta: "Respuesta 1."
      },
      {
        titulo: "pregunta 2",
        respuesta: "Respuesta 2."
      },
      {
        titulo: "pregunta 3",
        respuesta: "Respuesta 3."
      },
      {
        titulo: "pregunta 4",
        respuesta: "Respuesta 4."
      },
    ];


    function showHelpsAnswer(groupIndex){
      $scope.showHelp = $scope.showHelp.map(function(o,i){return i == groupIndex && !o});
    }
    


    function init(){
      $scope.showHelp = $scope.preguntas.map(function(i){return false});
    }

    init();

  }

})();
