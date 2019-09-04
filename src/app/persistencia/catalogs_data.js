angular.module('chasqui').factory('catalogs_data', catalogs_data);

    
function catalogs_data(ss_connection, agrupationTypeVAL, $log){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    var catalogs_data_int = {
        init: init,
        reset: reset,
        resetOrders: resetOrders,
        resetAgrupations: resetAgrupations,
        addCatalog: addCatalog, 
        getCatalog: getCatalog, 
        modifyCatalogData: modifyCatalogData
    }
    
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    function reset(){
        Object.keys(ss_connection.get("catalogs_data")).forEach(function(catalogId){
            resetOrders(catalogId);
            resetAgrupations(catalogId);
        })
    }             
    
    function resetOrders(catalogId){
        ss_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId].orders = startingOrders;
            return catalogs_data;
        });
    }
    
    function resetAgrupations(catalogId){
        ss_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId].agrupations = startingAgrupations;
            return catalogs_data;
        });
    }
          
    function addCatalog(catalogId){
        ss_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId] = startingCatalogData();
            return catalogs_data;
        });
    }
    
    function getCatalog(catalogId){
        return ss_connection.get("catalogs_data")[catalogId];
    }
    
    function modifyCatalogData(catalogId, modification){
        ss_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId] = modification(catalogs_data[catalogId]);
            return catalogs_data;
        });
    }
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    function startingCatalogData(){
        return {
            orders: startingOrders,
            agrupations: startingAgrupations
        }
    }
    
    /*  
     *  PROP: Creates startingOrders object with one entry per agrupation type.
     */ 
    var startingOrders = Object.keys(agrupationTypeVAL).reduce(function(r,k){
        r[agrupationTypeVAL[k]] = []; return r;
    }, {})
    
    /*  
     *  PROP: Creates startingAgrupations object with one entry per agrupation type.
     */ 
    var startingAgrupations = Object.keys(agrupationTypeVAL).reduce(function(r,k){
        r[agrupationTypeVAL[k]] = []; return r;
    }, {})
    
    /////////////////////////////////////////   Init    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    
    function init(){
        ss_connection.init({
            catalogs_data: {}
        });
        $log.debug("Init catalogs_data");
    }
                        
    init();
    
    //////////////////////////////////////////////////////////////////////////////////////////////
                        
    return catalogs_data_int;
    
};