
/* Cette classe gere la carte du jeu */

class Map {
    constructor(player1, player2) {
        // Les armes a afficher dans la map (nom et degats)
        this.mapWeapons = ["Revolver 10", "Fusil 15", "Fusil-pompe 20", "Roquette 25"];
        this.players = [player1, player2];
        this.grids = [];        // Les cases de la carte de jeu 
        this.createGrids(10);   // Cree les grilles de la carte de jeu
        this.createMap(10);     // Cree la carte de jeu
    }
  
    /**
     * Construit les grilles de la carte de jeu
     * @param {Int} numberOfGrids correspond au nombre de cases qui constituent la carte de jeu
     */
    createGrids(numberOfGrids) {
        for (let x = 0; x < numberOfGrids; x++) {
            const lane = [];  // Correspond a chaque ligne de la matrice
            for (let y = 0; y < numberOfGrids; y ++) {
                lane.push("0"); // On ajoute une case à la ligne contenant la valeur 0
            }
            this.grids.push(lane);
        }
        this.generateGrayGrids();   // Placement des cases grisees
        this.generatePlayersPos();  // Placement des joueurs sur la carte de jeu
        this.generateWeaponsPos();  // Placement des armes sur la carte de jeu
    }

    /**
     * Cree la carte de jeu
     * @param {Int} numberOfGrids correspond au nombre de cases qui constituent la carte de jeu
     */
    createMap(numberOfGrids) {
        for (let x = 0; x < numberOfGrids; x++){
            const lane = $("<tr></tr>"); // Ligne de la matrice
            for(let y = 0; y < numberOfGrids; y++){
                const grid = $("<td></td>");                
                grid.attr("id", String(x) + "-" + String(y)); // On attribue un id a chaque case de la carte
                
                const currentGrid = this.grids[x][y];

                // On applique la classe gray qui inversera la couleur des cases 
                if(currentGrid == "grayGrid") grid.addClass("gray");
                
                // Ajout des images des joueurs et des armes
                if(currentGrid === "first-player" || currentGrid === "second-player") { 
                    const playerImage = $("<img></img>");
                    playerImage.attr("src", "img/player.jpg");
                    playerImage.addClass(currentGrid);
                    grid.append(playerImage);

                } else if(this.mapWeapons.includes(currentGrid)) {
                    const weaponImage = $("<img></img>");
                    const weaponName = currentGrid.split(" ")[0];
                    weaponImage.attr("src", "img/"+ weaponName.toLowerCase() +".png");
                    weaponImage.addClass("img_arme");
                    grid.append(weaponImage);
                }
                lane.append(grid);
            }
            $("tbody").append(lane); // On ajoute la ligne a la table
        }
    }

    /**
     * Genere une position [x, y] et verifie si elle n'est pas deja occupee
     */
    generatePosXY() { 
        let x = Math.floor((Math.random() * 10));
        let y = Math.floor((Math.random() * 10));

        let newPosition = this.grids[x][y];
        while (newPosition !== "0") { // Tant que la position generee est occupee on genere une nouvelle position
            x = Math.floor((Math.random() * 10));
            y = Math.floor((Math.random() * 10));
            if (this.grids[x][y] === "0") newPosition = "0";
        }
        return [x, y];
    }

    /**
     * Genere les emplacements des cases grisees
     */
    generateGrayGrids() {
        for (let numberOfGrayGrids = 0; numberOfGrayGrids < 10; numberOfGrayGrids++) {
            const coordinates = this.generatePosXY();
            const x = coordinates[0];
            const y = coordinates[1];
            this.grids[x][y] = "grayGrid"; // On occupe l'emplacement de la case grisee sur la map
        }
    }

