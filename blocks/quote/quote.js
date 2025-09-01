export default function decorate(block) {
  const [quoteWrapper] = block.children;

  const blockquote = document.createElement('blockquote');
  blockquote.textContent = quoteWrapper.textContent.trim();

  // Add Tailwind classes to test
  blockquote.classList.add('text-xl', 'font-semibold', 'text-blue-600');

  quoteWrapper.replaceChildren(blockquote);

  // Add Tailwind classes to the wrapper
  block.classList.add('bg-yellow-100', 'border-l-4', 'border-yellow-500', 'p-4');
}
