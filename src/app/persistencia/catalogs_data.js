angular.module('chasqui').factory('catalogs_data', catalogs_data);

    
function catalogs_data(ls_connection, agrupationTypeVAL){
    
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
        console.log("RESET");
        init();
    }             
    
    function resetOrders(catalogId){
        ls_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId].orders = startingOrders;
            return catalogs_data;
        });
    }
    
    function resetAgrupations(catalogId){
        ls_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId].agrupations = startingAgrupations;
            return catalogs_data;
        });
    }
          
    function addCatalog(catalogId){
        ls_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId] = startingCatalogData();
            return catalogs_data;
        });
    }
    
    function getCatalog(catalogId){
        return ls_connection.get("catalogs_data")[catalogId];
    }
    
    function modifyCatalogData(catalogId, modification){
        ls_connection.modifyField("catalogs_data", function(catalogs_data){
            console.log("Catalog data", catalogs_data);
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
        ls_connection.init({
            catalogs_data: {}
        });
        console.log("Starting catalogs_data");
    }
                        
    init();
    
    //////////////////////////////////////////////////////////////////////////////////////////////
                        
    return catalogs_data_int;
    
};