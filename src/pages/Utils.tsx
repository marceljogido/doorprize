import React, { useState } from 'react';
import { useGuests } from '../context/GuestContext';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const Utils: React.FC = () => {
  const { fetchGuests, guests, setGuests } = useGuests();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const getGuests = async () => {
    try {
      // Ambil file Excel dari public
      const response = await fetch('/template/antam-data2025.xlsx');
      if (!response.ok) throw new Error('Gagal mengambil file Excel dari public!');
      const arrayBuffer = await response.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedGuests = [];
      let rowIndex = 4;
      while (true) {
        const nameCell = sheet[`A${rowIndex}`];
        const divisiCell = sheet[`B${rowIndex}`];
        const nppCell = sheet[`C${rowIndex}`];
        const statusCell = sheet[`D${rowIndex}`];
        if (!nameCell && !divisiCell && !nppCell && !statusCell) break;
        importedGuests.push({
          name: nameCell ? nameCell.v : '',
          divisi: divisiCell ? divisiCell.v : '',
          npp: nppCell ? String(nppCell.v) : '',
          status: statusCell ? statusCell.v : '',
        });
        rowIndex++;
      }
      setGuests(importedGuests);
      localStorage.setItem('guests', JSON.stringify(importedGuests));
      setStatus('Data tamu berhasil diambil dari file Excel public!');
    } catch (error) {
      setStatus('Gagal mengambil data tamu dari file Excel public!');
      console.error('Error fetching guests from public Excel:', error);
    }
  };

  const exportToExcel = () => {
    try {
      const storedGuests: { name: string; divisi: string; npp: string; status: string }[] = JSON.parse(localStorage.getItem('guests') || '[]');
      if (!storedGuests.length) {
        setStatus('Tidak ada data tamu untuk diekspor!');
        return;
      }
      const formattedGuests = storedGuests.map((guest) => [guest.name, guest.divisi, guest.npp, guest.status]);
      const ws = XLSX.utils.aoa_to_sheet([
        [],
        ['Nama', 'Divisi', 'NPP', 'Status'],
        ...formattedGuests
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Guests');
      XLSX.writeFile(wb, 'guests.xlsx');
      setStatus('Data tamu berhasil diekspor ke Excel!');
    } catch (error) {
      setStatus('Gagal mengekspor data tamu!');
      console.error('Error exporting guests to Excel:', error);
    }
  };

  const deleteAllGuests = () => {
    setGuests([]);
    localStorage.removeItem('guests');
    setStatus('Semua data tamu berhasil dihapus!');
  };

  const removeGuest = (name: string) => {
    setGuests(prev => {
      const updated = prev.filter(g => g.name !== name);
      localStorage.setItem('guests', JSON.stringify(updated));
      return updated;
    });
    setStatus(`Tamu dengan nama "${name}" berhasil dihapus!`);
  };

  const importFromExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const importedGuests = [];
      let rowIndex = 4;
      while (true) {
        const nameCell = sheet[`A${rowIndex}`];
        const divisiCell = sheet[`B${rowIndex}`];
        const nppCell = sheet[`C${rowIndex}`];
        const statusCell = sheet[`D${rowIndex}`];
        if (!nameCell && !divisiCell && !nppCell && !statusCell) break;
        importedGuests.push({
          name: nameCell ? nameCell.v : '',
          divisi: divisiCell ? divisiCell.v : '',
          npp: nppCell ? String(nppCell.v) : '',
          status: statusCell ? statusCell.v : '',
        });
        rowIndex++;
      }
      setGuests(importedGuests);
      localStorage.setItem('guests', JSON.stringify(importedGuests));
      setStatus('Data tamu berhasil diimpor dari Excel!');
    } catch (error) {
      setStatus('Gagal mengimpor data tamu dari Excel!');
      console.error(error);
    }
  };

  const downloadTemplate = () => {
    // File template sudah ada di public/template/doorprize-excel-template.xlsx
    const link = document.createElement('a');
    link.href = '/template/doorprize-excel-template.xlsx';
    link.download = 'doorprize-excel-template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setStatus('Template Excel berhasil diunduh!');
  };

  // Filter guests berdasarkan pencarian (Nama, Divisi, NPP) - mempertahankan urutan asli
  const filteredGuests = React.useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return guests;
    return guests.filter(g =>
      typeof g.name === 'string' &&
      typeof g.divisi === 'string' &&
      typeof g.npp === 'string' &&
      (
        g.name.toLowerCase().includes(searchTerm) ||
        g.divisi.toLowerCase().includes(searchTerm) ||
        g.npp.toLowerCase().includes(searchTerm)
      )
    );
  }, [guests, search]);

  return (
    <div className="flex flex-col min-h-screen px-8 py-8 bg-gray-50">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 px-4 py-2 border-2 border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
      >
        ← Kembali
      </button>
      
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Manajemen Data Tamu</h1>
        
        {status && (
          <div className="mb-6 p-4 bg-blue-100 text-blue-800 rounded-lg text-center border border-blue-200">
            {status}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Aksi Utama</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <button
              onClick={getGuests}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
            >
              📥 Ambil Data Tamu
            </button>
            <button
              onClick={exportToExcel}
              className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 font-medium"
            >
              📤 Ekspor ke Excel
            </button>
            <button
              onClick={deleteAllGuests}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
            >
              🗑️ Hapus Semua Data
            </button>
            <button
              onClick={downloadTemplate}
              className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium"
            >
              📋 Download Template
            </button>
            <label className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 font-medium cursor-pointer flex items-center justify-center">
              📁 Import dari Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={importFromExcel}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Pencarian</h2>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="text"
              placeholder="Cari nama, divisi, atau NPP..."
              value={search}
              onChange={e => {
                console.log('Search input changed:', e.target.value);
                setSearch(e.target.value);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                🗑️ Bersihkan
              </button>
            )}
          </div>
          {search && (
            <p className="mt-2 text-sm text-gray-600">
              Mencari: "{search}" - Ditemukan {filteredGuests.length} data
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Daftar Tamu ({filteredGuests.length} data)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">No</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Nama</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Divisi</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">NPP</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      {search ? 'Tidak ada data yang sesuai dengan pencarian.' : 'Tidak ada data tamu.'}
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest, idx) => (
                    <tr key={guest.name + guest.npp} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{idx + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.divisi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.npp}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{guest.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => removeGuest(guest.name)}
                          className="px-3 py-1 bg-red-400 text-white rounded-md hover:bg-red-600 transition-colors duration-200 text-xs font-medium"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Utils;
