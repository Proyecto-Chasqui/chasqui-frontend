angular.module('chasqui').factory('order_context', 
                            ['ls_connection',
                    function(ls_connection){
    
                        
    function init(){
        console.log("Init order_context");
        ls_connection.init({
            productSelectedId: -1,
            groupSelectedId: -1,
            orderSelectedId: -1
        });
    }
                        
    init();
          
    //////////////////////////////////////////////
    
    function setProductSelected(key){
        ls_connection.save("productSelectedId", key);
    }
                        
    function getProductSelected(){
        return ls_connection.get("productSelectedId");
    }
                       
    function setGroupSelected(key){
        ls_connection.save("groupSelectedId", key);   
    }
                         
    function getGroupSelected(){
        return ls_connection.get("groupSelectedId");
    }
                        
    function setOrderSelected(key){
        ls_connection.save("orderSelectedId", key);
    }
                        
    function getOrderSelected(){
        return ls_connection.get("orderSelectedId");
    }
            
                      
    //////////////////////////                        
                        
    return {
        setProductSelected: setProductSelected,
        getProductSelected: getProductSelected,
        setGroupSelected: setGroupSelected,
        getGroupSelected: getGroupSelected,
        setOrderSelected: setOrderSelected,
        getOrderSelected: getOrderSelected
    }
    
}]);