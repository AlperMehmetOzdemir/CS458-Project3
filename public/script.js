const bigbenUseDeviceLocation = document.getElementById("bigBenDeviceLocation");

const coreUseDeviceLocation = document.getElementById("coreDeviceLocation");

bigbenUseDeviceLocation.addEventListener("change", function () {
  if (this.checked) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const bigbenLat = document.getElementById("bigbenLat");
      const bigbenLng = document.getElementById("bigbenLng");

      bigbenLat.value = latitude;
      bigbenLng.value = longitude;
    });
  }
});

coreUseDeviceLocation.addEventListener("change", function () {
  if (this.checked) {
    navigator.geolocation.getCurrentPosition(function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const coreLat = document.getElementById("coreLat");
      const coreLng = document.getElementById("coreLng");

      coreLat.value = latitude;
      coreLng.value = longitude;
    });
  }
});
