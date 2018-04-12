(function() {
	'use strict';

	angular.module('chasqui').service('contextCatalogsService', contextCatalogsService);
    
	function contextCatalogsService(catalogs_dao, $q, sellerService){
        
        
        ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
         
        var contextCatalogsServiceInt = {
            getCatalogs: getCatalogs,
            getCatalog: getCatalog,
            getCatalogByShortName: getCatalogByShortName
        };
        
        
        ///////////////////////////////////////// Public \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
               
        
        function getCatalogs(){
            return setPromise(function(defered){
                var preCacheCatalogs = catalogs_dao.getCatalogs();

                if(preCacheCatalogs.length > 0){
                    defered.resolve(preCacheCatalogs);
                }else{
                    sellerService.getSellers().then(function(response){
                        catalogs_dao.loadCatalogs(response.data);
                        defered.resolve(response.data);
                    });
                }
            });
        }

        
        function getCatalog(catalogId){
            return setPromise(function(defered){
                getCatalogs().then(function(catalogs){
                    defered.resolve(filter(function(c){return c.id == catalogId})[0]);
                });
            });
        }
        
        
        function getCatalogByShortName(catalogShortName){
            return setPromise(function(defered){
                getCatalogs().then(function(catalogs){
                    defered.resolve(catalogs.filter(function(c){return c.nombreCorto.toLowerCase() == catalogShortName.toLowerCase()})[0]);
                });
            });
        }
        
        ///////////////////////////////////////// Private \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        function setPromise(deferedFunction){
            var defered = $q.defer();
            var promise = defered.promise;
            
            deferedFunction(defered);
            
            return promise;  
        }
        
        
        ///////////////////////////////////////// INIT \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
        
        
        return contextCatalogsServiceInt;
    }
     
})();   