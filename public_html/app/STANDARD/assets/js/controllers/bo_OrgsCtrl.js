/**
 * Created by edcracken 
 */
/**
 * Organizations maintenance controllers 
 */
app.controller('bo_OrgsCtrl', ["eReq", "$scope", "$filter", "ngTableParams", function (eReq, $scope, $filter, ngTableParams) {
//        $scope.host = "http://localhost:5002";
        $scope.host="http://181.209.238.78:5002";
        $scope.getCatalog = function ($name) {
            return eReq.getInstance($scope.host + "/" + $name);
        };
        /**
         * 
         * @param {type} $r
         * @param {type} $entity
         * @returns {type}
         */
        $scope.parsetRsHal = function ($r, $entity) {
            if ($r._embedded) {
                var ls = eval("$r._embedded." + $entity);
                return $scope.parsetLsHal(ls);
            }
        };
        /**
         * 
         * @param {type} $c
         * @returns {unresolved}
         */
        $scope.parsetLsHal = function ($c) {
            angular.forEach($c, function (v) {
                var lnk = v._links.self.href;
                v.id = lnk.substring(lnk.lastIndexOf("/") + 1, lnk.length);
            });
            return $c;
        };


        $scope.clients = $scope.parsetRsHal($scope.getCatalog("client").get(""), "client");
        $scope.editMode = false;
        
        $scope.refresh = function () {
            $scope.data = $scope.parsetRsHal($scope.getCatalog("organization").get(""), "organization");
        };
        $scope.editAction = function (serie) {
            $scope.mOrg = serie;
            $scope.editMode = true;
        };
        $scope.refresh();
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
            $scope.mOrg.idAdClient = JSON.parse($scope.mOrg.client)._links.client.href;
            if ($scope.editMode) {
                eReq.getInstance($scope.mOrg._links.self.href).put("", $scope.mOrg);
            } else {
                eReq.getInstance("/organization").post("", $scope.mOrg);
            }
            $scope.mOrg = {name: "", description: "", fiels: []};
            $scope.refresh();
            $scope.editMode = false;
        };

        $scope.editId = -1;

        $scope.setEditId = function (pid) {
            $scope.editId = pid;
        };
    }]);
