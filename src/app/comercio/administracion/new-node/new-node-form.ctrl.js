(function () {
    'use strict';

    angular.module('chasqui').controller('NewNodeFormController', NewNodeFormController);

    function NewNodeFormController($scope, $mdDialog) {


        $scope.direccion = {
            alias: "",
            barrio: "",
            aliasDomicilio: "",
            calle: "",
            numeroCalle: "",
            piso: "",
            calle1: "",
            calle2: "",
            ciudad: "",
            codigoPostal: ""
        };

        $scope.okAction = function () {
            // Esto lo saque de select-delivery-address.ctrl.js, tambien se usa algo similar en modifyCount.ctrl.js
            //actions.doOk($scope.deliveryTypes[0].show ? $scope.selectedAddress : null,
            //$scope.deliveryTypes[1].show ? $scope.selectedDeliveryPoint : null);
            $mdDialog.hide();
        }

        $scope.cancelAction = function () {
            //actions.doNotOk();
            $mdDialog.hide();
        }

    }
})();
