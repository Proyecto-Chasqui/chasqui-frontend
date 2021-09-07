(function() {
	'use strict';

	angular.module('chasqui').controller('AnswerSellerQuestionsController', AnswerSellerQuestionsController);

	/** @ngInject */
	function AnswerSellerQuestionsController($scope, $stateParams, sellerService) {
    
    var vm = $scope;
    vm.questions = [];
    vm.validateAndNext = validateAndNext;
    
    /////////////////////////////////////
      
    function init(){
      var catalogShortName = $stateParams.catalogShortName;
        
      function doOk(response){
          vm.questions = response.data;
          if(vm.questions.length == 0){
            vm.next(vm.questions);
          } else {
             var prevAnsewers = vm.getQuestions()
            if(prevAnsewers.length > 0){
              vm.questions = vm.questions.map(function(q){
                return prevAnsewers.filter(function(a){
                  return a.nombre === q.nombre;
                })[0];
              })
            }
          }
      }

      var fetchQuestionsMapper = {
          PERSONAL: sellerService.getSellerIndividualQuestions,
          GROUP: sellerService.getSellerColectiveQuestions,
          NODE: sellerService.getSellerColectiveQuestions
      }

      fetchQuestionsMapper[vm.order.type](catalogShortName).then(doOk);
  }


  init();
  
  /////////////////////////////////////
          
  function validateAndNext(){
    vm.validated = true;
    if(validInformation()){
      vm.next(vm.questions);
    }
  }

  function validInformation(){
      return vm.questions.reduce(function(r,q){return r && (q.answer != null || q.answer != undefined)}, true);
  }
	}

})();