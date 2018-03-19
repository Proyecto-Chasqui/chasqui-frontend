(function() {
	'use strict';

	angular.module('chasqui').controller('FormAddressesController', FormAddressesController);

	function FormAddressesController($rootScope, $scope, $log, perfilService) {
		
        $scope.selectedIndexDireccion = 0;
        $scope.addresses = [];
        
        function init(){
            if($scope.loadPreviousDirections){
                $scope.callDirecciones();
            }
        }
        
		$scope.callDirecciones = function() {
			$log.debug('call addresses ');
			// TODO NO OK , que vuelva a donde vino
			function doOk(response) {
				$log.debug('call addresses response ', response);
				$scope.addresses = response.data;
			}

			perfilService.verDirecciones().then(doOk);
		}        
        
        
		$scope.addDireccion = function() {
			$log.debug("add direccion");
            var newAddress = {
                alias: "Nueva dirección",
                isNew: true
            }
			$scope.addresses.push(newAddress);
			$scope.selectedIndexDireccion = $scope.addresses.length;
		}
        
        $rootScope.$on('newAddress', function(banana){
            console.log("Direcciones anteriores:", $scope.addresses, banana );
            $scope.addresses[$scope.addresses.length - 1] = banana;
            console.log("Direcciones posteriores:", $scope.addresses);
        });
        
        
        init();
        
        //// Derivado de la directiva
        
        $scope.cancel = function(){
            $scope.buttonCancelAction($scope.addresses);
        }
        
        $scope.next = function(){
            $scope.buttonNextAction($scope.addresses);
        }
        
        $scope.edit = function(){
            $scope.buttonEditAction($scope.addresses);
        }
        
        $scope.labelAction = function(){
            $scope.labelButtonAction($scope.addresses);
        }
        
        $scope.functionOnDelete = $scope.onDelete(function(address){
            
            console.log("Direcciones anteriores:", $scope.addresses);
            
            $scope.addresses = $scope.addresses.filter(function(ad){
                return ad.idDireccion != address.idDireccion;
            });
            
            console.log("Direcciones posteriores:", $scope.addresses);
        });
        
	}

})();
