import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import Renderer from '../../../utils/renderer';
import EstablishControlModalFactory from '../march/establishControlModal';
import SplitArmyModalFactory from '../march/splitArmyModal';
import AssetLoader from '../../../utils/assetLoader';
import FightModal from '../march/combatModal';
import {ActionFactory, Area, AreaKey, GameLogic, GamePhase, State, StateSelectorService} from 'got-store';

export default class OrderTokenRenderer {

  private renderer: Renderer;

  public init(gameLogic: GameLogic, renderer: Renderer) {
    this.renderer = renderer;
    this.renderPlaceHolderForOrderToken(gameLogic.getState());
    this.renderPlacedOrderTokens(gameLogic);
    gameLogic.subscribe(() => {
      this.renderPlaceHolderForOrderToken(gameLogic.getState());
      this.renderPlacedOrderTokens(gameLogic);
    });
  }

  private renderPlaceHolderForOrderToken(state: State) {
    this.renderer.areasToPlaceToken.removeChildren();
    if (state.gamePhase === GamePhase.PLANNING) {
      AssetLoader.getAreaTokens()
        .filter(areaToken => StateSelectorService.isAllowedToPlaceOrderToken(state, state.localPlayersHouse, areaToken.name))
        .forEach(areaToken => this.renderer.addSprite(areaToken.name, AssetLoader.ORDER_TOKENS_FRONT, this.renderer.convertHouseToNumber(state.localPlayersHouse), this.renderer.areasToPlaceToken));
    }
  }

  private renderPlacedOrderTokens(gameLog: GameLogic) {
    const state = gameLog.getState();
    this.renderer.placedTokens.removeChildren();
    if (state.gamePhase === GamePhase.PLANNING) {
      Array.from(state.areas.values())
        .filter((area: Area) => area.orderToken !== null)
        .map((sourceArea: Area) => {
          if (sourceArea.controllingHouse === state.localPlayersHouse) {
            this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
          }
          else {
            this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS_FRONT, this.renderer.convertHouseToNumber(sourceArea.controllingHouse), this.renderer.placedTokens);
          }
        });
    }
    else if (state.gamePhase === GamePhase.ACTION_RAID || state.gamePhase === GamePhase.ACTION_MARCH) {
      Array.from(state.areas.values())
        .filter((area: Area) => area.orderToken !== null)
        .map((sourceArea: Area) => {
          if (sourceArea.controllingHouse === state.localPlayersHouse) {
            let placedToken: Phaser.Sprite = this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
            placedToken.inputEnabled = true;
            if (sourceArea.orderToken.isMoveToken()) {
              this.onInputDownForMoveToken(gameLog, placedToken, sourceArea);
            }
            if (sourceArea.orderToken.isRaidToken()) {
              this.onInputDownForRaidToken(gameLog, placedToken, sourceArea.key);
            }
          } else {
            this.renderer.addSprite(sourceArea.key, AssetLoader.ORDER_TOKENS, sourceArea.orderToken.getType(), this.renderer.placedTokens);
          }
        });
    }
  }

  private highlightValidAreasToExecuteOrderToken(areasAllowedToExecuteOrder: Array<AreaKey>, onInputDownFunction: Function) {
    this.renderer.validAreasToExecuteOrderToken.removeChildren();
    AssetLoader.getAreaNames()
      .filter(area => areasAllowedToExecuteOrder.filter(border => border === area.name).length > 0)
      .forEach(area => {
        this.renderer.drawRectangleAroundAreaName(area.name, 0x0000FF, () => {
          onInputDownFunction(area.name);
        }, this.renderer.validAreasToExecuteOrderToken);
      });
  }

  private highlightAreaNameToSkipOrder(gameLogic: GameLogic, sprite: Phaser.Sprite, areaKey: AreaKey) {
    let skipOrderFn = () => {
      gameLogic.execute(ActionFactory.skipOrder(areaKey));
      this.renderer.removeSelectedToken();
    };
    this.renderer.drawRectangleAroundAreaName(areaKey, 0xFF0000, skipOrderFn, this.renderer.validAreasToExecuteOrderToken);
  }

  private onInputDownForMoveToken(logic: GameLogic, placedToken: Phaser.Sprite, sourceArea: Area) {
    placedToken.events.onInputDown.add((sprite) => {
      const currentHouse = logic.getState().currentHouse;
      let moveUnitFunction = (targetAreaKey) => {
        // splitArmy
        let targetArea = StateSelectorService.getAreaByKey(logic.getState(), targetAreaKey);
        if (sourceArea.units.length > 1 && (targetArea === null || targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse || (targetArea.controllingHouse !== currentHouse && targetArea.units.length === 0))) {
          let modal = new SplitArmyModalFactory(logic, this.renderer, sourceArea, targetAreaKey, () => {
            this.renderer.removeSelectedToken();
          });
          modal.show();
        }
        // establish Control
        if (sourceArea.units.length === 1 && StateSelectorService.getPlayerByHouse(logic.getState(), currentHouse).powerToken > 0 && (targetArea === null || targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse)) {

          let establishControlModal = new EstablishControlModalFactory(logic, this.renderer, sourceArea, targetAreaKey, () => {
            this.renderer.removeSelectedToken();
          });
          establishControlModal.show();
        }
        // fight
        let onCloseFn = () => {
          this.renderer.removeSelectedToken();
        };
        if (targetArea && targetArea.controllingHouse !== currentHouse && targetArea.units.length > 0) {
          let modal = new FightModal(logic, this.renderer, sourceArea, targetArea, onCloseFn);
          modal.show();
        }
      };
      let areasAllowedToExecuteOrder: Array<AreaKey> = StateSelectorService.getAllAreasAllowedToMarchTo(logic.getState(), sourceArea, logic.getState().localPlayersHouse);
      if (logic.getState().gamePhase === GamePhase.ACTION_MARCH) {
        this.highlightDuringActionPhase(logic, sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder);
      }
    });
  }

  private onInputDownForRaidToken(gameLogic: GameLogic, placedToken: Phaser.Sprite, areaKey: AreaKey) {
    placedToken.events.onInputDown.add((sprite) => {

      let raidAreaFunction = (targetAreaKey) => {
        gameLogic.execute(ActionFactory.executeRaidOrder(areaKey, targetAreaKey));
        this.renderer.removeSelectedToken();
      };
      let areaToPlaceToken = StateSelectorService.getAreaByKey(gameLogic.getState(), areaKey);
      let areasAllowedToExecuteOrder: Array<Area> = Array.from(gameLogic.getState().areas.values())
        .filter((area: Area) => {
          return StateSelectorService.isAllowedToRaid(areaToPlaceToken, area);
        });
      if (gameLogic.getState().gamePhase === GamePhase.ACTION_RAID) {
        this.highlightDuringActionPhase(gameLogic, sprite, areaKey, raidAreaFunction, areasAllowedToExecuteOrder);
      }
    });
  }

  private highlightDuringActionPhase(gameLogic: GameLogic, sprite: Phaser.Sprite, areaKey: AreaKey, onInputDownFunction, areasAllowdToExecuteOrder) {
    this.renderer.highlightToken(areaKey);
    this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
    this.highlightAreaNameToSkipOrder(gameLogic, sprite, areaKey);

  }
}
