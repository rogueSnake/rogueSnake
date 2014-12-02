
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