function calculateDistance(lat, lon, h){
  // WGS-84 geodetic constants
  var a = 6378137.0;         // WGS-84 Earth semimajor axis (m)
  var b = 6356752.314245;     // Derived Earth semiminor axis (m)
  var f = (a - b) / a;           // Ellipsoid Flatness
  var f_inv = 1.0 / f;       // Inverse flattening
  var a_sq = a * a;
  var b_sq = b * b;
  var e_sq = f * (2 - f);    // Square of Eccentricity

  // Converts WGS-84 Geodetic point (lat, lon, h) to the 
  // Earth-Centered Earth-Fixed (ECEF) coordinates (x, y, z).

  // Converts WGS-84 Geodetic point (lat, lon, h) to the 
  // Earth-Centered Earth-Fixed (ECEF) coordinates (x, y, z).
  // Convert to radians in notation consistent with the paper:
  var pi = Math.PI;
  var lambda = lat * (pi / 180);
  var phi = lon * (pi / 180);
  var s = Math.sin(lambda);
  var N = a / Math.sqrt(1 - e_sq * s * s);

  var sin_lambda = Math.sin(lambda);
  var cos_lambda = Math.cos(lambda);
  var cos_phi = Math.cos(phi);
  var sin_phi = Math.sin(phi);

  x = (h + N) * cos_lambda * cos_phi;
  y = (h + N) * cos_lambda * sin_phi;
  z = (h + (1 - e_sq) * N) * sin_lambda;

  p = Math.sqrt((x * x) + (y * y));
  distance = Math.sqrt((p * p) + (z * z));
  return distance;
}

module.exports = calculateDistance;