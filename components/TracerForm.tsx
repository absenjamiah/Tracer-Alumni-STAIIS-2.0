
import React, { useState, useMemo } from 'react';
import { FormData, Question } from '../types';
import { InputField } from './InputField';
import { SelectField } from './SelectField';
import { TextArea } from './TextArea';
import { RadioGroupField } from './RadioGroupField';

interface TracerFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  customQuestions: Question[];
}

const formSteps = [
    { id: 'identitas', title: 'Identitas', fullTitle: 'Identitas Alumni', fields: ['identitas_nim', 'identitas_namaLengkap', 'identitas_tahunMasuk', 'identitas_tahunLulus', 'identitas_programStudi', 'identitas_noHp', 'identitas_email', 'identitas_alamatDomisili', 'identitas_jenisKelamin', 'identitas_statusPernikahan'] },
    { id: 'pendidikan', title: 'Akademik', fullTitle: 'Pendidikan & Pengalaman', fields: ['pendidikan_kualitasPembelajaran', 'pendidikan_relevansiKurikulum', 'pendidikan_pelayananDosen', 'pendidikan_pengembanganSoftSkill', 'pendidikan_keterampilanBermanfaat'] },
    { id: 'pekerjaan', title: 'Karir', fullTitle: 'Pekerjaan & Relevansi', fields: ['pekerjaan_status', 'pekerjaan_waktuTunggu', 'pekerjaan_jenisPekerjaanPertama', 'pekerjaan_jenisPekerjaanPertamaLainnya', 'pekerjaan_kesesuaianBidangStudi', 'pekerjaan_namaInstansi', 'pekerjaan_jabatan', 'pekerjaan_lamaBekerja', 'pekerjaan_pendapatan', 'relevansi_kontribusiIlmu', 'relevansi_kompetensiDibutuhkan', 'relevansi_pengalamanPraktik', 'relevansi_aspekPerluDitingkatkan'] },
    { id: 'studi_lanjut', title: 'Studi', fullTitle: 'Studi Lanjut', fields: ['studiLanjut_status', 'studiLanjut_namaUniversitas', 'studiLanjut_programStudi'] },
    { id: 'hubungan', title: 'Relasi', fullTitle: 'Hubungan & Jaringan', fields: ['hubungan_komunikasi', 'hubungan_kesediaanTerlibat', 'hubungan_masukanPeningkatanMutu', 'jaringan_tergabungKomunitas', 'jaringan_mediaKomunitas', 'jaringan_mediaKomunitasLainnya'] }
];

const DynamicQuestionRenderer: React.FC<{ questions: Question[], formData: FormData, onInputChange: any, errors: any }> = ({ questions, formData, onInputChange, errors }) => {
    if (questions.length === 0) return null;

    return (
        <div className="space-y-6 mt-8 pt-8 border-t border-dashed border-indigo-200">
            <h4 className="font-bold text-lg text-indigo-900 mb-4">Pertanyaan Tambahan</h4>
            {questions.map(q => {
                if (q.type === 'textarea') {
                    return <TextArea key={q.id} label={q.label} name={q.id} value={formData[q.id] || ''} onChange={onInputChange} required={q.required} error={errors[q.id]} />;
                }
                if (q.type === 'select') {
                    return <SelectField key={q.id} label={q.label} name={q.id} value={formData[q.id] || ''} onChange={onInputChange} options={(q.options || []).map(o => ({ value: o, label: o }))} required={q.required} error={errors[q.id]} />;
                }
                if (q.type === 'radio') {
                    return <RadioGroupField key={q.id} label={q.label} name={q.id} value={formData[q.id] || ''} onChange={onInputChange} options={(q.options || []).map(o => ({ value: o, label: o }))} required={q.required} error={errors[q.id]} />;
                }
                return <InputField key={q.id} label={q.label} name={q.id} value={formData[q.id] || ''} onChange={onInputChange} required={q.required} error={errors[q.id]} />;
            })}
        </div>
    );
}

interface StepContentProps {
  currentStep: number;
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  errors: Record<string, string>;
  years: string[];
  isPekerjaanSectionVisible: boolean;
  customQuestions: Question[];
}

