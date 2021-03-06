(function() {
	'use strict';

	angular.module('chasqui').controller('AnswerSellerQuestionsController', AnswerSellerQuestionsController);

	/** @ngInject */
	function AnswerSellerQuestionsController($scope, $stateParams, sellerService) {
      
    $scope.questions = [];
    $scope.validateAndNext = validateAndNext;
    
    /////////////////////////////////////
      
    function init(){
        
      function doOk(response){
          $scope.questions = response.data;
          if($scope.questions.length == 0){
            $scope.next($scope.questions);
          } else {
             var prevAnsewers = $scope.getQuestions()
            if(prevAnsewers.length > 0){
              $scope.questions = $scope.questions.map(function(q){
                var res = prevAnsewers.filter(function(a){
                  return a.nombre === q.nombre;
                })[0];
                return res;
              })
            }
          }
      }
      
      var getQuestions = {
          PERSONAL: function(){
              sellerService.getSellerIndividualQuestions($stateParams.catalogShortName).then(doOk);                    
          },
          GROUP: function(){
              sellerService.getSellerColectiveQuestions($stateParams.catalogShortName).then(doOk);
          },
          NODE: function(){
              sellerService.getSellerColectiveQuestions($stateParams.catalogShortName).then(doOk);
          }
      }[$scope.order.type]();
  }


  init();
  
  /////////////////////////////////////
          
  function validateAndNext(){
    $scope.validated = true;
    if(validInformation()){
      $scope.next($scope.questions);
    }
  }

  function validInformation(){
      return $scope.questions.reduce(function(r,q){return r && (q.answer != null || q.answer != undefined)}, true);
  }
	}

})();