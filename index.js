function loadWeather(){
    var weather=new extractWeather();
    //console.log(weather.base);

    var mapProp = {
        center: new google.maps.LatLng(9.00000, 10),
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("mappa"), mapProp);
    var marker = new google.maps.Marker({
        position: mapProp.center,
        map: map
    });
}