(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('copyuser', {
            parent: 'entity',
            url: '/copyuser',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Copyusers'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/copyuser/copyusers.html',
                    controller: 'CopyuserController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                anony: ['Copyuser', function(Copyuser) {
                    return Copyuser.getcopyuser().get({id : 15}).$promise;
                }]
            }
        })
        .state('copyuser-detail', {
            parent: 'copyuser',
            url: '/copyuser/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Copyuser'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/copyuser/copyuser-detail.html',
                    controller: 'CopyuserDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Copyuser', function($stateParams, Copyuser) {
                    return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'copyuser',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('copyuser-detail.edit', {
            parent: 'copyuser-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/copyuser/copyuser-dialog.html',
                    controller: 'CopyuserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Copyuser', function(Copyuser) {
                            return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('copyuser.new', {
            parent: 'copyuser',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/copyuser/copyuser-dialog.html',
                    controller: 'CopyuserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                avater: null,
                                avaterContentType: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('copyuser', null, { reload: 'copyuser' });
                }, function() {
                    $state.go('copyuser');
                });
            }]
        })
        .state('copyuser.edit', {
            parent: 'copyuser',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/copyuser/copyuser-dialog.html',
                    controller: 'CopyuserDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Copyuser', function(Copyuser) {
                            return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('copyuser', null, { reload: 'copyuser' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
            .state('copyuser.addc', {
                parent: 'copyuser',
                url: '/{id}/{cid}/add',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/copyuser/copyuser_addc.html',
                        controller: 'CopyuserAddCController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Copyuser', function(Copyuser) {
                                return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                            }],
                            newc: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.cid}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('copyuser', null, { reload: 'copyuser' });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('copyuser.removec', {
                parent: 'copyuser',
                url: '/{id}/{cid}/remove',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/copyuser/copyuser_removec.html',
                        controller: 'CopyuserRemoveCController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Copyuser', function(Copyuser) {
                                return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                            }],
                            newc: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.cid}).$promise;
                            }]

                        }
                    }).result.then(function() {
                        $state.go('copyuser', null, { reload: 'copyuser' });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
        .state('copyuser.delete', {
            parent: 'copyuser',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/copyuser/copyuser-delete-dialog.html',
                    controller: 'CopyuserDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Copyuser', function(Copyuser) {
                            return Copyuser.getcopyuser().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('copyuser', null, { reload: 'copyuser' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
