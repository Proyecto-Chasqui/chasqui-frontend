(function() {
	'use strict';

	angular.module('chasqui').controller('ConfirmOrderCtrl', ConfirmOrderCtrl);

	/** @ngInject */
	function ConfirmOrderCtrl($scope, contextPurchaseService, $log, vendedorService, perfilService,
                              actions, order, $mdDialog, $state) {
        
        $scope.catalog = null;
        $scope.currentNavItem = 0;
        $scope.sections = {
            selectAddress: false,
            questions: false,
            orderSumary: false
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
            $scope.sections["selectAddress"] = true;
            $scope.order = order;
        }
        
        ////////////////// Public ///////////////////
        
        function show(section){
            $scope.sections = Object.keys($scope.sections).reduce(function(r, s){r[s] = s == section;return r}, {});
            $scope.currentNavItem = Object.keys($scope.sections).indexOf(section);
        }
        
        function cancelAction(){
            actions.doNotOk();
            $mdDialog.hide();
        }
        
        function back(){
            show(Object.keys($scope.sections)[$scope.currentNavItem - 1]);
        }
        
        function next(){
            [
                function(){
                    $scope.$broadcast('check-direccion');
                },
                function(){
                    $scope.$broadcast('check-answers');
                },
                function(){
                    actions.doOk($scope.selectedAddress, $scope.answers);
                }
            ][$scope.currentNavItem]();
        }
        
		function goProfile(){
			$mdDialog.hide();
			$state.go('catalog.profile');
        };
        
        ////////////////// okActions /////////////////
        
        function selectDeliveryAddressOkAction(address){
            $scope.selectedAddress = address;
            console.log(address);
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