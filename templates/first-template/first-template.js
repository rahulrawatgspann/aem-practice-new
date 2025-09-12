/* eslint-disable */
export default function decorate(template) {
  // ✅ Add a class to the template element itself
  template.classList.add('product-landing-template');

  // ✅ Add a class to the body for global styling (optional)
  document.body.classList.add('product-landing-template-body');

  // ✅ Scroll to top when this template is loaded
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // ✅ Example: Add a heading if not present
  if (!template.querySelector('.template-heading')) {
    const heading = document.createElement('h2');
    heading.className = 'template-heading';
    heading.textContent = 'Welcome to Our Product Page';
    template.prepend(heading);
  }

  // ✅ Example: Log block types inside the template
  const blocks = template.querySelectorAll('.block');
  blocks.forEach((block, index) => {
    console.log(`Block ${index + 1}:`, block.className);
  });

  // ✅ Optional: Add analytics or custom behavior
  console.log('Product Landing Template initialized');
}
