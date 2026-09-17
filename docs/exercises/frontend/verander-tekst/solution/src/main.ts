import './style.css';
const panel: HTMLDivElement | null = document.querySelector<HTMLDivElement>('#panel');
const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#change');
if (panel === null || button === null) throw new Error('Het paneel of de knop ontbreekt.');
const originalText: string = panel.textContent ?? '';
let changed: boolean = false;
button.addEventListener('click', (_event: MouseEvent): void => {
  changed = !changed;
  panel.textContent = changed ? 'De tekst is veranderd!' : originalText;
});
