'use strict';

/**
 * Config for the router
 */
app.config(['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$ocLazyLoadProvider', 'JS_REQUIRES',
function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide, $ocLazyLoadProvider, jsRequires) {

    app.controller = $controllerProvider.register;
    app.directive = $compileProvider.directive;
    app.filter = $filterProvider.register;
    app.factory = $provide.factory;
    app.service = $provide.service;
    app.constant = $provide.constant;
    app.value = $provide.value;

    // LAZY MODULES

    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: jsRequires.modules
    });

    // APPLICATION ROUTES
    // -----------------------------------
    // For any unmatched url, redirect to /app/dashboard
    // BACKUP DASHBOARD ROUTE
    //    .state('app.dashboard', {
//        url: "/dashboard",
//        templateUrl: "assets/views/frontoffice_dashboard.html",
//        resolve: loadSequence('jquery-sparkline','ngTable', 'fo_datasetsdashboardCtrl'),
//        title: 'Dashboard',
//        ncyBreadcrumb: {
//            label: 'Dashboard'
//        }
//    })
    $urlRouterProvider.otherwise("/app/dashboard");
    //
    // Set up the states
    $stateProvider.state('app', {
        url: "/app",
        templateUrl: "assets/views/app.html",
        resolve: loadSequence('modernizr', 'moment', 'angularMoment', 'uiSwitch', 'perfect-scrollbar-plugin', 'toaster', 'ngAside', 'vAccordion', 'sweet-alert', 'chartjs', 'tc.chartjs', 'oitozero.ngSweetAlert', 'chatCtrl'),
        abstract: true
    })
    .state('app.dashboard', {
        url: "/dashboard",
        templateUrl: "assets/views/frontoffice_dashboard.html",
        resolve: loadSequence('edOps','jquery-sparkline','ngTable', 'fo_datasetsdashboardCtrl'),
        title: 'Dashboard',
        ncyBreadcrumb: {
            label: 'Series de Datos'
        }
    }).state('app.backoffice.form01',{
        url: "/dataviewer/:serie",
        templateUrl: "assets/views/frontoffice_viewdataset.html",
        title: 'Vista de Dataset',
        icon: 'ti-layout-media-left-alt',
        ncyBreadcrumb: {
            label: 'Vista de datos'
        },
        resolve: loadSequence('ngTable','fo_viewdatasetCtrl')
    }).state('app.backoffice.dataloader',{
        url: "/form03",
        templateUrl: "assets/views/backoffice_wizard_datos.html",
        title: 'Importar Datos',
        icon: 'ti-layout-media-left-alt',
        ncyBreadcrumb: {
            label: 'Cargar Datos'
        },
        resolve: loadSequence('angularFileUpload','ngTable','bo_importdataCtrl','uploadCtrl')
    }).state('app.backoffice',{
        url: "/backoffice",
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'BackOffice',
        ncyBreadcrumb: {
            label: 'BackOffice'
        }
    }).state('app.backoffice.form02',{
            url: "/form02",
            templateUrl: "assets/views/backoffice_createdataset.html",
            title: 'Set de datos',
            icon: 'ti-layout-media-left-alt',
            ncyBreadcrumb: {
                label: 'Cargar Datos'
            },
        resolve: loadSequence('bo_datasetCtrl')
    }).state('app.ui', {
        url: '/ui',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'UI Elements',
        ncyBreadcrumb: {
            label: 'UI Elements'
        }
    }).state('app.ui.modals', {
        url: '/modals',
        templateUrl: "assets/views/ui_modals.html",
        title: 'Modals',
        ncyBreadcrumb: {
            label: 'Modals'
        },
        resolve: loadSequence('asideCtrl')
    }).state('app.pages.timeline', {
        url: '/timeline',
        templateUrl: "assets/views/pages_timeline.html",
        title: 'Timeline',
        ncyBreadcrumb: {
            label: 'Timeline'
        },
        resolve: loadSequence('ngMap')
    }).state('app.pages.calendar', {
        url: '/calendar',
        templateUrl: "assets/views/pages_calendar.html",
        title: 'Calendar',
        ncyBreadcrumb: {
            label: 'Calendar'
        },
        resolve: loadSequence('moment', 'mwl.calendar', 'calendarCtrl')
    }).state('app.pages.messages', {
        url: '/messages',
        templateUrl: "assets/views/pages_messages.html",
        resolve: loadSequence('truncate', 'htmlToPlaintext', 'inboxCtrl')
    }).state('app.pages.messages.inbox', {
        url: '/inbox/:inboxID',
        templateUrl: "assets/views/pages_inbox.html",
        controller: 'ViewMessageCrtl'
    }).state('app.pages.blank', {
        url: '/blank',
        templateUrl: "assets/views/pages_blank_page.html",
        ncyBreadcrumb: {
            label: 'Starter Page'
        }
    }).state('app.utilities', {
        url: '/utilities',
        template: '<div ui-view class="fade-in-up"></div>',
        title: 'Utilities',
        ncyBreadcrumb: {
            label: 'Utilities'
        }
    }).state('app.utilities.search', {
        url: '/search',
        templateUrl: "assets/views/utility_search_result.html",
        title: 'Search Results',
        ncyBreadcrumb: {
            label: 'Search Results'
        }
    }).state('app.utilities.pricing', {
        url: '/pricing',
        templateUrl: "assets/views/utility_pricing_table.html",
        title: 'Pricing Table',
        ncyBreadcrumb: {
            label: 'Pricing Table'
        }
    }).state('app.maps', {
        url: "/maps",
        templateUrl: "assets/views/maps.html",
        resolve: loadSequence('ngMap', 'mapsCtrl'),
        title: "Maps",
        ncyBreadcrumb: {
            label: 'Maps'
        }
    }).state('app.charts', {
        url: "/charts",
        templateUrl: "assets/views/charts.html",
        resolve: loadSequence('chartjs', 'tc.chartjs', 'chartsCtrl'),
        title: "Charts",
        ncyBreadcrumb: {
            label: 'Charts'
        }
    }).state('app.documentation', {
        url: "/documentation",
        templateUrl: "assets/views/documentation.html",
        title: "Documentation",
        ncyBreadcrumb: {
            label: 'Documentation'
        }
    }).state('error', {
        url: '/error',
        template: '<div ui-view class="fade-in-up"></div>'
    }).state('error.404', {
        url: '/404',
        templateUrl: "assets/views/utility_404.html",
    }).state('error.500', {
        url: '/500',
        templateUrl: "assets/views/utility_500.html",
    })

	// Login routes

	.state('login', {
	    url: '/login',
	    template: '<div ui-view class="fade-in-right-big smooth"></div>',
	    abstract: true
	}).state('login.signin', {
	    url: '/signin',
	    templateUrl: "assets/views/login_login.html"
	}).state('login.forgot', {
	    url: '/forgot',
	    templateUrl: "assets/views/login_forgot.html"
	}).state('login.registration', {
	    url: '/registration',
	    templateUrl: "assets/views/login_registration.html"
	}).state('login.lockscreen', {
	    url: '/lock',
	    templateUrl: "assets/views/login_lock_screen.html"
	});

    // Generates a resolve object previously configured in constant.JS_REQUIRES (config.constant.js)
    function loadSequence() {
        var _args = arguments;
        return {
            deps: ['$ocLazyLoad', '$q',
			function ($ocLL, $q) {
			    var promise = $q.when(1);
			    for (var i = 0, len = _args.length; i < len; i++) {
			        promise = promiseThen(_args[i]);
			    }
			    return promise;

			    function promiseThen(_arg) {
			        if (typeof _arg == 'function')
			            return promise.then(_arg);
			        else
			            return promise.then(function () {
			                var nowLoad = requiredData(_arg);
			                if (!nowLoad)
			                    return $.error('Route resolve: Bad resource name [' + _arg + ']');
			                return $ocLL.load(nowLoad);
			            });
			    }

			    function requiredData(name) {
			        if (jsRequires.modules)
			            for (var m in jsRequires.modules)
			                if (jsRequires.modules[m].name && jsRequires.modules[m].name === name)
			                    return jsRequires.modules[m];
			        return jsRequires.scripts && jsRequires.scripts[name];
			    }
			}]
        };
    }
}]);