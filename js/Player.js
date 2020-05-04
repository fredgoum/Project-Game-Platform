
/* Cette classe gere les joueurs */ 

class Player {
    constructor(name) {
        this.name = name;         // Nom du joueur
        this.order = "";          // Determine si c'est le premier ou le second joueur
        this.weapon = {};         // Arme actuelle du joueur
        this.oldWeapon = {};      // Ancienne arme du joueur
        this.position = [];       // Position du joueur
        this.oldPosition = [];    // Ancienne position du joueur
        this.fight = '';          // Dis si le joueur a attaqué ou defendu lors d'un tour de combat
        this.lifePoints = 100;    // Points de vie du joueur
        this.enemy = {};           
    }

    /**
     * Permet d'afficher les boutons attaquer et defendre du joueur dans son tableau de bord
     * @param {Object} player correspond au joueur
     */
    displayButtons(player) { 
        const attackButton = $(`#${player.order}-attack`);
        const defendButton = $(`#${player.order}-defend`);
        attackButton.show();
        defendButton.show();

        let that = this;
        attackButton.on('click', function(event) {
            event.stopImmediatePropagation(); // Pour empecher la propagation de l'event
            attackButton.hide();
            defendButton.hide();

            player.fight = 'attack'; // Pour specifier que le joueur a attaque
            that.caluculateLifePoints(player);

            const nextPlayer = player.enemy;
            that.displayButtons(nextPlayer); // C'est au tour du prochain joueur d'attaquer ou de defendre
        });
        defendButton.on('click', function(e) {
            event.stopImmediatePropagation(); // Pour empecher la propagation de l'event
            attackButton.hide();
            defendButton.hide();

            player.fight = 'defend';   // Pour specifier que le joueur a defendu

            const nextPlayer = player.enemy;
            that.displayButtons(nextPlayer); // C'est au tour du prochain joueur d'attaquer ou de defendre
        });
    }

    /**
     * Calcul les points de vie restant des joueurs
     * @param {Object} player correspond au joueur actuel
     */
    caluculateLifePoints(player) {
        let points = 100;
        if (player.enemy.fight === 'defend') {  // Si l'ennemi se defend alors il encaisse 50% des degats du joueur
            points = Math.abs(player.enemy.lifePoints - (player.weapon.damage / 2));
        } else {  // Sinon il encaisse 100% des degats
            points = Math.abs(player.enemy.lifePoints - player.weapon.damage);
        }
        if (player.enemy.lifePoints < player.weapon.damage) {
            points = 0;
        }
        player.enemy.lifePoints = points;
        
        this.updateLifeBar(player.enemy); // On met a jour les points de vie et la barre de vie de l'ennemi
    }

    /**
     * Met a jour les points de vie et la barre de vie des joueurs
     * @param {Object} player correspond au joueur attaque
     */
    updateLifeBar(player) {
        $(`#${player.order}-lifebar`).html(player.lifePoints + '%');
        $(`#${player.order}-lifebar`).css("width", player.lifePoints + '%');

        if (player.lifePoints == 0) { // Lorsque les points de vie d'un joueur tombent a 0 ..
            this.gameOver(player); //.. on affiche un message et la partie est terminee
        }
    }
    
    /**
     * Affiche le nom du joueur qui a remporte la partie et indique que la partie est terminee
     * @param {Obeject} player est le joueur qui meurt
     */
    gameOver(player) {
        const winnerPlayer = player.enemy; 

        const gameOver = "<b>GAME OVER</b></br></br></br>";
        const winner = "Nice fight " + winnerPlayer.name  + "</br></br></br>";
        const thanks = "<i>Thank you for playing</i>";
        
        $('#battle_title').hide();
        $('.game_interface').html("<p style='text-align: center;'>" + gameOver + winner + thanks + "</p>");
    }
}
