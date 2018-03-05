(function() {
	'use strict';

	angular.module('chasqui').factory('agrupationTypeVAL', agrupationTypeVAL);
    
	function agrupationTypeVAL(){
         
        return {
            TYPE_PERSONAL: 'PERSONAL',
            TYPE_GROUP: 'GROUP',
            TYPE_NODE: 'NODE'
        }
    }
     
})();   