    /**
     * Permet de positionner les joueurs sur la carte de jeu
     */
    generatePlayersPos(){
        // On genere la position du premier joueur
        const firstPlayerPos = this.generatePosXY();
        this.players[0].position = firstPlayerPos;
        this.grids[firstPlayerPos[0]][firstPlayerPos[1]] = this.players[0].order; // On occupe la position pour ne pas qu'elle soit generee de nouveau

        // On genere la position du second joueur et on verifie que les 2 joueurs ne se touchent pas
        let secondPlayerPos = this.generatePosXY();

        let playersIntersect = this.positionsIntersect(firstPlayerPos, secondPlayerPos); // Return true si les 2 joueurs se touchent      
        while (playersIntersect) { // Tant que second joueur est positionne a cote du premier joueur..
            secondPlayerPos = this.generatePosXY(); //.. on genere une nouvelle position pour le second joueur
            playersIntersect = this.positionsIntersect(firstPlayerPos, secondPlayerPos);
        }
        
        this.players[1].position = secondPlayerPos;
        this.grids[secondPlayerPos[0]][secondPlayerPos[1]] = this.players[1].order; // On occupe la position pour ne pas qu'elle soit generee de nouveau
    }

    /**
     * Verifie si 2 positions sont cotes a cotes et renvoie true, sinon renvoie false
     * @param {Array} pos1 contient les coordonnees x et y de la premiere position
     * @param {Array} pos2 contient les coordonnees x et y de la deuxieme position
     */
    positionsIntersect(pos1, pos2) { 
        // Renvoie true si les 2 positions se touchent sur l'axe horizontal
        const horizontalAxis = (pos1[0] === pos2[0]) && (Math.abs(pos1[1] - pos2[1]) === 1);
        // Renvoie true si les 2 positions se touchent sur l'axe vertical
        const verticalAxis = (pos1[1] === pos2[1]) && (Math.abs(pos1[0] - pos2[0]) === 1);
        // Renvoie true si les 2 positions se touchent sur l'axe transversal
        const transverseAxis = (Math.abs(pos1[0] - pos2[0]) === 1) && (Math.abs(pos1[1] - pos2[1]) === 1);
        
        const areIntersect = horizontalAxis || verticalAxis || transverseAxis;
        return areIntersect;
    }

    /**
     * Permet de positionner les armes sur la carte de jeu
     */
    generateWeaponsPos() {
        const weaponsPos = [];
        this.mapWeapons.forEach(weapon => { // On affiche toutes les armes dans la carte de jeu..
            if (weapon === "Revolver 10") return; //.. sauf l'arme actuelle du joueur qui est son arme par defaut
            const weaponPos = this.generatePosXY();
            const x = weaponPos[0];
            const y = weaponPos[1];
            this.grids[x][y] = weapon;            
        });
    }

    /**
     * Ajoute les deplacements possibles du joueur sur la carte de jeu
     * @param {Array} initPosition corespond a la position initiale du joueur
     * @param {Function} _callback est une fonction callback pour deplacer le joueur
     */
    displayPlayerDirections(initPosition, _callback) {
        const playerDirections = this.calculatePlayerDirections(initPosition);

        playerDirections.forEach(gridCard => {
            const grid = $("#"+ gridCard.join("-"));
            grid.addClass("move_possible");
            
            if(grid.children().length > 0) { // Si on clique sur une case contenant une arme
                if(grid.find("img.img_arme").length !== 0) { // Si un des deplacements disponibles contient une arme
                    grid.children("img.img_arme").addClass("move_possible"); // On donne la possibilite de cliquer sur la case
                }
            }
        });
        $(".move_possible").on("click", _callback);
    }

    /**
     * Renvoie un tableau contenant les deplacements possibles du joueur
     * @param {Array} initPosition correspond a la position initiale du joueur
     */
    calculatePlayerDirections(initPosition) {
        const gridsAvailable = [];

        for(let direction = 1; direction < 5; direction++) {
            const potentialGrids = this.checkPlayerDirections(initPosition, direction);
            potentialGrids.forEach(case_courante => {
                gridsAvailable.push(case_courante);
            });
        }
        return gridsAvailable;
    }

