angular.module('seo', []).
config(['$routeProvider', function($routeProvider) {
	$routeProvider.
	when('/edit/:wid', {templateUrl: 'partials/edit.html', controller: EditCtrl}).
	when('/filters/:fid', {templateUrl: 'partials/filters.html', controller: ChartsCtrl}).
	when('/charts/:wid', {templateUrl: 'partials/charts.html', controller: ChartsCtrl}).
	when('/charts/:wid/:fid', {templateUrl: 'partials/charts.html', controller: ChartsCtrl}).
	when('/welcome', {templateUrl: 'partials/welcome.html', controller: WelcomeCtrl}).
	otherwise({redirectTo: '/welcome'});
}]);