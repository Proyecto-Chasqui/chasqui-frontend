(function() {
	'use strict';

	angular.module('chasqui').controller('AnswerSellerQuestionsController', AnswerSellerQuestionsController);

	/** @ngInject */
	function AnswerSellerQuestionsController($scope, $stateParams, sellerService) {
        
        $scope.questions = [];
        
        /////////////////////////////////////
        
        function init(){
            
            function doOk(response){
                $scope.questions = response.data;
            }
            
            var getQuestions = {
                PERSONAL: function(){
                    sellerService.getSellerIndividualQuestions($stateParams.catalogShortName).then(doOk);                    
                },
                GROUP: function(){
                    sellerService.getSellerColectiveQuestions($stateParams.catalogShortName).then(doOk);
                }
            }[$scope.order.type]();
        }
        
        init();
        
        /////////////////////////////////////
               
        function validInformation(){
            return $scope.questions.reduce(function(r,q){return r && (q.answer != null || q.answer != undefined)}, true);
        }
        
        function riseErrors(){
            $scope.validated = true;
            $scope.questions = $scope.questions.map(function(q){q.answered = q.answer != null || q.answer != undefined; return q});
            console.log($scope.questions);
        }
        
        $scope.$on("check-answers", function(){
            if(validInformation()){
                console.log($scope.questions);
                $scope.validated = false;
                $scope.okAction($scope.questions);              
            }else{
                riseErrors();
            }
        })
        
	}

})();