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
            templateUrl: 'app/comercio/carrito/answer-seller-questions/answer-seller-questions.tmpl.html'
          };
    }
    
})();         