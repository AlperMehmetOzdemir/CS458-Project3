const taskC = require('../taskC');

test('Check coordinate values',()=>{
    expect(taskC.controlCoordinate(0, -112)).toBe(true);
    expect(taskC.controlCoordinate(1083, 197)).toBe(false);
    expect(taskC.controlCoordinate('1189')).toBe(false);
    expect(taskC.controlCoordinate(90578,"ABCD")).toBe(false);
  })

test('Check distance of center to the Earth',()=>{
    expect(taskC.calculateDistance(41.0082, 28.9784, 30.60943031311035)).toBeCloseTo(6369004.316294169);
    expect(taskC.calculateDistance(39.9334, 32.8597, 891.437744140625)).toBeCloseTo(6370260.734445383);
    expect(taskC.calculateDistance(40.7306, 73.9352, 10.02)).toBeCloseTo(6369948.79128152);
    expect(taskC.calculateDistance(36.7783, 119.4179, 13.07790184020996)).toBeCloseTo(6370525.634507292);
})

test.each([
  [41.0082, 28.9784, 30.60943031311035, "6369004.316294169"],
  [39.9334, 32.8597, 891.437744140625, "6370260.734445383"],
  [40.7306, 73.9352, 10.02, "6369948.79128152"],
  [36.7783, 119.4179, 13.07790184020996, "6370525.634507292"],
])('Checking Distance Calculating to Earth Center', (coordinate1, coordinate2, expectedElevation, expectedDistance)=>{
  const taskC = require('../taskC');

  taskC.getResponse = jest.fn(async (url) => {
    return {
      data: {
        results: [
          {
            elevation : expectedElevation
          }
        ]
      }
    }
  });
  return expect(taskC.getDistanceToEarthCenter(coordinate1, coordinate2)).resolves.toEqual(expectedDistance);
})
