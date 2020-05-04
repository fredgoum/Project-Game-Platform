
$(document).ready(function() {
    $("body").css("display", "block");  // Pour charger toute la page en meme temps
    
    // Intanciation des joueurs
    const firstPlayer = new Player("Player 1");
    const secondPlayer = new Player("Player 2");

    // Definir qui est le premier ou le second joueur et les adversaires respectifs
    firstPlayer.order = "first-player";
    secondPlayer.order = "second-player";
    firstPlayer.enemy = secondPlayer;
    secondPlayer.enemy = firstPlayer;

    // Definir les armes par defaut des joueurs
    firstPlayer.weapon = new Weapon("Revolver", 10);
    firstPlayer.oldWeapon = new Weapon("Revolver", 10);
    secondPlayer.weapon = new Weapon("Revolver", 10);
    secondPlayer.oldWeapon = new Weapon("Revolver", 10);

    // Instanciation de la carte du jeu
    const map = new Map(firstPlayer, secondPlayer);
    
    // Instanciation de l'interface graphique
    const interface = new Interface(firstPlayer, secondPlayer);

    // Gestion de la responsive
    resizeMap();
    $(window).resize(resizeMap);

    // Commencement du jeu
    let currentPlayerIndex = 0;
    let currentPlayer;
    startGame(currentPlayerIndex);
    
    /**
     * Commence le jeu et gere le tour par tour
     * @param {Int} currentPlayerIndex coorespond a l'index du joueur actuel
     */
    function startGame(currentPlayerIndex) {
        currentPlayer = map.players[currentPlayerIndex];
        const position = currentPlayer.position;                
        map.displayPlayerDirections(position, movePlayer);
    }

    /**
     * Gere le deplacement d'un joueur sur la carte de jeu
     * @param {Event} event
     */
    function movePlayer(event) {
        $(".move_possible").off("click", movePlayer);
        let position = event.target.id.split("-");
        if (position.length != 2) { // On cherche l'id du parent, si on clique sur l'image d'une arme
            position = $(event.target).parent().attr("id").split("-");
        }

        // On met à jour les positions du joueur 
        currentPlayer.oldPosition = currentPlayer.position;
        currentPlayer.position = [parseInt(position[0]), parseInt(position[1])];
        
        // On recupere la case actuelle du joueur pouvant contenir une arme
        const weapon = map.updateNewWeapon(currentPlayer, position); 
        if (map.mapWeapons.includes(weapon)) { // Si on tombe sur une arme...
            currentPlayer.oldWeapon = currentPlayer.weapon; // l'arme actuelle du joueur devient son ancienne arme            
            const WeaponName = weapon.split(" ")[0];
            const WeaponDamage = weapon.split(" ")[1];
            currentPlayer.weapon = new Weapon(WeaponName, WeaponDamage); // l'arme sur laquelle le joueur est tomblé devient son arme actuelle

            map.updateOldWeapon(currentPlayer); // Mis a jour de l'arme dans l'ancienne case du joueur sur la carte
            currentPlayer.weapon.updateWeapon(currentPlayer); // Mis a jour de l'arme dans le tableau de bord du joueur
        }
        map.updateMap(currentPlayer, position); // On remet à jour la map

        if (! map.fight()) {  // Si les 2 joueurs ne se croisent pas alors on continue de jouer
            // Si le joueur actuelle c'est le premier joueur, alors on donne le tour au second joueur
            if (currentPlayer.order == "first-player") {
                currentPlayerIndex = 1;
            } else {
                currentPlayerIndex = 0;
            }
            // C'est maintenant au second joueur de jouer
            startGame(currentPlayerIndex);
        } else { // Sinon si les 2 joueurs se croisent, un combat à mort est lance
            interface.displayBattle(); // On affiche l'interface de combat  
            currentPlayer.displayButtons(currentPlayer);  // On affiche les boutons attaquer et defendre du joueur actuel 
        }
    }

    /**
     * Redimmensionne la map en tenant compte de la largeur de l'ecran du terminal
     */
    function resizeMap() {
        const playersDashboard = $("#first-player-dashboard, #second-player-dashboard"); // Tableaux de bord des joueurs
        if ($(document).width() < 880) {
            const $width = $("table").width(); // Largeur de la map
            setWidth($width);   // On calcule la nouvelle largeur de la map
            playersDashboard.hide(); // Pour un ecran plus petit, on masque les 2 tableaux de bords, qui seront reaffiches lors du combat            
        } else {
            const $width = $("table").width(); // Largeur de la map
            setWidth($width);   // On calcule la nouvelle largeur de la map
            playersDashboard.show();            
        }
    }

    /**
     * Calcul la largeur de la map en fonction de la taille de l'ecran
     * @param {Int} $width correspond a la largeur de la map
     */
    function setWidth($width) {
        const $tdWidth = Math.trunc($width / 10); // On recupere la valeur la plus proche en-dessous
        const $finalWidth = $tdWidth * 10; // On recalcule la taille finale de la map
        $("table").css({
            "height": `${$finalWidth}px`,
            "width": `${$finalWidth}px`
        });
        $("td").css({
            "height": `${$tdWidth}px`,
            "width": `${$tdWidth}px`
        });
    }
});
