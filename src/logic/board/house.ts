export enum House {
    stark = 'stark',
    baratheon = 'baratheon',
    lannister = 'lannister',
    greyjoy = 'greyjoy',
    tyrell = 'tyrell',
    martell = 'martell'
}

export function convertHouseToNumber(house: House): number {
    switch (house) {
        case House.stark:
            return 0;
        case House.baratheon:
            return 1;
        case House.lannister:
            return 2;
        case House.greyjoy:
            return 3;
        case House.martell:
            return 4;
        case House.tyrell:
            return 5;
    }
}