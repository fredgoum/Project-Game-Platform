
/* Cette classe gere l'interface du jeu */

class Interface {
    constructor(firstPlayer, secondPlayer) {
        this.players = [firstPlayer, secondPlayer];
        // Boutons attaquer et defendre des 2 joueurs sont initialement masques
        $(`#first-player-attack`).hide();
        $(`#first-player-defend`).hide();
        $(`#second-player-attack`).hide();
        $(`#second-player-defend`).hide();
        $('#battle_title').hide(); 
    }

    /**
     * Affiche l'interface de combat du jeu lorsque les 2 joueurs se croisent
     */
    displayBattle() {
        $(`#map`).remove();
        $('#battle_title').show();
        $('#battle_title').css("text-align", "center");
        $('#battle_title').css("margin-bottom", "3px");
        const playersDashboard = $("#first-player-dashboard, #second-player-dashboard"); // Tableaux de bord des joueurs
        if (! playersDashboard.is(":visible")) { // Si les tableaux de bord sont masques (cas sur petit ecran).. 
            playersDashboard.show();    // .. on les affiche pour le combat
            $(".game_interface").css("display", "flex");
        }
    }
}
