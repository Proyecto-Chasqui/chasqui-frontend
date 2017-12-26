angular.module('chasqui').factory('orders_dao', 
                            ['ls_connection',
                    function(ls_connection){
    
                        
    var STATE_OPEN = "ABIERTO";                                
    var STATE_CANCEL = "CANCELADO";            
                        
                        
    function init(){
        ls_connection.init({
            orders: []
        });
        console.log("Starting orders_dao:", orders());
    }
                        
    init();
                        
                        
    function newOrder(order){
        ls_connection.modifyField("orders", function(orders){
            orders.push(order);
            return orders;
        });
    }
                        
    function removeOrder(id){
        ls_connection.modifyField("orders", function(orders){
            return orders.reduce(function(r,o){
                return (o.id === id)? r : cons(r, o);
            }, []);
        });
    }                
                        
    function cons(list, elem){
        list.push(elem);
        return list;
    }
                        
    function loadOrders(orders){
        orders.forEach(newOrder);
    }
                        
    function reset(){
        console.log("RESET");
        init();
    }
                        
    function orders(){
        return ls_connection.get("orders");
    }
    
    function getOrder(orderId){
        return orders().filter(function(o){return o.id == orderId})[0];
    }
                        
    function changeToStateCancel(orderId){
        changeToState(orderId, STATE_CANCEL);
    } 
      
    function changeToStateOpen(orderId){
        changeToState(orderId, STATE_OPEN);
    }   
                        
    function changeToState(orderId, state){
        ls_connection.modifyField("orders", function(orders){
            orders.filter(function(o){return o.id == orderId})[0].estado = state;
            return orders;
        });
    }
                        
    //////////////////////////                        
                        
    return {
        newOrder: newOrder,
        removeOrder: removeOrder,
        loadOrders: loadOrders, 
        getOrders: orders,
        getOrder: getOrder,
        changeToStateCancel: changeToStateCancel,
        changeToStateOpen: changeToStateOpen,
        reset: reset
    }
    
}]);