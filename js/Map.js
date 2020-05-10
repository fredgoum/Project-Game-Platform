class Map {
  constructor(player1, player2) {
    // Weapons to display in the map (name and damage)
    this.mapWeapons = ['Revolver 10', 'Fusil 15', 'Fusil-pompe 20', 'Roquette 25'];
    this.players = [player1, player2];
    this.grids = [];
    this.createGrids(10);
    this.createMap(10);
  }

  /**
   * Creates the map grids
   * @param {Int} numberOfGrids is the number of rows and columns on the map
   */
  createGrids(numberOfGrids) {
    for (let x = 0; x < numberOfGrids; x++) {
      const lane = []; // lane corresponds to each row of the matrix
      for (let y = 0; y < numberOfGrids; y++) {
        lane.push('0');
      }
      this.grids.push(lane);
    }
    this.generateGrayGrids(); // Placement of gray grids
    this.generatePlayersPos(); // Placement of players on the map
    this.generateWeaponsPos(); // Placement of weapons on the map
  }

  /**
   * Creates the map
   * @param {Int} numberOfGrids is the number of rows and columns on the map
   */
  createMap(numberOfGrids) {
    for (let x = 0; x < numberOfGrids; x++) {
      const lane = $('<tr></tr>');
      for (let y = 0; y < numberOfGrids; y++) {
        const grid = $('<td></td>');
        grid.attr('id', `${String(x)}-${String(y)}`); // Assign an id to each grid

        const currentGrid = this.grids[x][y];

        // Class gray to inverse the grids color
        if (currentGrid == 'grayGrid') grid.addClass('gray');

        // Adds images of players and weapons
        if (currentGrid === 'first-player' || currentGrid === 'second-player') {
          const playerImage = $('<img></img>');
          playerImage.attr('src', 'img/player.jpg');
          playerImage.addClass(currentGrid);
          grid.append(playerImage);
        } else if (this.mapWeapons.includes(currentGrid)) {
          const weaponImage = $('<img></img>');
          const weaponName = currentGrid.split(' ')[0];
          weaponImage.attr('src', `img/${weaponName.toLowerCase()}.png`);
          weaponImage.addClass('img_arme');
          grid.append(weaponImage);
        }
        lane.append(grid);
      }
      $('tbody').append(lane);
    }
  }

  /**
   * Generates a position [x, y] and check if it is not already occupied
   */
  generatePosXY() {
    let x = Math.floor((Math.random() * 10));
    let y = Math.floor((Math.random() * 10));

    let newPosition = this.grids[x][y];
    while (newPosition !== '0') {
      x = Math.floor((Math.random() * 10));
      y = Math.floor((Math.random() * 10));
      if (this.grids[x][y] === '0') newPosition = '0';
    }
    return [x, y];
  }

  /**
   * Generates the locations of gray grids
   */
  generateGrayGrids() {
    for (let numberOfGrayGrids = 0; numberOfGrayGrids < 10; numberOfGrayGrids++) {
      const coordinates = this.generatePosXY();
      const x = coordinates[0];
      const y = coordinates[1];
      this.grids[x][y] = 'grayGrid'; // Occupies location of the gray grids on the map
    }
  }

  /**
   * Allows to position the players on the map and check that they do not touch
   */
  generatePlayersPos() {
    const firstPlayerPos = this.generatePosXY();
    this.players[0].position = firstPlayerPos;
    this.grids[firstPlayerPos[0]][firstPlayerPos[1]] = this.players[0].order;

    let secondPlayerPos = this.generatePosXY();
    let playersIntersect = this.positionsIntersect(firstPlayerPos, secondPlayerPos);
    while (playersIntersect) {
      secondPlayerPos = this.generatePosXY();
      playersIntersect = this.positionsIntersect(firstPlayerPos, secondPlayerPos);
    }
    this.players[1].position = secondPlayerPos;
    this.grids[secondPlayerPos[0]][secondPlayerPos[1]] = this.players[1].order;
  }

  /**
   * Checks if 2 positions are side by side and return true, otherwise return false
   * @param {Array} pos1 contains x and y coordinates of the first position
   * @param {Array} pos2 contains x and y coordinates of the second position
   */
  positionsIntersect(pos1, pos2) {
    const horizontalTouch = (pos1[0] === pos2[0]) && (Math.abs(pos1[1] - pos2[1]) === 1);
    const verticalTouch = (pos1[1] === pos2[1]) && (Math.abs(pos1[0] - pos2[0]) === 1);
    const transverseTouch = (Math.abs(pos1[0] - pos2[0]) === 1) && (Math.abs(pos1[1] - pos2[1]) === 1);
    return horizontalTouch || verticalTouch || transverseTouch;
  }

  /**
   * Allows to position weapons on the map
   */
  generateWeaponsPos() {
    const weaponsPos = [];
    this.mapWeapons.forEach((weapon) => {
      if (weapon === 'Revolver 10') return;
      const weaponPos = this.generatePosXY();
      const x = weaponPos[0];
      const y = weaponPos[1];
      this.grids[x][y] = weapon;
    });
  }

  /**
   * Adds the player's possible movements on the map
   * @param {Array} initPosition is the player's initial position
   * @param {Function} _callback is a callback function to move player
   */
  displayPlayerDirections(initPosition, _callback) {
    const playerDirections = this.calculatePlayerDirections(initPosition);
    playerDirections.forEach((gridCard) => {
      const grid = $(`#${gridCard.join('-')}`);
      grid.addClass('move_possible');

      if (grid.children().length > 0) { // If the grid contains a weapon
        if (grid.find('img.img_arme').length !== 0) {
          grid.children('img.img_arme').addClass('move_possible');
        }
      }
    });
    $('.move_possible').on('click', _callback);
  }

  /**
   * Returns an array containing the player's possible moves
   * @param {Array} initPosition is the player's initial position
   */
  calculatePlayerDirections(initPosition) {
    const gridsAvailable = [];
    for (let direction = 1; direction < 5; direction++) {
      const potentialGrids = this.checkPlayerDirections(initPosition, direction);
      potentialGrids.forEach((grid) => {
        gridsAvailable.push(grid);
      });
    }
    return gridsAvailable;
  }

  /**
   * Returns an array containing the player's moves in a given direction
   * @param {Array} initPosition is the player's initial position
   * @param {Int} direction is the move directions (1: up, 2: left, 3: down, 4: right)
   */
  checkPlayerDirections(initPosition, direction) {
    let continueMove = true;
    const potentialGrids = [];
    // For moves on (left and right), put x as the reference index, otherwise y
    const start = (direction % 2 === 0) ? initPosition[0] : initPosition[1];
    const reverseAxis = (direction % 2 === 0) ? initPosition[1] : initPosition[0];
    // To increment or decrement the index, look for next grid
    let nextGrid = (direction <= 2) ? start - 1 : start + 1;

    while (continueMove) {
      if (Math.abs(nextGrid - start) === 4 || nextGrid < 0 || nextGrid > 9) {
        continueMove = false;
      } else {
        const currentGrid = (direction % 2 === 0) ? this.grids[nextGrid][reverseAxis] : this.grids[reverseAxis][nextGrid];
        // In a direction, if a grid is grayed or contains a player
        if (['grayGrid', 'first-player', 'second-player'].indexOf(currentGrid) >= 0) {
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
   * Returns a grid of the map that may contain a weapon
   * @param {Object} currentPlayer is current player
   * @param {Array} position is player's current position
   */
  updateNewWeapon(currentPlayer, position) {
    let weapon = -1;
    if (this.grids[position[0]][position[1]] !== 'O') {
      weapon = this.grids[position[0]][position[1]];
    }
    this.grids[position[0]][position[1]] = currentPlayer.order;
    return weapon;
  }

  /**
   * Allows to leave the player's old weapon in its old position on the map
   * @param {Object} currentPlayer is current player
   */
  updateOldWeapon(currentPlayer) {
    const x = currentPlayer.oldPosition[0];
    const y = currentPlayer.oldPosition[1];
    this.grids[x][y] = `${currentPlayer.oldWeapon.name} ${currentPlayer.oldWeapon.damage}`;
    const oldGrid = $(`#${x}-${y}`);

    const weaponImage = $('<img></img>');
    weaponImage.attr('src', `img/${currentPlayer.oldWeapon.image}`);
    weaponImage.addClass('img_arme');
    oldGrid.html(weaponImage);
  }

  /**
   * Updates the map
   * @param {Object} currentPlayer is current player
   * @param {Array} position is player's current position
   */
  updateMap(currentPlayer, position) {
    const playerImage = $('<img></img>');
    const oldGrid = $(`#${currentPlayer.oldPosition.join('-')}`);
    const newGrid = $(`#${position.join('-')}`);
    playerImage.attr('src', 'img/player.jpg');
    playerImage.addClass(currentPlayer.order); // Class allowing the change of color

    if (oldGrid.html().includes('player')) { // Frees old grid of player
      oldGrid.html('');
      const x = currentPlayer.oldPosition[0];
      const y = currentPlayer.oldPosition[1];
      this.grids[x][y] = '0';
    }
    newGrid.html(playerImage);
    $('.move_possible').removeClass('move_possible'); // Clears possible moves
  }

  /**
   * Checks if the 2 players crossed and returns true, otherwise returns false
   */
  fight() {
    const firstPlayerPos = this.players[0].position;
    const secondPlayerPos = this.players[1].position;
    const touchX = Math.abs(firstPlayerPos[0] - secondPlayerPos[0]) === 0 && Math.abs(firstPlayerPos[1] - secondPlayerPos[1]) === 1;
    const touchY = Math.abs(firstPlayerPos[0] - secondPlayerPos[0]) === 1 && Math.abs(firstPlayerPos[1] - secondPlayerPos[1]) === 0;
    return touchX || touchY;
  }
}
