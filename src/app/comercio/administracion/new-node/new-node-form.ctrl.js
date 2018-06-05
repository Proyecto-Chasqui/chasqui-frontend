(function () {
    'use strict';

    angular.module('chasqui').controller('NewNodeFormController', NewNodeFormController);

    function NewNodeFormController($scope, $mdDialog, nodoService) {


        $scope.nodo = {
            alias: "",
            descripcion: "",
            barrio: "",
            aliasDomicilio: "",
            calle: "",
            numeroCalle: "",
            piso: "",
            calle1: "",
            calle2: "",
            ciudad: "",
            codigoPostal: "",
            comentario: "",
            visibilidad: false
        };

        $scope.showNode = function(){
            console.log($scope);
        }
        
        //Al precionas el boton para solicitar la creacion de nodo se ejecuta esta funcion.
        $scope.okAction = function () {

            //Se ejecuta si retorna 200
            function doOK(response) {
                $log.debug("callCrearNodo", response);
            }
            
            //Se ejecuta si no ejecuta el servicio correctamente
            function doNoOK(response) {
                $log.debug("error al solicitar la creacion de nodo, seguramente ya tenia pedido",response);
            }

            var params = $scope.nodo

            nodoService.solicitarCrearNodo(toNodoRequest($scope.nodo), doNoOK).then(doOK);//Faltan los parametros.
            $mdDialog.hide();
        }

        $scope.cancelAction = function () {
            //actions.doNotOk();
            $mdDialog.hide();
        }
        
        function toNodoRequest(nodo){
            
            var nodoRequest = {}
            nodoRequest.idVendedor = 2//TODO el id no tiene que estar hardcodeado
            nodoRequest.alias = nodo.alias
            nodoRequest.descripcion = nodo.descripcion
            nodoRequest.visibilidad = nodo.visibilidad
            nodoRequest.barrio = nodo.barrio
            nodoRequest.direccion = toDireccionRequest(nodo)
            
            return nodoRequest
        }
        
        function toDireccionRequest(nodo){
            
            var direccionRequest = {}
            direccionRequest.calle = nodo.calle
            direccionRequest.calleAdyacente1 = nodo.calle1
            direccionRequest.calleAdyacente2 = nodo.calle2
            direccionRequest.altura = nodo.numeroCalle
            direccionRequest.departamento = nodo.piso
            direccionRequest.alias = nodo.aliasDomicilio
            direccionRequest.codigoPostal = nodo.codigoPostal
            direccionRequest.predeterminada = true
            direccionRequest.comentario = nodo.comentario
            
            return direccionRequest
            
        }

    }
})();
