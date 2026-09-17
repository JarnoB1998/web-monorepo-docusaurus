import './style.css';
const cells: NodeListOf<HTMLTableCellElement> = document.querySelectorAll<HTMLTableCellElement>('td');
cells.forEach((cell: HTMLTableCellElement): void => {
  const value: number = Number(cell.textContent);
  cell.classList.toggle('high', Number.isFinite(value) && value > 10);
});
