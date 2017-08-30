var app = angular.module(
    'app', []
).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.controller("ctrl", function ($scope, $timeout) {
    $scope.click = {};

    $scope.click.logout = function() {
        $.ajax({
            method: 'DELETE',
            url: '/api/middleware/session',
            success: function(res) {
                location.reload()
            }
        })
    }

    $scope.click.submit = function(username) {
        $.ajax({
            method: 'POST',
            url: '/api/middleware/session',
            data: { username: username },
            success: function(res) {
                location.reload()
            }
        })
    }
});
