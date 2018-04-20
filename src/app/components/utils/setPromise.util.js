(function() {
	'use strict';

	angular.module('chasqui').service('setPromise', setPromise);
    
	function setPromise($q){
        
        return setPromiseImpl;

        function setPromiseImpl(deferedFunction){
            var defered = $q.defer();
            var promise = defered.promise;
            
            deferedFunction(defered);
            
            return promise;  
        }
        
    }
})();