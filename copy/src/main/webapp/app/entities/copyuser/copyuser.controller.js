(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .controller('CopyuserController', CopyuserController);

    CopyuserController.$inject = ['DataUtils', 'Copyuser', 'CopyuserSearch', 'Principal', 'Course', 'Comment', 'anony', 'Pic'];

    function CopyuserController(DataUtils, Copyuser, CopyuserSearch, Principal, Course, Comment, anony, Pic) {

        var vm = this;

        vm.courses = [];
        vm.copyusers = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.clear = clear;
        vm.search = search;
        vm.loadAll = loadAll;
        vm.anonys = anony;
        loadAll();

        Principal.identity().then(function(account) {
            vm.account = account;
            vm.isAuthenticated = Principal.isAuthenticated;
            Copyuser.getbyuser().get({id:vm.account.id}, function (result) {
                vm.copyuser = result;
                vm.copyuser.courses[0].picture = [];
               // vm.tmp = vm.copyuser.id;
                Comment.getbycu().query({id: vm.copyuser.id}, function (result) {
                    vm.cucomment = result;
                    vm.searchQuery = null;
                    Course.getcourse().query(function(result) {
                        vm.courses = result;
                        vm.searchQuery = null;

                        vm.idx = new Array(vm.courses[vm.courses.length - 1].id+1);
                        vm.idxc = new Array(vm.copyuser.courses[vm.copyuser.courses.length - 1].id+1);
                        for (var i = 0; i < vm.courses.length; i ++) {
                            vm.idx[vm.courses[i].id] = i+1;
                            vm.courses[i].picture = [];
                        }


                        for (var i = 0; i < vm.copyuser.courses.length; i ++) {
                            vm.idxc[vm.copyuser.courses[i].id] = i+1;
                            vm.copyuser.courses[i].picture = [];
                        }
                        vm.tmp = vm.idxc[1] > 0;


                        Pic.getpic().query(function (result) {
                            vm.pics = result;
                            //vm.tmp = vm.pics.length;


                            //vm.tmp = vm.pics[2].coursepic.id;
                            //vm.tmp = vm.idxc[vm.pics[5].coursepic.id];

                            for(var i = 0; i < vm.pics.length; i ++) {
                                // if (vm.idx[vm.pics[i].coursepic.id] > 0) {
                                //     vm.courses[vm.idx[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                // }
                                // else {
                                //    continue;
                                // }
                                // if (vm.idxc[vm.pics[i].coursepic.id] > 0) {
                                //     vm.copyuser.courses[vm.idxc[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                // }
                                // else{
                                //     continue;
                                // }

                                if (vm.idx[vm.pics[i].coursepic.id] > 0) {
                                    vm.courses[vm.idx[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                    if (vm.idxc[vm.pics[i].coursepic.id] > 0) {
                                        vm.copyuser.courses[vm.idxc[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                    }
                                    else{
                                        continue;
                                    }
                                }
                                else {
                                    if (vm.idxc[vm.pics[i].coursepic.id] > 0) {
                                        vm.copyuser.courses[vm.idxc[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                    }
                                    else{
                                        continue;
                                    }
                                }



                                // if (vm.idxc[vm.pics[i].coursepic.id] > 0 ) {
                                //     vm.copyuser.courses[vm.idxc[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                // }
                                // else {
                                //     continue;
                                //   //  vm.copyuser.courses[vm.idxc[vm.pics[i].coursepic.id] - 1].picture.push(vm.pics[i]);
                                // }
                            }
                            // vm.tmp = vm.courses[1].picture.length;
                            // vm.len = vm.courses[0].name;
                        });

                    });
                })
            })
        });

        function loadAll() {
            // Course.getcourse().query(function(result) {
            //     vm.courses = result;
            //     vm.searchQuery = null;
            //
            // });



            // Copyuser.getcopyuser().query(function(result) {
            //     vm.copyusers = result;
            //     vm.searchQuery = null;
            //     vm.len = vm.account.login;
            //     for (var i = 0; i < vm.copyusers.length; i++) {
            //         if (vm.copyusers[i].user.login === vm.len) {
            //             vm.copyuser = vm.copyusers[i];
            //         }
            //     }
            //     if (vm.copyuser === null) {
            //         vm.added = false;
            //     }
            //     else {
            //         vm.added = true;
            //     }
            // });
            vm.tmp = vm.account;


        }

        function search() {
            if (!vm.searchQuery) {
                return vm.loadAll();
            }
            CopyuserSearch.query({query: vm.searchQuery}, function(result) {
                vm.copyusers = result;
                vm.currentSearch = vm.searchQuery;
            });
        }

        function clear() {
            vm.searchQuery = null;
            loadAll();
        }    }
})();
