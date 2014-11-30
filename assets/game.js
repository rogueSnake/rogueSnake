// rogueSnake requires ROT.js, which ensures access to Object.create().

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

rSNAKE.proto.wall = {
    mappable : true,
    blocksView : true,
    blocksMove : true,
    explored : false,
    fov : false,
    tile : " ",
    fg_color : rSNAKE.CON.LIGHT_FLOOR_RGB,
    bg_color : rSNAKE.CON.LIGHT_WALL_RGB
    };

rSNAKE.proto.floor = {
    mappable : true,
    blocksView : false,
    blocksMove : false,
    explored : false,
    fov : false,
    tile : ".",
    fg_color : rSNAKE.CON.LIGHT_WALL_RGB,
    bg_color : rSNAKE.CON.LIGHT_FLOOR_RGB
    };

// I use "dude" as a gender-neutral pronoun. rogueSnake happens to be male, and
// golems are genderless, but I would assume the rest of the monsters are a mix
// of genders. dude gets the functions and values for all of these, obviously.
rSNAKE.proto.dude = {
    x : rSNAKE.CON.DISPLAY_WIDTH + 1,  // Initialize object positions off map. 
    y : rSNAKE.CON.DISPLAY_HEIGHT + 1,        
    mappable : true,
    blocksView : false,
    blocksMove : true,
    bg_color : rSNAKE.CON.LIGHT_FLOOR_RGB,
    floorCache : Object.create(rSNAKE.proto.floor),
    mapSelf : function (x, y) {
        map[this.x][this.y] = this.floorCache;
        this.floorCache = map[x][y];
        map[x][y] = this;

        rSNAKE.map.set(x, y, this.x, this.y, this.tile, this.fg_color, 
                this.bg_color);
        },
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
    floorCache : Object.create(rSNAKE.proto.floor),
    mapSelf : function (x, y) {
        map[self.x][self.y] = this.floorCache;
        this.floorCache = map[x][y];
        map[x][y] = this;
        },
    };

