(function() {
	'use strict';

	angular.module('chasqui').factory('getContext', getContext);
    
	function getContext($log, $q, CTE_REST){
         
        function cacheTimeExpired(lastUpdate){
			return parseInt(moment().diff(lastUpdate))/1000 > CTE_REST.TIEMPO_MAX_CACHE;
		}
        
        // Interfaz 
        return function (lastUpdate, contextName, context, cacheIsEmpty, returnFromServer){
			var defered = $q.defer();
			var promise = defered.promise;

			if (cacheTimeExpired(lastUpdate) || cacheIsEmpty) {
                $log.debug("NO tiene " + contextName + " en cache");
                returnFromServer(defered);
			} else {
				context().then(defered.resolve);
			}

			return promise;
		}
    }
     
})();   