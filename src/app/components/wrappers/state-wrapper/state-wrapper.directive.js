(function() {
	'use strict';
    
    angular.module('chasqui').directive('stateWrapper', stateWrapper);
    
	function stateWrapper() {
    
        return {
            restrict: 'E',
            transclude: true,
            scope: {
                supportedStrategies: '@' /* List. Can be any combination of:
                                                    * nodos
                                                    * gcc
                                                    * compraIndividual
                                                    * puntoDeEntrega
                                                    * seleccionDeDireccionDelUsuario
                                            
                                            Any other may result in error
                                          */
            },
            controller: 'StateWrapperCtrl',
            templateUrl: 'app/components/wrappers/element-wrapper/element-wrapper.tmpl.html'
          };
    }
    
})();         