angular.module('mg-Services', [])

.factory('api', ['$http', '$q', function ($http, $q) {

    return {

        get: function (url) {

            var defer = $q.defer();

            $http.get(url)
                .success(function (result) {
                    defer.resolve(result);
                })
                .error(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        },

        _delete: function (url) {
            var defer = $q.defer();

            $http.delete(url)
                .success(function (msg) {
                    defer.resolve(msg);
                })
                .error(function (err) {
                    defer.reject(err);
                });

            return defer.promise;
        },

        post: function (url, data) {

            var defer = $q.defer();

            $http.post(url, data)
                  .success(function (result) {
                      defer.resolve(result);
                  })
                  .error(function (err) {
                      defer.reject(err);
                  });

            return defer.promise;
        },

        put: function (url, data) {

            var defer = $q.defer();

            $http.post(url, data)
                  .success(function (result) {
                      defer.resolve(result);
                  })
                  .error(function (err) {
                      defer.reject(err);
                  });

            return defer.promise;
        }
    };

}]);