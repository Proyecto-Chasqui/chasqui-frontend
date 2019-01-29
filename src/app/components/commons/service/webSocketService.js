(function() {
    'use strict';

angular
    .module('chasqui').
    service('webSocketService', webSocketService);

    function webSocketService(toastr,$websocket,$log,contextPurchaseService,digestMessageService,URLS){
    	//parametrizar
      var dataStream = $websocket(URLS.be_websocket.concat(""), null, { reconnectIfNotNormalClose: true });

      dataStream.onMessage(function(message) {
        $log.debug("MESSAGE", message.data);
        digestMessageService.webSocketMessageDispatch(JSON.parse(message.data));
      });
      //solo para debug, elminar los toast cuando se vaya a produccion
      dataStream.onClose(function(message){
        //toastr.info("","WEBSOCKET CLOSE",{timeOut: 8000});
      });

      dataStream.onOpen(function(message){
        //toastr.info("","WEBSOCKET OPEN",{timeOut: 8000});
      });

    };
})(); // anonimo