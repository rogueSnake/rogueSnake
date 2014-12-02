// Here's a rough outline of the program:
rSNAKE = {     
    CON : {},      // Shared stash of constants.
    proto : {},    // Shared stash of prototype objects.
    map : {},      //
    hud : {},      // Heads Up Display. 
    player : {},    // 
    monsters : {}, //
    potions : {},  // 
    upgrades : {}, //
    glyphs : {},   //
    game : {}      // Handles game initialization and scheduling.
    };

rSNAKE.CON = { 
    DARK_FLOOR_RGB : ROT.Color.toRGB([153, 102, 0]),     
    DARK_WALL_RGB : ROT.Color.toRGB([102, 51, 0]),        
    LIGHT_FLOOR_RGB : ROT.Color.toRGB([204, 102, 204]),  
    LIGHT_WALL_RGB : ROT.Color.toRGB([102, 0, 102]),     
    UNEXPLORED_RGB : ROT.Color.toRGB([0, 0, 0]),

    HEALTH_RGB : ROT.Color.toRGB([255, 102, 102]),
    MANA_RGB : ROT.Color.toRGB([102, 204, 255]),    

    WATER_RGB : ROT.Color.toRGB([51, 102, 255]),
    FIRE_RGB : ROT.Color.toRGB([204, 51, 0]),
    SUN_RGB : ROT.Color.toRGB([255, 255, 153]),
    MOON_RGB : ROT.Color.toRGB([102, 102, 153]),

    SNAKE_RGB : ROT.Color.toRGB([51, 255, 51]),
    SNAKE_HIT_RGB : ROT.Color.toRGB([255, 153, 51]),

    BLUE_MON_RGB : ROT.Color.toRGB([51, 51, 153]),
    GREEN_MON_RGB : ROT.Color.toRGB([51, 153,0]),
    YELLOW_MON_RGB : ROT.Color.toRGB([255, 255, 0]),
    ICE_GOLEM_RGB : ROT.Color.toRGB([255, 255, 255]),
    STONE_GOLEM_RGB : ROT.Color.toRGB([153, 153, 153]),

    RED_CORPSE_RGB : ROT.Color.toRGB([153, 0, 51]),
    GREEN_CORPSE_RGB : ROT.Color.toRGB([0, 102, 51]),

    DISPLAY_WIDTH : 80,
    DISPLAY_HEIGHT : 40,
 
    MAP_WIDTH : 80,
    MAP_HEIGHT : 30,
    DUNGEON_LEVELS : 10,

    ROOM_MAX_SIZE : 10,
    ROOM_MIN_SIZE : 6,
    MAX_ROOMS : 30,
    MAX_ROOM_MONSTERS : 3,

    START_SEGMENTS : 5,
    START_HEALTH : 10,
    START_MANA : 10,

    FOV_ALGO : 0,
    SNAKE_FOV_RADIUS : 15,
    MON_FOV_RADIUS : 10,
    
    FPS_RATE : 10, 
    FPS_LIMIT : 20, 

    LOWER_CASE_DMG : 1,
    LOWER_CASE_CRIT_DMG : 2,
    UPPER_CASE_DMG : 2,
    UPPER_CASE_CRIT_DMG : 3
    };



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
/*    floorCache : Object.create(rSNAKE.map.protoFloor),
    mapSelf : function (x, y) {
        map[self.x][self.y] = this.floorCache;
        this.floorCache = map[x][y];
        map[x][y] = this;
        },
*/    };