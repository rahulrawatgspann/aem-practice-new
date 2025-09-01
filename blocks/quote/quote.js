export default function decorate(block) {
  const [quoteWrapper] = block.children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();

  // Add multiple classes to increase specificity
  blockquote.classList.add('text-blue-600', 'tailwind-test');

  quoteWrapper.replaceChildren(blockquote);

  // Test with inline styles to confirm Tailwind utilities exist
  block.style.cssText = 'background-color: rgb(254 249 195) !important; border-left: 4px solid rgb(234 179 8) !important; padding: 1rem !important;';
}
