(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseController', CourseController);

    CourseController.$inject = ['DataUtils', 'Course', 'CourseSearch'];

    function CourseController(DataUtils, Course, CourseSearch) {

        var vm = this;

        vm.courses = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;

        loadAll();

        function loadAll() {
            Course.getcourse().query(function(result) {
                vm.courses = result;
                vm.searchQuery = null;
            });
        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            CourseSearch.query({query: vm.searchQuery}, function(result) {
                vm.courses = result;
                vm.currentSearch = vm.searchQuery;
            });
        }

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
