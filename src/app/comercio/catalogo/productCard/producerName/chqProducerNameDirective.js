angular.module('chasqui').directive('chqProducerName',
  function(){
    return {
      restrict: 'E',
      controller: 'ChqProducerNameCtrl',
      scope:{
          nombre: '='
      },
      templateUrl: 'app/comercio/catalogo/productCard/producerName/chqProducerName.html'
    }
});
