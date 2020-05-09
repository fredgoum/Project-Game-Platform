class Interface {
  constructor(firstPlayer, secondPlayer) {
    this.players = [firstPlayer, secondPlayer];
    // Attack and defend buttons of players
    $('#first-player-attack').hide();
    $('#first-player-defend').hide();
    $('#second-player-attack').hide();
    $('#second-player-defend').hide();
    $('#battle_title').hide();
  }

  /**
   * Displays the game's battlefield when the 2 players cross
   */
  displayBattlefield() {
    $('#map').remove();
    $('#battle_title').show();
    $('#battle_title').css('text-align', 'center');
    $('#battle_title').css('margin-bottom', '3px');
    $('#battle_title').css('color', 'white');

    const playersDashboard = $('#first-player-dashboard, #second-player-dashboard');
    if (! playersDashboard.is(':visible')) { // Case on small screen
      playersDashboard.show();
      $('.game_interface').css('display', 'flex');
    }
  }
}
