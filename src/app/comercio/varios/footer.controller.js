(function () {
    'use strict';

    angular
        .module('chasqui')
        .controller('FooterController', FooterController);

    /** @ngInject */
    function FooterController($scope, $stateParams,$state) {

        var vm = $scope;

        vm.goSolicitudArrepentimiento = function() {
            var catalogShortName = $stateParams.catalogShortName;

            if(catalogShortName) {
                $state.go("catalog.arrepentimiento");
            } else {
                $state.go("home.arrepentimiento");
            }
        }
    }
})();
