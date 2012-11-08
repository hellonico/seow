/////
/////
///// LOADING
/////
/////
angular.element(document).ready(function() {
    angular.bootstrap(document);
    
});
google.load("visualization", "1", {packages:["corechart"]});
// nothing to do on load
// google.setOnLoadCallback(drawChart);

function EditCtrl($scope, $http, $routeParams) {
    $scope.wid = $routeParams.wid;
    console.log("edit"+$routeParams.wid);
    $http.get('/site/'+$scope.wid).success(function(data) {
        $scope.website = data;
    });
    $http.get('/filters/'+$scope.wid).success(function(data) {
        console.log("fetch filters");
        $scope.filters = data;
    }).error(function(data){console.log(data);});


}

function WelcomeCtrl($scope) {
    $("#navwelcome").toggleClass("active");
}   

function ChartsCtrl($scope, $routeParams) {
    $scope.wid = $routeParams.wid;
    $("#navchart").toggleClass("active");

    $scope.clean = function() {

    }   
}

function drawChart(id) {
    var jsonData = $.ajax({
      url: "/points/"+id,
      dataType:"json",
      async: false}).responseText;
    var data = $.parseJSON(jsonData);
    var array = [["Date", "fresheye","goo","bing","yahoo","google"]];
    for(i in data) {
      var item = data[i];
      var values = item["values"];
      var line = [
       item["date"].substring(0,10), 
       values["fresheye"][0], 
       values["goo"][0], 
       values["bing"][0], 
       values["yahoo"][0], 
       values["google"][0]
      ];
      array.push(line);
}

  var data = google.visualization.arrayToDataTable(array);

  var options = {
      title: 'ランキング'
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function FiltersCtrl($scope, $http) {
    console.log("enter filters");
    $http.get('/filters/'+$scope.wid).success(function(data) {
        console.log("fetch filters");
        $scope.filters = data;
    }).error(function(data){console.log(data);});

    $scope.click = function(id) {
        console.log(id);
        drawChart(id);
    }

}

function WebsiteCtrl($scope, $http) {
    $http.get('/sites/nico').success(function(data) {
        console.log("hello");
        $scope.sites = data;
    }).error(function(data) {alert("failed")});
}
/*
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

*/