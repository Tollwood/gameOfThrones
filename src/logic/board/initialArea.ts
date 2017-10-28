import {Area} from './area';
import {House} from './house';
import Player from './player';
import Unit from '../units/units';
import {UnitType} from '../units/unitType';

export class AreaInitiator {

    public static getInitalState(players: Array<Player>): Array<Area> {
        let areas: Array<Area> = new Array();
        let castleBlack = new Area('CastleBlack', 1, false, false, false, true, 0);
        areas.push(castleBlack);
        let karhold = new Area('Karhold', 1, false, false, false, true, 0);
        areas.push(karhold);
        let theShiveringSea = new Area('TheShiveringSea', 0, false, false, false, false, 0);
        areas.push(theShiveringSea);
        let bayOfIce = new Area('BayOfIce', 0, false, false, false, false, 0);
        areas.push(bayOfIce);
        let winterfell = new Area('Winterfell', 1, true, false, true, true, 1);
        areas.push(winterfell);
        let theStonyShore = new Area('TheStonyShore', 1, false, false, false, true, 1);
        areas.push(theStonyShore);
        let whiteHarbor = new Area('WhiteHarbor', 0, true, true, false, true, 0);
        areas.push(whiteHarbor);
        let widowsWatch = new Area('WidowsWatch', 0, false, false, false, true, 1);
        areas.push(widowsWatch);
        let flintsFinger = new Area('FlintsFinger', 0, false, true, false, true, 0);
        areas.push(flintsFinger);
        let pyke = new Area('Pyke', 1, true, false, true, true, 1);
        areas.push(pyke);
        let greyWaterWatch = new Area('GreyWaterWatch', 0, false, false, false, true, 1);
        areas.push(greyWaterWatch);
        let ironmansBay = new Area('IronmansBay', 0, false, false, false, false, 0);
        areas.push(ironmansBay);
        let theNarrowSea = new Area('TheNarrowSea', 0, false, false, false, false, 0);
        areas.push(theNarrowSea);
        let moatCailin = new Area('MoatCailin', 0, false, true, false, true, 0);
        areas.push(moatCailin);
        let seagard = new Area('Seagard', 1, false, false, true, true, 1);
        areas.push(seagard);
        let theTwins = new Area('TheTwins', 1, false, false, false, true, 0);
        areas.push(theTwins);
        let theFingers = new Area('TheFingers', 0, false, false, false, true, 1);
        areas.push(theFingers);
        let theEyrie = new Area('TheEyrie', 1, false, true, false, true, 1);
        areas.push(theEyrie);
        let sunsetSea = new Area('SunsetSea', 0, false, false, false, false, 0);
        areas.push(sunsetSea);
        let lannisport = new Area('Lannisport', 0, true, false, true, true, 2);
        areas.push(lannisport);
        let theGoldenSound = new Area('TheGoldenSound', 0, false, false, false, false, 0);
        areas.push(theGoldenSound);
        let stoneySept = new Area('StoneySept', 1, false, false, false, true, 0);
        areas.push(stoneySept);
        let riverrun = new Area('Riverrun', 1, false, false, true, true, 1);
        areas.push(riverrun);
        let TheMountainsOfTheMoon = new Area('TheMountainsOfTheMoon', 0, false, false, false, true, 1);
        areas.push(TheMountainsOfTheMoon);
        let harrenhal = new Area('Harrenhal', 1, false, true, false, true, 0);
        areas.push(harrenhal);
        let crackClawPoint = new Area('CrackClawPoint', 0, false, true, false, true, 0);
        areas.push(crackClawPoint);
        let blackwaterBay = new Area('BlackwaterBay', 0, false, false, false, false, 0);
        areas.push(blackwaterBay);
        let dragonStone = new Area('Dragonstone', 1, true, false, true, true, 1);
        areas.push(dragonStone);
        let shipbreakerBay = new Area('ShipbreakerBay', 0, false, false, false, false, 0);
        areas.push(shipbreakerBay);
        let kingswood = new Area('Kingswood', 1, false, false, false, true, 1);
        areas.push(kingswood);
        let kingsLanding = new Area('KingsLanding', 2, false, false, true, true, 0);
        areas.push(kingsLanding);
        let blackwater = new Area('Blackwater', 0, false, false, false, true, 2);
        areas.push(blackwater);
        let searoadMarches = new Area('SearoadMarches', 0, false, false, false, true, 1);
        areas.push(searoadMarches);
        let highgarden = new Area('Highgarden', 0, false, false, true, true, 2);
        areas.push(highgarden);
        let dornishMarches = new Area('DornishMarches', 1, false, false, false, true, 0);
        areas.push(dornishMarches);
        let redwyneStraights = new Area('RedwyneStraights', 0, false, false, false, false, 0);
        areas.push(redwyneStraights);
        let stormsEnd = new Area('StormsEnd', 0, true, true, false, true, 0);
        areas.push(stormsEnd);
        let theBoneway = new Area('TheBoneway', 1, false, false, false, true, 0);
        areas.push(theBoneway);
        let oldtown = new Area('Oldtown', 0, true, false, true, true, 0);
        areas.push(oldtown);
        let threeTowers = new Area('ThreeTowers', 0, false, false, false, true, 1);
        areas.push(threeTowers);
        let princesPass = new Area('PrincesPass', 1, false, false, false, true, 1);
        areas.push(princesPass);
        let yronwood = new Area('Yronwood', 0, false, true, false, true, 0);
        areas.push(yronwood);
        let sunspear = new Area('Sunspear', 1, true, false, true, true, 1);
        areas.push(sunspear);
        let saltShore = new Area('SaltShore', 0, false, false, false, true, 1);
        areas.push(saltShore);
        let seaOfDorne = new Area('SeaOfDorne', 0, false, false, false, false, 0);
        areas.push(seaOfDorne);
        let starfall = new Area('Starfall', 0, false, true, false, true, 1);
        areas.push(starfall);
        let theArbor = new Area('TheArbor', 1, false, false, false, true, 0);
        areas.push(theArbor);
        let westSummerSea = new Area('WestSummerSea', 0, false, false, false, false, 0);
        areas.push(westSummerSea);
        let eastSummerSea = new Area('EastSummerSea', 0, false, false, false, false, 0);
        areas.push(eastSummerSea);
        let theReach = new Area('TheReach', 0, false, true, false, true, 0);
        areas.push(theReach);

        castleBlack.borders.push(theShiveringSea, karhold, winterfell, bayOfIce);
        karhold.borders.push(theShiveringSea, winterfell);
        theShiveringSea.borders.push(castleBlack, karhold, winterfell, whiteHarbor, widowsWatch, theNarrowSea);
        bayOfIce.borders.push(sunsetSea, theStonyShore, winterfell, castleBlack);
        winterfell.borders.push(castleBlack, karhold, whiteHarbor, theShiveringSea, moatCailin, theStonyShore, bayOfIce);
        theStonyShore.borders.push(winterfell, bayOfIce);
        whiteHarbor.borders.push(theShiveringSea, widowsWatch, theNarrowSea, moatCailin, winterfell);
        widowsWatch.borders.push(whiteHarbor, theShiveringSea, theNarrowSea);
        theNarrowSea.borders.push(theShiveringSea, widowsWatch, whiteHarbor, moatCailin, theTwins, theFingers, TheMountainsOfTheMoon, theEyrie, crackClawPoint, shipbreakerBay);
        moatCailin.borders.push(whiteHarbor, theNarrowSea, theTwins, seagard, greyWaterWatch, winterfell);
        greyWaterWatch.borders.push(moatCailin, seagard, ironmansBay, flintsFinger, bayOfIce);
        flintsFinger.borders.push(bayOfIce, sunsetSea, ironmansBay, greyWaterWatch);
        sunsetSea.borders.push(bayOfIce, flintsFinger, ironmansBay, theGoldenSound, searoadMarches, westSummerSea);
        ironmansBay.borders.push(sunsetSea, flintsFinger, greyWaterWatch, seagard, riverrun, theGoldenSound, pyke);
        pyke.borders.push(ironmansBay);
        seagard.borders.push(greyWaterWatch, moatCailin, theTwins, riverrun, ironmansBay);
        theTwins.borders.push(moatCailin, theNarrowSea, theFingers, TheMountainsOfTheMoon);
        theFingers.borders.push(theNarrowSea, TheMountainsOfTheMoon, theTwins);
        TheMountainsOfTheMoon.borders.push(theTwins, theFingers, theNarrowSea, theEyrie, crackClawPoint);
        theEyrie.borders.push(TheMountainsOfTheMoon, theNarrowSea);
        riverrun.borders.push(seagard, harrenhal, stoneySept, lannisport, theGoldenSound, ironmansBay);
        lannisport.borders.push(theGoldenSound, riverrun, stoneySept, searoadMarches);
        theGoldenSound.borders.push(ironmansBay, riverrun, lannisport, searoadMarches);
        theStonyShore.borders.push();
        harrenhal.borders.push(crackClawPoint, blackwater, stoneySept, riverrun);
        crackClawPoint.borders.push(TheMountainsOfTheMoon, theNarrowSea, shipbreakerBay, blackwaterBay, kingsLanding, blackwater, harrenhal);
        shipbreakerBay.borders.push(theNarrowSea, dragonStone, eastSummerSea, stormsEnd, kingswood, blackwaterBay, crackClawPoint);
        dragonStone.borders.push(shipbreakerBay);
        kingsLanding.borders.push(crackClawPoint, blackwaterBay, kingswood, blackwater, theReach);
        blackwater.borders.push(harrenhal, crackClawPoint, kingsLanding, theReach, searoadMarches, stoneySept);
        searoadMarches.borders.push(lannisport, stoneySept, blackwater, theReach, highgarden, westSummerSea, sunsetSea, theGoldenSound);
        westSummerSea.borders.push(sunsetSea, searoadMarches, highgarden, redwyneStraights, threeTowers, starfall, eastSummerSea, theArbor);
        highgarden.borders.push(searoadMarches, theReach, dornishMarches, oldtown, redwyneStraights, westSummerSea);
        theReach.borders.push(blackwater, kingsLanding, kingswood, theBoneway, dornishMarches, highgarden, searoadMarches);
        kingswood.borders.push(blackwaterBay, shipbreakerBay, stormsEnd, theBoneway, theReach, kingsLanding);
        stormsEnd.borders.push(kingswood, shipbreakerBay, eastSummerSea, seaOfDorne, theBoneway);
        theBoneway.borders.push(kingswood, stormsEnd, seaOfDorne, yronwood, princesPass, dornishMarches, theReach);
        seaOfDorne.borders.push(stormsEnd, eastSummerSea, sunspear, yronwood, theBoneway);
        dornishMarches.borders.push(theReach, theBoneway, princesPass, threeTowers, oldtown, highgarden);
        oldtown.borders.push(highgarden, dornishMarches, threeTowers, redwyneStraights);
        redwyneStraights.borders.push(highgarden, oldtown, threeTowers, westSummerSea, theArbor);
        theArbor.borders.push(redwyneStraights, westSummerSea);
        threeTowers.borders.push(oldtown, dornishMarches, princesPass, westSummerSea, redwyneStraights);
        princesPass.borders.push(dornishMarches, theBoneway, yronwood, starfall, threeTowers);
        starfall.borders.push(princesPass, yronwood, saltShore, eastSummerSea, westSummerSea);
        yronwood.borders.push(theBoneway, seaOfDorne, sunspear, saltShore, starfall, princesPass);
        saltShore.borders.push(yronwood, sunspear, eastSummerSea, starfall);
        eastSummerSea.borders.push(starfall, saltShore, sunspear, seaOfDorne, shipbreakerBay, westSummerSea);
        sunspear.borders.push(seaOfDorne, eastSummerSea, saltShore, yronwood);

        for (let player of players){
            switch (player.house) {
                case House.stark:
                    theShiveringSea.units = [new Unit(UnitType.Ship, House.stark)];
                    theShiveringSea.controllingHouse = House.stark;
                    winterfell.units = [new Unit(UnitType.Horse, House.stark), new Unit(UnitType.Footman, House.stark)];
                    winterfell.controllingHouse = House.stark;
                    whiteHarbor.units =  [new Unit(UnitType.Footman, House.stark)];
                    whiteHarbor.controllingHouse = House.stark;
                    break;
                case House.lannister:
                    lannisport.units = [new Unit(UnitType.Footman, House.lannister), new Unit(UnitType.Horse, House.lannister)];
                    lannisport.controllingHouse = House.lannister;
                    theGoldenSound.units =  [new Unit(UnitType.Ship, House.lannister)];
                    theGoldenSound.controllingHouse = House.lannister;
                    stoneySept.units = [new Unit(UnitType.Footman, House.lannister)];
                    stoneySept.controllingHouse = House.lannister;
                    break;
                case House.baratheon:
                    dragonStone.units = [new Unit(UnitType.Footman, House.baratheon), new Unit(UnitType.Horse, House.baratheon)];
                    dragonStone.controllingHouse = House.baratheon;
                    shipbreakerBay.units = [new Unit(UnitType.Ship, House.baratheon), new Unit(UnitType.Ship, House.baratheon)];
                    shipbreakerBay.controllingHouse = House.baratheon;
                    kingswood.units = [new Unit(UnitType.Footman, House.baratheon)];
                    kingswood.controllingHouse = House.baratheon;
                    break;
                case House.greyjoy:
                    pyke.units = [new Unit(UnitType.Footman, House.greyjoy), new Unit(UnitType.Horse, House.greyjoy)];
                    pyke.controllingHouse = House.greyjoy;
                    greyWaterWatch.units = [new Unit(UnitType.Footman, House.greyjoy)];
                    greyWaterWatch.controllingHouse = House.greyjoy;
                    ironmansBay.units = [new Unit(UnitType.Ship, House.greyjoy), new Unit(UnitType.Ship, House.greyjoy)];
                    ironmansBay.controllingHouse = House.greyjoy;
                    break;
                case House.tyrell:
                    highgarden.units = [new Unit(UnitType.Footman, House.tyrell), new Unit(UnitType.Horse, House.tyrell)];
                    highgarden.controllingHouse = House.tyrell;
                    dornishMarches.units = [new Unit(UnitType.Footman, House.tyrell)];
                    dornishMarches.controllingHouse = House.tyrell;
                    redwyneStraights.units = [new Unit(UnitType.Ship, House.tyrell)];
                    redwyneStraights.controllingHouse = House.tyrell;
                    break;
                case House.martell:
                    sunspear.units = [new Unit(UnitType.Footman, House.martell), new Unit(UnitType.Horse, House.martell)];
                    sunspear.controllingHouse = House.martell;
                    saltShore.units = [new Unit(UnitType.Footman, House.martell)];
                    saltShore.controllingHouse = House.martell;
                    seaOfDorne.units = [new Unit(UnitType.Ship, House.martell)];
                    seaOfDorne.controllingHouse = House.martell;
                    break;
            }

        }

        return areas;
    }

    private static addInitialUnits(areas: Array<Area>, players: Array<Player>) {


    }
}
