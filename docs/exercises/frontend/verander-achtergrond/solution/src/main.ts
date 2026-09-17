import './style.css';
const panel: HTMLDivElement | null = document.querySelector<HTMLDivElement>('#panel');
const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#change');
if (panel === null || button === null) throw new Error('Het paneel of de knop ontbreekt.');
button.addEventListener('click', (_event: MouseEvent): void => {
  panel.classList.toggle('active');
});
