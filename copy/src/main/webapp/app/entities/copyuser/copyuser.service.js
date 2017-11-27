(function() {
    'use strict';
    angular
        .module('hopefullyApp')
        .factory('Copyuser', Copyuser);

    Copyuser.$inject = ['$resource'];

    function Copyuser ($resource) {
        var resourceUrl =  'api/copyusers/:id';

        var copyuserFac = {};

        copyuserFac.getcopyuser = function(){
            return $resource(resourceUrl, {}, {
                'query': { method: 'GET', isArray: true},
                // 'get': {
                //     method: 'GET',
                //     transformResponse: function (data) {
                //         if (data) {
                //             data = angular.fromJson(data);
                //         }
                //         return data;
                //     }
                // },
                'update': { method:'PUT' }
            });
        };

        copyuserFac.getbyuser = function() {
            return $resource( 'api/copyuserByuser/:id', {}, {
                'query': {method: 'GET', isArray: true}
            });
        };

        return copyuserFac;

    }
})();
