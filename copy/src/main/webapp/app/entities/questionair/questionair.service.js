(function() {
    'use strict';
    angular
        .module('hopefullyApp')
        .factory('Questionair', Questionair);

    Questionair.$inject = ['$resource'];

    function Questionair ($resource) {
        var resourceUrl =  'api/questionairs/:id';

        var queFac = {};
        queFac.getque = function () {
            return $resource(resourceUrl, {}, {
                'query': { method: 'GET', isArray: true},
                'get': {
                    method: 'GET',
                    transformResponse: function (data) {
                        if (data) {
                            data = angular.fromJson(data);
                        }
                        return data;
                    }
                },
                'update': { method:'PUT' }
            });
        };

        queFac.courseque = function () {
            return $resource('api/cuquestionairs/:id', {}, {
                'query': {method: 'GET', isArray: true}
            });
        }

        return queFac;

    }
})();
