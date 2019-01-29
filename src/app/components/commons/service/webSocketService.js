(function() {
    'use strict';

angular
    .module('chasqui').
    service('webSocketService', webSocketService);

    function webSocketService(toastr,$websocket,$log,contextPurchaseService,digestMessageService,URLS){
    	//parametrizar
      var dataStream = $websocket(URLS.be_websocket, null, { reconnectIfNotNormalClose: true });

      dataStream.onMessage(function(message) {
        $log.debug("MESSAGE", message.data);
        toastr.info(message.data,"WEBSOCKET MESSAGE",{timeOut: 800000});
        digestMessageService.webSocketMessageDispatch(JSON.parse(message.data));
      });
      //solo para debug, elminar los toast cuando se vaya a produccion
      dataStream.onClose(function(message){
        toastr.info("","WEBSOCKET CLOSE",{timeOut: 800000});
      });

      dataStream.onOpen(function(message){
        toastr.info("","WEBSOCKET OPEN",{timeOut: 800000});
      });

    };
})(); // anonimo