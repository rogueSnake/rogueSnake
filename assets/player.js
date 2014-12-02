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
    floorCache : Object.create(rSNAKE.map.protoFloor),
    mapSelf : function (x, y) {
        map[this.x][this.y] = this.floorCache;
        this.floorCache = map[x][y];
        map[x][y] = this;

        rSNAKE.map.set(x, y, this.x, this.y, this.tile, this.fg_color, 
                this.bg_color);
        },
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