class Player {
  constructor(name) {
    this.name = name;
    this.weapon = {};
    this.oldWeapon = {};
    this.position = [];
    this.oldPosition = [];
    this.enemy = {};
    this.lifePoints = 100;
    this.order = ''; // Determine if it is the first or second player
    this.fight = ''; // Defined if player attacked or defended during a combat turn
  }

  /**
   * Allows to display attack and defend buttons of the player in his dashboard
   * @param {Object} player is current player
   */
  displayButtons(player) {
    const attackButton = $(`#${player.order}-attack`);
    const defendButton = $(`#${player.order}-defend`);
    attackButton.show();
    defendButton.show();

    const that = this;
    attackButton.on('click', (event) => {
      event.stopImmediatePropagation();
      attackButton.hide();
      defendButton.hide();

      player.fight = 'attack'; // To specify that the player attacked
      that.caluculateLifePoints(player);

      const nextPlayer = player.enemy;
      that.displayButtons(nextPlayer);
    });
    defendButton.on('click', (e) => {
      event.stopImmediatePropagation();
      attackButton.hide();
      defendButton.hide();

      player.fight = 'defend'; // To specify that the player defended

      const nextPlayer = player.enemy;
      that.displayButtons(nextPlayer);
    });
  }

  /**
   * Calculates the remaining life points of the players
   * @param {Object} player is current player
   */
  caluculateLifePoints(player) {
    let points = 100;
    if (player.enemy.fight === 'defend') { // If the enemy defends he takes 50% of the player's damages
      points = Math.abs(player.enemy.lifePoints - (player.weapon.damage / 2));
    } else { // Otherwise he takes 100% of damages
      points = Math.abs(player.enemy.lifePoints - player.weapon.damage);
    }
    if (player.enemy.lifePoints < player.weapon.damage) {
      points = 0;
    }
    player.enemy.lifePoints = points;
    this.updateLifeBar(player.enemy);
  }

  /**
   * Updates player's life points and life bar
   * @param {Object} player is attacked player
   */
  updateLifeBar(player) {
    $(`#${player.order}-lifebar`).html(`${player.lifePoints}%`);
    $(`#${player.order}-lifebar`).css('width', `${player.lifePoints}%`);

    if (player.lifePoints == 0) { // When a player's life points drop to 0..
      this.gameOver(player); // ..display winner and game over
    }
  }

  /**
   * Indicates that the game is over and displays the winner's name
   * @param {Obeject} player is the player who dies
   */
  gameOver(player) {
    const winnerPlayer = player.enemy;

    const gameOver = '<b>GAME OVER</b></br></br></br>';
    const winner = `<b>Nice fight ${winnerPlayer.name}<b></br></br></br>`;
    const thanks = '<b><i>Thank you for playing</i><b>';

    $('#battle_title').hide();
    $('.game_interface').html(`<p style='text-align: center; color: white'>${gameOver}${winner}${thanks}</p>`);
  }
}
