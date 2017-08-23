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
    $scope.click.submit = function(username) {
        console.log('atest')
        location.href = '/users/' + username
    }
});
