import './style.css';
const panels: NodeListOf<HTMLDivElement> = document.querySelectorAll<HTMLDivElement>('.panel');
const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#change');
if (button === null || panels.length === 0) throw new Error('De knop of panelen ontbreken.');
let activeIndex: number = -1;
button.addEventListener('click', (_event: MouseEvent): void => {
  activeIndex = (activeIndex + 1) % panels.length;
  panels.forEach((panel: HTMLDivElement, index: number): void => {
    panel.classList.toggle('active', index === activeIndex);
  });
});
