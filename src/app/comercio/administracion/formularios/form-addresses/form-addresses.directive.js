angular.module('chasqui').directive('formAddresses', [
        function(){
    
            
    return {
        restrict: 'E',
        controller: 'FormAddressesController',
        scope: {
            loadPreviousDirections: '=',    // Boolean. False by default
            buttonNextLabel: '@',           // Sin label no se muestra el boton
            buttonNextAction: '=',
            buttonCancelLabel: '@',         // Sin label no se muestra el boton
            buttonCancelAction: '=',
            buttonEditLabel: '@',           // Sin label no se muestra el boton
            buttonEditAction: '=',
            labelButtonLabel: '@',          // Sin label no se muestra el boton
            labelButtonAction: '=',
            onSave: '=',
            onDelete: '=',
            onMarkAsPrimary:'='
        },
        templateUrl: 'app/comercio/administracion/formularios/form-addresses/form-addresses.tmpl.html'
      };
        
}]);