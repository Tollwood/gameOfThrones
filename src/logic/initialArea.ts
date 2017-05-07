import {Area} from './area';
import {Unit, UnitType} from './units';
import {House} from './house';

export class AreaInitiator {

    public static getInitalState(): Array<Area> {
        let areas: Array<Area> = new Array();
        areas.push(new Area('CastleBlack', 1, false, false, false, 0));
        areas.push(new Area('Karhold', 1, false, false, false, 0));
        areas.push(new Area('TheShiveringSea', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.stark)]));
        areas.push(new Area('BayOfIce', 0, false, false, false, 0));
        areas.push(new Area('Winterfell', 1, true, false, true, 1, [new Unit(UnitType.Horse, House.stark), new Unit(UnitType.Footman, House.stark)]));
        areas.push(new Area('TheStonyShore', 1, false, false, false, 1));
        areas.push(new Area('WhiteHarbor', 0, true, true, false, 0, [new Unit(UnitType.Footman, House.stark)]));
        areas.push(new Area('WidowsWatch', 0, false, false, false, 1, []));
        areas.push(new Area('FlintsFinger', 0, false, true, false, 0, []));

        areas.push(new Area('Pyke', 1, true, false, true, 1, [new Unit(UnitType.Footman, House.greyjoy), new Unit(UnitType.Horse, House.greyjoy)]));
        areas.push(new Area('GrayWaterWatch', 0, false, false, false, 1, [new Unit(UnitType.Footman, House.greyjoy)]));
        areas.push(new Area('IronmansBay', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.greyjoy), new Unit(UnitType.Ship, House.greyjoy)]));
        areas.push(new Area('TheNarrowSea', 0, false, false, false, 0, []));
        areas.push(new Area('MoatCailin', 0, false, true, false, 0, []));
        areas.push(new Area('Seagard', 1, false, false, true, 1, []));
        areas.push(new Area('TheTwins', 1, false, false, false, 0, []));

        areas.push(new Area('TheFingers', 0, false, false, false, 1, []));
        areas.push(new Area('TheEyrie', 1, false, true, false, 1, []));
        areas.push(new Area('SunsetSea', 0, false, false, false, 0, []));
        areas.push(new Area('Lannisport', 0, true, false, true, 2, [new Unit(UnitType.Footman, House.lannister), new Unit(UnitType.Horse, House.lannister)]));
        areas.push(new Area('TheGoldenSound', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.lannister)]));
        areas.push(new Area('StoneySept', 1, false, false, false, 0, [new Unit(UnitType.Ship, House.lannister)]));
        areas.push(new Area('Riverrun', 1, false, false, true, 1, []));
        areas.push(new Area('TheMountainOfTheMoon', 0, false, false, false, 1, []));
        areas.push(new Area('Harrenhal', 1, false, true, false, 0, []));
        areas.push(new Area('CraicklawPoint', 0, false, true, false, 0, []));
        areas.push(new Area('BlackwaterBay', 0, false, false, false, 0, []));
        areas.push(new Area('Dragonstone', 1, true, false, true, 1, [new Unit(UnitType.Footman, House.baratheon), new Unit(UnitType.Horse, House.baratheon)]));
        areas.push(new Area('ShipbreakerBay', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.baratheon), new Unit(UnitType.Ship, House.baratheon)]));
        areas.push(new Area('Kingswood', 1, false, false, false, 1, [new Unit(UnitType.Footman, House.baratheon)]));
        areas.push(new Area('KingsLanding', 2, false, false, false, 0, []));
        areas.push(new Area('Blackwater', 0, false, false, false, 2, []));
        areas.push(new Area('SearoadMarches', 0, false, false, false, 1, []));
        areas.push(new Area('Highgarden', 0, false, false, true, 2, [new Unit(UnitType.Footman, House.tyrell), new Unit(UnitType.Horse, House.tyrell)]));
        areas.push(new Area('DornishMarches', 1, false, false, false, 0, [new Unit(UnitType.Footman, House.tyrell)]));
        areas.push(new Area('RedwyneStraights', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.tyrell)]));
        areas.push(new Area('StormsEnd', 0, true, true, false, 0, []));
        areas.push(new Area('TheBoneway', 1, false, false, false, 0, []));
        areas.push(new Area('Oldtown', 0, true, false, true, 0, []));
        areas.push(new Area('ThreeTowers', 0, false, false, false, 1, []));
        areas.push(new Area('PrincesPass', 1, false, false, false, 1, []));
        areas.push(new Area('Yornwood', 0, false, true, false, 0, []));
        areas.push(new Area('Sunspear', 1, true, false, true, 1, [new Unit(UnitType.Footman, House.martell), new Unit(UnitType.Horse, House.martell)]));
        areas.push(new Area('SaltShore', 0, false, false, false, 1, [new Unit(UnitType.Footman, House.martell)]));
        areas.push(new Area('SeaOfDorne', 0, false, false, false, 0, [new Unit(UnitType.Ship, House.martell)]));
        areas.push(new Area('Starfall', 0, false, true, false, 1, []));
        areas.push(new Area('TheArbor', 1, false, false, false, 0, []));
        areas.push(new Area('WestSummerSea', 0, false, false, false, 0, []));
        areas.push(new Area('EastSummerSea', 0, false, false, false, 0, []));
        areas.push(new Area('TheReach', 0, false, true, false, 0, []));
        return areas;
    }
}


