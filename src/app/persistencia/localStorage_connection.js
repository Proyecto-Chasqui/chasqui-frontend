angular.module('chasqui').factory('ls_connection', ls_connection);

function ls_connection(){  
    
    function init(mapping){
        for(k in mapping){
            save(k, mapping[k]);
        }
    }
    
    function save(key, obj){
        localStorage.setItem(key, JSON.stringify(obj));
    }
                        
    
    function get(key){
        return JSON.parse(localStorage.getItem(key));
    }
                        
    function remove(id){
        localStorage.removeItem(id);
    }
    
    
    function modifyField(field, modification){
        save(field, modification(get(field)));
    }
    
    return {
        init: init,
        save: save,
        get: get,
        remove: remove,
        modifyField: modifyField
    }
    
}