/**
 * Created by Juliu on 12/01/2016.
 */
/**
 * controllers used for the dashboard
 */
app.controller('bo_categoriesCtrl', ["eReq", "$scope", "$filter", "ngTableParams", function (eReq, $scope, $filter, ngTableParams) {
//        var reqConfig = eReq.getInstance("http://181.209.238.78:5002");
        $scope.getReq = function () {
//            return eReq.getInstance("http://localhost:5002");
            return eReq.getInstance("http://181.209.238.78:5002");            
        };
        $scope.data = $scope.getReq().get("/organization");
        $scope.data = $scope.data._embedded.organization;
        $scope.editMode = false;

        $scope.editAction = function (serie) {
            $scope.mOrg = serie;
            $scope.editMode = true;
        };
        $scope.tableParams = new ngTableParams({
            page: 1, // show first page
            count: 5 // count per page
        }, {
            total: $scope.data.length, // length of $scope.data
            getData: function ($defer, params) {
                var orderedData = params.sorting() ? $filter('orderBy')($scope.data, params.orderBy()) : $scope.data;
                $defer.resolve($scope.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });

        $scope.mOrg = {name: "", description: ""};

        $scope.save = function () {
            if ($scope.editMode) {
                eReq.getInstance($scope.mOrg._links.self.href).put("", $scope.mOrg);
            } else {
                $scope.getReq().post("/organization", $scope.mOrg);
            }
            $scope.mOrg = {name: "", description: "", fiels: []};
            $scope.data = $scope.getReq().get("/organization");
            $scope.data = $scope.data._embedded.organization;
            $scope.editMode = false;
        };

        $scope.editId = -1;

        $scope.setEditId = function (pid) {
            $scope.editId = pid;
        };
    }]);
