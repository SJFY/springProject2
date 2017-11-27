(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .factory('PicSearch', PicSearch);

    PicSearch.$inject = ['$resource'];

    function PicSearch($resource) {
        var resourceUrl =  'api/_search/pics/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
