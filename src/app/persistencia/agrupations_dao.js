angular.module('chasqui').factory('agrupations_dao', agrupations_dao);

function agrupations_dao(catalogs_data, ls_connection, fn_snoc){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                 
    var agrupations_dao_int = {
                            reset: reset,
                            newAgrupation: newAgrupation,
                            loadAgrupations: loadAgrupations, 
                            getAgrupation: getAgrupation,
                            getAgrupations: getAgrupations, 
                            modifyGroup: modifyGroup,
                            deleteAgrupation: deleteAgrupation
                        }
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
                            
    function reset(catalogId){
        console.log("RESET");
        init(catalogId);
    }              
    
    
    function newAgrupation(catalogId, agrupation){
        newAgrupationCurrified(catalogId)(agrupation);
    }
    
    function loadAgrupations(catalogId, agrupations){
        agrupations.forEach(newAgrupationCurrified(catalogId));
    }
    
    function getAgrupations(){
        var catalogId = "2";
        var agrupations = catalogs_data.getCatalog(catalogId).agrupations;
        
        return Object.keys(agrupations).reduce(
            function(r,ot){ return r.concat(agrupations[ot]) }, 
            []
        );
    }
    
    
    function getAgrupation(catalogId, agrupationId, agrupationType){
        return catalogs_data.getCatalog(catalogId).agrupations[agrupationType].filter(function(g){return g.idGrupo == agrupationId})[0];
    }
    
    
    function deleteAgrupation(catalogId, agrupationId, agrupationType){
        catalogs_data.modifyCatalogData(catalogId, function(catalog){
            catalog.agrupations[agrupationType].splice(
                catalog.agrupations[agrupationType].map(function(g){return g.idGrupo}).indexOf(agrupationId), 
                1);
            return catalog;
        });
    }
    
    
    function modifyGroup(catalogId, agrupationId, agrupationType, modification){
        var agrupation = getAgrupation(catalogId, agrupationId, agrupationType);
        deleteAgrupation(catalogId, agrupationId, agrupationType);
        newAgrupation(catalogId, modification(agrupation));
    }
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    
    function newAgrupationCurrified(catalogId){
        return function (agrupation){
            modifyAgrupationsInCatalog(catalogId, agrupation.type, function(agrupations){
                return fn_snoc(agrupations, agrupation);
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
        catalogs_data.resetAgrupations(catalogId);
    }
    
    ///////////////////////////////////////////////////////////
    
    return agrupations_dao_int;
    
}