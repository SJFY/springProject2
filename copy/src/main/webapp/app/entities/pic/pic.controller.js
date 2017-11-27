(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('PicController', PicController);

    PicController.$inject = ['DataUtils', 'Pic', 'PicSearch'];

    function PicController(DataUtils, Pic, PicSearch) {

        var vm = this;

        vm.pics = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Pic.getpic().query(function(result) {
                vm.pics = result;
                vm.searchQuery = null;
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            PicSearch.query({query: vm.searchQuery}, function(result) {
                vm.pics = result;
                vm.currentSearch = vm.searchQuery;
            });
        }

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
