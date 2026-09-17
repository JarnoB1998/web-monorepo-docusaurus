import './style.css';
import {isRecord, fetchJson, errorMessage} from './api';
interface ForecastDay { date: string; minimum: number; maximum: number; }
function parseForecast(value: unknown): ForecastDay[] {
  if (!isRecord(value) || !isRecord(value.daily)) throw new Error('Daggegevens ontbreken.');
  const daily: Record<string, unknown> = value.daily;
  if (!Array.isArray(daily.time) || !Array.isArray(daily.temperature_2m_min) || !Array.isArray(daily.temperature_2m_max)) throw new Error('Onverwachte weersgegevens.');
  const dates: unknown[] = daily.time;
  const minima: unknown[] = daily.temperature_2m_min;
  const maxima: unknown[] = daily.temperature_2m_max;
  if (dates.length !== 7 || minima.length !== dates.length || maxima.length !== dates.length) throw new Error('Er worden zeven volledige dagen verwacht.');
  return dates.map((date: unknown, index: number): ForecastDay => {
    const minimum: unknown = minima[index];
    const maximum: unknown = maxima[index];
    if (typeof date !== 'string' || typeof minimum !== 'number' || !Number.isFinite(minimum)
      || typeof maximum !== 'number' || !Number.isFinite(maximum)) throw new Error('Een dag bevat ongeldige waarden.');
    return {date, minimum, maximum};
  });
}
function main(): void {
  const form: HTMLFormElement | null = document.querySelector<HTMLFormElement>('#location');
  const latitudeInput: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#latitude');
  const longitudeInput: HTMLInputElement | null = document.querySelector<HTMLInputElement>('#longitude');
  const button: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('#submit');
  const status: HTMLParagraphElement | null = document.querySelector<HTMLParagraphElement>('#status');
  const table: HTMLTableSectionElement | null = document.querySelector<HTMLTableSectionElement>('#forecast');
  if (form === null || latitudeInput === null || longitudeInput === null || button === null || status === null || table === null) throw new Error('De HTML is onvolledig.');
  let loading: boolean = false;
  const load: () => Promise<void> = async (): Promise<void> => {
    if (loading) return;
    table.replaceChildren();
    const latitude: number = latitudeInput.valueAsNumber;
    const longitude: number = longitudeInput.valueAsNumber;
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      status.textContent = 'Geef geldige coördinaten op.'; return;
    }
    loading = true; button.disabled = true; status.textContent = 'Weer laden…';
    try {
      const url: URL = new URL('https://api.open-meteo.com/v1/forecast');
      url.search = new URLSearchParams({latitude: String(latitude), longitude: String(longitude), daily: 'temperature_2m_min,temperature_2m_max', timezone: 'auto', forecast_days: '7'}).toString();
      const data: unknown = await fetchJson(url);
      const days: ForecastDay[] = parseForecast(data);
      days.forEach((day: ForecastDay): void => {
        const row: HTMLTableRowElement = document.createElement('tr');
        const values: string[] = [day.date, day.minimum.toFixed(1), day.maximum.toFixed(1)];
        values.forEach((value: string): void => {
          const cell: HTMLTableCellElement = document.createElement('td');
          cell.textContent = value; row.appendChild(cell);
        });
        table.appendChild(row);
      });
      status.textContent = `Voorspelling voor ${latitude}, ${longitude}: zeven dagen.`;
    } catch (error: unknown) { status.textContent = errorMessage(error); }
    finally { loading = false; button.disabled = false; }
  };
  form.addEventListener('submit', (event: SubmitEvent): void => { event.preventDefault(); void load(); });
  void load();
}
main();
