(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .factory('CopyuserSearch', CopyuserSearch);

    CopyuserSearch.$inject = ['$resource'];

    function CopyuserSearch($resource) {
        var resourceUrl =  'api/_search/copyusers/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
