(function() {
	'use strict';
    
    angular.module('chasqui').factory('order_context', order_context);

    function order_context(ss_connection, settersAndGettersBuilder, fn_set, fn_get){

        var initFields = {
                            catalogId: -1,
                            groupId: -1,
                            groupType: "",
                            orderId: -1,
                            productId: -1
                        }

        function init(){
            console.log("Init order_context");
            ss_connection.init(initFields);
        }

        init();

        //////////////////////////////////////////////

        var set = fn_set(ss_connection);
        var get = fn_get(ss_connection);

        //////////////////////////                        

        return settersAndGettersBuilder(set, get, Object.keys(initFields));
    
    }
})();