'use strict';
/** 
 * controller for User Profile Example
 */
app.controller('PersonaCtrl', ["$scope", "$timeout","cfpLoadingBar", function ($scope, $timeout, cfpLoadingBar) {
        $scope.noImage = true;
        $scope.persona = {
            cui: '',
            nombres: '',
            apellidos: '',
            paisNacimiento: '',
            nacionalidad: '',
            foto: ''
        };
        $scope.persona_rnp = {
            cui: '',
            nombres: '',
            apellidos: '',
            paisNac: '',
            nacionalidad: '',
            estadoCivil: '',
            estado: '',
            conyuge: ''
        };

        $scope.leerDPI = function () {
            cfpLoadingBar.start();
            $timeout(function () {
                cfpLoadingBar.set(0.3);
            }, 1000);
            $timeout(function () {
                cfpLoadingBar.set(0.6);
            }, 2000);
            $timeout(function () {
                cfpLoadingBar.complete();
            }, 5000);
        };
    }]);