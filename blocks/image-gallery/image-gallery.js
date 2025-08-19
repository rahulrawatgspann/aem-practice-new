export default function decorate(block) {
  const images = [...block.querySelectorAll('picture')];

  const gallery = document.createElement('div');
  gallery.className = 'gallery-grid';

  images.forEach((pic) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';
    wrapper.appendChild(pic);
    gallery.appendChild(wrapper);
  });

  block.textContent = ''; // Clear original content
  block.appendChild(gallery);
}
