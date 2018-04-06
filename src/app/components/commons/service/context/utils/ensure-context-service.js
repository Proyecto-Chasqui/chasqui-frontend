(function() {
	'use strict';

	angular.module('chasqui').service('ensureContext', ensureContext);
    
	function ensureContext($log, $q, REST_ROUTES){
        
        return ensureContextImpl;
         
        ///////////////////// Public
        
        function ensureContextImpl(lastUpdate, contextName, cacheIsEmpty, returnFromServer){
			var defered = $q.defer();
			var promise = defered.promise;
            
			if (cacheTimeExpired(lastUpdate) || cacheIsEmpty) {
                $log.debug("NO tiene " + contextName + " en cache");
                returnFromServer(defered);
			}else{
                defered.resolve();
            }
            
			return promise;
		}
        
        
        ///////////////////// Private
        
        function cacheTimeExpired(lastUpdate){
			return parseInt(moment().diff(lastUpdate))/1000 > REST_ROUTES.TIEMPO_MAX_CACHE;
		}
    }
     
})();   