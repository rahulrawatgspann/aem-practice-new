// blocks/nav-container/nav-container.js

export default function decorate(block) {
  // Get all rows in the block
  const rows = [...block.children];
  console.log('🎈 ~ decorate ~ rows: ~~~~~~~~~~~~~~~~~~~~ ', rows);

  // The first row should contain the nav container title
  let titleRow = null;
  const itemRows = [];

  rows.forEach((row) => {
    const cells = [...row.children];

    // Check if this row contains the title (usually the first row or a row with single cell)
    if (cells.length === 1 && cells[0].textContent.trim() && !cells[0].querySelector('div')) {
      titleRow = row;
      // Add data attribute for easier querying
      cells[0].setAttribute('data-field', 'nav_container_title');
      cells[0].classList.add('nav-container-title');
    } else {
      // This is likely a nav-item row
      itemRows.push(row);
    }
  });

  // Process nav items
  itemRows.forEach((row) => {
    const cells = [...row.children];

    // Each nav-item should have title and link
    if (cells.length >= 2) {
      row.classList.add('nav-item');

      // First cell is title
      if (cells[0]) {
        cells[0].setAttribute('data-field', 'item_title');
        cells[0].classList.add('item-title');
      }

      // Second cell is link
      if (cells[1]) {
        cells[1].setAttribute('data-field', 'item_link');
        cells[1].classList.add('item-link');
      }

      // Third cell might be item type (if you added it)
      if (cells[2]) {
        cells[2].setAttribute('data-field', 'item_type');
        cells[2].classList.add('item-type');
      }

      // Fourth cell might be open in new tab flag
      if (cells[3]) {
        cells[3].setAttribute('data-field', 'open_in_new_tab');
        cells[3].classList.add('open-in-new-tab');
      }
    }
  });

  // Add container class
  block.classList.add('nav-container-block');
}
