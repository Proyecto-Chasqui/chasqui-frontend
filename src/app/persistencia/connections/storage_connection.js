angular.module('chasqui').factory('storageConnection', storageConnection);

function storageConnection(){  
    
    return function(storage){
        return {
            init: function(mapping){
                    for(k in mapping){
                        this.save(k, mapping[k]);
                    }
                },
            
            save: function(key, obj){
                    storage.setItem(key, JSON.stringify(obj));
                },
            
            get: function(key){
                    return JSON.parse(storage.getItem(key));
                },
            
            remove: function(id){
                    storage.removeItem(id);
                },
            
            modifyField: function(field, modification){
                    this.save(field, modification(this.get(field)));
                }
        }
    }
    
}