(function() {
  'use strict';

  angular.module('chasqui').service('dialogCommons', dialogCommons);

  function dialogCommons($mdDialog) {

    var vm = this;
    
    
    /** Dialogo con un input text y confirmacion */
    vm.prompt = function(titulo, texto, placeholder, textOk, textCancel, doOk, doNoOk) {

      var confirm = $mdDialog.prompt()
                      .title(titulo)
                      .textContent(texto)
                      .placeholder(placeholder)
                      .ok(textOk)
                      .cancel(textCancel);

      $mdDialog.show(confirm).then(doOk, doNoOk);
    }
    
    
    /** Dialogo confirmacion */
    vm.confirm = function(titulo, texto, textOk, textCancel, doOk, doNoOk) {
      var confirm = $mdDialog.confirm()
                      .title(titulo)
                      .textContent(texto)
                      .ok(textOk)
                      .cancel(textCancel);

      $mdDialog.show(confirm).then(doOk, doNoOk);
    }
        
    
    vm.newGroup = function(callback){
      var newGroup = {
        parent: angular.element(document.body),
        templateUrl: "app/comercio/administracion/new-group/new-group.tmpl.html",
        controller: "NewGroupCtrl",
        clickOutsideToClose: true,
        locals: {
          isEdit: false,
          group: {}, 
          callback: callback
        }
      };

      $mdDialog.show(newGroup);
    }
        
    
    vm.editGroup = function(group, callback){
      var editGroup = {
        parent: angular.element(document.body),
        templateUrl: "app/comercio/administracion/new-group/new-group.tmpl.html",
        controller: "NewGroupCtrl",
        clickOutsideToClose: true,
        locals: {
          isEdit: true,
          group: {
            idGrupo: group.idGrupo,
            alias: group.alias,
            descripcion: group.descripcion
          }, 
          callback: callback
        }
      };

      $mdDialog.show(editGroup);
    }
    
        
    /* Dialogo para la modificación de la cantidad de productos de una variedad en el changuito */
    vm.modifyVarietyCount = function(variety, order, texts, initCount, actions){
      var modify = {
        parent: angular.element(document.body),
        templateUrl: "app/components/commons/modifyCount.tmpl.html",
        controller: "ModifyCountCtrl",
        clickOutsideToClose: false,
        locals: {
          variety: variety, 
          order: order,
          texts: texts,
          initCount: initCount,
          actions: actions
        }
      };

      $mdDialog.show(modify);
    }
        
    vm.selectDeliveryAddress = function(actions, order){
      var selectDeliveryAddress = {
        parent: angular.element(document.body),
        templateUrl: "app/comercio/carrito/confirm-order/confirm-order.tmpl.html",
        controller: "ConfirmOrderCtrl",
        clickOutsideToClose: false,
        locals: {
          actions: actions, 
          order: order
        }
      }

      $mdDialog.show(selectDeliveryAddress);
    }
        
    vm.selectPurchaseContext = function(variety){
      var selectPurchaseContext = {
        parent: angular.element(document.body),
        templateUrl: "app/components/commons/selectPurchaseContext.tmpl.html",
        controller: "SelectPurchaseContextCtrl",
        clickOutsideToClose: false,
        locals: {
          variety: variety
        },
        openFrom: "#selectorPurchaseContext", 
        closeTo: "#selectorPurchaseContext"
      }

      $mdDialog.show(selectPurchaseContext);
    }
            
  } 
})(); 
