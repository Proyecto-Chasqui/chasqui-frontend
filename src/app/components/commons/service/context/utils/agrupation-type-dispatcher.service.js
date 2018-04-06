(function() {
	'use strict';

	angular
		.module('chasqui')
		.service('agrupationTypeDispatcher', agrupationTypeDispatcher);

	function agrupationTypeDispatcher(agrupationTypeVAL) {

        return {
            byType: agrupationTypeDispatcherByType,
            byElem: agrupationTypeDispatcherByElem
        };
        
        /////////////////////////////////////////////////////////////
        
        function agrupationTypeDispatcherByType(type, personalFunc, groupFunc, nodeFunc){
            return (type === agrupationTypeVAL.TYPE_PERSONAL)? personalFunc :
                   (type === agrupationTypeVAL.TYPE_GROUP)? groupFunc :
                   (type === agrupationTypeVAL.TYPE_NODE)? nodeFunc : 0;
        }
        
        function agrupationTypeDispatcherByElem(elem, personalFunc, groupFunc, nodeFunc){
            return agrupationTypeDispatcherByType(elem.type, personalFunc, groupFunc, nodeFunc)(elem);
        }
        
	}
})();