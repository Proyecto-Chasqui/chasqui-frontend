angular.module('chasqui').directive('formAddress', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'FormAddressController',
        scope: {
            address: '=', // Direccion a modificar
            buttonNextLabel: '@', // Sin label no se muestra el boton
            buttonNextAction: '=',
            buttonCancelLabel: '@', // Sin label no se muestra el boton
            buttonCancelAction: '=',
            buttonEditLabel: '@', // Sin label no se muestra el boton
            buttonEditAction: '=',
            onSave: '=',
            onDelete: '=',
            onMarkAsPrimary:'='
        },
        templateUrl: 'app/comercio/administracion/formularios/form-addresses/form-address/form-address.tmpl.html'
      };
        
}]);