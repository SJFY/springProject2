(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('questionair', {
            parent: 'entity',
            url: '/questionair',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Questionairs'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/questionair/questionairs.html',
                    controller: 'QuestionairController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('questionair-detail', {
            parent: 'questionair',
            url: '/questionair/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Questionair'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/questionair/questionair-detail.html',
                    controller: 'QuestionairDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Questionair', function($stateParams, Questionair) {
                    return Questionair.getque().get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'questionair',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('questionair-detail.edit', {
            parent: 'questionair-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/questionair/questionair-dialog.html',
                    controller: 'QuestionairDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Questionair', function(Questionair) {
                            return Questionair.getque().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('questionair.new', {
            parent: 'questionair',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/questionair/questionair-dialog.html',
                    controller: 'QuestionairDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                view: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('questionair', null, { reload: 'questionair' });
                }, function() {
                    $state.go('questionair');
                });
            }]
        })
        .state('questionair.edit', {
            parent: 'questionair',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/questionair/questionair-dialog.html',
                    controller: 'QuestionairDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Questionair', function(Questionair) {
                            return Questionair.getque().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('questionair', null, { reload: 'questionair' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('questionair.delete', {
            parent: 'questionair',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/questionair/questionair-delete-dialog.html',
                    controller: 'QuestionairDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Questionair', function(Questionair) {
                            return Questionair.getque().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('questionair', null, { reload: 'questionair' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
