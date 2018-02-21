var currentPosition = '';
var oldAccess = '';
var latitulong = '';
function loadWeather() {
    var weather = new extractWeather();
    var mapProp = {
        center: new google.maps.LatLng(9.00000, 10),
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("mappa"), mapProp);
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    var marker = new google.maps.Marker({
        position: mapProp.center,
        map: map
    });
    loadPosition();
    if (localStorage && localStorage['ultimoaccesso']) {
        var oldDate = localStorage['ultimoaccesso'];
    } else {
        var oldDate = "MAI";
    }
    localStorage.setItem('ultimoaccesso', moment().format('LL')+' '+moment().format('LTS'));
    if (localStorage && localStorage['username']) {
        user = localStorage['username'];
    } else {
        user = 'Mario';
        localStorage['username'] = user;
    }
    oldAccess = user + " ultimo accesso " + oldDate;

    var arrayId = ['nome', 'accesso', 'icona', 'temp', 'wind', 'cloudiness', 'pressure', 'humidity', 'sunrise', 'sunset'];
    var arrayValue = [user, oldDate, weather.weather.icon, weather.main.temp, weather.wind, weather.weather.description, weather.main.pressure, weather.main.humidity, weather.sys.sunrise, weather.sys.sunset];
    for (var i = 0; i < arrayId.length; i++) {
        load(arrayId[i], arrayValue[i]);
    }
}
function loadPosition() { //geolocalizza e restituisce l'indirizzo utilizzando il reverse geocoding
    var coordinate;
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(funzioneOk, funzioneErrore);
    } else {
        alert('non disponibile');
    }
}
function funzioneOk(position) {
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
        var geocoder = new google.maps.Geocoder;
        geocoder.geocode({ 'location': mapProp.center }, function (results, status) {
            if (results[0]) {
                currentPosition = results[0].formatted_address;
                var luogo = document.getElementById('luogo');
                luogo.innerText = currentPosition;
            } else {
                alert('No Result');
            }
        });
        var map = new google.maps.Map(document.getElementById("mappa"), mapProp);
        var marker = new google.maps.Marker({
            position: mapProp.center,
            map: map
        });
    }
}
function funzioneErrore(error) {
    alert(error.message);
}
function load(id, value) {
    var name = document.getElementById(id);
    switch (id) {
        case 'icona':
            name.src = 'https://openweathermap.org/img/w/' + value + '.png';
            break;
        case 'temp':
            var temp = value - 273.15;
            name.innerText = temp.toFixed(1);
            break;
        case 'wind':
            if (value.deg > 303.75 && value.deg < 326.25) {
                name.innerText = 'Gently Breeze ' + value.speed + ' m/s, NordWest (' + value.deg + ')';
            }
            break;
        case 'sunrise': case 'sunset':
            name.innerText = moment.unix(value).format('kk:mm:ss ');
            break;
        default:
            name.innerText = value;
    }
}
