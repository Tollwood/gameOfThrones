import {Area} from "./area";
import {Unit, UnitType, House} from "./units";

export class AreaInitiator {

    public static getInitalState(): Array<Area> {
        let areas: Array<Area> = new Array();
        areas.push(new Area("CastleBlack", 1, false, false, false, 0));
        areas.push(new Area("Karhold", 1, false, false, false, 0));
        areas.push(new Area("TheShiveringSea", 0, false, false, false, 0, [new Unit(UnitType.Ship, House.stark)]));
        areas.push(new Area("BayOfIce", 0, false, false, false, 0));
        areas.push(new Area("Winterfell", 1, true, false, true, 1, [new Unit(UnitType.Horse, House.stark), new Unit(UnitType.Footman, House.stark)]));
        areas.push(new Area("TheStonyShore", 1, false, false, false, 1));
        areas.push(new Area("WhiteHarbor", 0, true, true, false, 0, [new Unit(UnitType.Footman, House.stark)]));
        return areas;
    }
}


/*
 const widowsWatch = new Area(7, "Widows Watch", 0, false, false, false, 1);
 const theNarrowSea = new Area(8, "The Narrow Sea", 0, false, false, false, 0);
 const moatCalin = new Area(9, "Moat Calin", 0, false, true, false, 0);
 const greywaterWatch = new Area(10, "Greywater Watch", 0, false, false, false, 1);
 const flintsFinger = new Area(11, "Flints Finger", 0, false, true, false, 0);
 const sunsetSea = new Area(12, "Sunset Sea", 0, false, false, false, 0);
 const ironmansBay = new Area(13, "Ironmans Bay", 0, false, false, false, 0);
 const pyke = new Area(14, "Pyke", 1, true, false, true, 1);
 const seagard = new Area(15, "Seagard", 1, false, false, true, 1);
 const theTwins = new Area(16, "The Twins", 1, false, false, false, 0);
 const theFingers = new Area(17, "The Fingers", 0, false, false, false, 1);
 const theMountainsOfTheMoon = new Area(18, "The Mountains of the Moon", 0, false, false, false, 1);
 const theEyrie = new Area(19, "The Eyrie", 1, false, true, false, 1);
 const riverrun = new Area(20, "Riverrun", 1, false, false, true, 1);
 const lannisport = new Area(21, "Lannisport", 0, true, false, true, 2);
 const theGoldenSound = new Area(22, "The Golden Sound", 0, false, false, false, 0);
 const theStonySept = new Area(23, "Stony Sept", 1, false, false, false, 0);
 const harrenhal = new Area(24, "Harrenhal", 1, false, true, false, 0);
 const cracklawPoint = new Area(25, "Cracklaw Point", 0, false, true, false, 0);
 const shipbreakerBay = new Area(26, "Shipbreaker Bay", 0, false, false, false, 0);
 const dragonstone = new Area(27, "Dragonstone", 1, true, false, true, 1);
 const kingslanding = new Area(28, "Kingslanding", 2, false, false, false, 0);
 const blackwater = new Area(29, "Blackwater", 0, false, false, false, 2);
 const searoadMarches = new Area(30, "Searoad Marches", 0, false, false, false, 1);
 const westSummerSea = new Area(31, "West Summer Sea", 0, false, false, false, 0);
 const highgarden = new Area(32, "Highgarden", 0, false, false, true, 2);
 const theReach = new Area(33, "The Reach", 0, false, true, false, 0);
 const kingswood = new Area(34, "Kingswood", 1, false, false, false, 1);
 const stromsend = new Area(35, "StormsEnd", 0, true, true, false, 0);
 const theBoneway = new Area(36, "The Boneway", 1, false, false, false, 0);
 const seaOfDorne = new Area(37, "Sea of Dorne", 0, false, false, false, 0);
 const dornishMarches = new Area(38, "Dornish Marches", 1, false, false, false, 0);
 const oldtown = new Area(39, "Oldtown", 0, true, true, false, 0);
 const redwyneStraights = new Area(40, "Redwyne Straights", 0, false, false, false, 0);
 const theArbor = new Area(41, "The Arbor", 1, false, false, false, 0);
 const threeTowers = new Area(42, "Three Towers", 0, false, false, false, 1);
 const princessPass = new Area(43, "Princes Pass", 1, false, false, false, 1);
 const starfall = new Area(44, "Starfall", 0, false, true, false, 1);
 const yronWood = new Area(45, "YronWood", 0, false, true, false, 0);
 const saltShore = new Area(46, "Salt Shore", 0, false, false, false, 1);
 const eastSummerSea = new Area(47, "East Summer Sea", 0, false, false, false, 0);
 const sunspear = new Area(48, "Sunspear", 1, true, false, true, 1);


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