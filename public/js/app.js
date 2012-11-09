/////
///// LOADING
/////
angular.element(document).ready(function() {
    angular.bootstrap(document);
});

try {
   google.load("visualization", "1", {packages:["corechart"]});
} catch(e) {
  console.log("Can not load google");
}

// nothing to do on load
// google.setOnLoadCallback(drawChart);

/////
///// Application
/////
function NavCtrl($scope, $location) {
  $scope.navClass = function(page) {
        var currentRoute = $location.path().substring(1) || 'welcome';
        return currentRoute.indexOf(page) > -1 ? 'active' : '';
  }
}

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

    $scope.edit = function(id) {
      console.log("edit:"+id);
    }
    $scope.delete = function(id) {
      console.log("delete:"+id);
    }
    $scope.add = function() {
      console.log("Add filter");
        // $scope.filters.push();
    }
}

function WelcomeCtrl($scope, $http) {
    //$("#navwelcome").toggleClass("active");

    $scope.refresh = function(id) {
        console.log("refreshing:"+id);
        $("#refresh-image").attr("src", "/icons/loading.gif");
        $("#refresh-image").attr("title", "loading");
        $http.get('/site/update/'+id).success(function(data) {
            $("#refresh-image").attr("src", "/icons/refresh.png");
        }).error(function(data) {
            $("#refresh-image").attr("src", "/icons/warning.png");
            $("#refresh-image").attr("title", "error");
        });
    }
}   

function ChartsCtrl($scope, $routeParams) {
    $scope.wid = $routeParams.wid;

    //$("#navchart").toggleClass("active");

    if($routeParams.fid!=null) {
        drawChart($routeParams.fid);
    }

    $scope.clean = function() {

    }   
}

function drawChart(id) {
    $("#filterslist tr").removeClass("success");
    

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

      $("#f"+id).addClass("success");
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
        drawChart(id);
    }

}

function WebsiteCtrl($scope, $http) {
    $http.get('/sites/nico').success(function(data) {
        $scope.sites = data;
    }).error(function(data) {alert("failed")});
}