const StepContent: React.FC<StepContentProps> = ({ currentStep, formData, onInputChange, errors, years, isPekerjaanSectionVisible, customQuestions }) => {
    // Filter questions for current section
    const sectionIds = ['identitas', 'pendidikan', 'pekerjaan', 'studi_lanjut', 'hubungan'];
    const currentSectionId = sectionIds[currentStep];
    const sectionQuestions = customQuestions.filter(q => q.section === currentSectionId);

    switch(currentStep) {
        case 0: // Identitas
            return (
                <div className="animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                        <InputField label="NIM" name="identitas_nim" value={formData.identitas_nim} onChange={onInputChange} required error={errors.identitas_nim} readOnly />
                        <InputField label="Nama Lengkap" name="identitas_namaLengkap" value={formData.identitas_namaLengkap} onChange={onInputChange} required error={errors.identitas_namaLengkap} readOnly />
                        <SelectField label="Tahun Masuk" name="identitas_tahunMasuk" value={formData.identitas_tahunMasuk} onChange={onInputChange} options={years.map(y => ({value: y, label: y}))} required error={errors.identitas_tahunMasuk}/>
                        <SelectField label="Tahun Lulus" name="identitas_tahunLulus" value={formData.identitas_tahunLulus} onChange={onInputChange} options={years.map(y => ({value: y, label: y}))} required error={errors.identitas_tahunLulus}/>
                        <SelectField label="Program Studi" name="identitas_programStudi" value={formData.identitas_programStudi} onChange={onInputChange} options={[{ value: 'Pendidikan Bahasa Arab', label: 'Pendidikan Bahasa Arab' }, { value: 'Hukum Keluarga Islam (Akhwal Al-Syakhsiyyah)', label: 'Hukum Keluarga Islam (Akhwal Al-Syakhsiyyah)' }]} required error={errors.identitas_programStudi} />
                        <InputField label="No. HP / WhatsApp Aktif" name="identitas_noHp" value={formData.identitas_noHp} onChange={onInputChange} required error={errors.identitas_noHp}/>
                        <InputField label="Alamat Email Aktif" name="identitas_email" type="email" value={formData.identitas_email} onChange={onInputChange} required error={errors.identitas_email}/>
                        <TextArea label="Alamat Domisili Saat Ini" name="identitas_alamatDomisili" value={formData.identitas_alamatDomisili} onChange={onInputChange} rows={2} required error={errors.identitas_alamatDomisili} className="md:col-span-2"/>
                        <RadioGroupField label="Jenis Kelamin" name="identitas_jenisKelamin" value={formData.identitas_jenisKelamin} onChange={onInputChange} options={[{value: 'Laki-laki', label: 'Laki-laki'}, {value: 'Perempuan', label: 'Perempuan'}]} required error={errors.identitas_jenisKelamin} />
                        <RadioGroupField label="Status Pernikahan" name="identitas_statusPernikahan" value={formData.identitas_statusPernikahan} onChange={onInputChange} options={[{value: 'Menikah', label: 'Menikah'}, {value: 'Belum Menikah', label: 'Belum Menikah'}]} required error={errors.identitas_statusPernikahan} />
                    </div>
                    <DynamicQuestionRenderer questions={sectionQuestions} formData={formData} onInputChange={onInputChange} errors={errors} />
                </div>
            );
        case 1: // Pendidikan
            return (
                <div className="space-y-8 animate-fade-in">
                    <RadioGroupField label="Bagaimana penilaian Anda terhadap kualitas proses pembelajaran di STAI Imam Syafi’i Cianjur?" name="pendidikan_kualitasPembelajaran" value={formData.pendidikan_kualitasPembelajaran} onChange={onInputChange} options={[{value: 'Sangat Baik', label: 'Sangat Baik'}, {value: 'Baik', label: 'Baik'}, {value: 'Cukup', label: 'Cukup'}, {value: 'Kurang', label: 'Kurang'}]} required error={errors.pendidikan_kualitasPembelajaran} />
                    <RadioGroupField label="Menurut Anda, seberapa relevan kurikulum yang diajarkan dengan kebutuhan dunia kerja saat ini?" name="pendidikan_relevansiKurikulum" value={formData.pendidikan_relevansiKurikulum} onChange={onInputChange} options={[{value: 'Sangat Relevan', label: 'Sangat Relevan'}, {value: 'Relevan', label: 'Relevan'}, {value: 'Cukup Relevan', label: 'Cukup Relevan'}, {value: 'Tidak Relevan', label: 'Tidak Relevan'}]} required error={errors.pendidikan_relevansiKurikulum} />
                    <RadioGroupField label="Dosen dan tenaga kependidikan memberikan pelayanan akademik dan bimbingan dengan baik." name="pendidikan_pelayananDosen" value={formData.pendidikan_pelayananDosen} onChange={onInputChange} options={[{value: 'Sangat Setuju', label: 'Sangat Setuju'}, {value: 'Setuju', label: 'Setuju'}, {value: 'Kurang Setuju', label: 'Kurang Setuju'}, {value: 'Tidak Setuju', label: 'Tidak Setuju'}]} required error={errors.pendidikan_pelayananDosen} />
                    <RadioGroupField label="Kegiatan organisasi, seminar, dan pelatihan di kampus membantu pengembangan soft skill Anda." name="pendidikan_pengembanganSoftSkill" value={formData.pendidikan_pengembanganSoftSkill} onChange={onInputChange} options={[{value: 'Sangat Setuju', label: 'Sangat Setuju'}, {value: 'Setuju', label: 'Setuju'}, {value: 'Kurang Setuju', label: 'Kurang Setuju'}, {value: 'Tidak Setuju', label: 'Tidak Setuju'}]} required error={errors.pendidikan_pengembanganSoftSkill} />
                    <TextArea label="Sebutkan keterampilan atau kompetensi yang paling bermanfaat setelah lulus dari STAI Imam Syafi’i Cianjur:" name="pendidikan_keterampilanBermanfaat" value={formData.pendidikan_keterampilanBermanfaat} onChange={onInputChange} rows={3} error={errors.pendidikan_keterampilanBermanfaat} />
                    <DynamicQuestionRenderer questions={sectionQuestions} formData={formData} onInputChange={onInputChange} errors={errors} />
                </div>
            );
        case 2: // Pekerjaan
            return (
                <div className="space-y-8 animate-fade-in">
                    <RadioGroupField label="Apakah Anda saat ini sudah bekerja?" name="pekerjaan_status" value={formData.pekerjaan_status} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}, {value: 'Sedang Melanjutkan Studi', label: 'Sedang Melanjutkan Studi'}]} required error={errors.pekerjaan_status}/>
                    {isPekerjaanSectionVisible && (
                        <div className="space-y-8 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mt-6 animate-fade-in-up">
                            <div className="flex items-center gap-2 mb-2">
                                <i className="fas fa-briefcase text-indigo-500 text-lg"></i>
                                <h4 className="font-bold text-xl text-indigo-800">Detail Pekerjaan</h4>
                            </div>
                            <RadioGroupField label="Berapa lama waktu yang dibutuhkan untuk memperoleh pekerjaan pertama setelah lulus?" name="pekerjaan_waktuTunggu" value={formData.pekerjaan_waktuTunggu} onChange={onInputChange} options={[{value: '< 3 bulan', label: '< 3 bulan'}, {value: '3–6 bulan', label: '3–6 bulan'}, {value: '6–12 bulan', label: '6–12 bulan'}, {value: '> 1 tahun', label: '> 1 tahun'}]} required error={errors.pekerjaan_waktuTunggu} />
                            <RadioGroupField label="Apa jenis pekerjaan pertama Anda setelah lulus?" name="pekerjaan_jenisPekerjaanPertama" value={formData.pekerjaan_jenisPekerjaanPertama} onChange={onInputChange} options={[{value: 'PNS', label: 'PNS'}, {value: 'Guru/Dosen', label: 'Guru/Dosen'}, {value: 'Pegawai Swasta', label: 'Pegawai Swasta'}, {value: 'Wirausaha', label: 'Wirausaha'}, {value: 'Lainnya', label: 'Lainnya'}]} required error={errors.pekerjaan_jenisPekerjaanPertama} />
                            {formData.pekerjaan_jenisPekerjaanPertama === 'Lainnya' && <InputField label="Sebutkan Lainnya" name="pekerjaan_jenisPekerjaanPertamaLainnya" value={formData.pekerjaan_jenisPekerjaanPertamaLainnya} onChange={onInputChange} required error={errors.pekerjaan_jenisPekerjaanPertamaLainnya} />}
                            <RadioGroupField label="Apakah pekerjaan Anda saat ini sesuai dengan bidang studi?" name="pekerjaan_kesesuaianBidangStudi" value={formData.pekerjaan_kesesuaianBidangStudi} onChange={onInputChange} options={[{value: 'Sangat Sesuai', label: 'Sangat Sesuai'}, {value: 'Cukup Sesuai', label: 'Cukup Sesuai'}, {value: 'Tidak Sesuai', label: 'Tidak Sesuai'}]} required error={errors.pekerjaan_kesesuaianBidangStudi}/>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Nama instansi / tempat kerja" name="pekerjaan_namaInstansi" value={formData.pekerjaan_namaInstansi} onChange={onInputChange} required error={errors.pekerjaan_namaInstansi}/>
                                <InputField label="Jabatan / Posisi" name="pekerjaan_jabatan" value={formData.pekerjaan_jabatan} onChange={onInputChange} required error={errors.pekerjaan_jabatan}/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField label="Lama bekerja" name="pekerjaan_lamaBekerja" value={formData.pekerjaan_lamaBekerja} onChange={onInputChange} placeholder="Contoh: 2 tahun 3 bulan" error={errors.pekerjaan_lamaBekerja}/>
                                <RadioGroupField label="Pendapatan per bulan" name="pekerjaan_pendapatan" value={formData.pekerjaan_pendapatan} onChange={onInputChange} options={[{value: '< Rp2.000.000', label: '< 2jt'}, {value: 'Rp2–4 juta', label: '2–4jt'}, {value: 'Rp4–6 juta', label: '4–6jt'}, {value: '> Rp6 juta', label: '> 6jt'}]} required error={errors.pekerjaan_pendapatan}/>
                            </div>

                            <div className="flex items-center gap-2 mt-6 mb-2">
                                <i className="fas fa-chart-line text-indigo-500 text-lg"></i>
                                <h4 className="font-bold text-xl text-indigo-800">Relevansi & Kompetensi</h4>
                            </div>
                            <RadioGroupField label="Seberapa besar kontribusi ilmu yang diperoleh di STAI Imam Syafi’i terhadap pekerjaan Anda?" name="relevansi_kontribusiIlmu" value={formData.relevansi_kontribusiIlmu} onChange={onInputChange} options={[{value: 'Sangat Besar', label: 'Sangat Besar'}, {value: 'Besar', label: 'Besar'}, {value: 'Cukup', label: 'Cukup'}, {value: 'Kecil', label: 'Kecil'}]} required error={errors.relevansi_kontribusiIlmu}/>
                            <RadioGroupField label="Kompetensi apa yang paling dibutuhkan dalam pekerjaan Anda sekarang?" name="relevansi_kompetensiDibutuhkan" value={formData.relevansi_kompetensiDibutuhkan} onChange={onInputChange} options={[{value: 'Komunikasi', label: 'Komunikasi'}, {value: 'Kepemimpinan', label: 'Kepemimpinan'}, {value: 'Etos Kerja', label: 'Etos Kerja'}, {value: 'Kemampuan Teknologi', label: 'Teknologi'}, {value: 'Keilmuan Islam', label: 'Keilmuan Islam'}]} required error={errors.relevansi_kompetensiDibutuhkan}/>
                            <RadioGroupField label="Apakah selama kuliah Anda memperoleh cukup pengalaman praktik atau magang yang mendukung dunia kerja?" name="relevansi_pengalamanPraktik" value={formData.relevansi_pengalamanPraktik} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}]} required error={errors.relevansi_pengalamanPraktik}/>
                            <TextArea label="Menurut Anda, aspek apa yang perlu ditingkatkan oleh kampus agar lulusan lebih siap kerja?" name="relevansi_aspekPerluDitingkatkan" value={formData.relevansi_aspekPerluDitingkatkan} onChange={onInputChange} rows={3} error={errors.relevansi_aspekPerluDitingkatkan}/>
                        </div>
                    )}
                    <DynamicQuestionRenderer questions={sectionQuestions} formData={formData} onInputChange={onInputChange} errors={errors} />
                </div>
            );
        case 3: // Studi Lanjut
            return (
                <div className="space-y-8 animate-fade-in">
                    <RadioGroupField label="Apakah Anda melanjutkan studi setelah lulus dari STAI Imam Syafi’i Cianjur?" name="studiLanjut_status" value={formData.studiLanjut_status} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}]} required error={errors.studiLanjut_status}/>
                    {formData.studiLanjut_status === 'Ya' && (
                        <div className="space-y-6 bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 mt-6 animate-fade-in-up">
                            <InputField label="Di mana Anda melanjutkan studi?" name="studiLanjut_namaUniversitas" value={formData.studiLanjut_namaUniversitas} onChange={onInputChange} required error={errors.studiLanjut_namaUniversitas}/>
                            <InputField label="Program studi yang diambil" name="studiLanjut_programStudi" value={formData.studiLanjut_programStudi} onChange={onInputChange} required error={errors.studiLanjut_programStudi}/>
                        </div>
                    )}
                    <DynamicQuestionRenderer questions={sectionQuestions} formData={formData} onInputChange={onInputChange} errors={errors} />
                </div>
            );
        case 4: // Hubungan
            return (
                <div className="space-y-8 animate-fade-in">
                    <RadioGroupField label="Apakah Anda masih berkomunikasi dengan dosen atau pihak kampus setelah lulus?" name="hubungan_komunikasi" value={formData.hubungan_komunikasi} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}]} required error={errors.hubungan_komunikasi}/>
                    <RadioGroupField label="Apakah Anda bersedia terlibat dalam kegiatan kampus (seminar, pelatihan, rekrutmen, sharing alumni)?" name="hubungan_kesediaanTerlibat" value={formData.hubungan_kesediaanTerlibat} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}]} required error={errors.hubungan_kesediaanTerlibat}/>
                    <TextArea label="Masukan atau saran untuk peningkatan mutu STAI Imam Syafi’i Cianjur:" name="hubungan_masukanPeningkatanMutu" value={formData.hubungan_masukanPeningkatanMutu} onChange={onInputChange} rows={4} error={errors.hubungan_masukanPeningkatanMutu}/>
                    
                    <div className="pt-6 border-t border-slate-200">
                         <div className="flex items-center gap-2 mb-4">
                            <i className="fas fa-users text-indigo-500 text-lg"></i>
                            <h4 className="font-bold text-xl text-slate-800">Jaringan Alumni</h4>
                        </div>
                        <RadioGroupField label="Apakah Anda tergabung dalam komunitas alumni STAI Imam Syafi’i Cianjur?" name="jaringan_tergabungKomunitas" value={formData.jaringan_tergabungKomunitas} onChange={onInputChange} options={[{value: 'Ya', label: 'Ya'}, {value: 'Tidak', label: 'Tidak'}]} required error={errors.jaringan_tergabungKomunitas}/>
                        {formData.jaringan_tergabungKomunitas === 'Ya' && (
                            <div className="space-y-6 mt-4 animate-fade-in-up">
                                <RadioGroupField label="Jika Ya, sebutkan grup atau media yang digunakan:" name="jaringan_mediaKomunitas" value={formData.jaringan_mediaKomunitas} onChange={onInputChange} options={[{value: 'WhatsApp', label: 'WhatsApp'}, {value: 'Telegram', label: 'Telegram'}, {value: 'Facebook', label: 'Facebook'}, {value: 'Lainnya', label: 'Lainnya'}]} required error={errors.jaringan_mediaKomunitas}/>
                                {formData.jaringan_mediaKomunitas === 'Lainnya' && <InputField label="Sebutkan Media Lainnya" name="jaringan_mediaKomunitasLainnya" value={formData.jaringan_mediaKomunitasLainnya} onChange={onInputChange} required error={errors.jaringan_mediaKomunitasLainnya}/>}
                            </div>
                        )}
                    </div>
                    <DynamicQuestionRenderer questions={sectionQuestions} formData={formData} onInputChange={onInputChange} errors={errors} />
                </div>
            );
        default:
          return null;
    }
}

