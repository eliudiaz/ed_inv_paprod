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

app.controller('ngTabledatasetsCtrl', ["eReq", "$scope", "$filter", "ngTableParams", function (eReq, $scope, $filter, ngTableParams) {
        var reqConfig = eReq.getInstance("http://181.209.238.78:5002/v1/opendata");
//        var reqConfig = eReq.getInstance("http://localhost:5002/v1/opendata");
        var series = reqConfig.get("/series");
        $scope.editMode = false;

        $scope.editAction = function (serie) {
            $scope.nSerie = serie;
            $scope.editMode = true;
        };
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

        $scope.nSerie = {name: "", description: "", fiels: []};
        $scope.nCampo = {columnName: "", columndType: "text"};
        $scope.addCampo = function () {
            $scope.nSerie.fiels.push($scope.nCampo);
            $scope.nCampo = {columnName: "", columndType: "text"};
        };

        $scope.saveSerie = function () {
            if ($scope.editMode) {
                reqConfig.post("/series/upd/" + $scope.nSerie.id, $scope.nSerie);
            } else {
                reqConfig.post("/series", $scope.nSerie);
            }
            $scope.nSerie = {name: "", description: "", fiels: []};
            series = reqConfig.get("/series");
            $scope.editMode = false;
        };

        $scope.editId = -1;

        $scope.setEditId = function (pid) {
            $scope.editId = pid;
        };
    }]);
