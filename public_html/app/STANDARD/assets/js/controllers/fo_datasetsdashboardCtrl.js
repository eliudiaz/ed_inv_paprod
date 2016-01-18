/**
 * Created by Juliu on 12/01/2016.
 */
/**
 * controllers used for the dashboard
 */
app.controller('SparklineCtrl', ["$scope", function ($scope) {
    $scope.sales = [600, 923, 482, 1211, 490, 1125, 1487];
    $scope.earnings = [400, 650, 886, 443, 502, 412, 353];
    $scope.referrals = [4879, 6567, 5022, 5890, 9234, 7128, 4811];
}]);

app.controller('ngTabledatasetsCtrl', ["eReq","$scope", "$filter", "ngTableParams", function (eReq,$scope, $filter, ngTableParams) {
    var reqConfig=eReq.getInstance("http://181.209.238.78:5002/v1/opendata");
    var series=reqConfig.get("/series");
    

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 5 // count per page
    }, {
        total: series.length, // length of data
        getData: function ($defer, params) {
            var orderedData = params.sorting() ? $filter('orderBy')(series, params.orderBy()) : series;
            $defer.resolve(series.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    });

    $scope.editId = -1;

    $scope.setEditId = function (pid) {
        $scope.editId = pid;
    };
}]);
