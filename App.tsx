
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { TracerForm } from './components/TracerForm';
import { SubmissionResult } from './components/SubmissionResult';
import { AdminDashboard } from './components/AdminDashboard';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { EditProfilePage } from './components/EditProfilePage';
import { summarizeTracerData } from './services/geminiService';
import { sheetApi } from './services/sheetApi';
import { Alumnus, FormData, Question } from './types';

const initialFormData: FormData = {
  identitas_nim: '', identitas_namaLengkap: '', identitas_tahunMasuk: new Date().getFullYear().toString(), identitas_tahunLulus: new Date().getFullYear().toString(), identitas_programStudi: '', identitas_noHp: '', identitas_email: '', identitas_alamatDomisili: '', identitas_jenisKelamin: '', identitas_statusPernikahan: '',
  pendidikan_kualitasPembelajaran: '', pendidikan_relevansiKurikulum: '', pendidikan_pelayananDosen: '', pendidikan_pengembanganSoftSkill: '', pendidikan_keterampilanBermanfaat: '',
  pekerjaan_status: '', pekerjaan_waktuTunggu: '', pekerjaan_jenisPekerjaanPertama: '', pekerjaan_jenisPekerjaanPertamaLainnya: '', pekerjaan_kesesuaianBidangStudi: '', pekerjaan_namaInstansi: '', pekerjaan_jabatan: '', pekerjaan_lamaBekerja: '', pekerjaan_pendapatan: '',
  relevansi_kontribusiIlmu: '', relevansi_kompetensiDibutuhkan: '', relevansi_pengalamanPraktik: '', relevansi_aspekPerluDitingkatkan: '',
  studiLanjut_status: '', studiLanjut_namaUniversitas: '', studiLanjut_programStudi: '',
  hubungan_komunikasi: '', hubungan_kesediaanTerlibat: '', hubungan_masukanPeningkatanMutu: '',
  jaringan_tergabungKomunitas: '', jaringan_mediaKomunitas: '', jaringan_mediaKomunitasLainnya: '',
};

type AppView = 'login' | 'form' | 'result' | 'admin_dashboard' | 'forgot_password' | 'reset_password' | 'edit_profile';

