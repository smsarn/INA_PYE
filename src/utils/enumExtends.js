
export class Color2 {
    constructor(name) {
        this.name = name;
    }
    toString(lang) {
        return this.getName(lang)
    }
    getName=(lang)=>{
        switch (lang) {
            case "en":
                switch (this.name) {
                    case "RED":
                        return "Red"
                    case "GREEN":
                        return "Green"
                    case "BLUE":
                        return "Blue"
                        break;
                
                    default:
                        break;
                }
                break;
            case "fr":
                switch (this.name) {
                    case "RED":
                        return "Rouge"
                    case "GREEN":
                        return "Verte"
                    case "BLUE":
                        return "Bleu"
                        break;
                
                    default:
                        break;
                }
                break;
        
            default:
                break;
        }


    }
}
Color2.RED = new Color2('RED');
Color2.GREEN = new Color2('GREEN');
Color2.BLUE = new Color2('BLUE');


