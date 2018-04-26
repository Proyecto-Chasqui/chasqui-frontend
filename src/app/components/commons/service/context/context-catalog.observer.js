(function() {
	'use strict';

	angular.module('chasqui').service('contextCatalogObserver', contextCatalogObserver);

	function contextCatalogObserver() {
       
        var contextCatalogObserverImpl = {
            observe: observe,
            run: run
        }
        
        ///////////////
        
        
        var runObservers = false;
        var observers = [];       
		
		function observe(observerFunction){
            if(runObservers){
                observerFunction();
            }else{
                observers.push(observerFunction);                
            }
        }
        
        function run(){
            observers.forEach(function(observerFunction){
                observerFunction();
            });
            runObservers = true
        }
        
        return contextCatalogObserverImpl;
	}
})();