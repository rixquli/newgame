/* eslint-disable no-undef */
class Inventory {
  constructor() {
    this.inventoryModal = new bootstrap.Modal("#inventory");
    this.lootbox = new bootstrap.Modal("#lootbox");
    this.init();
  }
  init() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) =>
        new bootstrap.Tooltip(tooltipTriggerEl, {
          html: true,
        })
    );
  }
  addItem(path, amount) {
    document.querySelector(
      ".modal-body.inventoryContent"
    ).innerHTML += `<div class="itemCount"><button class="inventoryItem" data-bs-toggle="tooltip" data-bs-placement="top"
      data-bs-custom-class="custom-tooltip"
      data-bs-title="This top tooltip is themed via CSS variables."><img src="${path}" alt="" /></button>${amount}</div>`;
  }
  statCreator(stat) {
    return `attack: ${stat.attack}<br>attack speed: ${stat.attackSpeed}`;
  }
  toggle() {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    [...tooltipTriggerList].map(
      (tooltipTriggerEl) =>
        new bootstrap.Tooltip(tooltipTriggerEl, {
          html: true,
        })
    );
    this.inventoryModal.toggle();
  }
  toggleLootbox() {
    this.lootbox.toggle();
  }
}

export { Inventory };
