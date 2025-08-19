export default function decorate(block) {
  const model = block.dataset.model ? JSON.parse(block.dataset.model) : {};
  const images = model.images || [];

  const gallery = document.createElement('div');
  gallery.className = 'gallery-grid';

  images.forEach(({ src, alt }) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';

    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    picture.appendChild(img);

    wrapper.appendChild(picture);
    gallery.appendChild(wrapper);
  });

  block.textContent = '';
  block.appendChild(gallery);
}
