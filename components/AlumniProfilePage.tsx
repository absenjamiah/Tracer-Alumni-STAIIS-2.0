import React from 'react';
import { Alumnus, FormData } from '../types';

interface AlumniProfilePageProps {
  alumnus: Alumnus;
  submissionData?: FormData;
}

const ProfileDataItem: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="py-3 sm:py-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="text-md text-slate-900 font-semibold">{value}</p>
    </div>
  );
};

export const AlumniProfilePage: React.FC<AlumniProfilePageProps> = ({ alumnus, submissionData }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8 pb-6 border-b border-slate-200">
        <div className="w-24 h-24 bg-indigo-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
          {alumnus.name.charAt(0)}
        </div>
        <div className="text-center sm:text-left">
          <h2 className="text-3xl font-bold text-slate-800">{alumnus.name}</h2>
          <p className="text-slate-600">NIM: {alumnus.nim}</p>
          <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            alumnus.hasSubmitted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {alumnus.hasSubmitted ? 'Survey Completed' : 'Survey Pending'}
          </span>
        </div>
      </div>

      {submissionData ? (
        <div>
          <h3 className="text-xl font-semibold text-slate-700 mb-4">Submission Details</h3>
          <div className="divide-y divide-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <ProfileDataItem label="Program Studi" value={submissionData.identitas_programStudi} />
              <ProfileDataItem label="Tahun Lulus" value={submissionData.identitas_tahunLulus} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ProfileDataItem label="Email" value={submissionData.identitas_email} />
                <ProfileDataItem label="No. HP / WhatsApp" value={submissionData.identitas_noHp} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ProfileDataItem label="Status Pekerjaan" value={submissionData.pekerjaan_status} />
                {submissionData.pekerjaan_status === 'Ya' && <ProfileDataItem label="Instansi" value={submissionData.pekerjaan_namaInstansi} />}
            </div>
            {submissionData.pekerjaan_status === 'Ya' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    <ProfileDataItem label="Jabatan" value={submissionData.pekerjaan_jabatan} />
                </div>
            )}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                <ProfileDataItem label="Melanjutkan Studi" value={submissionData.studiLanjut_status} />
                {submissionData.studiLanjut_status === 'Ya' && <ProfileDataItem label="Universitas" value={submissionData.studiLanjut_namaUniversitas} />}
             </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <p className="text-slate-500">No submission data found for this alumnus.</p>
        </div>
      )}
    </div>
  );
};