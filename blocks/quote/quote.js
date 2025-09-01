export default function decorate(block) {
  const [quoteWrapper] = block.children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();

  // Add multiple classes to increase specificity
  blockquote.classList.add('bg-blue-500', 'text-white', 'px-4', 'py-2');

  quoteWrapper.replaceChildren(blockquote);
}
