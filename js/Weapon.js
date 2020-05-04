
/* Cette classe permet de gerer les armes des joueurs */

class Weapon {
    constructor(name, damage) {
        this.name = name;                               // Nom de l'arme
        this.image = this.name.toLowerCase() + ".png";  // Image corresponde a l'arme
        this.damage = damage;                           // degat de l'arme
    }

    /**
     * Met a jour le nom, l'image et le degat de arme du joueur actuel dans son tableau de bord
     * @param currentPlayer {Object} correspond au joueur actuel
     */
    updateWeapon(currentPlayer) {
        $(`#${currentPlayer.order}-weapon-name`).html(currentPlayer.weapon.name);
        $(`#${currentPlayer.order}-weapon-damage`).html(currentPlayer.weapon.damage);
        $(`#${currentPlayer.order}-weapon-image`).attr("src", "img/"+ currentPlayer.weapon.image);
    }
}
