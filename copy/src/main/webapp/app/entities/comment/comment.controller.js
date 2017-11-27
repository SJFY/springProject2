(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CommentController', CommentController);

    CommentController.$inject = ['DataUtils', 'Comment', 'CommentSearch'];

    function CommentController(DataUtils, Comment, CommentSearch) {

        var vm = this;

        vm.comments = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Comment.getcomment().query(function(result) {
                vm.comments = result;
                vm.searchQuery = null;
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            CommentSearch.query({query: vm.searchQuery}, function(result) {
                vm.comments = result;
                vm.currentSearch = vm.searchQuery;
            });
        }

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
