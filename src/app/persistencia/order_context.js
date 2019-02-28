(function() {
	'use strict';
    
    angular.module('chasqui').factory('order_context', order_context);

    function order_context(ss_connection, settersAndGettersBuilder, fn_set, fn_get, $log){

        var initFields = {
                            catalogId: -1,
                            agrupationId: -1,
                            agrupationType: "",
                            productId: -1
                        }

        function init(){
            $log.debug("Init order_context");
            ss_connection.init(initFields);
        }

        init();

        //////////////////////////////////////////////

        var set = fn_set(ss_connection);
        var get = fn_get(ss_connection);

        //////////////////////////        
        
        var order_context = settersAndGettersBuilder(set, get, Object.keys(initFields));
        order_context.reset = init;

        return order_context;
    
    }
})();