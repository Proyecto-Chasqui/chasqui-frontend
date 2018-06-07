(function() {
	'use strict';
    
    angular.module('chasqui').directive('answerSellerQuestions', answerSellerQuestions);
    
	function answerSellerQuestions() {
    
        return {
            restrict: 'E',
            scope: {
                okAction: '='
            },
            controller: 'AnswerSellerQuestionsController',
            templateUrl: 'app/comercio/carrito/confirm-order/answer-seller-questions/answer-seller-questions.tmpl.html'
          };
    }
    
})();         