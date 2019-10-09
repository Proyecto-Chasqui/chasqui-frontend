(function() {
	'use strict';

	angular.module('chasqui').factory('getContext', getContext);
    
	function getContext($log, $q, REST_ROUTES){
         
    function cacheTimeExpired(lastUpdate){
			return parseInt(moment().diff(lastUpdate))/1000 > REST_ROUTES.TIEMPO_MAX_CACHE;
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