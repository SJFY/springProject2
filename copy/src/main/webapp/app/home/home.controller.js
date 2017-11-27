(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', 'Principal', 'LoginService', '$state', 'Course', 'Pic'];

    function HomeController ($scope, Principal, LoginService, $state, Course, Pic) {
        var vm = this;

        vm.account = null;
        vm.isAuthenticated = null;
        vm.login = LoginService.open;
        vm.register = register;
        vm.login = login;
        $scope.$on('authenticationSuccess', function() {
            getAccount();
        });

        getAccount();
        loadAll();

        function getAccount() {
            Principal.identity().then(function(account) {
                vm.account = account;
                vm.isAuthenticated = Principal.isAuthenticated;
            });
        }
        function register () {
            $state.go('register');
        }
        function loadAll() {
            Course.getall().query(function(result) {
                vm.courses = result;
                vm.searchQuery = null;
                vm.len = vm.courses.length;

                vm.idx = new Array(vm.courses[vm.courses.length - 1].id+1);
                for (var i = 0; i < vm.courses.length; i ++) {
                    vm.idx[vm.courses[i].id] = i;
                    vm.courses[i].picture = [];
                    vm.courses[i].comment = [];

                }

                Pic.getpic().query(function (result) {
                    vm.pics = result;
                    for(var i = 0; i < vm.pics.length; i ++) {
                        vm.courses[vm.idx[vm.pics[i].coursepic.id]].picture.push(vm.pics[i]);
                    }
                    vm.tmp1 = vm.courses[0];
                    vm.tmp2 = vm.courses[1];
                    vm.tmp3 = vm.courses[2];
                    vm.tmp4 = vm.courses[3];
                    vm.tmp5 = vm.courses[4];
                    vm.tmp6 = vm.courses[5];
                    vm.tmp7 = vm.courses[6];
                    vm.tmp8 = vm.courses[7];
                    vm.tmp9 = vm.courses[8];

                    // vm.len = vm.courses[0].name;
                });
              //  vm.tmp = vm.courses[0].picture.length;

                // Comment.getcomment().query(function (result) {
                //     vm.comments = result;
                //     for (var i = 0; i < vm.comments.length; i ++) {
                //         vm.courses[vm.idx[vm.comments[i].targetcourse.id]].comment.push(vm.comments[i]);
                //     }
                //     //vm.courses[2].comment is an array
                //     vm.tmp = vm.courses[2].comment[0].review;
                // })



            });

        }

        function login() {
            LoginService.open();
        }
    }
})();
