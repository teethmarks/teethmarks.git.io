function initMap() {
    var monks = {
        lat: 40.8054491,
        lng: -73.9654415
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 18,
        center: monks
    });
    var marker = new google.maps.Marker({
        position: monks,
        map: map
    });
}