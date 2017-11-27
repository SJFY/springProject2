(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CourseDetailReadController', CourseDetailReadController);

    CourseDetailReadController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'Principal', 'DataUtils', 'entity', 'pics', 'comments', 'ques', 'anony', 'Questionair', 'Comment','Pic', 'Course', 'Copyuser', 'User'];

    function CourseDetailReadController($scope, $rootScope, $stateParams, previousState, Principal, DataUtils, entity, pics, comments, ques, anony, Questionair, Comment, Pic, Course, Copyuser, User) {
        var vm = this;

        vm.course = entity;
        vm.picture = pics;
        vm.coms = comments;
        vm.questions = ques;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.avaters = [];

        load();

        Principal.identity().then(function(account) {
            vm.account = account;
            vm.tmp = vm.account;
            vm.isAuthenticated = Principal.isAuthenticated;
            Copyuser.getbyuser().get({id:vm.account.id}, function (result) {
                vm.copyuser = result;

            })
        });
        function load() {

            Copyuser.getcopyuser().query(function (result) {
                vm.cu = result;
                vm.idx = new Array(vm.cu[vm.cu.length - 1].user.id+1);

                for (var i = 0; i < vm.cu.length; i ++) {
                    vm.idx[vm.cu[i].user.id] = i;
                }
                for (var i = 0; i < vm.questions.length; i ++) {
                    if (vm.questions[i].user === null) {
                        vm.questions[i].profile = anony;
                    }
                    else {
                        vm.questions[i].profile = vm.cu[vm.idx[vm.questions[i].user.id]];
                    }
                }
            });


        };


        var unsubscribe = $rootScope.$on('hopefullyApp:courseUpdate', function(event, result) {
            vm.course = result;
            vm.picture = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
