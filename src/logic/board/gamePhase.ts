enum GamePhase {
    //  WESTEROS1,
    //  WESTEROS2,
    //  WESTEROS3,
    PLANNING,
    ACTION_RAID,
    ACTION_MARCH,
    ACTION_CLEANUP
}

let ACTION_PHASES = new Array(GamePhase.ACTION_RAID,
    GamePhase.ACTION_MARCH,
    GamePhase.ACTION_CLEANUP);


let WESTEROS_PHASES = new Array(
    /*GamePhase.WESTEROS1,
    GamePhase.WESTEROS2,
     GamePhase.WESTEROS3*/);

let ALL_PHASES = new Array(
    /*GamePhase.WESTEROS1,
     GamePhase.WESTEROS2,
     GamePhase.WESTEROS3*/
    GamePhase.PLANNING,
    GamePhase.ACTION_RAID,
    GamePhase.ACTION_MARCH,
    GamePhase.ACTION_CLEANUP);

export {WESTEROS_PHASES, ACTION_PHASES, ALL_PHASES, GamePhase};