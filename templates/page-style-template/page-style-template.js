/* eslint-disable */
export default function decorate(template) {
  template.classList.add('page-style-template');

  // Apply background color
  const bgColor = template.dataset.backgroundColor || '#ffffff';
  template.style.setProperty('--background-color', bgColor);
  template.setAttribute('data-background-color', bgColor);

  // Apply font family
  const font = template.dataset.fontFamily || 'Arial, sans-serif';
  template.style.setProperty('--font-family', font);
  template.setAttribute('data-font-family', font);

  // Apply padding
  const padding = template.dataset.padding || '20px';
  template.style.setProperty('--padding', padding);
  template.setAttribute('data-padding', padding);

  console.log('🎈 ~ Page Styling Template applied: ~~~~~~~~~~~~~~~~~~~~ ', { bgColor, font, padding });
}
