import {AreaKey} from '../../../../src/logic/board/areaKey';
import CombatResult from '../../../../src/logic/march/combatResult';
import {TSMap} from 'typescript-map';
import {House} from '../../../../src/logic/board/house';
import {UnitType} from '../../../../src/logic/units/unitType';
import Player from '../../../../src/logic/board/player';
import {gameStore} from '../../../../src/logic/board/gameState/reducer';
import {Area} from '../../../../src/logic/board/area';
import AreaBuilder from '../../../areaBuilder';
import {loadGame, resolveFight} from '../../../../src/logic/board/gameState/actions';

describe('resolveFight', () => {
    it('should eliminate defenders army and establish control over attacking area if attacker wins', () => {
        // given
        const attackingArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Horse]).build();
        const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withUnits([UnitType.Footman]).build();
        const playerStark = new Player(House.stark, 5);
        const players = [playerStark, new Player(House.lannister, 5)];
        const ironThroneSuccession = [House.lannister, House.stark];
        const areas = new TSMap<AreaKey, Area>();
        areas.set(AreaKey.Winterfell, attackingArea);
        areas.set(AreaKey.WhiteHarbor, defendingArea);

        const gameStoreState = {
            areas: areas,
            players,
            ironThroneSuccession,
            currentHouse: House.stark
        };
        gameStore.dispatch(loadGame(gameStoreState));
        const combatResult = new CombatResult(attackingArea, defendingArea, 2, 1);

        // when
        gameStore.dispatch(resolveFight(combatResult));

        const currenState = gameStore.getState();
        const newDefendingArea = currenState.areas.get(defendingArea.key);
        const newAttackingArea = currenState.areas.get(attackingArea.key);
        // then
        expect(newDefendingArea.controllingHouse).toBe(House.stark);
        expect(newDefendingArea.orderToken).toBeNull();
        expect(newAttackingArea.controllingHouse).toBe(House.stark);
        expect(newAttackingArea.orderToken).toBeNull();
        expect(newAttackingArea.units.length).toBe(0);
    });
    it('it should elimite attackers army, remove its control over attacking area and remove order Token if defender wins', () => {
        // given
        const attackingArea = new AreaBuilder(AreaKey.Winterfell).withHouse(House.stark).withUnits([UnitType.Footman]).build();
        const defendingArea = new AreaBuilder(AreaKey.WhiteHarbor).withHouse(House.lannister).withUnits([UnitType.Horse]).build();
        const combatResult = new CombatResult(attackingArea, defendingArea, 1, 2);
        const areas: TSMap<AreaKey, Area> = new TSMap<AreaKey, Area>();
        areas.set(attackingArea.key, attackingArea);
        areas.set(defendingArea.key, defendingArea);

        const state = {areas};

        gameStore.dispatch(loadGame(state));

        // when
        gameStore.dispatch(resolveFight(combatResult));
        const newState = gameStore.getState();
        // then
        const updatedAttackingArea = newState.areas.get(attackingArea.key);
        const updatedDefendingArea = newState.areas.get(defendingArea.key);
        expect(updatedAttackingArea.units.length).toBe(0);
        expect(updatedAttackingArea.orderToken).toBeNull();
        expect(updatedAttackingArea.controllingHouse).toBeNull();
        expect(updatedDefendingArea.units.length).toBe(1);

    });
});
