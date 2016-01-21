/**
 * Created by Juliu on 12/01/2016.
 */
'use strict';
/**
 * controllers that generate the list of icons (Fontawesome and Themify)
 */
app.controller('fo_viewdatasetCtrl', ["$scope", "eReq", "$stateParams", function ($scope, eReq, $stateParams) {
//        var reqContent = eReq.getInstance("http://181.209.238.78:5000/v1/opendata");
        var reqContent = eReq.getInstance("http://localhost:5000/v1/opendata");
        var jsonData = reqContent.get("/content/entities/" + $stateParams.serie);
        function setPivotReport() {
            var report = {
                dataSourceType: "json",
                data: jsonData,
//                rows: [{uniqueName: "M"}],
//                columns: [{uniqueName: "id"}, {uniqueName: "[id]"}],
//                measures: [{uniqueName: "Quantity"}],
                configuratorActive: true,
                viewType: "grid"
            };
            flexmonster.setReport(report);
        }
        // Init Flexmonster
        flexmonster.embedPivotComponent("flexmonster/", "pivot-container", "100%", "500", {
//            licenseKey: "Z544-5U1SI3-3D1H-2J22-0U37-4L2A-0M41-3F",
            licenseKey: "Z54C-3E2HS4-381I-2758-1U1P-6T0M-2K3S-3C05-572W-0I5E-2B1A-23",
            jsPivotCreationCompleteHandler: setPivotReport
        });
    }]);
