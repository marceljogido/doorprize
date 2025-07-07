import * as XLSX from 'xlsx';

interface Guest {
  name: string;
  divisi: string;
  npp: string;
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

    if (!nameCell || !divisiCell || !nppCell) {
      break;
    }

    const name = nameCell.v;
    const divisi = divisiCell.v;
    const npp = String(nppCell.v);

    guests.push({ name, divisi, npp });
    rowIndex++;
  }

  return guests;
};

export type { Guest };
