(function() {
    'use strict';

    angular
        .module('hopefullyApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
            .state('allcourses',{
                parent: 'entity',
                url: '/allcourses',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/course/allcourses.html',
                        controller: 'AllCoursesController',
                        controllerAs: 'vm'
                    }
                }
            })
        .state('course', {
            parent: 'entity',
            url: '/course',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Courses'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/course/courses.html',
                    controller: 'CourseController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('course-detail', {
            parent: 'course',
            url: '/course/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Course'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/course/course-detail.html',
                    controller: 'CourseDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Course', function($stateParams, Course) {
                    return Course.getcourse().get({id : $stateParams.id}).$promise;
                }],
                pics: ['$stateParams', 'Pic', function($stateParams, Pic) {
                    return Pic.coursepic().query({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'course',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
            .state('course-detail-readOnly', {
                parent: 'allcourses',
                url: '/viewcourse/{id}',
                data: {
                    authorities: []
                },
                views: {
                    'content@': {
                        templateUrl: 'app/entities/course/course-detail-readonly.html',
                        controller: 'CourseDetailReadController',
                        controllerAs: 'vm'
                    }
                },
                resolve: {
                    entity: ['$stateParams', 'Course', function($stateParams, Course) {
                        return Course.getcourse().get({id : $stateParams.id}).$promise;
                    }],
                    pics: ['$stateParams', 'Pic', function($stateParams, Pic) {
                        return Pic.coursepic().query({id : $stateParams.id}).$promise;
                    }],
                    comments: ['$stateParams', 'Comment', function($stateParams, Comment) {
                        return Comment.getbycourse().query({id : $stateParams.id}).$promise;
                    }],
                    ques: ['$stateParams', 'Questionair', function($stateParams, Questionair) {
                        return Questionair.courseque().query({id : $stateParams.id}).$promise;
                    }],
                    anony: ['$stateParams', 'Copyuser', function($stateParams, Copyuser) {
                        return Copyuser.getcopyuser().get({id : 15}).$promise;
                    }],
                    previousState: ["$state", function ($state) {
                        var currentStateData = {
                            name: $state.current.name || 'course',
                            params: $state.params,
                            url: $state.href($state.current.name, $state.params)
                        };
                        return currentStateData;
                    }]
                }
            })
            .state('course-detail-askque', {
                parent:'course-detail-readOnly',
                url: '/askque',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/course/askque.html',
                        controller: 'CourseAskQueController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.id}).$promise;
                            }],
                            que: ['Questionair', function(Questionair) {
                                return null;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('^', {}, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })
            .state('course-detail-replyque', {
                parent:'course-detail-readOnly',
                url: '/replyque/{qid}',
                data: {
                    authorities: []
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/course/askque.html',
                        controller: 'CourseAskQueController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.id}).$promise;
                            }],
                            que: ['Questionair', function(Questionair) {
                                return Questionair.getque().get({id : $stateParams.qid}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('^', {}, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })

        .state('course-detail.edit', {
            parent: 'course-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/course/course-dialog.html',
                    controller: 'CourseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Course', function(Course) {
                            return Course.getcourse().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
            .state('course-detail.addpic', {
                parent: 'course-detail',
                url: '/detail/addpic',
                data: {
                    authorities: ['ROLE_USER']
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'app/entities/course/addpic.html',
                        controller: 'CourseAddPicController',
                        controllerAs: 'vm',
                        backdrop: 'static',
                        size: 'lg',
                        resolve: {
                            entity: ['Course', function(Course) {
                                return Course.getcourse().get({id : $stateParams.id}).$promise;
                            }]
                        }
                    }).result.then(function() {
                        $state.go('^', {}, { reload: true });
                    }, function() {
                        $state.go('^');
                    });
                }]
            })

        .state('course.new', {
            parent: 'course',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/course/course-dialog.html',
                    controller: 'CourseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                price: null,
                                description: null,
                                rating: null,
                                district: null,
                                category: null,
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
        .state('course.edit', {
            parent: 'course',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/course/course-dialog.html',
                    controller: 'CourseDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Course', function(Course) {
                            return Course.getcourse().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('course', null, { reload: 'course' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('course.delete', {
            parent: 'course',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/course/course-delete-dialog.html',
                    controller: 'CourseDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Course', function(Course) {
                            return Course.getcourse().get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('course', null, { reload: 'course' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
