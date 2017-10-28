import GameRules from './gameRules';
export default class WildlingRules {

    public static increaseWildlings(wildling: number) {
        if (GameRules.gameState.wildlingsCount + wildling >= 12) {
            GameRules.gameState.wildlingsCount = 12;
        } else {
            GameRules.gameState.wildlingsCount += wildling;

        }
    }
}