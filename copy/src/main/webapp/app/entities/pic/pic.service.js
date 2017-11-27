(function() {
    'use strict';
    angular
        .module('hopefullyApp')
        .factory('Pic', Pic);

    Pic.$inject = ['$resource'];

    function Pic ($resource) {
        var resourceUrl =  'api/pics/:id';

        var picFac = {};
        picFac.getpic = function(){
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

        picFac.coursepic = function () {
            return $resource('api/coursepics/:id', {}, {
                'query': { method: 'GET', isArray: true}
            });
        }

        return picFac;
    }
})();
