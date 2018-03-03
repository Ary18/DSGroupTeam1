/*global google */
/*global moment */
/*global $ */
var currentPosition = '';
var latitulong = '';
var user = '';
var map;
var map2;
var oldDate = '';
var pos = 1;
window.addEventListener('load', function () {
    'use strict';
    // $('#loading').loading({
    //     theme: 'dark',
    //     message: 'one moment...',
    //     hiddenClass: 'loading-hidden',
    //     onStart: function (loading) {
    //         loading.overlay.slideDown(400);
    //     },
    //     onStop: function (loading) {
    //         loading.overlay.slideUp(400);
    //     }
    // }, 'toggle');
    // $('#container').hide('toggle');
    // $('footer').hide('toggle');
    loadPosition();

});
function loadCurrentWeather(weather) {
    'use strict';
    try {
        if (localStorage && localStorage.ultimoaccesso) {
            oldDate = localStorage.ultimoaccesso;
        } else {
            oldDate = "MAI";
        }
        localStorage.setItem('ultimoaccesso', moment().format('LL') + ' ' + moment().format('LTS'));
        if (localStorage && localStorage.username) {
            user = localStorage.username;
        } else {
            user = 'Mario';
            localStorage.username = user;
        }
    }
    catch (err) {
        console.log(err);
        user = 'Mario';
        oldDate = "Non Disponibile";
    }
    finally {
        var arrayId = ['nome', 'accesso', 'icona', 'temp', 'wind', 'cloudiness', 'pressure', 'humidity', 'sunrise', 'sunset'];
        var arrayValue = [user, oldDate, weather.weather[0].icon, weather.main.temp, weather.wind, weather.weather[0].description, weather.main.pressure, weather.main.humidity, weather.sys.sunrise, weather.sys.sunset];
        for (var i = 0; i < arrayId.length; i++) {
            load(arrayId[i], arrayValue[i]);
        }
    }
    // $('#container').show('toggle');
    // $('footer').show('toggle');
    // $('#loading').loading('toggle');
}
// function deleteRow() {
//     'use strict';

