export default class WildlingStateModificationService {

    static updateWildlingCount(currentCount: number, increment: number): number {
        if (currentCount + increment >= 12) {
            return 12;
        } else {
            return currentCount + increment;
        }
    }
}