describe("Map", function() {
  var Map = require('../../common/map2');
  var map;

  beforeEach(function() {
    map = new Map(1, "mainGrid" );
  });


  describe("when Map is invoked with parameters, ", function() {
    beforeEach(function() {
      map = new Map(1, "mainGrid" );
    });

    it("it should indicate that the map is initialized correctly", function() {
      expect(map.mapLevel == 1).toBeTruthy();
      expect(map.gridName == "mainGrid").toBeTruthy();
    });

  });

});
