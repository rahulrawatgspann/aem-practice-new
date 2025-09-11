import { div } from '../../scripts/dom-builder.js';

export default function decorate(block) {
  const wrapper = document.querySelector('.nav-container-wrapper');
  console.log('🎈 ~ decorate ~ wrapper: ~~~~~~~~~~~~~~~~~~~~ ', wrapper);
  wrapper?.parentElement?.removeAttribute('class');
  wrapper?.parentElement?.removeAttribute('style');

  const navContainerWrapper = div({
    class:
      'dhls-container',
  });
  const navContainerTitle = block.firstElementChild?.querySelector('p')?.textContent.trim() || '';
  console.log('🎈 ~ decorate ~ navContainerTitle: ~~~~~~~~~~~~~~~~~~~~ ', navContainerTitle);
  const dynamicData = Array.from(block.children).slice(1);
  navContainerWrapper.append(dynamicData);
  console.log('🎈 ~ decorate ~ dynamicData: ~~~~~~~~~~~~~~~~~~~~ ', dynamicData);
  console.log('🎈 ~ decorate ~ wrapper: ~~~~~~~~~~~~~~~~~~~~ ', wrapper);
  console.log('🎈 ~ decorate ~ block1: ~~~~~~~~~~~~~~~~~~~~ ', block);
  console.log('🎈 ~ decorate ~ block2: ~~~~~~~~~~~~~~~~~~~~ ', block.children);
  /* change to ul, li */
  // const ul = document.createElement('ul');
  // [...block.children].forEach((row) => {
  //   const li = document.createElement('li');
  //   moveInstrumentation(row, li);
  //   while (row.firstElementChild) li.append(row.firstElementChild);
  //   [...li.children].forEach((div) => {
  //     if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
  //     else div.className = 'cards-card-body';
  //   });
  //   ul.append(li);
  // });
  // block.textContent = '';
  // block.append(navContainerWrapper);
}
