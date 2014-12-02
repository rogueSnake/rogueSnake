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
                    Object.create(rSNAKE.map.protoFloor); // grid (not -1).
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
                rSNAKE.map.cache[x].push(Object.create(rSNAKE.map.protoWall));
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
                                Object.create(rSNAKE.map.protoFloor);
                        }
                    }
                }
            if (i === 0) {


                // This is supposed to establish the existance the off-map 
                // square that objects get initialized in. 
                rSNAKE.map.cache[rSNAKE.CON.DISPLAY_WIDTH + 1] = [];   
                        rSNAKE.map.cache[rSNAKE.CON.DISPLAY_WIDTH + 
                        1][rSNAKE.CON.DISPLAY_HEIGHT + 1] = 
                        Object.create(rSNAKE.map.protoFloor);


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


rSNAKE.map.protoWall = {
    mappable : true,
    blocksView : true,
    blocksMove : true,
    explored : false,
    fov : false,
    tile : " ",
    fg_color : rSNAKE.CON.LIGHT_FLOOR_RGB,
    bg_color : rSNAKE.CON.LIGHT_WALL_RGB
    };


rSNAKE.map.protoFloor = {
    mappable : true,
    blocksView : false,
    blocksMove : false,
    explored : false,
    fov : false,
    tile : ".",
    fg_color : rSNAKE.CON.LIGHT_WALL_RGB,
    bg_color : rSNAKE.CON.LIGHT_FLOOR_RGB
    };
