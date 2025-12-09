import { GoogleGenAI } from "@google/genai";
import { FormData } from '../types';

function formatDataForPrompt(data: FormData): string {
    const sections: { [key: string]: { [key: string]: string } } = {
        'A. Identitas Alumni': {
            'Nama Lengkap': data.identitas_namaLengkap,
            'Tahun Masuk dan Tahun Lulus': `${data.identitas_tahunMasuk} - ${data.identitas_tahunLulus}`,
            'Program Studi': data.identitas_programStudi,
            'Nomor HP / WhatsApp': data.identitas_noHp,
            'Alamat Email': data.identitas_email,
            'Alamat Domisili': data.identitas_alamatDomisili,
            'Jenis Kelamin': data.identitas_jenisKelamin,
            'Status Pernikahan': data.identitas_statusPernikahan,
        },
        'B. Pendidikan dan Pengalaman di Kampus': {
            'Penilaian Kualitas Proses Pembelajaran': data.pendidikan_kualitasPembelajaran,
            'Relevansi Kurikulum dengan Dunia Kerja': data.pendidikan_relevansiKurikulum,
            'Pelayanan Akademik Dosen & Tendik': data.pendidikan_pelayananDosen,
            'Peran Kegiatan Kampus dalam Pengembangan Soft Skill': data.pendidikan_pengembanganSoftSkill,
            'Keterampilan Paling Bermanfaat Setelah Lulus': data.pendidikan_keterampilanBermanfaat || 'Tidak diisi',
        },
        'C. Status Pekerjaan Saat Ini': {
            'Apakah Saat Ini Sudah Bekerja?': data.pekerjaan_status,
        },
        'D. Relevansi dan Kompetensi': {},
        'E. Melanjutkan Studi': {
            'Apakah Melanjutkan Studi?': data.studiLanjut_status,
        },
        'F. Hubungan dengan Kampus': {
            'Komunikasi dengan Dosen/Kampus Setelah Lulus': data.hubungan_komunikasi,
            'Kesediaan Terlibat dalam Kegiatan Kampus': data.hubungan_kesediaanTerlibat,
            'Masukan/Saran untuk Peningkatan Mutu': data.hubungan_masukanPeningkatanMutu || 'Tidak diisi',
        },
        'G. Kontak Jaringan Alumni': {
            'Tergabung dalam Komunitas Alumni?': data.jaringan_tergabungKomunitas,
        },
    };

    if (data.pekerjaan_status === 'Ya') {
        sections['C. Status Pekerjaan Saat Ini'] = {
            ...sections['C. Status Pekerjaan Saat Ini'],
            'Waktu Tunggu Mendapatkan Pekerjaan Pertama': data.pekerjaan_waktuTunggu,
            'Jenis Pekerjaan Pertama': data.pekerjaan_jenisPekerjaanPertama === 'Lainnya' ? data.pekerjaan_jenisPekerjaanPertamaLainnya : data.pekerjaan_jenisPekerjaanPertama,
            'Kesesuaian Pekerjaan dengan Bidang Studi': data.pekerjaan_kesesuaianBidangStudi,
            'Nama Instansi/Tempat Kerja Saat Ini': data.pekerjaan_namaInstansi,
            'Jabatan/Posisi': data.pekerjaan_jabatan,
            'Lama Bekerja di Instansi Tersebut': data.pekerjaan_lamaBekerja,
            'Pendapatan Rata-rata per Bulan': data.pekerjaan_pendapatan,
        };
        sections['D. Relevansi dan Kompetensi'] = {
            'Kontribusi Ilmu Terhadap Pekerjaan': data.relevansi_kontribusiIlmu,
            'Kompetensi Paling Dibutuhkan dalam Pekerjaan': data.relevansi_kompetensiDibutuhkan,
            'Kecukupan Pengalaman Praktik/Magang': data.relevansi_pengalamanPraktik,
            'Aspek yang Perlu Ditingkatkan Kampus': data.relevansi_aspekPerluDitingkatkan || 'Tidak diisi',
        };
    }

    if (data.studiLanjut_status === 'Ya') {
        sections['E. Melanjutkan Studi'] = {
            ...sections['E. Melanjutkan Studi'],
            'Nama Universitas': data.studiLanjut_namaUniversitas,
            'Program Studi Lanjutan': data.studiLanjut_programStudi,
        };
    }
    
    if (data.jaringan_tergabungKomunitas === 'Ya') {
        sections['G. Kontak Jaringan Alumni'] = {
            ...sections['G. Kontak Jaringan Alumni'],
            'Media Komunitas yang Digunakan': data.jaringan_mediaKomunitas === 'Lainnya' ? data.jaringan_mediaKomunitasLainnya : data.jaringan_mediaKomunitas,
        };
    }

    let formattedString = '';
    for (const [sectionTitle, fields] of Object.entries(sections)) {
        if (Object.keys(fields).length > 0) {
            formattedString += `\n**${sectionTitle}**\n`;
            for (const [label, value] of Object.entries(fields)) {
                formattedString += `- ${label}: ${value || 'Tidak diisi'}\n`;
            }
        }
    }

    return formattedString.trim();
}