    /**
     * Renvoie un tableau contenant les deplacements possibles dans une direction donnee
     * @param {Array} initPosition correspond a la position initiale du joueur
     * @param {Int} direction est la direction de deplacement (1: haut, 2: gauche, 3: bas, 4: droite)
     */
    checkPlayerDirections(initPosition, direction) { 
        let continueMove = true;
        const potentialGrids = [];
        // Si l'on cherche a voir les deplacements sur [gauche, droite], on met x comme index de reference, sinon y
        const start = (direction % 2 === 0) ? initPosition[0] : initPosition[1];
        const reverseAxis = (direction % 2 === 0) ? initPosition[1] : initPosition[0];
        // Si l'on veut decrementer l'index de reference (haut et gauche) ou incrementer (bas et droite), on cherche la case immediatement suivante
        let nextGrid = (direction <= 2) ? start - 1 : start + 1; 

        while(continueMove) {
            if(Math.abs(nextGrid - start) === 4 || nextGrid < 0 || nextGrid > 9) {
                continueMove = false;
            } else {
                const currentGrid = (direction % 2 === 0) ? this.grids[nextGrid][reverseAxis] : this.grids[reverseAxis][nextGrid];
                
                if(["grayGrid", "first-player", "second-player"].indexOf(currentGrid) >= 0) { // Si la case sur laquelle on se trouve est grisee ou a un joueur
                    continueMove = false;
                } else {
                    potentialGrids.push((direction % 2 === 0) ? [nextGrid, reverseAxis] : [reverseAxis, nextGrid]);
                }
            }
            nextGrid = (direction <= 2) ? nextGrid - 1 : nextGrid + 1;
        }
        return potentialGrids;
    }

    /**
     * Renvoie une case de la carte pourvant contenir une arme
     * @param {Object} currentPlayer correspond au joueur actuel
     * @param {Array} position est la position actuelle du joueur
     */
    updateNewWeapon(currentPlayer, position) {
        let weapon = -1;
        if(this.grids[position[0]][position[1]] !== "O") { // Si on est sur une arme on modifie la variable arme
            weapon = this.grids[position[0]][position[1]];
        }
        this.grids[position[0]][position[1]] = currentPlayer.order; // On occupe la nouvelle case du joueur en lui attribuant une valeur
        return weapon;
    }

    /**
     * Permet de laisser l'ancienne arme du joueur a son ancienne position dans la carte
     * @param {Object} currentPlayer correspond au joueur actuel
     */
    updateOldWeapon(currentPlayer) {
        let x = currentPlayer.oldPosition[0];
        let y = currentPlayer.oldPosition[1];
        
        this.grids[x][y] = currentPlayer.oldWeapon.name + " " + currentPlayer.oldWeapon.damage; // On redonne un nom d'arme a la case
        const oldGrid = $("#"+ x + "-" + y); // On recupere l'ancienne case du joueur

        const weaponImage = $("<img></img>");
        weaponImage.attr("src", "img/"+ currentPlayer.oldWeapon.image);
        weaponImage.addClass("img_arme");
        oldGrid.html(weaponImage);
    }
    
    /**
     * Met a jour la carte de jeu
     * @param {Object} currentPlayer correspond au joueur actuel
     * @param {Array} position est la position actuelle du joueur
     */
    updateMap(currentPlayer, position) {
        const playerImage = $("<img></img>");
        const oldGrid = $("#"+currentPlayer.oldPosition.join("-")); // On recupere l'ancienne case du joueur
        const newGrid = $("#"+ position.join("-")); // On recupere la nouvelle case du joueur
        playerImage.attr("src", "img/player.jpg");
        playerImage.addClass(currentPlayer.order);  // On applique la classe au joueur permettant le changement de couleur

        if (oldGrid.html().slice(-10).includes("player")) { // On libere l'ancienne case du joeur
            oldGrid.html(""); 
            let x = currentPlayer.oldPosition[0];
            let y = currentPlayer.oldPosition[1];
            this.grids[x][y] = "0";
        }
        newGrid.html(playerImage); // On applique l'image a la nouvelle case
        $(".move_possible").removeClass("move_possible"); // On efface les deplacements possibles
    }

    /**
     * Verifie si les 2 joueurs se sont croises et renvoie true, sinon renvoie false
     */
    fight() {
        const firstPlayerPos = this.players[0].position;
        const secondPlayerPos = this.players[1].position;
        const touchX = Math.abs(firstPlayerPos[0] - secondPlayerPos[0]) === 0 &&  Math.abs(firstPlayerPos[1] - secondPlayerPos[1]) === 1;
        const touchY = Math.abs(firstPlayerPos[0] - secondPlayerPos[0]) === 1 &&  Math.abs(firstPlayerPos[1] - secondPlayerPos[1]) === 0;
        return touchX || touchY;
    }
}
