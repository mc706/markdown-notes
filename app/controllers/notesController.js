app.controller("NotesController", function ($scope, $log, $filter, note) {
    'use strict';
    $log.debug('NotesController Initialized');

    if (note) {
        $scope.newNote = $filter('filter')($scope.notes, function (n){
            return n.slug === note;
        })[0];
        $log.debug("Selected Note", $scope.newNote);
    }

});