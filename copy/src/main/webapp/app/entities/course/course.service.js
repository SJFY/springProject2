(function() {
    'use strict';
    angular
        .module('hopefullyApp')
        .factory('Course', Course);

    Course.$inject = ['$resource'];

    function Course ($resource) {
        var resourceUrl =  'api/courses/:id';

        // return $resource(resourceUrl, {}, {
        //     'query': { method: 'GET', isArray: true},
        //     'get': {
        //         method: 'GET',
        //         transformResponse: function (data) {
        //             if (data) {
        //                 data = angular.fromJson(data);
        //             }
        //             return data;
        //         }
        //     },
        //     'update': { method:'PUT' }
        // });

        var courseFac = {};
        courseFac.getcourse = function(){
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
        courseFac.getall = function() {
            return $resource( 'api/allcourses', {}, {
                'query': {method: 'GET', isArray: true}
            });
        };

        return courseFac;

    }
})();