rSNAKE.map = {
    dungeonLevel : 0, // When map.new first runs it will set this to 1.
    cache : [],    


    x : rSNAKE.CON.DISPLAY_WIDTH + 1,   
    y : rSNAKE.CON.DISPLAY_HEIGHT + 1, 


    level0 : {}, 
    level1 : {}, 
    level2 : {}, 
    level3 : {},
    level4 : {},
    level5 : {},
    level6 : {},
    level7 : {},
    level8 : {},
    level9 : {},
    level10 : {},
    level11 : {},
    level12 : {},

    set : function (newX, newY, oldX, oldY, tile, fg_color, bg_color) {

        if (!!rSNAKE.map.cache[oldX] === true) { // !! casts to bool, we're 
            rSNAKE.map.cache[oldX][oldY] =       // making sure that oldX is on
                    rSNAKE.map.cache[oldX][oldY].floorCache || 
                    Object.create(rSNAKE.proto.floor); // grid (not -1).
            }

        rSNAKE.map.cache[newX][newY].floorCache = rSNAKE.map.cache[newX, newY];
        rSNAKE.map.cache[newX][newY] = {
            tile : tile,
            fg_color : fg_color,
            bg_color : bg_color,
            };
        },

    generate : function () {

        // It might be better to handle level advancement separately and have
        // the game call map.downStairs right before checking to see if it 
        // should call map.new, but I'll leave this in for now:
        rSNAKE.map["level" + rSNAKE.map.dungeonLevel].cache = rSNAKE.map.cache;
        rSNAKE.map.dungeonLevel += 1;
        rSNAKE.map.cache = [];
        rSNAKE.map.rooms = [];

        // Fill the map up with walls. We'll carve them into a dungeon shortly.
        for (var x = 0; x < rSNAKE.CON.MAP_WIDTH; x += 1) {
            rSNAKE.map.cache.push([]);

            for (var y = 0; y < rSNAKE.CON.MAP_HEIGHT; y += 1) {
                rSNAKE.map.cache[x].push(Object.create(rSNAKE.proto.wall));
                }
            }
        /*
        Okay. The following code block is supposed to be a dungeon generator.
        It makes random rectangles within certain perameters, makes sure they
        don't overlap with previously generated rectangles, and makes new
        objects for each spot in the matrixy-dude map[x][y] 
        At least, it should. Currently it makes a single room. Sometimes that
        room bleeds over the right side of the map, and I suspect it would also
        bleed over the bottom of the map (but not into the rest of the display)
        for obvious reasons. Neither case happens  too frequently, and I've 
        only witnessed the one.
        */
    
        for (i = 0; i < rSNAKE.CON.MAX_ROOMS; i += 1) {    
            w = ROT.RNG.getUniformInt(rSNAKE.CON.ROOM_MIN_SIZE, 
                    rSNAKE.CON.ROOM_MAX_SIZE);
            h = ROT.RNG.getUniformInt(rSNAKE.CON.ROOM_MIN_SIZE, 
                    rSNAKE.CON.ROOM_MAX_SIZE);
            x = ROT.RNG.getUniformInt(1, rSNAKE.CON.MAP_WIDTH - w - 1);
            y = ROT.RNG.getUniformInt(1, rSNAKE.CON.MAP_HEIGHT - h - 1);
            collides = false;

            for (j = 0; j < i; j+= 1) {

                if (i !== 0) {

                    if (x <= rSNAKE.map.rooms[j].x && x + w >= 
                                rSNAKE.map.rooms[j].x + rSNAKE.map.rooms[j].w) {
                        collides = true;
                        }

                    else if (y <= rSNAKE.map.rooms[j].y && y + h >= rSNAKE.map.rooms[j].y + 
                                rSNAKE.map.rooms[j].h) {
                        collides = true;
                        }
                    }
                } 

            if (collides !== true) {
                rSNAKE.map.rooms.push({
                    "x" : x,
                    "y" : y,
                    "w" : w,
                    "h" : h
                    });

                for (k = x; k <= x + w; k += 1){

                    for (l = y; l <= y + h; l += 1){
                        rSNAKE.map.cache[k][l] = 
                                Object.create(rSNAKE.proto.floor);
                        }
                    }
                }
            if (i === 0) {


                // This is supposed to establish the existance the off-map 
                // square that objects get initialized in. 
                rSNAKE.map.cache[rSNAKE.CON.DISPLAY_WIDTH + 1] = [];   
                        rSNAKE.map.cache[rSNAKE.CON.DISPLAY_WIDTH + 
                        1][rSNAKE.CON.DISPLAY_HEIGHT + 1] = 
                        Object.create(rSNAKE.proto.floor);


                rSNAKE.player.slither(Math.floor(((rSNAKE.map.rooms[0].x * 2) + 
                        rSNAKE.map.rooms[0].w) / 2), 
                        Math.floor(((rSNAKE.map.rooms[0].y * 2) + 
                        rSNAKE.map.rooms[0].h) / 2))

                rSNAKE.player.x = Math.floor(((rSNAKE.map.rooms[0].x * 2) + 
                        rSNAKE.map.rooms[0].w) / 2)
                rSNAKE.player.y = Math.floor(((rSNAKE.map.rooms[0].y * 2) + 
                        rSNAKE.map.rooms[0].h) / 2)
                }

            rSNAKE.map.sketch();
            // ^^^^^ This line is what makes the screen load purple instead of 
            // ^^^^^ black.
            }
        },

    sketch : function () {

        for (i = 0; i < rSNAKE.CON.MAP_WIDTH; i += 1) { 

            for (j = 0; j < rSNAKE.CON.MAP_HEIGHT; j += 1) {
                rSNAKE.game.display.draw(i, j, rSNAKE.map.cache[i][j].tile,
                        rSNAKE.map.cache[i][j].fg_color, 
                        rSNAKE.map.cache[i][j].bg_color);
                }
            }
        },

    downStairs : function () {
        rSNAKE.map["level" + dungeonLevel].cache = rSNAKE.map.cache;
        rSNAKE.map.dungeonLevel += 1;
        },

    upStairs : function () {
        rSNAKE.map["level" + dungeonLevel].cache = rSNAKE.map.cache;
        rSNAKE.map.dungeonLevel -= 1;
        }
    };


