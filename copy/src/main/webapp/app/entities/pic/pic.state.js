(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('pic', {
            parent: 'entity',
            url: '/pic',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Pics'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/pic/pics.html',
                    controller: 'PicController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('pic-detail', {
            parent: 'pic',
            url: '/pic/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Pic'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/pic/pic-detail.html',
                    controller: 'PicDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Pic', function($stateParams, Pic) {
                    return Pic.getpic().get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'pic',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('pic-detail.edit', {
            parent: 'pic-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/pic/pic-dialog.html',
                    controller: 'PicDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Pic', function(Pic) {
                            return Pic.getpic().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('pic.new', {
            parent: 'pic',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/pic/pic-dialog.html',
                    controller: 'PicDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                image: null,
                                imageContentType: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('pic', null, { reload: 'pic' });
                }, function() {
                    $state.go('pic');
                });
            }]
        })
        .state('pic.edit', {
            parent: 'pic',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/pic/pic-dialog.html',
                    controller: 'PicDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Pic', function(Pic) {
                            return Pic.getpic().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('pic', null, { reload: 'pic' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('pic.delete', {
            parent: 'pic',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/pic/pic-delete-dialog.html',
                    controller: 'PicDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Pic', function(Pic) {
                            return Pic.getpic().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('pic', null, { reload: 'pic' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
