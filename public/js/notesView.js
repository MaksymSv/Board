/**
 * Created by Maksym on 15-Aug-14.
 */
(function (angular) {
    var theModule = angular.module("notesView", ["ngRoute", "ui.bootstrap"]);


    theModule.controller("notesViewController", ["$scope", "$window", "$http", function ($scope, $window, $http) {
        $scope.notes = [];
        $scope.newNote = createBlankNote();

        function getCategoryNameFromUrl() {
            var urlParts = $window.location.pathname.split("/");
            var categoryName = urlParts[urlParts.length - 1];
            return categoryName;
        }

        var categoryName = getCategoryNameFromUrl();
        var noteUrl = "/api/notes/" + categoryName;

        $http.get(noteUrl).then(
            function (result) {
                console.log(result);
                $scope.notes = result.data;
                console.log($scope.notes);
        }, function (err) {
            alert(err);
        });
        
        $scope.save = function () {
           $http.post(noteUrl, $scope.newNote)
               .then(function (result) {
                   $scope.notes.push(result.data);
                   $scope.newNote = createBlankNote();
               }, function (err) {
                    alert(err);
               })
        };

        function createBlankNote() {
            return {
                note: "",
                color: "yellow"
            };
        }


    }])
})(window.angular);