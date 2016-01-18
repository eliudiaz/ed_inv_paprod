/**
 * Created by Juliu on 04/01/2016.
 */
'use strict';
/**
 * controller for Validation Form example
 */
app.controller('bo_datacategoryCtrl', ["$scope", "$state", "$timeout", "SweetAlert", function ($scope, $state, $timeout, SweetAlert) {

    $scope.master = $scope.myModel;
    $scope.form = {

        submit: function (form) {
            var firstError = null;
            if (form.$invalid) {

                var field = null, firstError = null;
                for (field in form) {
                    if (field[0] != '$') {
                        if (firstError === null && !form[field].$valid) {
                            firstError = form[field].$name;
                        }

                        if (form[field].$pristine) {
                            form[field].$dirty = true;
                        }
                    }
                }

                angular.element('.ng-invalid[name=' + firstError + ']').focus();
                SweetAlert.swal("Esta forma no puede ser procesada porque contiene errores de validación!", "Los errores estan marcados en color rojo, y borde punteado!", "error");
                return;

            } else {
                SweetAlert.swal("Felicitaciones!", "La forma esta lista para ser procesa!", "éxito");
                //your code for submit
            }

        },
        reset: function (form) {

            $scope.myModel = angular.copy($scope.master);
            form.$setPristine(true);

        }
    };

}]);
