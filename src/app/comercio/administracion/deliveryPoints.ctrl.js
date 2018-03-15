(function() {
	'use strict';
    
    angular.module('chasqui').controller('DeliveryPointsCtrl', DeliveryPointsCtrl);
    
	function DeliveryPointsCtrl(navigation_state, $scope) {
        
        navigation_state.goDeliveryPointsTab();
        
        $scope.formatAddress = formatAddress;
        
        $scope.deliveryPoints = [{
                    id: 1,
                    nombre: "Hirigoyen",
                    mensaje: "La próxima fecha de entrega va a ser el 31/2",
                    direccion: {
                        id: 7,
                        calle: "av Hirigoyen",
                        calleAdyacente1: null,
                        calleAdyacente2: null,
                        altura: 270,
                        localidad: "Quilmes",
                        codigoPostal: "",
                        alias: null,
                        departamento: null,
                        latitud: null,
                        longitud: null,
                        predeterminada: null,
                        geoUbicacion: null,
                        comentario: "algo"
                    }
                }, {
                    id: 2,
                    nombre: "Beltran",
                    mensaje: "La próxima fecha de entrega va a ser el 31/2",
                    direccion: {
                        id: 8,
                        calle: "beltran",
                        calleAdyacente1: null,
                        calleAdyacente2: null,
                        altura: 180,
                        localidad: "Bernal",
                        codigoPostal: "",
                        alias: null,
                        departamento: null,
                        latitud: null,
                        longitud: null,
                        predeterminada: null,
                        geoUbicacion: null,
                        comentario: "algo"
                    }
                }
            ];
        
        ///////////////////////////////
        
        function formatAddress(address){
            return address.calle + " " + address.altura;
        }
        
    }
    
})();