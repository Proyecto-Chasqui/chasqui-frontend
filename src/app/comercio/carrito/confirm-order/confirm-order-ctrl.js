(function() {
	'use strict';

	angular.module('chasqui').controller('ConfirmOrderCtrl', ConfirmOrderCtrl);

	/** @ngInject */
	function ConfirmOrderCtrl($scope, $rootScope, contextPurchaseService, $log, sellerService, perfilService,
                              $stateParams, $mdDialog, $state, contextCatalogObserver, contextOrdersService) {
        
        $scope.catalog = null;
        $scope.currentNavItem = 0;
        $scope.sections = {
          orderSumary: false,
          selectAddress: false,
          questions: false,
          confirmation: false,
        }

        $scope.actions = {
          orderSumary: {
            next: function(){
              show('selectAddress');
            },
            cancel: function(){
              console.log("cancel");
            }
          },
          selectAddress: {
            next: function(){
              show('questions');
            },
            cancel: function(){
              show('orderSumary');
            }
          },
        }
        
        ////////////////// okActions /////////////////
        
        $scope.selectDeliveryAddressOkAction = selectDeliveryAddressOkAction;
        $scope.answerSellerQuestionsOkAction = answerSellerQuestionsOkAction;
        
        
        //// Actions
        $scope.cancelAction = cancelAction;
        $scope.back = back;
        $scope.next = next;
        $scope.goProfile = goProfile;
        
        $scope.showGoProfileButton = false;
        ////////////////// Data //////////////////
        
        $scope.selectedAddress = null;
        $scope.answers = [];
        
        /////////////////////////////////////
        
        function init(){
            $scope.sections.selectAddress = true;
            // develop

            function doOk(order){
              $scope.order = order;
              console.log("inside", $scope.order);
              $rootScope.$broadcast('order-loaded-suc', $scope.order);
            }

            if($stateParams.order){
              doOk($stateParams.order);
            } else {
              contextCatalogObserver.observe(function(){
                contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), contextPurchaseService.getAgrupationContextType())
                .then(function(){
                  contextPurchaseService.getSelectedOrder()
                  .then(doOk);
                })
              });
            }
        }
        
        ////////////////// Public ///////////////////
        
        function show(section){
            $scope.sections = Object.keys($scope.sections).reduce(function(r, s){r[s] = s == section;return r}, {});
            $scope.currentNavItem = Object.keys($scope.sections).indexOf(section);
        }
        
        function cancelAction(){
            $stateParams.actions.doNotOk();
            $mdDialog.hide();
        }
        
        function back(){
            show(Object.keys($scope.sections)[$scope.currentNavItem - 1]);
        }
        
        function next(){
            [
                function(){
                    $scope.$broadcast('check-direccion');
                    $scope.$broadcast('check-answers-length');
                },
                function(){
                    $scope.$broadcast('check-answers');
                },
                function(){
                    $stateParams.actions.doOk($scope.selectedAddress, $scope.answers);
                },
                function(){
                    $stateParams.actions.doOk($scope.selectedAddress, $scope.answers);
                }
            ][$scope.currentNavItem]();
        }
        
    function formatDate(date){
      return date.slice(0,2) + "/" + date.slice(3,5) + "/" + date.slice(6,10);
    }

    function getAddressZone(address){

      function doOk(response){
        $scope.addressZone = response.data;
        $scope.addressZone.fechaCierrePedidos = formatDate($scope.addressZone.fechaCierrePedidos);
      }

      function doNoOk(response){
        $scope.addressZone = {
          descripcion: "La dirección del domicilio no está asociada con ninguna zona de entrega del vendedor. Por favor comuniquese con el administrador del catálogo para confirmar los detalles de la compra."
        }
      }

      sellerService.getAddressZone(contextPurchaseService.getCatalogContext(), address.idDireccion, doNoOk).then(doOk);
    }
    


		function goProfile(){
			  $mdDialog.hide();
        $state.go('catalog.profile', {
            index: 1
        });
    };
        
        ////////////////// okActions /////////////////
        
        function selectDeliveryAddressOkAction(address){
            $scope.selectedAddress = address;
            $log.debug(address);
            show(Object.keys($scope.sections)[$scope.currentNavItem + 1]);
        }
        
        function answerSellerQuestionsOkAction(answers){
            $scope.answers = answers;
            show(Object.keys($scope.sections)[$scope.currentNavItem + 1]);
        }
        
        
        ////////////////// Private ///////////////////
        
        
        
        
        
        init();
	}

})();