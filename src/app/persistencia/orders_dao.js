angular.module('chasqui').factory('orders_dao', orders_dao);

function orders_dao(catalogs_data){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
   
    var orders_dao_int = {
            reset: reset,
            newOrder: newOrder,
            loadOrders: loadOrders, 
            getOrders: orders,
            getOrdersByType: getOrdersByType, 
            getOrder: getOrder,
            removeOrder: removeOrder,
            changeToStateCancel: changeToStateCancel,
            changeToStateOpen: changeToStateOpen
        }
    
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    function newOrder(catalogId, order){
        newOrderCurrified(catalogId)(order);
    }
    
    function newOrderCurrified(catalogId){
        return function (order){
            modifyOrdersInCatalog(catalogId, order.type, function(orders){
                return snoc(orders, order);
            })
        }
    }
                        
    function removeOrder(catalogId, orderId, orderType){
        modifyOrdersInCatalog(catalogId, ordersType, function(orders){
            return orders.filter(function(o){return o.id != orderId})
        })
    }  
                        
    function loadOrders(catalogId, orders){
        orders.forEach(newOrderCurrified(catalogId));
    }
                        
    function reset(){
        console.log("RESET");
        init();
    }
                        
    function orders(catalogId){
        var orders = catalogs_data.getCatalog(catalogId).orders;
        
        return Object.keys(orders).reduce(function(r,ot){
            return r.concat(orders[ot]); 
        }, []);
    }
    
    function getOrdersByType(catalogId, ordersType){
        return catalogs_data.getCatalog(catalogId)[ordersType];
    }
    
    function getOrder(catalogId, orderId, orderType){
        return catalogs_data.getCatalog(catalogId).orders[orderType].filter(function(o){return o.id == orderId})[0];
    }
                        
    function changeToStateCancel(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_CANCEL);
    } 
      
    function changeToStateOpen(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_OPEN);
    } 
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    var STATE_OPEN = "ABIERTO";                                
    var STATE_CANCEL = "CANCELADO";  
    
    function modifyOrdersInCatalog(catalogId, ordersType, modification){
        catalogs_data.modifyCatalogData(catalogId, function(catalog){
            catalog.orders[ordersType] = modification(catalog.orders[ordersType])
            return catalog;
        })
    }
    
    function changeToState(catalogId, orderId, orderType, state){
        modifyOrdersInCatalog(catalogId, ordersType, function(orders){
            orders.filter(function(o){return o.id == orderId})[0].estado = state;
            return orders;
        });
    }   
    
    function snoc(list, elem){
        list.push(elem);
        return list;
    }
    
    /////////////////////////////////////////   Init    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
         
    function init(){
    }
                        
    init();
                   
    //////////////////////////                        
                        
    return orders_dao_int
    
};