function generateFallbackSummary(data: FormData): string {
    return `Terima kasih, ${data.identitas_namaLengkap}!\n\nData Anda telah berhasil kami terima. Berikut adalah ringkasan singkat:\n- Program Studi: ${data.identitas_programStudi}\n- Tahun Lulus: ${data.identitas_tahunLulus}\n- Status Pekerjaan: ${data.pekerjaan_status}\n\nKontribusi Anda sangat berarti bagi pengembangan almamater STAI Imam Syafi'i Cianjur.`;
}

export const summarizeTracerData = async (formData: FormData): Promise<string> => {
  let apiKey: string | undefined = undefined;

  try {
      // Access process.env safely to prevent ReferenceError in pure browser environments
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
          // @ts-ignore
          apiKey = process.env.API_KEY;
      }
  } catch (e) {
      // Ignore errors if process is not available
  }

  // Strong validation: check for empty string, null, undefined, or string literal "undefined"
  if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey === 'undefined') {
      console.warn("API Key is not set or invalid. Using fallback summary.");
      return generateFallbackSummary(formData);
  }

  try {
    // Instantiate inside try-catch to catch SDK initialization errors (like "API Key must be set")
    const ai = new GoogleGenAI({ apiKey: apiKey });
    const model = 'gemini-2.5-flash';
    const prompt = `
      Anda adalah asisten otomatis dari kantor hubungan alumni STAI Imam Syafi'i Cianjur. 
      Tugas Anda adalah membuat pesan konfirmasi yang hangat dan profesional untuk seorang alumni yang baru saja mengisi survei tracer study yang komprehensif.

      Berikut adalah data yang mereka kirimkan:
      ${formatDataForPrompt(formData)}

      Tolong buatkan pesan konfirmasi dengan struktur berikut:
      1. Mulai dengan ucapan terima kasih yang tulus kepada alumni, sebutkan nama lengkap mereka.
      2. Berikan ringkasan singkat dari informasi kunci yang mereka berikan. Kelompokkan poin-poin ringkasan berdasarkan kategori yang relevan (misalnya, Identitas, Pengalaman Kampus, Status Karir).
      3. Jangan mengarang informasi apapun yang tidak ada di data. Pastikan semua ringkasan akurat.
      4. Tutup dengan pesan positif, sampaikan bahwa kontribusi mereka sangat berarti bagi pengembangan almamater.
      
      Pastikan responsnya hanya berupa teks tunggal yang siap ditampilkan di halaman konfirmasi. Gunakan bahasa Indonesia yang baik, ramah, dan profesional.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary with Gemini:", error);
    // Return a fallback summary instead of throwing, ensuring the user can still complete their submission
    return generateFallbackSummary(formData);
  }
};