export const TracerForm: React.FC<TracerFormProps> = ({ formData, onInputChange, onSubmit, isLoading, customQuestions }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentYear = new Date().getFullYear();
  const startYear = 2010;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => (currentYear - i).toString());

  const isPekerjaanSectionVisible = useMemo(() => formData.pekerjaan_status === 'Ya', [formData.pekerjaan_status]);

  const validate = (fieldsToValidate: string[]): boolean => {
    const newErrors: Record<string, string> = {};

    const check = (field: keyof FormData, message: string) => {
        if (fieldsToValidate.includes(field as string) && !formData[field]) {
            newErrors[field as string] = message;
        }
    };
    
    // Existing Validation
    // A. Identitas Alumni
    check('identitas_nim', 'NIM wajib diisi.');
    check('identitas_namaLengkap', 'Nama Lengkap wajib diisi.');
    check('identitas_tahunMasuk', 'Tahun Masuk wajib diisi.');
    check('identitas_tahunLulus', 'Tahun Lulus wajib diisi.');
    check('identitas_programStudi', 'Program Studi wajib diisi.');
    check('identitas_noHp', 'Nomor HP / WhatsApp wajib diisi.');
    if (fieldsToValidate.includes('identitas_email')) {
        if (!formData.identitas_email) {
            newErrors.identitas_email = 'Email wajib diisi.';
        } else if (!/\S+@\S+\.\S+/.test(formData.identitas_email)) {
            newErrors.identitas_email = 'Format email tidak valid.';
        }
    }
    check('identitas_alamatDomisili', 'Alamat Domisili wajib diisi.');
    check('identitas_jenisKelamin', 'Jenis Kelamin wajib diisi.');
    check('identitas_statusPernikahan', 'Status Pernikahan wajib diisi.');
    
    // B. Pendidikan
    check('pendidikan_kualitasPembelajaran', 'Penilaian Kualitas Pembelajaran wajib diisi.');
    check('pendidikan_relevansiKurikulum', 'Penilaian Relevansi Kurikulum wajib diisi.');
    check('pendidikan_pelayananDosen', 'Penilaian Pelayanan Dosen wajib diisi.');
    check('pendidikan_pengembanganSoftSkill', 'Penilaian Pengembangan Soft Skill wajib diisi.');
    
    // C. Pekerjaan
    check('pekerjaan_status', 'Status pekerjaan wajib diisi.');
    if (formData.pekerjaan_status === 'Ya') {
      check('pekerjaan_waktuTunggu', 'Waktu tunggu pekerjaan wajib diisi.');
      check('pekerjaan_jenisPekerjaanPertama', 'Jenis pekerjaan pertama wajib diisi.');
      if (formData.pekerjaan_jenisPekerjaanPertama === 'Lainnya') {
          check('pekerjaan_jenisPekerjaanPertamaLainnya', 'Sebutkan jenis pekerjaan lainnya.');
      }
      check('pekerjaan_kesesuaianBidangStudi', 'Kesesuaian bidang studi wajib diisi.');
      check('pekerjaan_namaInstansi', 'Nama instansi wajib diisi.');
      check('pekerjaan_jabatan', 'Jabatan wajib diisi.');
      check('pekerjaan_pendapatan', 'Pendapatan wajib diisi.');
    }
    
    // D. Relevansi (Only if working)
    if (formData.pekerjaan_status === 'Ya') {
        check('relevansi_kontribusiIlmu', 'Penilaian kontribusi ilmu wajib diisi.');
        check('relevansi_kompetensiDibutuhkan', 'Kompetensi yang dibutuhkan wajib diisi.');
        check('relevansi_pengalamanPraktik', 'Penilaian pengalaman praktik wajib diisi.');
    }

    // E. Studi Lanjut
    check('studiLanjut_status', 'Status studi lanjut wajib diisi.');
    if (formData.studiLanjut_status === 'Ya') {
        check('studiLanjut_namaUniversitas', 'Nama universitas wajib diisi.');
        check('studiLanjut_programStudi', 'Program studi wajib diisi.');
    }

    // F. Hubungan
    check('hubungan_komunikasi', 'Status komunikasi dengan kampus wajib diisi.');
    check('hubungan_kesediaanTerlibat', 'Kesediaan terlibat wajib diisi.');
    
    // G. Jaringan
    check('jaringan_tergabungKomunitas', 'Status keanggotaan komunitas wajib diisi.');
    if (formData.jaringan_tergabungKomunitas === 'Ya') {
        check('jaringan_mediaKomunitas', 'Media komunitas wajib dipilih.');
        if(formData.jaringan_mediaKomunitas === 'Lainnya') {
            check('jaringan_mediaKomunitasLainnya', 'Sebutkan media lainnya.');
        }
    }

    // --- Dynamic Question Validation ---
    const sectionIds = ['identitas', 'pendidikan', 'pekerjaan', 'studi_lanjut', 'hubungan'];
    const currentSectionId = sectionIds[currentStep];
    const sectionQuestions = customQuestions.filter(q => q.section === currentSectionId);
    
    sectionQuestions.forEach(q => {
       if (q.required && (!formData[q.id] || formData[q.id].trim() === '')) {
           newErrors[q.id] = 'Pertanyaan ini wajib diisi.';
       }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const currentFields = formSteps[currentStep].fields;
    if (validate(currentFields)) {
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo(0, 0);
      }
    } else {
        const firstErrorKey = Object.keys(errors).find(key => currentFields.includes(key)) || Object.keys(errors)[0];
        const errorElement = document.getElementsByName(firstErrorKey)[0];
        if (errorElement) {
            errorElement.focus({ preventScroll: true });
            errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validate(formSteps.flatMap(s => s.fields))) {
      onSubmit(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10 animate-fade-in-up">
        <h2 className="text-3xl md:text-5xl font-display font-black text-slate-800 tracking-tight">Tracer Study</h2>
        <p className="mt-3 text-lg text-slate-600">
            Halo, <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{formData.identitas_namaLengkap}</span>! 
            <br className="hidden md:block"/> Mohon lengkapi data Anda.
        </p>
      </div>

      {/* Modern Stepper */}
      <div className="mb-12 px-2 overflow-x-auto pb-4 hide-scrollbar">
        <div className="flex items-center justify-between min-w-[320px] max-w-2xl mx-auto relative">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full transform -translate-y-1/2"></div>
            {/* Active Progress Line */}
            <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-600 -z-0 rounded-full transform -translate-y-1/2 transition-all duration-500 ease-out" 
                style={{width: `${(currentStep / (formSteps.length - 1)) * 100}%`}}
            ></div>

            {formSteps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center group cursor-default">
                    <div 
                        className={`
                            w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-4 transition-all duration-300 z-10
                            ${currentStep > index 
                                ? 'bg-indigo-600 border-indigo-600 text-white scale-100 shadow-lg shadow-indigo-500/30' 
                                : currentStep === index 
                                    ? 'bg-white border-indigo-600 text-indigo-600 scale-110 shadow-xl' 
                                    : 'bg-white border-slate-200 text-slate-400'}
                        `}
                    >
                        {currentStep > index ? <i className="fas fa-check"></i> : index + 1}
                    </div>
                    <p className={`
                        absolute -bottom-8 text-[10px] md:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300
                        ${currentStep === index ? 'text-indigo-600 opacity-100 transform translate-y-0' : 'text-slate-400 opacity-0 transform -translate-y-2'}
                    `}>
                        {step.title}
                    </p>
                </div>
            ))}
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8" noValidate>
        <div className="glass-panel p-6 md:p-10 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-500">
           {/* Decorative corner blob */}
           <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-10 blur-3xl"></div>
           
           <div className="relative z-10">
                <div className="mb-8 pb-4 border-b border-slate-200/60 flex items-end justify-between">
                    <div>
                         <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1 block">Langkah {currentStep + 1} dari {formSteps.length}</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-slate-800">{formSteps[currentStep].fullTitle}</h3>
                    </div>
                    <i className="fas fa-edit text-slate-200 text-4xl hidden sm:block"></i>
                </div>
                
                <StepContent 
                    currentStep={currentStep}
                    formData={formData}
                    onInputChange={onInputChange}
                    errors={errors}
                    years={years}
                    isPekerjaanSectionVisible={isPekerjaanSectionVisible}
                    customQuestions={customQuestions}
                />
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={currentStep === 0} 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
              <i className="fas fa-arrow-left mr-2"></i> Sebelumnya
          </button>
          
          {currentStep < formSteps.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext} 
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
                Selanjutnya <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Kirim Jawaban
                </>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
