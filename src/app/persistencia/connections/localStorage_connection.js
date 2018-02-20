angular.module('chasqui').factory('ls_connection', ls_connection);

function ls_connection(storageConnection){  
    
    return storageConnection(localStorage);
    
}