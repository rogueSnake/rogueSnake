
// item is currently negligibly different from dude, but that will change. item
// needs the functions shared by potions, glyphs, and upgrades... I'm just not 
// sure what those will be yet.
rSNAKE.proto.item = { 
    x : rSNAKE.CON.DISPLAY_WIDTH + 1,   
    y : rSNAKE.CON.DISPLAY_HEIGHT + 1,        
    mappable : true,
    blocksView : false,
    blocksMove : false,
    bg_color : rSNAKE.CON.LIGHT_FLOOR_RGB,
    floorCache : Object.create(rSNAKE.map.protoFloor),
    mapSelf : function (x, y) {
        map[self.x][self.y] = this.floorCache;
        this.floorCache = map[x][y];
        map[x][y] = this;
        },
    };