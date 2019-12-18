angular.module('chasqui').factory('agrupations_dao', agrupations_dao);

function agrupations_dao(catalogs_data, ls_connection, fn_snoc, $log, agrupationTypeVAL){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                 
    var agrupations_dao_int = {
                            reset: reset,
                            newAgrupation: newAgrupation,
                            loadAgrupations: loadAgrupations, 
                            getAgrupation: getAgrupation,
                            getAgrupations: getAgrupations, 
                            getAgrupationsByType: getAgrupationsByType,
                            modifyGroup: modifyGroup,
                            deleteAgrupation: deleteAgrupation
                        }
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                            
    function reset(catalogId){
        init(catalogId);
    }              
    
    
    function newAgrupation(catalogId, agrupation){
        newAgrupationCurrified(catalogId)(agrupation);
    }
    
    function loadAgrupations(catalogId, agrupations){
        agrupations.forEach(newAgrupationCurrified(catalogId));
    }
    
    function getAgrupations(catalogId){
        var catalogAgrupations = agrupations(catalogId);
        
        return Object.keys(catalogAgrupations).reduce(
            function(r,ot){ return r.concat(catalogAgrupations[ot]) }, 
            []
        );
    }
    
    
    function getAgrupation(catalogId, agrupationId, agrupationType){
        return agrupations(catalogId)[agrupationType].filter(function(g){return g.id == agrupationId})[0];
    }
    
    function getAgrupationsByType(catalogId, agrupationsType){
        return agrupations(catalogId)[agrupationsType];
    }
    
    function deleteAgrupation(catalogId, agrupationId, agrupationType){
        catalogs_data.modifyCatalogData(catalogId, function(catalog){
            catalog.agrupations[agrupationType].splice(
                catalog.agrupations[agrupationType].map(function(g){return g.id}).indexOf(agrupationId), 
                1);
            return catalog;
        });
    }
    
    
    function modifyGroup(catalogId, agrupationId, agrupationType, modification){
        modifyAgrupationsInCatalog(catalogId, agrupationType, function(agrupations){
            var searchedAgrupationIndex = agrupations.map(function(a){return a.id;}).indexOf(agrupationId);
            agrupations[searchedAgrupationIndex] = modification(agrupations[searchedAgrupationIndex]);
            return agrupations;
        })
        
    }
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    function catalog(catalogId){
        return catalogs_data.getCatalog(catalogId);
    }
    
    function agrupations(catalogId){
        return catalog(catalogId).agrupations;
    }
    
    function newAgrupationCurrified(catalogId){
        return function (newAgrupation){
            modifyAgrupationsInCatalog(catalogId, newAgrupation.type, function(agrupations){
                if(agrupations.map(function(a){return a.id}).includes(newAgrupation.id)){
                    agrupations[agrupations.map(function(a){return a.id}).indexOf(newAgrupation.id)] = newAgrupation;
                    return agrupations;
                }else{
                    return fn_snoc(agrupations, newAgrupation);
                }
            })
        }
    }
    
    
    function modifyAgrupationsInCatalog(catalogId, agrupationType, modification){
        catalogs_data.modifyCatalogData(catalogId, function(catalog){
            catalog.agrupations[agrupationType] = modification(catalog.agrupations[agrupationType])
            return catalog;
        })
    }
    
    /////////////////////////////////////////   Init    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    function init(catalogId){
        $log.debug("Init agrupations_dao");
        catalogs_data.resetAgrupations(catalogId);
    }
    
    ///////////////////////////////////////////////////////////
    
    return agrupations_dao_int;
    
}