/*global google */
/*global moment */
/*global $ */
var currentPosition = '';
var oldAccess = '';
var latitulong = '';
var user = '';
var map;
var prevision;
var indice = 0;
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

    var oldDate = '';
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
    oldAccess = user + " ultimo accesso " + oldDate;
    var arrayId = ['nome', 'accesso', 'icona', 'temp', 'wind', 'cloudiness', 'pressure', 'humidity', 'sunrise', 'sunset'];
    var arrayValue = [user, oldDate, weather.weather[0].icon, weather.main.temp, weather.wind, weather.weather[0].description, weather.main.pressure, weather.main.humidity, weather.sys.sunrise, weather.sys.sunset];
    for (var i = 0; i < arrayId.length; i++) {
        load(arrayId[i], arrayValue[i]);
    }
    // $('#container').show('toggle');
    // $('footer').show('toggle');
    // $('#loading').loading('toggle');
}
function loadForecast(forecast, j) {
    'use strict';
    var weather;
    if (forecast) {
        prevision = forecast;
    }
    console.log(j);
    if (j === 'success') {
        j = 0;
    }
    weather = prevision.list[j];
    console.log(prevision);
    var arrayId = ['data','time', 'ficona', 'ftemp', 'fcloudiness'];
    var arrayValue = [weather.dt, weather.dt, weather.weather[0].icon, weather.main.temp, weather.weather[0].description];
    for (var i = 0; i < arrayId.length; i++) {
        load(arrayId[i], arrayValue[i]);
    }
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
            latitulong = mapProp.center;
            var name = document.getElementById('geoCoords');
            name.innerText = latitulong.lat().toFixed(2) + ', ' + latitulong.lng().toFixed(2);
            var luogo = document.getElementById('luogo');
            luogo.innerText = results[0].formatted_address;
            $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadCurrentWeather);
            $.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadForecast);
        } else {
            alert('No Result');
        }
    });
}
function loadPosition() { //geolocalizza e restituisce l'indirizzo utilizzando il reverse geocoding
    'use strict';
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(funzioneOk, funzioneErrore);
    } else {
        alert('non disponibile');
    }
}
function funzioneOk(position) {
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
        $.getJSON('http://api.openweathermap.org/data/2.5/weather?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadCurrentWeather);
        $.getJSON('http://api.openweathermap.org/data/2.5/forecast?lat=' + latitulong.lat() + '&lon=' + latitulong.lng() + '&lang=it&APPID=ee6b293d773f4fcd7e434f79bbc341f2', loadForecast);
    }
}
function funzioneErrore(error) {
    'use strict';
    $('#loading').loading('toggle');
    alert(error.message);
}
function load(id, value) {
    'use strict';
    var name = document.getElementById(id);
    switch (id) {
        case 'icona': case 'ficona':
            name.src = 'https://openweathermap.org/img/w/' + value + '.png';
            break;
        case 'temp': case 'ftemp':
            var temp = value - 273.15;
            name.innerText = temp.toFixed(1);
            break;
        case 'wind': case 'fwind':
            if (value.deg === undefined) {
                name.innerText = 'calmo';
            } else {
                name.innerText = ' ' + value.speed + ' m/s,  (' + value.deg + ')';
            }
            break;
        case 'sunrise': case 'sunset': case 'time':
            name.innerText = moment.unix(value).format('kk:mm');
            break;
        case 'data':
            name.innerText = moment.unix(value).format('ll ');
            break;
        default:
            name.innerText = value;
    }
}
$('#btSearch').click(function () {
    'use strict';
    findPosition($('#srch-term').val());
});

$('#btForward').click(function () {
    'use strict';
    if (indice >= 0 && indice < 31) {
        indice += 8;
    }
    loadForecast(undefined, indice);
});

$('#btBack').click(function () {
    'use strict';
    if (indice > 0 && indice <= 39) {
        indice -= 8;
    }
    loadForecast(undefined, indice);
});