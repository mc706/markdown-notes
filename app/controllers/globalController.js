app.controller("GlobalController", function ($scope, $log, $location, $http, localStorageService) {
  'use strict';
  var taskRegs = [
    /^\!(.*)@(.*)\((.*)\)$/i,
    /^\!(.*)@(.*)$/i,
    /^\!(.*)$/i
  ];
  $log.debug('GlobalController Initialized');

  $scope.go = function () {
    var args = Array.prototype.slice.call(arguments),
      url = "/" + args.join('/');
    $log.debug(url);
    $location.path(url);
  };

  $scope.tasks = [];
  $scope.notes = localStorageService.get('notes') ? localStorageService.get('notes') : [];
  $log.debug('notes:', $scope.notes);

  if ($scope.notes.length === 0) {
    $http.get('/scripts/json/welcome.json')
      .then(function (data) {
        var note = data.data;
        console.log(note);
        $scope.notes.push(note);
        localStorageService.set('notes', $scope.notes);
        $scope.parseTasks();
      })
  }

  $scope.saveNote = function (note) {
    $log.debug('Saving note:', note);
    if (!note.slug) {
      note.slug = $scope.slugify(note.title);
      note.date = new Date();
      $log.debug('New note:', note);
      $scope.notes.push(note);
    } else {
      angular.forEach($scope.notes, function (n, i) {
        if (n.slug === note.slug) {
          $scope.notes[i] = note;
        }
      });
      $log.debug('updated:', $scope.notes);
    }
    localStorageService.remove('notes');
    localStorageService.set('notes', $scope.notes);
    $scope.parseTasks();
  };

  $scope.slugify = function (text) {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  $scope.parseResults = function (results) {
    results.splice(0, 1);
    $log.debug('results', results);
    var task = {},
      map = ['description', 'owner', 'date'];
    for (var i = 0; i < results.length; i++) {
      task[map[i]] = results[i];
    }
    $log.debug('task:', task);
    return task;
  };

  $scope.parseTasks = function (newNote) {
    var results, i;
    $scope.tasks = [];
    angular.forEach($scope.notes, function (note) {
      angular.forEach(note.content.split('\n'), function (line) {
        for (i = 0; i < taskRegs.length; i++) {
          results = taskRegs[i].exec(line);
          if (taskRegs[i].test(line)) break;
        }
        if (results && results.length > 1) {
          $scope.tasks.push($scope.parseResults(results));
        }
      });
    });
    if (newNote && newNote.content) {
      angular.forEach(newNote.content.split('\n'), function (line) {
        for (i = 0; i < taskRegs.length; i++) {
          results = taskRegs[i].exec(line);
          if (taskRegs[i].test(line)) break;
        }
        if (results && results.length > 2) {
          $scope.tasks.push({
            "description": results[1],
            "owner": results[2],
            "date": results[3]
          });
        }
      });
    }
  };
  $scope.parseTasks();


});