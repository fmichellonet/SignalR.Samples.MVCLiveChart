/// <reference path="../../Scripts/jquery-1.6.2.js" />
/// <reference path="../../Scripts/jQuery.tmpl.js" />
/// <reference path="../../Scripts/jquery.cookie.js" />


$(function () {

    window.Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    var chart;

    $(document).ready(function () {
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'spline',
                marginRight: 10
            },
            title: {
                text: 'Real time charting with SignalR'
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: 'Value'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
							Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
							Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Fowler-Corp',
                data: (function () {
                    // generate an array of random data
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i++) {
                        data.push({
                            x: time + i * 1000,
                            y: Math.random()
                        });
                    }
                    return data;
                })()
            }]
        });

    });

    var stockExchangeServer = $.connection.stockExchange;

    stockExchangeServer.sendSharePrices = function (id, content) {
        //console.log(content);

        if (id != this.Id) {
            return;
        }

        // set up the updating of the chart.
        var series = chart.series[0];
        var x = new Date(parseInt(content[0].Date.substr(6))).getTime(),
                y = content[0].Price;

        series.addPoint([x, y], true, true);
    };

    $.connection.hub.start(function () {
        stockExchangeServer.connect()
            .done(function (success) {
                if (success === false) {
                    console.log(":(");
                }
                console.log("connected");
            });
    });
});