/*

 castleBlack.borders.push(theShiveringSea, karhold, winterfell, bayOfIce);
 karhold.borders.push(theShiveringSea, winterfell);
 theShiveringSea.borders.push(castleBlack, karhold, winterfell, whiteHarbor, widowsWatch, theNarrowSea);
 bayOfIce.borders.push(sunsetSea, theStonyShore, winterfell, castleBlack);
 winterfell.borders.push(castleBlack, karhold, whiteHarbor, theShiveringSea, moatCalin, theStonyShore, bayOfIce);
 theStonyShore.borders.push(winterfell, bayOfIce);
 whiteHarbor.borders.push(theShiveringSea, widowsWatch, theNarrowSea, moatCalin, winterfell);
 widowsWatch.borders.push(whiteHarbor, theShiveringSea, theNarrowSea);
 theNarrowSea.borders.push(theShiveringSea, widowsWatch, whiteHarbor, moatCalin, theTwins, theFingers, theMountainsOfTheMoon, theEyrie, cracklawPoint, shipbreakerBay);
 moatCalin.borders.push(whiteHarbor, theNarrowSea, theTwins, seagard, greywaterWatch);
 greywaterWatch.borders.push(moatCalin, seagard, ironmansBay, flintsFinger, bayOfIce);
 flintsFinger.borders.push(bayOfIce, sunsetSea, ironmansBay, greywaterWatch);
 sunsetSea.borders.push();
 ironmansBay.borders.push();
 pyke.borders.push();
 seagard.borders.push();
 theTwins.borders.push();
 theFingers.borders.push();
 theMountainsOfTheMoon.borders.push();
 theEyrie.borders.push();
 riverrun.borders.push();
 lannisport.borders.push();
 theGoldenSound.borders.push();
 theStonySept.borders.push();
 harrenhal.borders.push();
 cracklawPoint.borders.push();
 shipbreakerBay.borders.push();
 dragonstone.borders.push();
 kingslanding.borders.push();
 blackwater.borders.push();
 searoadMarches.borders.push();
 westSummerSea.borders.push();
 highgarden.borders.push();
 theReach.borders.push();
 kingswood.borders.push();
 stromsend.borders.push();
 theBoneway.borders.push();
 seaOfDorne.borders.push();
 dornishMarches.borders.push();
 oldtown.borders.push();
 redwyneStraights.borders.push();
 theArbor.borders.push();
 threeTowers.borders.push();
 princessPass.borders.push();
 starfall.borders.push();
 yronWood.borders.push();
 saltShore.borders.push();
 eastSummerSea.borders.push();
 sunspear.borders.push();

 */