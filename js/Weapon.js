class Weapon {
  constructor(name, damage) {
    this.name = name;
    this.image = `${this.name.toLowerCase()}.png`;
    this.damage = damage;
  }

  /**
   * Updates name, image and weapon damage of the current player in his dashboard
   * @param currentPlayer {Object} is the current player
   */
  updateWeapon(currentPlayer) {
    $(`#${currentPlayer.order}-weapon-name`).html(currentPlayer.weapon.name);
    $(`#${currentPlayer.order}-weapon-damage`).html(currentPlayer.weapon.damage);
    $(`#${currentPlayer.order}-weapon-image`).attr('src', `img/${currentPlayer.weapon.image}`);
  }
}
