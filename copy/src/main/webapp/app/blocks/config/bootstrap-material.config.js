(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(bootstrapMaterialDesignConfig);

    compileServiceConfig.$inject = [];

    function bootstrapMaterialDesignConfig() {
        $.material.init();

    }
})();
