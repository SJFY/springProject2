(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('QuestionairController', QuestionairController);

    QuestionairController.$inject = ['DataUtils', 'Questionair', 'QuestionairSearch'];

    function QuestionairController(DataUtils, Questionair, QuestionairSearch) {

        var vm = this;

        vm.questionairs = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Questionair.getque().query(function(result) {
                vm.questionairs = result;
                vm.searchQuery = null;
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            QuestionairSearch.query({query: vm.searchQuery}, function(result) {
                vm.questionairs = result;
                vm.currentSearch = vm.searchQuery;
            });
        }

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