//     $('tr').remove('.forecast');
// }
function addRow(array) {
    'use strict';
    var tr = $(document.createElement('tr'));
    $(tr).addClass('forecast');
    for (var i = 1; i < array.length; i++) {
        if (array[i].slice(0, 6) === 'ficona') {
            $(tr).append('<td><img id="' + array[i] + '"></img></td>');
        } else {
            $(tr).append('<td id="' + array[i] + '"></td>');
        }
    }
    return tr;
}
function addRowTh(array) {
    'use strict';
    var tr = $(document.createElement('tr'));
    $(tr).addClass('forecast');
    for (var i = 0; i < array.length; i++) {
        $(tr).append('<th id="' + array[i] + '"></th>');
    }
    return tr;
}
function backForward(direction) {
    'use strict';
    if (direction) {
        if (pos < 6) {
            $('.num-' + pos).hide();
            $('#data'+pos).hide();
            pos++;
            $('.num-' + pos).show();
            $('#data'+pos).show();
        }
    }
    else {
        if (pos > 1) {
            $('.num-' + pos).hide();
            $('#data'+pos).hide();
            pos--;
            $('.num-' + pos).show();
            $('#data'+pos).show();
        }
    }
    console.log(pos);
}
function loadForecast(forecast) {
    'use strict';
    var weather;
    var tr;
    var n = 1;
    var oldDay = {
        date: moment.unix(forecast.list[0].dt).format('L'),
        index: 0,
    };
    $('article').remove('#contForecast');
    var article = $(document.createElement('article'));
    $(article).attr('id','contForecast');
    $(article).addClass('modal-body col-md-10');
    $('#modalForecast').append(article);
    while (oldDay.index < 39) {
        var h3= $(document.createElement('h3'));
        $(h3).attr('id', 'data'+n);
        $(article).append(h3);
        $(h3).hide();
        load('data'+n, forecast.list[oldDay.index].dt, n);
        var table = $(document.createElement('table'));
        $(table).addClass('num-' + n + ' table table-dark');
        $(article).append(table);
        $(table).hide();
        var arrayTh = ['ora' + n, 'fenomeno' + n, 'tempo' + n, 'temperatura' + n];
        var arrayValueTh = ['Ora', 'Fenomeno', 'Tempo', 'Temperatura'];
        $(table).append(addRowTh(arrayTh));
        for (var i = 0; i < arrayTh.length; i++) {
            load(arrayTh[i], arrayValueTh[i], oldDay.index);
        }
        n++;
        weather = forecast.list[oldDay.index];
        while (oldDay.date === moment.unix(weather.dt).format('L')) {
            if (oldDay.index <= 38) {
                oldDay.index++;
                oldDay.date = moment.unix(weather.dt).format('L');
                weather = forecast.list[oldDay.index];
                var arrayId = ['data', 'time' + oldDay.index, 'ficona' + oldDay.index, 'fcloudiness' + oldDay.index, 'ftemp' + oldDay.index];
                var arrayValue = [weather.dt, weather.dt, weather.weather[0].icon, weather.weather[0].description, weather.main.temp];
                tr = addRow(arrayId);
                $(table).append(tr);
                for (i = 1; i < arrayId.length; i++) {
                    load(arrayId[i], arrayValue[i], oldDay.index);
                }
            }
            else {
                weather = forecast.list[oldDay.index];
                oldDay.date = '';
            }
        }
        oldDay.date = moment.unix(weather.dt).format('L');
    }
    $('.num-1').show();
    $('#data1').show();
    n--;
}
function findPosition(position) {
    'use strict';
    var mapProp;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': position }, function (results, status) {
        if (status === 'OK') {
            mapProp = {
                center: results[0].geometry.location,
                zoom: 16,
            };
            map = new google.maps.Map(document.getElementById("mappa"), mapProp);
            new google.maps.Marker({
                position: mapProp.center,
                map: map
            });
            map2 = new google.maps.Map(document.getElementById("mappa2"), mapProp);
            new google.maps.Marker({
                position: mapProp.center,
                map: map2
            });
            latitulong = mapProp.center;
            var name = document.getElementById('geoCoords');
            name.innerText = latitulong.lat().toFixed(2) + ', ' + latitulong.lng().toFixed(2);
            var luogo = document.getElementById('luogo');
            luogo.innerText = results[0].formatted_address;
            google.maps.event.addListener(map2, 'click', function (event) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'location': event.latLng }, function (results) {
                    if (results[0]) {
                        currentPosition = results[0].formatted_address;
                        $('#srch-term').val(currentPosition);//document.getElementById('srch-term');

                    } else {
                        alert('No Result');
                    }
                    console.log(event.latLng);   // Get latlong info as object.
                });
            });
            $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadCurrentWeather);
            $.getJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadForecast);
        } else {
            alert('No Result');
        }
    });
}
function loadPosition() { //geolocalizza e restituisce l'indirizzo utilizzando il reverse geocoding
    'use strict';
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(loadMap, noGeolocation);
    } else {
        alert('non disponibile');
    }
}
function noGeolocation() {
    'use strict';
    $("#myModal").modal();
}
function loadMap(position) {
    'use strict';
    if (position && position.coords) {
        var latitudine = position.coords.latitude;
        var longitudine = position.coords.longitude;
        var mapProp = {
            center: new google.maps.LatLng(latitudine, longitudine),
            zoom: 16,
        };
        latitulong = mapProp.center;
        var name = document.getElementById('geoCoords');
        name.innerText = latitulong.lat().toFixed(2) + ', ' + latitulong.lng().toFixed(2);
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({ 'location': mapProp.center }, function (results) {
            if (results[0]) {
                currentPosition = results[0].formatted_address;
                var luogo = document.getElementById('luogo');
                luogo.innerText = currentPosition;
            } else {
                alert('No Result');
            }
        });
        map = new google.maps.Map(document.getElementById("mappa"), mapProp);
        new google.maps.Marker({
            position: mapProp.center,
            map: map
        });
        map2 = new google.maps.Map(document.getElementById("mappa2"), mapProp);
        new google.maps.Marker({
            position: mapProp.center,
            map: map2
        });
        google.maps.event.addListener(map2, 'click', function (event) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'location': event.latLng }, function (results) {
                if (results[0]) {
                    currentPosition = results[0].formatted_address;
                    $('#srch-term').val(currentPosition);//document.getElementById('srch-term');

                } else {
                    alert('No Result');
                }
                console.log(event.latLng);   // Get latlong info as object.
            });
        });
        $.getJSON('https://api.openweathermap.org/data/2.5/weather?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadCurrentWeather);
        $.getJSON('https://api.openweathermap.org/data/2.5/forecast?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadForecast);
    }
}
function load(id, value, j) {
    'use strict';
    var name = document.getElementById(id);
    switch (id) {
        case 'icona': case 'ficona' + j:
            name.src = 'https://openweathermap.org/img/w/' + value + '.png';
            break;
        case 'temp': case 'ftemp' + j:
            var temp = value - 273.15;
            name.innerText = temp.toFixed(1);
            break;
        case 'wind':
            if (value.deg === undefined) {
                name.innerText = 'calmo';
            } else {
                name.innerText = ' ' + value.speed + ' m/s,  (' + value.deg + ')';
            }
            break;
        case 'sunrise': case 'sunset': case 'time' + j:
            name.innerText = moment.unix(value).format('kk:mm');
            break;
        case 'data'+j:
            name.innerText = moment.unix(value).format('LL');
            break;
        default:
            name.innerText = value;
    }
}
$('#btSearch').click(function () {
    'use strict';
    findPosition($('#srch-term').val());
});
$("#modalSearch").on('keyup', function (e) {
    'use strict';
    if (e.keyCode === 13) {
        findPosition($('#srch-term').val());
    }
});

$('#btForward').click(function () {
    'use strict';
    backForward(true);
});

$('#btBack').click(function () {
    'use strict';
    backForward(false);
});
