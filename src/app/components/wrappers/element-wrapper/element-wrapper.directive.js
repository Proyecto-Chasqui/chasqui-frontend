(function() {
	'use strict';
    
    angular.module('chasqui').directive('elementWrapper', elementWrapper);
    
	function elementWrapper() {
    
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                supportedStrategies: '@', /* List. Can be any combination of:
                                                    * nodos
                                                    * gcc
                                                    * compraIndividual
                                                    * puntoDeEntrega
                                                    * seleccionDeDireccionDelUsuario
                                            
                                            Any other may result in error
                                          */
                notSupportedStrategies: '@' /* List. Can be any combination of:
                                                    * nodos
                                                    * gcc
                                                    * compraIndividual
                                                    * puntoDeEntrega
                                                    * seleccionDeDireccionDelUsuario
                                            
                                            Any other may result in error
                                          */
            },
            controller: 'ElementWrapperCtrl',
            templateUrl: 'app/components/wrappers/element-wrapper/element-wrapper.tmpl.html'
          };
    }
    
})();         