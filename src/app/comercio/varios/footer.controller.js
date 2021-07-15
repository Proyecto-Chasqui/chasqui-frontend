(function () {
    'use strict';

    angular
        .module('chasqui')
        .controller('FooterController', FooterController);

    /** @ngInject */
    function FooterController($scope, $stateParams, $state, vendedorService) {

        var catalogShortName = $stateParams.catalogShortName;

        var vm = $scope;
        vm.urlWebVendedor = null;
        vm.nombreVendedor = null;
        vm.isOnMulticatalogo = $state.current.name === "home.multicatalogo";
        

        vm.goSolicitudArrepentimiento = function() {
            if(catalogShortName) {
                $state.go("catalog.arrepentimiento");
            } else {
                $state.go("home.arrepentimiento");
            }
        }

        function buscarDatosVendedor() {
            if(!catalogShortName) {
                return;
            }

            vendedorService.verDatosDePortada().then(function(response){
                vm.urlWebVendedor = response.data.dataContacto.url || "";
            });

            vendedorService.obtenerConfiguracionVendedor().then(function(response){
                vm.nombreVendedor = response.data.nombre;
            });
        }

        buscarDatosVendedor();
    }
})();
