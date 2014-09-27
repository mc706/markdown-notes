app.service('RootService', function ($http, $q, $log, $filter) {
    "use strict";
    return {
        listDatabases: function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/_all_dbs/'
            }).success(function (data, status, headers, config) {
                var exclude = /(^_|^test_suite|^couch\-excel$)/i,
                    databases = $filter('filter')(data, function (n, i) {
                        return !exclude.test(n);
                    }, true);
                $log.debug("Filtered Response:", databases);
                defer.resolve(databases);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        checkHealth: function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/'
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        provisionDatabase: function (name) {
            var defer = $q.defer();
            $http({
                method: 'PUT',
                url: '/' + name + '/_design/filter',
                data: {
                    language: 'javascript',
                    views: {
                        reports: {
                            map: "function(doc) {\n  if (doc.type===\"report\"){\n  emit(doc._id, doc);\n}\n}"
                        }
                    }
                }
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        createDatabase: function (name) {
            var defer = $q.defer();
            $http({
                method: 'PUT',
                url: '/' + name
            }).success(function (data, status, headers, config) {
                $http({
                    method: 'PUT',
                    url: '/' + name + '/_design/config',
                    data: {
                        language: 'javascript',
                        views: {
                            reports: {
                                map: "function(doc){if(doc.type===\"report\"){emit(doc._id, doc);}}"
                            },
                            rows: {
                                map: "function(doc){if(doc.type===\"row\"){emit(doc.id, doc);}} "
                            }
                        },
                        structure: []
                    }
                });
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        deleteDatabase: function (name) {
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: '/' + name
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getUUID: function (amount) {
            var defer = $q.defer(),
                url = +amount > 1 ? '/_uuids?count=' + amount : '/_uuids';
            $http({
                method: 'GET',
                url: url
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        updateSettings: function (name, settings) {
            var defer = $q.defer();
            $http({
                method: 'PUT',
                url: '/' + name + '/_design/config',
                data: settings
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        },
        getSettings: function (name) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/' + name + '/_design/config'
            }).success(function (data, status, headers, config) {
                defer.resolve(data);
            }).error(function (data, status, headers, config) {
                defer.reject(status);
            });
            return defer.promise;
        }

    };
});