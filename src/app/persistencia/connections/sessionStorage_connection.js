angular.module('chasqui').factory('ss_connection', ss_connection);

function ss_connection(storageConnection){  
    
    return storageConnection(sessionStorage);
    
}