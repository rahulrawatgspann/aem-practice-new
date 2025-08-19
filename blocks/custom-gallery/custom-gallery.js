export default function decorate(block) {
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });

  const caption = document.createElement('div');
  caption.className = 'caption';
  caption.textContent = block.dataset.caption || 'Gallery';
  block.appendChild(caption);
}