// Helper function to calculate analytics locally
function calculateAnalyticsLocal(data: FormData[]) {
  const count = (key: keyof FormData, filter?: (d: FormData) => boolean) => {
    const counts: Record<string, number> = {};
    const subset = filter ? data.filter(filter) : data;
    subset.forEach(d => {
      const val = (d[key] as string) || 'Tidak Diisi';
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const isWorking = (d: FormData) => d.pekerjaan_status === 'Ya';
  const isCommunity = (d: FormData) => d.jaringan_tergabungKomunitas === 'Ya';

  return {
    programStudi: count('identitas_programStudi'),
    jenisKelamin: count('identitas_jenisKelamin'),
    statusPernikahan: count('identitas_statusPernikahan'),
    kualitasPembelajaran: count('pendidikan_kualitasPembelajaran'),
    relevansiKurikulum: count('pendidikan_relevansiKurikulum'),
    pelayananDosen: count('pendidikan_pelayananDosen'),
    pengembanganSoftSkill: count('pendidikan_pengembanganSoftSkill'),
    statusPekerjaan: count('pekerjaan_status'),
    waktuTunggu: count('pekerjaan_waktuTunggu', isWorking),
    kesesuaianBidangStudi: count('pekerjaan_kesesuaianBidangStudi', isWorking),
    jenisPekerjaanPertama: count('pekerjaan_jenisPekerjaanPertama', isWorking),
    pendapatan: count('pekerjaan_pendapatan', isWorking),
    kontribusiIlmu: count('relevansi_kontribusiIlmu', isWorking),
    kompetensiDibutuhkan: count('relevansi_kompetensiDibutuhkan', isWorking),
    pengalamanPraktik: count('relevansi_pengalamanPraktik', isWorking),
    studiLanjut: count('studiLanjut_status'),
    komunikasi: count('hubungan_komunikasi'),
    kesediaanTerlibat: count('hubungan_kesediaanTerlibat'),
    tergabungKomunitas: count('jaringan_tergabungKomunitas'),
    mediaKomunitas: count('jaringan_mediaKomunitas', isCommunity),
  };
}

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('login');
  const [userRole, setUserRole] = useState<'admin' | 'alumni' | null>(null);
  const [currentUser, setCurrentUser] = useState<Alumnus | null>(null);
  const [alumniData, setAlumniData] = useState<Alumnus[]>([]);
  const [submissions, setSubmissions] = useState<{ [nim: string]: FormData }>({});
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [appLoading, setAppLoading] = useState(true);
  const [loadingText, setLoadingText] = useState('Memuat aplikasi...');
  const [loginMessage, setLoginMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  
  // Independent fetch functions kept for updates, but initialization uses Batching
  const fetchAlumniData = async () => {
    try {
        const result = await sheetApi.getAlumni();
        if (result.success && result.data) {
            setAlumniData(result.data);
            return result.data;
        } else {
            console.error('Error fetching alumni:', result.message);
            return [];
        }
    } catch (err) {
        console.error("Unexpected error fetching alumni:", err);
        return [];
    }
  };

  const fetchAllSubmissions = async () => {
    try {
        const result = await sheetApi.getAllSubmissions();
        if (result.success && result.data) {
            const submissionsMap = result.data.reduce((acc: any, submission: any) => {
                acc[submission.identitas_nim] = submission;
                return acc;
            }, {} as { [nim: string]: FormData });
            setSubmissions(submissionsMap);
            return submissionsMap;
        }
        return {};
    } catch (err) {
        console.error("Unexpected error fetching submissions:", err);
        return {};
    }
  };

  const fetchSubmissionDetail = async (nim: string): Promise<FormData | null> => {
      if (submissions[nim]) return submissions[nim];
      const all = await fetchAllSubmissions();
      return all[nim] || null;
  };

  const initializeAdminData = async () => {
    try {
        setLoadingText('Mengunduh data kuesioner...');
        const subsMap = await fetchAllSubmissions();
        const subsList = Object.values(subsMap) as FormData[];

        setLoadingText('Menghitung analisis data...');
        const analytics = calculateAnalyticsLocal(subsList);
        setAnalyticsData(analytics);
    } catch (error) {
        console.error("Partial failure in admin data init", error);
    }
  };

  // Main Initialization Effect - OPTIMIZED BATCHING
  useEffect(() => {
    const initializeApp = async () => {
        setAppLoading(true);
        setLoadingText('Menghubungkan ke Database...');
        try {
            // 1. Clear sensitive states
            setUserRole(null);
            setCurrentUser(null);
            setView('login');
            
            // 2. Load basic config IN ONE REQUEST
            const response = await sheetApi.getInitialData();
            
            if (response.success && response.data) {
               setAlumniData(response.data.alumni);
               setCustomQuestions(response.data.questions);
            } else {
               // Fallback if batch fails or old script version
               console.warn("Batch fetch failed or script outdated, using fallback");
               await fetchAlumniData();
               // Questions will be empty in fallback initially
            }

        } catch (error: any) {
            console.error("Error during app initialization:", error);
            setLoginMessage({type: 'error', text: `Gagal memuat aplikasi. Refresh halaman.`});
        } finally {
            setAppLoading(false);
            setLoadingText('');
        }
    };

    initializeApp();
  }, []);


  const handleLogin = async (role: 'admin' | 'alumni', identity?: string, password?: string) => {
    setLoginMessage(null);
    if (role === 'admin') {
      if (!identity || !password) {
        setLoginMessage({type: 'error', text: 'Email and password are required.'});
        return;
      }
      
      setAppLoading(true);
      setLoadingText('Verifikasi kredensial...');

      const result = await sheetApi.loginAdmin(identity, password);

      if (!result.success) {
          setAppLoading(false);
          setLoginMessage({type: 'error', text: result.message || 'Login Failed'});
      } else {
          // Login Success
          setUserRole('admin');
          try {
             await initializeAdminData();
             setView('admin_dashboard');
          } catch (e) {
             console.error("Error loading admin data:", e);
             setLoginMessage({type: 'error', text: "Gagal memuat data dashboard."});
          } finally {
             setAppLoading(false);
          }
      }

    } else if (role === 'alumni') {
      if (!identity) {
        setLoginMessage({type: 'error', text: 'Silakan pilih akun Anda dari daftar.'});
        return;
      }
      // Check locally first for instant feedback, then verify status
      const alumnus = alumniData.find(a => a.nim === identity);
      
      if (alumnus) {
        if (alumnus.hasSubmitted) {
          setLoginMessage({type: 'error', text: `Terima kasih, ${alumnus.name}. Anda sudah pernah mengisi survei ini.`});
        } else {
          setCurrentUser(alumnus);
          setFormData({ ...initialFormData, identitas_nim: alumnus.nim, identitas_namaLengkap: alumnus.name, identitas_tahunMasuk: alumnus.angkatan });
          setUserRole('alumni');
          setView('form');
        }
      } else {
        setLoginMessage({type: 'error', text: 'Alumni tidak ditemukan. Silakan coba lagi.'});
      }
    }
  };
  
  const handleLogout = async () => {
    setView('login');
    setUserRole(null);
    setCurrentUser(null);
    setFormData(initialFormData);
    setSubmissions({});
    setAnalyticsData(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // 1. Send to Google Sheet first (Priority)
      const response = await sheetApi.submitForm(formData);
      if (!response.success) throw new Error(response.message);
      
      // 2. Update local state immediately
      setSubmissions(prev => ({ ...prev, [currentUser!.nim]: formData }));
      setAlumniData(prev => prev.map(a => a.nim === currentUser!.nim ? { ...a, hasSubmitted: true } : a));
      if(currentUser) setCurrentUser({...currentUser, hasSubmitted: true});

      // 3. Generate summary in background (don't block success screen if it fails)
      try {
        const resultAI = await summarizeTracerData(formData);
        setSummary(resultAI);
      } catch (err) {
        console.warn("AI summary failed, but form submitted", err);
        setSummary("Terima kasih, data Anda berhasil disimpan.");
      }
      
      setView('result');
    } catch (error: any) {
      console.error(error);
      alert(`An error occurred while submitting the form: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    handleLogout();
  };
  
  const handleForgotPassword = async (email: string) => {
      const result = await sheetApi.requestPasswordReset(email);
      if(!result.success) {
          setLoginMessage({type: 'error', text: result.message || 'Error'});
          return false;
      }
      setLoginMessage({type: 'success', text: 'Permintaan reset password dikirim (Simulasi).'});
      setTimeout(() => setLoginMessage(null), 5000);
      return true;
  }

  const handleImportAlumni = async (newAlumni: Alumnus[]) => {
    setIsLoading(true);
    const result = await sheetApi.importAlumni(newAlumni);
    setIsLoading(false);
    if (!result.success) {
        alert(`Impor Gagal: ${result.message}`);
    } else {
        alert(`Data alumni berhasil diimpor.`);
        await fetchAlumniData(); // Refresh data
    }
  };

  const handleBulkStatusUpdate = async (nimsToUpdate: string[], newStatus: boolean) => {
    const result = await sheetApi.updateAlumniStatus(nimsToUpdate, newStatus);
    if (!result.success) {
        alert('Error updating status: ' + result.message);
    } else {
        await fetchAlumniData(); // Refresh data
    }
  };
  
  const handleProfileUpdate = async (updatedData: Partial<FormData>) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      const result = await sheetApi.updateProfile(currentUser.nim, updatedData);
      if(!result.success) throw new Error(result.message);
      
      const newFormData = { ...formData, ...updatedData };
      setFormData(newFormData);
      
      setAlumniData(prev => prev.map(a => a.nim === currentUser.nim ? { ...a, name: newFormData.identitas_namaLengkap } : a));
      setCurrentUser(prev => prev ? { ...prev, name: newFormData.identitas_namaLengkap } : null);
       if (submissions[currentUser.nim]) {
          setSubmissions(prev => ({ ...prev, [currentUser.nim]: { ...prev[currentUser.nim], ...updatedData }}));
      }

      setView('form');

    } catch (error: any) {
        alert('Failed to update profile: ' + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  if (appLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col bg-transparent relative overflow-hidden">
         <div className="absolute inset-0 bg-white/30 backdrop-blur-md z-0"></div>
         <div className="z-10 text-center">
             <div className="relative inline-block">
                <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-indigo-600 mb-6"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-3">
                    <i className="fas fa-graduation-cap text-indigo-300 text-2xl"></i>
                </div>
             </div>
             <h2 className="text-2xl font-bold text-slate-800 animate-pulse">{loadingText}</h2>
             <p className="text-slate-500 mt-2 text-sm">Menggunakan Google Sheets Database</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (view) {
      case 'form':
        return <TracerForm formData={formData} onInputChange={handleInputChange} onSubmit={handleFormSubmit} isLoading={isLoading} customQuestions={customQuestions} />;
      case 'result':
        return <SubmissionResult summary={summary} onReset={handleReset} alumniName={currentUser?.name || 'Alumni'} />;
      case 'admin_dashboard':
        return (
            <AdminDashboard 
                alumniList={alumniData} 
                submissions={submissions} 
                analyticsData={analyticsData} 
                onImportAlumni={handleImportAlumni} 
                onBulkStatusUpdate={handleBulkStatusUpdate}
                onFetchDetail={fetchSubmissionDetail}
            />
        );
      case 'forgot_password':
        return <ForgotPasswordPage onResetRequest={handleForgotPassword} onBackToLogin={() => setView('login')} />;
      case 'reset_password':
        return <ResetPasswordPage onResetComplete={(pass) => {alert(`Password updated (Simulated): ${pass}`); setView('login');}} onBackToLogin={() => setView('login')} />;
      case 'edit_profile':
        return <EditProfilePage initialData={formData} onSaveChanges={handleProfileUpdate} onBack={() => setView('form')} />;
      case 'login':
      default:
        return <LoginPage onLogin={handleLogin} onForgotPassword={() => setView('forgot_password')} message={loginMessage} alumniList={alumniData} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans relative">
      <div className="fixed inset-0 z-[-1] bg-gradient-to-br from-indigo-50 via-white to-purple-50"></div>

      <Header userRole={userRole} currentUser={currentUser} onLogout={handleLogout} onNavigate={setView} />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 pt-20 md:pt-24 z-10">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
