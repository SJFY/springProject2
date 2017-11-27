(function() {
    'use strict';
    angular
        .module('hopefullyApp')
        .factory('Comment', Comment);

    Comment.$inject = ['$resource'];

    function Comment ($resource) {
        var resourceUrl =  'api/comments/:id';

        var commentFac = {};

        commentFac.getcomment = function(){
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

        commentFac.getbycourse = function() {
            return $resource( 'api/coursecomments/:id', {}, {
                'query': {method: 'GET', isArray: true}
            });
        };

        commentFac.getbycu = function () {
            return $resource('api/cucomments/:id', {}, {
                'query' : {method: 'GET', isArray: true}
            });
        }

        return commentFac;
    }
})();
