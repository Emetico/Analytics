﻿angular.module("umbraco").controller("Analytics.LanguageController",
    function ($scope, $location, statsResource, settingsResource) {

        var profileID = "";

        // items list array
        $scope.items = [];

        // change sort icons
        function iconSorting(tableId, field) {
            $('#' + tableId + ' th i').each(function () {
                $(this).removeClass().addClass('icon'); // reset sort icon for columns with existing icons
            });
            if ($scope.descending)
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-down');
            else
                $('#' + tableId + ' #' + field + ' i').removeClass().addClass('icon-navigation-up');
        }

        $scope.sort = function (newSortField) {
            if ($scope.sortField == newSortField)
                $scope.descending = !$scope.descending;

            // sort by new field and change sort icons
            $scope.sortField = newSortField;
            iconSorting("tbl-languages", newSortField);
        };

        $scope.dateFilter = settingsResource.getDateFilter();

        $scope.$watch('dateFilter', function () {
            
            settingsResource.setDateFilter($scope.dateFilter.startDate, $scope.dateFilter.endDate);
            //Get Profile
            settingsResource.getprofile().then(function(response) {
                $scope.profile = response.data;
                profileID = response.data.Id;

                if (profileID == null || profileID == "") {
                    $location.path("/analytics/analyticsTree/edit/settings");
                    return;
                }
                
                //Get language via statsResource - does WebAPI GET call
                statsResource.getlanguage(profileID, $scope.dateFilter.startDate, $scope.dateFilter.endDate).then(function (response) {
                    $scope.data = response.data;

                    // clear existing items
                    $scope.items.length = 0;
                    // push objects to items array
                    angular.forEach($scope.data.Rows, function (item) {
                        $scope.items.push({
                            language: item.Cells[0],
                            visits: parseInt(item.Cells[1]),
                            pageviews: parseInt(item.Cells[2])
                        });
                    });

                    var defaultSort = "pageviews"; // default sorting
                    $scope.sortField = defaultSort;
                    $scope.descending = true; // most pageviews first

                    // change sort icons
                    iconSorting("tbl-languages", defaultSort);
                });

            });
        });
    });