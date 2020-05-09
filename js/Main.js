$(document).ready(function() {
  $("body").css("display", "block"); // To load the whole page at the same time
  
  // Instantiation of players
  const firstPlayer = new Player("Player 1");
  const secondPlayer = new Player("Player 2");
  firstPlayer.order = "first-player";
  secondPlayer.order = "second-player";
  firstPlayer.enemy = secondPlayer;
  secondPlayer.enemy = firstPlayer;

  // Set default weapons for players
  firstPlayer.weapon = new Weapon("Revolver", 10);
  firstPlayer.oldWeapon = new Weapon("Revolver", 10);
  secondPlayer.weapon = new Weapon("Revolver", 10);
  secondPlayer.oldWeapon = new Weapon("Revolver", 10);

  // Instantiation of map and interface 
  const map = new Map(firstPlayer, secondPlayer);
  const interface = new Interface(firstPlayer, secondPlayer);

  // Responsive design management
  resizeMap();
  $(window).resize(resizeMap);

  // Beginning of the game
  let currentPlayerIndex = 0;
  let currentPlayer;
  startGame(currentPlayerIndex);
    
  /**
   * Starts the game and manages the turn by turn
   * @param {Int} currentPlayerIndex is the index of current player
   */
  function startGame(currentPlayerIndex) {
    currentPlayer = map.players[currentPlayerIndex];
    const position = currentPlayer.position;                
    map.displayPlayerDirections(position, movePlayer);
  }

  /**
   * Manages the movements of a player on the map
   * @param {Event} event is a event
   */
  function movePlayer(event) {
    $(".move_possible").off("click", movePlayer);
    let position = event.target.id.split("-");
    if (position.length != 2) { // Get parent's id if player comes across an image
      position = $(event.target).parent().attr("id").split("-");
    }

    // Update player positions
    currentPlayer.oldPosition = currentPlayer.position;
    currentPlayer.position = [parseInt(position[0]), parseInt(position[1])];
      
    const weapon = map.updateNewWeapon(currentPlayer, position); 
    if (map.mapWeapons.includes(weapon)) { // If player comes across a weapon
      currentPlayer.oldWeapon = currentPlayer.weapon;
      const WeaponName = weapon.split(" ")[0];
      const WeaponDamage = weapon.split(" ")[1];
      currentPlayer.weapon = new Weapon(WeaponName, WeaponDamage);

      map.updateOldWeapon(currentPlayer); // Leave the player's old weapon in its old position
      currentPlayer.weapon.updateWeapon(currentPlayer); // Update player weapon in dashbord
    }
    map.updateMap(currentPlayer, position);

    if (! map.fight()) { // If the 2 players do not cross then game continues
      if (currentPlayer.order == "first-player") {
        currentPlayerIndex = 1;
      } else {
        currentPlayerIndex = 0;
      }
      startGame(currentPlayerIndex);
    } else { // Otherwise a death fight is launched
      interface.displayBattlefield();
      currentPlayer.displayButtons(currentPlayer); // Display attack and defend buttons of current player
    }
  }

  /**
   * Resize map width based on terminal screen
   */
  function resizeMap() {
    const $width = $("table").width(); // Width of map
    setWidth($width); // Calculate new width of map

    const playersDashboard = $("#first-player-dashboard, #second-player-dashboard");
    if ($(document).width() < 880) {
      playersDashboard.hide(); // ..dashboards will be displayed during the fight
    } else {
      playersDashboard.show();            
    }
  }

  /**
   * Calculate map width based on screen size
   * @param {Int} $width is map width
   */
  function setWidth($width) {
    const $tdWidth = Math.trunc($width / 10); // Get the closest value below
    const $finalWidth = $tdWidth * 10; // Calculate the map final size
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
