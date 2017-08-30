var app = angular.module('starter', ['ionic'])
    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    }).directive('ngEnter', function () {
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


var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

app.controller('ctrl', function($scope, $timeout) {
    let afterSearch = function(data) {
        $scope.data = data;
        $scope.result = data.hits.hits;

        $('.chart-1').html('<canvas id="category-chart"></canvas>');
        $('.chart-2').html('<canvas id="timeline"></canvas>');

        var aggs = []
        var agg_labels = []

        for(var i = 0 ; i < data.aggregations.byClass.buckets.length ; i++) {
            if(i >= 3) break;
            aggs.push(data.aggregations.byClass.buckets[i].doc_count);
            agg_labels.push(data.aggregations.byClass.buckets[i].key);
        }

        var ctx_class = document.getElementById('category-chart').getContext("2d");
        var categoryChart = new Chart(ctx_class, {
            type: 'pie',
            data: {
                datasets: [{
                    data: aggs,
                    backgroundColor: [
                        chartColors.red,
                        chartColors.orange,
                        chartColors.yellow,
                        chartColors.green,
                        chartColors.blue,
                    ],
                    label: 'Dataset 1'
                }],
                labels: agg_labels
            },
            options: {
                responsive: true
            }
        });

        var aggs = []
        var agg_labels = []

        for(var i = 0 ; i < data.aggregations.byDate.buckets.length ; i++) {
            var d = new Date(data.aggregations.byDate.buckets[i].key);
            aggs.push(data.aggregations.byDate.buckets[i].doc_count);
            agg_labels.push(d.getFullYear() + '/' + (d.getMonth() + 1));
        }

        var ctx_date = document.getElementById('timeline').getContext("2d");
        var dateChart = new Chart(ctx_date, {
            type: 'line',
            data: {
                labels: agg_labels,
                datasets: [{
                    label: "",
                    backgroundColor: 'rgba(255, 99, 132, .4)',
                    borderColor: chartColors.red,
                    data: aggs, 
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                title:{
                    display: false,
                },
                legend: {
                    display: false
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Month'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Document Count'
                        }
                    }]
                }
            }
        });

        $timeout();
    }

    $scope.result = [];
    $scope.data = null;

    $scope.search = function(query) {
        $.ajax({
            method: 'POST',
            url: 'http://localhost:3000/api/search',
            crossDomain: true,
            data: { q: query },
            dataType: 'jsonp',
            success: function(data) {
                $scope.querystr = query;
                $scope.query = query;
                afterSearch(data);
            }
        })
    }
})
