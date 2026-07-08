
import { FormData } from '../types';

// FUNGSI INI SUDAH DIMATIKAN AI-NYA AGAR TIDAK PERLU API KEY
// Anda bisa langsung deploy tanpa error.

export const summarizeTracerData = async (formData: FormData): Promise<string> => {
  // Pesan ini akan muncul otomatis setelah user mengisi form
  return `Terima kasih, ${formData.identitas_namaLengkap}!

Data Anda telah berhasil kami simpan ke database.
Berikut adalah ringkasan data Anda:
- Program Studi: ${formData.identitas_programStudi}
- Tahun Lulus: ${formData.identitas_tahunLulus}
- Status Pekerjaan: ${formData.pekerjaan_status}

Semoga sukses selalu untuk karir dan masa depan Anda.
(Pesan ini dibuat otomatis oleh sistem Tracer Study)`;
};
