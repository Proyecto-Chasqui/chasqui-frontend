(function() {
  'use strict';

  angular.module('chasqui').controller('ConfirmOrderCtrl', ConfirmOrderCtrl);

  /** @ngInject */
  function ConfirmOrderCtrl($scope, $rootScope, contextPurchaseService, $log, 
                              $stateParams, $state, contextCatalogObserver, contextOrdersService) {
        
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
          cancelAction();
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
      questions: {
        next: function(){
          show('confirmation');
        },
        cancel: function(){
          show('selectAddress');
        }
      },
      confirmation: {
        next: function(){
          $stateParams.actions.doOk($scope.selectedAddress, $scope.answers);
        },
        cancel: function(){
          show('questions');
        }
      },
    }
    
    ////////////////// okActions /////////////////
    
    
    //// Actions
    $scope.cancelAction = cancelAction;
    $scope.goProfile = goProfile;
    
    $scope.showGoProfileButton = false;

    $scope.selectDeliveryAddressOkAction = selectDeliveryAddressOkAction;
    $scope.answerSellerQuestionsOkAction = answerSellerQuestionsOkAction;
            
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
    
    ////////////////// Data //////////////////
    
    $scope.selectedAddress = null;
    $scope.answers = [];
        
    ////////////////// Public ///////////////////
    
    function show(section){
      $scope.sections = Object.keys($scope.sections).reduce(function(r, s){r[s] = s == section;return r}, {});
      $scope.currentNavItem = Object.keys($scope.sections).indexOf(section);
    }
    
    function cancelAction(){
      $stateParams.actions.doNotOk();
      $state.go('catalog.products')
    }

    function goProfile(){
      $state.go('catalog.profile', {
        index: 1
      });
    }
    
    ////////////////// Private ///////////////////
    
    function init(){
      $scope.sections.orderSumary = true;
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
    
    init();
  }

})();