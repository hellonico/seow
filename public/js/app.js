angular.element(document).ready(function() {angular.bootstrap(document);});

    function FiltersCtrl($scope, $http) {
        $http.get('/filters/nico').success(function(data) {
            $scope.filters = data;
        })
    }

    function WebsiteCtrl($scope, $http) {
        $http.get('/sites/nico').success(function(data) {
            console.log("hello");
            $scope.sites = data;
        }).error(function(data) {alert("failed")});

    }

    function Controller($scope) {
      $scope.master= {};
      
    $scope.update = function(user) {
       $scope.master= angular.copy(user);
    };
     
    $scope.reset = function() {
       $scope.user = angular.copy($scope.master);
    };
     
    $scope.reset();
    }

    function SpicyCtrl($scope, $http) {
    $scope.clear = function() {
        $scope.score = "";
    }

    $scope.fetchScore = function() {
        $scope.score = [];
        $http.get('/points/508f654b3004faaba40d1bff').success(function(data) {
            $scope.score = data;
        }).error(function(data) {alert("failed")});
    }

    $scope.spice = 'very';

    $scope.chiliSpicy = function() {
        $scope.spice = 'chili';
    }
    $scope.jalapenoSpicy = function() {
        $scope.spice = 'jalapeño';
    } 
    }