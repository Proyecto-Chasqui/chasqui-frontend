(function() {
	'use strict';
    
    angular.module('chasqui').directive('sectionWrapper', sectionWrapper);
    
	function sectionWrapper() {
    
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
            controller: 'SectionWrapperCtrl',
            templateUrl: 'app/components/wrappers/section-wrapper/section-wrapper.tmpl.html'
          };
    }
    
})();         