
export interface FormData {
  // A. Identitas Alumni
  identitas_nim: string;
  identitas_namaLengkap: string;
  identitas_tahunMasuk: string;
  identitas_tahunLulus: string;
  identitas_programStudi: string;
  identitas_noHp: string;
  identitas_email: string;
  identitas_alamatDomisili: string;
  identitas_jenisKelamin: string;
  identitas_statusPernikahan: string;

  // B. Pendidikan dan Pengalaman di Kampus
  pendidikan_kualitasPembelajaran: string;
  pendidikan_relevansiKurikulum: string;
  pendidikan_pelayananDosen: string;
  pendidikan_pengembanganSoftSkill: string;
  pendidikan_keterampilanBermanfaat: string;

  // C. Status Pekerjaan Saat Ini
  pekerjaan_status: string;
  pekerjaan_waktuTunggu?: string;
  pekerjaan_jenisPekerjaanPertama?: string;
  pekerjaan_jenisPekerjaanPertamaLainnya?: string;
  pekerjaan_kesesuaianBidangStudi?: string;
  pekerjaan_namaInstansi?: string;
  pekerjaan_jabatan?: string;
  pekerjaan_lamaBekerja?: string;
  pekerjaan_pendapatan?: string;

  // D. Relevansi dan Kompetensi
  relevansi_kontribusiIlmu?: string;
  relevansi_kompetensiDibutuhkan?: string;
  relevansi_pengalamanPraktik?: string;
  relevansi_aspekPerluDitingkatkan?: string;

  // E. Melanjutkan Studi
  studiLanjut_status: string;
  studiLanjut_namaUniversitas?: string;
  studiLanjut_programStudi?: string;

  // F. Hubungan dengan Kampus
  hubungan_komunikasi: string;
  hubungan_kesediaanTerlibat: string;
  hubungan_masukanPeningkatanMutu: string;

  // G. Kontak Jaringan Alumni
  jaringan_tergabungKomunitas: string;
  jaringan_mediaKomunitas?: string;
  jaringan_mediaKomunitasLainnya?: string;

  // Allow dynamic keys from custom questions
  [key: string]: any;
}

export interface Alumnus {
  nim: string;
  name: string;
  angkatan: string;
  hasSubmitted: boolean;
}

export type QuestionType = 'text' | 'textarea' | 'select' | 'radio';

export interface Question {
  id: string;
  label: string;
  type: QuestionType;
  section: string; // 'identitas', 'pendidikan', 'pekerjaan', 'studi_lanjut', 'hubungan'
  options?: string[]; // For select or radio
  required: boolean;
}
