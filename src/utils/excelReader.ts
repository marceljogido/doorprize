import * as XLSX from 'xlsx';

interface Guest {
  name: string;
  divisi: string;
  npp: string;
  status: string;
}

export const readExcel = (file: ArrayBuffer): Guest[] => {
  const data = new Uint8Array(file);
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const guests: Guest[] = [];
  let rowIndex = 4;

  while (true) {
    const nameCell = sheet[`A${rowIndex}`];
    const divisiCell = sheet[`B${rowIndex}`];
    const nppCell = sheet[`C${rowIndex}`];
    const statusCell = sheet[`D${rowIndex}`];

    if (!nameCell && !divisiCell && !nppCell && !statusCell) {
      break;
    }

    const name = nameCell ? nameCell.v : '';
    const divisi = divisiCell ? divisiCell.v : '';
    const npp = nppCell ? String(nppCell.v) : '';
    const status = statusCell ? statusCell.v : '';

    guests.push({ name, divisi, npp, status });
    rowIndex++;
  }

  return guests;
};

export type { Guest };
