
import { Alumnus, FormData, Question } from '../types';

// URL Web App Google Apps Script Anda
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw9SgmU74lkUv-USxsX1n50_bRXiHv36gOFJZ2J7vQB04bzQwljtEi0vh6KifbbXHxT/exec";

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

// Response structure for the batch initial data fetch
interface InitialDataResponse {
    alumni: Alumnus[];
    questions: Question[];
}

const callScript = async <T>(action: string, payload: any = {}): Promise<ApiResponse<T>> => {
    try {
        // Menggunakan "Content-Type": "text/plain" sangat penting untuk menghindari 
        // masalah CORS (Cross-Origin Resource Sharing) pada Google Apps Script.
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify({ action, ...payload }),
        });
        
        const result = await response.json();
        return result;
    } catch (error: any) {
        console.error(`Error calling ${action}:`, error);
        return { success: false, message: error.message || 'Gagal terhubung ke database spreadsheet.' };
    }
};

export const sheetApi = {
    // --- OPTIMIZATION: Fetch Alumni & Questions in ONE request ---
    getInitialData: async () => {
        return await callScript<InitialDataResponse>('getInitialData');
    },

    // Verifikasi login admin
    loginAdmin: async (email: string, password: string) => {
        return await callScript<{ token: string }>('loginAdmin', { email, password });
    },

    // Ambil daftar alumni untuk dropdown login (fallback jika perlu refresh)
    getAlumni: async () => {
        return await callScript<Alumnus[]>('getAlumni');
    },

    // Kirim data kuesioner
    submitForm: async (data: FormData) => {
        return await callScript('submitForm', { formData: data });
    },

    // Ambil semua data submission untuk dashboard
    getAllSubmissions: async () => {
        return await callScript<FormData[]>('getAllSubmissions');
    },

    // Admin: Import data alumni baru via CSV
    importAlumni: async (alumniList: Alumnus[]) => {
        return await callScript('importAlumni', { alumniList });
    },

    // Admin: Update status submitted secara massal
    updateAlumniStatus: async (nims: string[], hasSubmitted: boolean) => {
        return await callScript('updateAlumniStatus', { nims, hasSubmitted });
    },
    
    // Admin: Update Profil Alumni
    updateProfile: async (nim: string, data: Partial<FormData>) => {
        return await callScript('updateProfile', { nim, data });
    },
    
    // Request Password Reset (Mock)
    requestPasswordReset: async (email: string) => {
        return await callScript('requestPasswordReset', { email });
    },

    // --- Manajemen Soal Dinamis ---
    getQuestions: async () => {
        return await callScript<Question[]>('getQuestions');
    },

    saveQuestion: async (question: Question) => {
        return await callScript('saveQuestion', { question });
    },

    deleteQuestion: async (id: string) => {
        return await callScript('deleteQuestion', { id });
    }
};
