export default function decorate(block) {
  const images = block.querySelectorAll('img');
  images.forEach((img) => {
    img.setAttribute('loading', 'lazy');
  });
  console.log('images.......................................', images);
  const caption = document.createElement('div');
  caption.className = 'caption';
  caption.textContent = block.dataset.caption || 'Gallery';
  console.log('caption........................................', caption);
  block.appendChild(caption);
}