rSNAKE.player = Object.create(rSNAKE.proto.dude);

rSNAKE.player.hp = 5;
rSNAKE.player.mp = 5;
rSNAKE.player.tile = "@";
rSNAKE.player.fg_color = rSNAKE.CON.SNAKE_RGB;
rSNAKE.player.seg = [];

for (loop = 0; loop < rSNAKE.CON.START_SEGMENTS; loop += 1) {
    rSNAKE.player.seg[loop] = Object.create(rSNAKE.proto.dude);
    rSNAKE.player.seg[loop].tile = "O";

    if (loop === 0) {
        rSNAKE.player.seg[loop].tile = "@";
        }
    rSNAKE.player.seg[loop].fg_color = rSNAKE.CON.SNAKE_RGB;
    }


rSNAKE.player.slither = function (a, b) { // a and b are x and y coordinates,
                                         // I'm trying to avoid confusion.
/*
Tucking fired. The below commented out lines are probably the key to getting
rSNAKE.player.slither to work, but uncommenting them currently breaks the 
the function entirely. The firefox console says that rSNAKE.map.cache[newX,
newY] is undefined. I'm sure I can track the thing down and kill it, but not
tonight.
*/
    rSNAKE.player.x = a;
    rSNAKE.player.y = b;
    rSNAKE.player.seg[0].x = rSNAKE.player.x; // Segment 0 is the player's head.
    rSNAKE.player.seg[0].y = rSNAKE.player.y;
    rSNAKE.player.seg[0].floorCache = rSNAKE.player.floorCache;
    rSNAKE.map.set(a, b, rSNAKE.player.x, rSNAKE.player.y, rSNAKE.player.tile, 
            rSNAKE.player.fg_color, rSNAKE.player.bg_color);

//    rSNAKE.player.seg[rSNAKE.player.seg.length + 1] = 

    for (e = rSNAKE.player.seg.length - 1; e > 0; e -= 1) {

        if (e === 0) {
            rSNAKE.player.seg[e].x = rSNAKE.player.x;
            rSNAKE.player.seg[e].y = rSNAKE.player.y;
            }

        else if (e > 0) {
            rSNAKE.player.seg[e].x = rSNAKE.player.seg[e - 1].x;
            rSNAKE.player.seg[e].y = rSNAKE.player.seg[e - 1].y;
            }

        if (rSNAKE.player.seg[e].x <= rSNAKE.CON.MAP_WIDTH) {
            rSNAKE.map.set(rSNAKE.player.seg[e].x, rSNAKE.player.seg[e].y, 
                    rSNAKE.player.seg[e + 1].x, rSNAKE.player.seg[e + 1].y, 
                    rSNAKE.player.seg[e].tile, rSNAKE.player.seg[e].fg_color, 
                    rSNAKE.player.seg[e].bg_color);
            }
        }
    };

rSNAKE.game = {
    output : {},
    display : null,
    engine : null,
    playerActor : null,
    monsterActor : null,
    scheduler : null,
    testText : "a sailor went to sea."
    };

 // Attempting to make engine a nonglobal variable crashes the code; don't know
 // why. Check the ROT.js documentation? It would suck if ROT.js requires a 
 // global variable called "engine".
var engine = null;

rSNAKE.game.start = function() {
    rSNAKE.game.display = new ROT.Display({width:rSNAKE.CON.DISPLAY_WIDTH, 
            height:rSNAKE.CON.DISPLAY_HEIGHT});
    document.body.appendChild(rSNAKE.game.display.getContainer());
    
    rSNAKE.map.generate();
                    
    var scheduler = new ROT.Scheduler.Simple();
    scheduler.add(rSNAKE.game.playerActor, true);
    scheduler.add(rSNAKE.game.monsterActor,true);

    engine = new ROT.Engine(scheduler);
    engine.start();

    rSNAKE.game.display.drawText(0, 0, testText)                  ;
    };

// Time to actually start the game, if we can.
window.onload = function() {

    if (!ROT.isSupported()) {
        alert("Your browser is too shitty to play rogueSnake.");
        } 

    else {
    	rSNAKE.game.start();
//        rSNAKE.map.sketch();
        }
    };