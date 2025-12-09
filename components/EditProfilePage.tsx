import React, { useState } from 'react';
import { FormData } from '../types';
import { InputField } from './InputField';
import { TextArea } from './TextArea';

interface EditProfilePageProps {
  initialData: FormData;
  onSaveChanges: (updatedData: Partial<FormData>) => void;
  onBack: () => void;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = ({ initialData, onSaveChanges, onBack }) => {
  const [profileData, setProfileData] = useState({
    identitas_namaLengkap: initialData.identitas_namaLengkap,
    identitas_noHp: initialData.identitas_noHp,
    identitas_email: initialData.identitas_email,
    identitas_alamatDomisili: initialData.identitas_alamatDomisili,
  });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveChanges(profileData);
    setMessage('Profil berhasil diperbarui!');
    // The actual navigation is handled by the parent component after saving
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-800">Ubah Profil Anda</h2>
        <p className="mt-2 text-slate-600">Pastikan informasi kontak Anda selalu yang terbaru.</p>
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-lg border border-slate-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="NIM"
            name="identitas_nim"
            value={initialData.identitas_nim}
            onChange={() => {}} // No-op
            readOnly
          />
          <InputField
            label="Nama Lengkap"
            name="identitas_namaLengkap"
            value={profileData.identitas_namaLengkap}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="No. HP / WhatsApp"
            name="identitas_noHp"
            value={profileData.identitas_noHp}
            onChange={handleInputChange}
            required
          />
          <InputField
            label="Alamat Email"
            name="identitas_email"
            type="email"
            value={profileData.identitas_email}
            onChange={handleInputChange}
            required
          />
          <TextArea
            label="Alamat Domisili"
            name="identitas_alamatDomisili"
            value={profileData.identitas_alamatDomisili}
            onChange={handleInputChange}
            required
            rows={3}
          />
          
          {message && (
            <div className="p-3 bg-green-100 text-green-800 rounded-md text-center text-sm">
              {message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
            >
              <i className="fas fa-save mr-2"></i>
              Simpan Perubahan
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-2 px-6 rounded-lg hover:bg-slate-300 transition duration-300"
            >
              Kembali
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
