export default function decorate(block) {
  const rows = [...block.children];
  let title = '';
  let description = '';

  // Extract content from the basic block structure
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1];

      if (key === 'title' || key === 'text') {
        title = value.textContent.trim();
      } else if (key === 'description') {
        description = value.textContent.trim();
      }
    }
  });

  // Simple HTML with Tailwind classes for testing
  block.innerHTML = `
    ${title ? `<h1>${title}</h1>` : '<h1>Hero Block</h1>'}
    ${description ? `<p>${description}</p>` : '<p>This is a test to see if Tailwind CSS is working.</p>'}
    <button class="bg-white text-blue-500 px-4 py-2 rounded">Test Button</button>
  `;
}
