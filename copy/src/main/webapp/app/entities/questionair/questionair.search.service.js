(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .factory('QuestionairSearch', QuestionairSearch);

    QuestionairSearch.$inject = ['$resource'];

    function QuestionairSearch($resource) {
        var resourceUrl =  'api/_search/questionairs/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
