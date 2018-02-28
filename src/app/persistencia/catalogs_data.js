angular.module('chasqui').factory('catalogs_data', catalogs_data);

    
function catalogs_data(ls_connection){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    var catalogs_data_int = {
        reset: reset,
        addCatalog: addCatalog, 
        getCatalog: getCatalog
    }
    
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    function reset(){
        console.log("RESET");
        init();
    }              
          
    function addCatalog(catalogId){
        ls_connection.modifyField("catalogs_data", function(catalogs_data){
            catalogs_data[catalogId.toString()] = startingCatalogData();
            return catalogs_data;
        });
    }
    
    function getCatalog(catalogId){
        return ls_connection.get("catalogs_data")[catalogId.toString()];
    }
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    function startingCatalogData(){
        return {
            orders: {},
            agrupations: {}
        }
    }
    
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
    
}]);