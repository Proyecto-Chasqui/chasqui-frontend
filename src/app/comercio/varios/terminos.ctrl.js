(function() {
  'use strict';

  angular
    .module('chasqui')
    .controller('TerminosCtrl', TerminosCtrl);

  /** @ngInject */
  function TerminosCtrl(URLS, $scope, vendedorService) {
     $scope.base = URLS.be_base;
     $scope.path = "/#/terminosYcondiciones";
     $scope.shortname = "";

    function setCatalogState(){
        vendedorService.obtenerConfiguracionVendedor().then(
            function(response){
                $scope.shortname = response.data.nombreCorto;
                console.log(response.data);
                $scope.path = "/#/"+$scope.shortname+"/terminosYcondiciones";
            }
        );
    }

    function toTop(){
        window.scrollTo(0,0);
    }

    function init(){
      setCatalogState();
      toTop();
    }

    init();
  }
})();
