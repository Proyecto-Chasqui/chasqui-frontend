(function() {
	'use strict';
    
    angular.module('chasqui').directive('discriminacionIncentivo', discriminacionIncentivo);
    
	function discriminacionIncentivo() {
    
        return {
            restrict: 'E',
            scope: {
                node: "=",
                active: "=",
                isAdmin: "=",
            },
            controller: 'discriminacionIncentivoController',
            templateUrl: 'app/components/commons/discriminacion-incentivo/discriminacion-incentivo.tmpl.html'
          };
    }
    
})();         