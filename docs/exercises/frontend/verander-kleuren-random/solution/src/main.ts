import './style.css';
const body: HTMLTableSectionElement | null = document.querySelector<HTMLTableSectionElement>('#numbers');
const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#generate');
if (body === null || button === null) throw new Error('De tabel of knop ontbreekt.');
function renderNumbers(target: HTMLTableSectionElement): void {
  target.replaceChildren();
  for (let rowIndex: number = 0; rowIndex < 4; rowIndex++) {
    const row: HTMLTableRowElement = document.createElement('tr');
    for (let columnIndex: number = 0; columnIndex < 4; columnIndex++) {
      const value: number = Math.floor(Math.random() * 99) + 1;
      const cell: HTMLTableCellElement = document.createElement('td');
      cell.textContent = String(value);
      cell.classList.toggle('high', value > 10);
      row.appendChild(cell);
    }
    target.appendChild(row);
  }
}
button.addEventListener('click', (_event: MouseEvent): void => renderNumbers(body));
renderNumbers(body);
