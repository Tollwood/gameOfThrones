import * as Phaser from 'phaser-ce/build/custom/phaser-split';

import Renderer from '../../../utils/renderer';
import EstablishControlModalFactory from '../march/establishControlModal';
import SplitArmyModalFactory from '../march/splitArmyModal';
import AssetLoader from '../../../utils/assetLoader';
import FightModal from '../march/combatModal';
import {ActionFactory, Area, AreaKey, GamePhase, GameStoreState, StateSelectorService} from 'got-store';
import {Store} from 'redux';

export default class OrderTokenRenderer {

  private renderer: Renderer;

  public init(store: Store<GameStoreState>, renderer: Renderer) {
    this.renderer = renderer;
    store.subscribe(() => {
      this.renderPlaceHolderForOrderToken(store.getState());
      this.renderPlacedOrderTokens(store);
    });
  }

  private renderPlaceHolderForOrderToken(state: GameStoreState) {
    this.renderer.areasToPlaceToken.removeChildren();
    if (state.gamePhase === GamePhase.PLANNING) {
      AssetLoader.getAreaTokens()
        .filter(areaToken => StateSelectorService.isAllowedToPlaceOrderToken(state, state.localPlayersHouse, areaToken.name))
        .forEach(areaToken => this.renderer.addSprite(areaToken.name, AssetLoader.ORDER_TOKENS_FRONT, this.renderer.convertHouseToNumber(state.localPlayersHouse), this.renderer.areasToPlaceToken));
    }
  }

  private renderPlacedOrderTokens(store: Store<GameStoreState>) {
    const state = store.getState();
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
              this.onInputDownForMoveToken(store, placedToken, sourceArea);
            }
            if (sourceArea.orderToken.isRaidToken()) {
              this.onInputDownForRaidToken(store, placedToken, sourceArea.key);
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

  private highlightAreaNameToSkipOrder(store: Store<GameStoreState>, sprite: Phaser.Sprite, areaKey: AreaKey) {
    let skipOrderFn = () => {
      store.dispatch(ActionFactory.skipOrder(areaKey));
      this.renderer.removeSelectedToken();
    };
    this.renderer.drawRectangleAroundAreaName(areaKey, 0xFF0000, skipOrderFn, this.renderer.validAreasToExecuteOrderToken);
  }

  private onInputDownForMoveToken(store: Store<GameStoreState>, placedToken: Phaser.Sprite, sourceArea: Area) {
    placedToken.events.onInputDown.add((sprite) => {
      const currentHouse = store.getState().currentHouse;
      let moveUnitFunction = (targetAreaKey) => {
        // splitArmy
        let targetArea = StateSelectorService.getAreaByKey(store.getState(), targetAreaKey);
        if (sourceArea.units.length > 1 && (targetArea === null || targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse || (targetArea.controllingHouse !== currentHouse && targetArea.units.length === 0))) {
          let modal = new SplitArmyModalFactory(store, this.renderer, sourceArea, targetAreaKey, () => {
            this.renderer.removeSelectedToken();
          });
          modal.show();
        }
        // establish Control
        if (sourceArea.units.length === 1 && StateSelectorService.getPlayerByHouse(store.getState(), currentHouse).powerToken > 0 && (targetArea === null || targetArea.controllingHouse === null || targetArea.controllingHouse === currentHouse)) {

          let establishControlModal = new EstablishControlModalFactory(store, this.renderer, sourceArea, targetAreaKey, () => {
            this.renderer.removeSelectedToken();
          });
          establishControlModal.show();
        }
        // fight
        let onCloseFn = () => {
          this.renderer.removeSelectedToken();
        };
        if (targetArea && targetArea.controllingHouse !== currentHouse && targetArea.units.length > 0) {
          let modal = new FightModal(this.renderer, sourceArea, targetArea, onCloseFn);
          modal.show();
        }
      };
      let areasAllowedToExecuteOrder: Array<AreaKey> = StateSelectorService.getAllAreasAllowedToMarchTo(store.getState(), sourceArea);
      if (store.getState().gamePhase === GamePhase.ACTION_MARCH) {
        this.highlightDuringActionPhase(store, sprite, sourceArea.key, moveUnitFunction, areasAllowedToExecuteOrder);
      }
    });
  }

  private onInputDownForRaidToken(store: Store<GameStoreState>, placedToken: Phaser.Sprite, areaKey: AreaKey) {
    placedToken.events.onInputDown.add((sprite) => {

      let raidAreaFunction = (targetAreaKey) => {
        store.dispatch(ActionFactory.executeRaidOrder(areaKey, targetAreaKey));
        this.renderer.removeSelectedToken();
      };
      let areaToPlaceToken = StateSelectorService.getAreaByKey(store.getState(), areaKey);
      let areasAllowedToExecuteOrder: Array<Area> = Array.from(store.getState().areas.values())
        .filter((area) => {
          return StateSelectorService.isAllowedToRaid(areaToPlaceToken, area);
        });
      if (store.getState().gamePhase === GamePhase.ACTION_RAID) {
        this.highlightDuringActionPhase(store, sprite, areaKey, raidAreaFunction, areasAllowedToExecuteOrder);
      }
    });
  }

  private highlightDuringActionPhase(store: Store<GameStoreState>, sprite: Phaser.Sprite, areaKey: AreaKey, onInputDownFunction, areasAllowdToExecuteOrder) {
    this.renderer.highlightToken(areaKey);
    this.highlightValidAreasToExecuteOrderToken(areasAllowdToExecuteOrder, onInputDownFunction);
    this.highlightAreaNameToSkipOrder(store, sprite, areaKey);

  }
}
