'use strict';
/** 
 * controller for Wizard Form example
 */
app.controller('bo_importdataCtrl', ['$scope', 'toaster', 'FileUploader', 'eReq', 'ngTableParams',
    function ($scope, toaster, FileUploader, eReq, ngTableParams) {
        //$scope.host = "http://localhost:5002/v1/opendata"
        $scope.host = "http://181.209.238.78:5002/v1/opendata";
        $scope.reqConfig = eReq.getInstance($scope.host);

        $scope.series = $scope.reqConfig.get("/series");
        $scope.currentStep = 1;
        $scope.myModel = {rowsFile: [], columnsFile: [], serie: {}};
        $scope.working = false;
        // Initial Value
        $scope.form = {
            next: function (form) {

                $scope.toTheTop();

                if (form.$valid) {
                    if ($scope.myModel.rowsFile.length === 0) {
                        toaster.pop('error', 'Error', 'No ha cargado ningun archivo o el archivo esta vacio');
                        return;
                    }
                    if ($scope.currentStep === 3) {
                        $scope.working = true;
                        $scope.reqConfig.post("/series/" + $scope.myModel.serie.id + "/attach/files/" + $scope.myModel.fileName);
                        $scope.working = false;
                    }
                    nextStep();
                } else {
                    var field = null, firstError = null;
                    for (field in form) {
                        if (field[0] !== '$') {
                            if (firstError === null && !form[field].$valid) {
                                firstError = form[field].$name;
                            }

                            if (form[field].$pristine) {
                                form[field].$dirty = true;
                            }
                        }
                    }

                    angular.element('.ng-invalid[name=' + firstError + ']').focus();
                    errorMessage(firstError);
                }
            },
            prev: function (form) {
                $scope.toTheTop();
                prevStep();
            },
            goTo: function (form, i) {
                if (parseInt($scope.currentStep) > parseInt(i)) {
                    $scope.toTheTop();
                    goToStep(i);

                } else {
                    if (form.$valid) {
                        $scope.toTheTop();
                        goToStep(i);

                    } else
                        errorMessage();
                }
            },
            submit: function () {

            },
            reset: function () {

            }
        };


        var nextStep = function () {
            $scope.currentStep++;
        };
        var prevStep = function () {
            $scope.currentStep--;
        };
        var goToStep = function (i) {
            $scope.currentStep = i;
        };
        var errorMessage = function (i) {
            toaster.pop('error', 'Error', 'Informacion incompleta en elemento: ' + i);
        };

        //uploader
        var uploader = $scope.uploader = new FileUploader({name: "file",
            url: $scope.host + '/files'});

        //table
        $scope.fileData = [];
        $scope.tableData = [];
        $scope.fieldsMapping = function () {
            angular.forEach($scope.fileColumns, function (v, k) {
                $scope.tableData.push({fCol: v, dsCol: null, dsColType: null});
            });
            var i = 0;
            $scope.myModel.serie = JSON.parse($scope.myModel.serie);
            angular.forEach($scope.myModel.serie.fiels, function (v, k) {
                $scope.tableData[i].dsCol = v.columnName;
                $scope.tableData[i].dsColType = v.columndType;
                i++;
            });
        };
        // FILTERS

        uploader.filters.push({
            name: 'customFilter',
            fn: function (item/*{File|FileLikeObject}*/, options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item/*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            $scope.myModel.fileName = response.name;
            $scope.myModel.rowsFile = response.firstValues;
            $scope.myModel.columnsFile = response.columns;
            $scope.fileData = $scope.myModel.rowsFile;
            $scope.fileColumns = $scope.myModel.columnsFile;
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            alert("Error realizando carga: " + response);
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

        console.info('uploader', uploader);
    }]);
