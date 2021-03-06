angular.module('chasqui').factory('orders_dao', orders_dao);

function orders_dao(catalogs_data, fn_snoc, agrupationTypeDispatcher, $log){
    
    ///////////////////////////////////////// Interface \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
   
    var orders_dao_int = {
            reset: reset,
            resetType: resetType,
            newOrder: newOrder,
            modifyOrder: modifyOrder, 
            loadOrders: loadOrders, 
            getOrders: orders,
            getOrdersByType: getOrdersByType, 
            getOrder: getOrder,
            removeOrder: removeOrder,
            changeToStateOpen: changeToStateOpen,
            changeToStateCancel: changeToStateCancel,
            changeToStateConfirm: changeToStateConfirm,
            changeToStateExpired: changeToStateExpired,
        }
    
    /////////////////////////////////////////  Public   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
    
    function newOrder(catalogId, order){
        newOrderCurrified(catalogId)(order);
    }
    
    function newOrderCurrified(catalogId){
        return function (order){
            modifyOrdersInCatalog(catalogId, order.type, function(orders){
                if(orders.map(function(o){return o.id}).includes(order.id)){
                    return orders;
                }else{
                    return fn_snoc(orders, order);
                }
            })
        }
    }
    
    function modifyOrder(catalogId, order, modification){
        removeOrder(catalogId, order.id, order.type);
        newOrder(catalogId, modification(order));
    }
                        
    function removeOrder(catalogId, orderId, orderType){
        modifyOrdersInCatalog(catalogId, orderType, function(orders){
            return orders.filter(function(o){return o.id != orderId})
        })
    }  
                        
    function loadOrders(catalogId, orders){
        orders.forEach(newOrderCurrified(catalogId));
    }
                        
    function reset(catalogId){
        init(catalogId);
    }
    
    function resetType(catalogId, orderType){
        modifyOrdersInCatalog(catalogId, orderType, function(orders){
            return [];
        })
    }
                        
    function orders(catalogId){
        var orders = catalogs_data.getCatalog(catalogId).orders;
        
        return Object.keys(orders).reduce(
            function(r,ot){ return r.concat(orders[ot]) }, 
            []
        );
    }
    
    function getOrdersByType(catalogId, ordersType){
        return catalogs_data.getCatalog(catalogId).orders[ordersType];
    }
    
    function getOrder(catalogId, orderId, orderType){
        return agrupationTypeDispatcher.byType(orderType, 
            function(){
                return catalogs_data.getCatalog(catalogId).orders[orderType][0];
            },
            function(){
                return catalogs_data.getCatalog(catalogId).orders[orderType].filter(function(o){return o.id == orderId})[0];
            },
            function(){
                return catalogs_data.getCatalog(catalogId).orders[orderType].filter(function(o){return o.id == orderId})[0];
            })();
    }
      
    function changeToStateOpen(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_OPEN);
    } 
              
    function changeToStateCancel(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_CANCEL);
    } 
                        
    function changeToStateConfirm(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_CONFIRM);
    } 
      
    function changeToStateExpired(catalogId, orderId, orderType){
        changeToState(catalogId, orderId, orderType, STATE_EXPIRED);
    } 
    
    /////////////////////////////////////////  Private  \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
    
    var STATE_OPEN = "ABIERTO";                                
    var STATE_CANCEL = "CANCELADO";  
    var STATE_CONFIRM = "CONFIRMADO";  
    var STATE_EXPIRED = "VENCIDO";                                
    
    function modifyOrdersInCatalog(catalogId, ordersType, modification){
        catalogs_data.modifyCatalogData(catalogId, function(catalog){
            catalog.orders[ordersType] = modification(catalog.orders[ordersType])
            return catalog;
        })
    }
    
    function changeToState(catalogId, orderId, orderType, state){
        modifyOrdersInCatalog(catalogId, orderType, function(orders){
            orders.filter(function(o){return o.id == orderId})[0].estado = state;
            return orders;
        });
    }   
    
    /////////////////////////////////////////   Init    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\     
         
    function init(catalogId){ 
        $log.debug("Init orders_dao");
        catalogs_data.resetOrders(catalogId);
    }
                   
    //////////////////////////                        
                        
    return orders_dao_int
    
};