(function() {
  'use strict';

  angular.module('chasqui').controller('ConfirmOrderCtrl', ConfirmOrderCtrl);

  /** @ngInject */
  function ConfirmOrderCtrl($scope, $rootScope, contextPurchaseService, $log, agrupationTypeDispatcher,
                              $stateParams, $state) {
        
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
        next: function(address){
          $scope.selectedAddress = address;
          $scope.order.idDireccion = address.selected.idDireccion;
          show('questions');
        },
        cancel: function(address){
          $scope.selectedAddress = address;
          show('orderSumary');
        }
      },
      questions: {
        next: function(answers){
          $scope.answers = answers;
          show('confirmation');
        },
        cancel: function(answers){
          $scope.answers = answers;
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

    ////////////////// Data //////////////////
    
    $scope.selectedAddress = null;
    $scope.answers = [];

    $scope.getSelectedAddress = function(){
      return $scope.selectedAddress;
    }

    $scope.getQuestions = function(){
      return $scope.answers;
    }
        
    ////////////////// Public ///////////////////
    
    function show(section){
      $scope.sections = Object.keys($scope.sections).reduce(function(r, s){r[s] = s == section;return r}, {});
      $scope.currentNavItem = Object.keys($scope.sections).indexOf(section);
    }
    
    function cancelAction(){
      $stateParams.actions.doNotOk();
      $state.go('catalog.products');
    }

    function goProfile(){
      $state.go('catalog.profile', {
        index: 1
      });
    }
    
    ////////////////// Private ///////////////////
    
    function init(){
      $scope.sections.orderSumary = true;

      if($stateParams.order && $stateParams.actions){
        $scope.order = $stateParams.order;
      } else {
        $state.go('catalog.products');
      }



      // develop start

      // function doOk(order){
      //   $scope.order = order;
      // }

      // if($stateParams.order){
      //   doOk($stateParams.order);
      // } else {
      //   contextCatalogObserver.observe(function(){
      //     contextOrdersService.ensureOrders(contextPurchaseService.getCatalogContext(), contextPurchaseService.getAgrupationContextType())
      //     .then(function(){
      //       contextPurchaseService.getSelectedOrder()
      //       .then(doOk);
      //     })
      //   });
      // }

      // develop end
    }
    
    init();
  }

})();