/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
app.controller('maintCtrl', ["$scope", "ngTableParams", "em", function ($scope, ngTableParams, em) {
        $scope.today = new Date();
        $scope.showForm = false;
        $scope.saveMode = 1; // modes: 1(save)|2(update) 
        $scope.rowModel = {};
        em.setE("persons");
        $scope.rData = em.getAll();
        $scope.data = $scope.rData;
        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: $scope.rData.length,
            getData: function ($defer, params) {
                $defer.resolve($scope.rData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        $scope.delAction = function (id) {
            for (var i = 0; i < $scope.data.length - 1; i++) {
                if ($scope.data[i].id === id) {
                    $scope.data.splice(i, 1);
                }
            }
            $scope.tableParams.reload();
        };
        /**
         * 
         * @param {type} row
         * @returns {undefined}
         */
        $scope.editAction = function (row) {
            if (row !== null) {
                $scope.showRowDetail(row);
                $scope.saveMode = 2;
            }
            // TODO: show wrong param alert!
        };
        /**
         * 
         * @returns {undefined}
         */
        $scope.newAction = function () {
            $scope.showRowDetail(null);
            $scope.saveMode = 1;
        };
        $scope.saveAction = function () {
            switch ($scope.saveMode) {
                case 1:
                    $scope.rowModel.created_at = "0000-00-00 00:00:00";
                    em.post($scope.rowModel);
                    break;
                case 2:
                    em.put($scope.rowModel);
                    break;
            }
        };
        $scope.cancelAction = function () {
            $scope.showForm = false;
            $scope.rowModel = {};
        };
        /**
         * 
         * @param {type} row element
         * @returns {undefined}
         */
        $scope.showRowDetail = function (e) {
            $scope.rowModel = e;
            if (e === null) {
                $scope.rowModel = {};
            }

            $scope.showRowDetailView($scope.rowModel);
        };
        /**
         * 
         * @param {type} el
         * @returns nothing
         */
        $scope.showRowDetailView = function (el) {
            $scope.showForm = true;
        };
    }]);
