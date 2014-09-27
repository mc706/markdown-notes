app.controller("HomeController", function ($scope, $log, $filter, note) {
    'use strict';
    $log.debug('HomeController Initialized');


    if (note) {
        $scope.selectedNote = $filter('filter')($scope.notes, function (n){
            return n.slug === note;
        })[0];
        $log.debug("selectedNote", $scope.selectedNote);
    }

});