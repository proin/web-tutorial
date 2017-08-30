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
    $.ajax({
        method: 'GET',
        url: '/api/middleware/elastic',
        success: function(res) {
            $scope.list = res
            $timeout()
        }
    })
});
