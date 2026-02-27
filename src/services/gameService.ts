import { GoogleGenAI, Type } from '@google/genai';
import { GameResponse } from '../types';

// 1. Mengambil API Key dengan cara yang benar untuk Vite (harus diawali VITE_)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("🚨 API Key tidak ditemukan! Pastikan Anda memiliki file .env yang berisi VITE_GEMINI_API_KEY=...");
}

// 2. Inisialisasi AI Engine
const ai = new GoogleGenAI({ apiKey: apiKey as string });

// 3. System Prompt (Instruksi Otak Game)
const SYSTEM_INSTRUCTION = `
Bertindaklah sebagai "Birokrasi Engine", sebuah mesin game simulasi berbasis teks. Judul game ini adalah "Ajudan Manager 2026". 
Pemain berperan sebagai Asisten Pribadi (Ajudan/Staf Khusus) untuk seorang Menteri atau Kepala Lembaga Negara di Indonesia.
Game ini mengadaptasi mekanik "Football Manager", di mana pemain harus mengelola tugas harian, menangani krisis, membangun jaringan, dan bisa melakukan "transfer" (pindah kerja) ke kementerian/lembaga lain demi karir yang lebih tinggi.

# FORMAT RESPONS (JSON)
Anda WAJIB merespons dalam format JSON sesuai schema yang diberikan.
- eventTitle: Judul event saat ini (misal: "PANGGILAN DARURAT: RDP DPR" atau "RUTINITAS PAGI").
- narrative: Teks cerita, dialog, dan deskripsi situasi saat ini. Gunakan markdown untuk formatting.
- newsHeadlines: Array berisi 3-4 judul berita hari ini yang relevan dengan situasi politik atau tindakan pemain sebelumnya.
- tasks: Daftar tugas harian. Berikan progress (0-100) untuk setiap tugas.
- options: Berikan 2-4 pilihan tindakan yang spesifik dan berdampak. KOSONGKAN array ini HANYA saat awal permainan ketika Anda meminta pemain memasukkan nama karakter. Setiap opsi harus memiliki "riskText" yang menjelaskan risiko singkat.
- stats: Variabel status pemain saat ini.
- memories: Daftar keputusan penting pemain di masa lalu (Butterfly Effect). Format text: "Menolak Suap", impact: "(Integritas +, Power -)".
- notifications: Notifikasi penting seperti tawaran kerja dari BIN/KPK atau peringatan pemecatan.

# MEKANIK GAME & SIKLUS HARIAN
Game berjalan dalam siklus harian dengan struktur berikut:
1. Pagi (Briefing): Berikan 2-3 tugas harian di dalam array \`tasks\`.
2. Siang (Eksekusi): Berikan opsi tindakan di array \`options\`.
3. Sore/Malam (Evaluasi & Event Acak): Tampilkan hasil dari keputusan pemain di \`narrative\`. Sesuaikan \`stats\` berdasarkan keberhasilan/kegagalan. Munculkan Event Acak.

# MEKANIK BURSA TRANSFER (PINDAH KERJA)
- Setiap akhir bulan (Hari ke-30), berikan rekap bulanan.
- Jika "reputasiPribadi" > 70, akan ada tawaran rahasia dari lembaga lain. Masukkan ke dalam \`notifications\`.
- Jika "kepercayaanAtasan" mencapai 0, pemain dipecat.

# ATURAN INTERAKSI AI
1. Jangan pernah keluar dari karakter. Tetaplah menjadi narator game.
2. Gunakan bahasa birokrasi, politik, dan formal ala pemerintahan Indonesia, namun berikan sentuhan drama intrik politik.
3. Buat konsekuensi dari setiap pilihan terasa berat dan saling berkaitan (butterfly effect). Selalu catat di \`memories\`.

# AWAL PERMAINAN
Saat permainan dimulai, sapa pemain, minta mereka memasukkan Nama Karakter. KOSONGKAN array \`options\` agar pemain bisa mengetik nama mereka. Set semua stat awal ke 50, Hari 1, Bulan 1, Tahun 1. Atasan: "Belum Ditugaskan".
Setelah pemain memasukkan nama, berikan narasi pengangkatan dan 3 pilihan instansi awal di array \`options\`.
`;

// 4. Fungsi untuk Memulai Sesi Game Baru
export const initGameSession = () => {
  return ai.chats.create({
    // Anda bisa mengganti ini ke "gemini-2.5-flash" jika versi 3 masih berstatus preview dan kurang stabil
    model: "gemini-3-flash-preview", 
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          eventTitle: { type: Type.STRING },
          narrative: { type: Type.STRING },
          newsHeadlines: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          tasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                progress: { type: Type.INTEGER }
              },
              required: ["title", "description", "progress"]
            }
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                riskText: { type: Type.STRING }
              },
              required: ["id", "text", "riskText"]
            }
          },
          stats: {
            type: Type.OBJECT,
            properties: {
              hari: { type: Type.INTEGER },
              bulan: { type: Type.INTEGER },
              tahun: { type: Type.INTEGER },
              atasan: { type: Type.STRING },
              reputasiPribadi: { type: Type.INTEGER },
              kepercayaanAtasan: { type: Type.INTEGER },
              tingkatStres: { type: Type.INTEGER },
              politicalPower: { type: Type.INTEGER },
              opiniPublik: { type: Type.INTEGER },
              dukunganPartai: { type: Type.INTEGER }
            },
            required: ["hari", "bulan", "tahun", "atasan", "reputasiPribadi", "kepercayaanAtasan", "tingkatStres", "politicalPower", "opiniPublik", "dukunganPartai"]
          },
          memories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                hari: { type: Type.INTEGER },
                text: { type: Type.STRING },
                impact: { type: Type.STRING }
              },
              required: ["hari", "text", "impact"]
            }
          },
          notifications: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            }
          }
        },
        required: ["eventTitle", "narrative", "newsHeadlines", "tasks", "options", "stats", "memories", "notifications"]
      }
    }
  });
};

// 5. Fungsi untuk Mengirim Keputusan Pemain ke AI dan Mendapatkan Respons JSON
export const sendPlayerAction = async (chatSession: any, actionText: string): Promise<GameResponse> => {
  try {
    const response = await chatSession.sendMessage({
        text: actionText
    });
    
    // SDK @google/genai biasanya mengembalikan teks mentah, kita harus mem-parsingnya ke JSON
    const gameData: GameResponse = JSON.parse(response.text); 
    return gameData;
    
  } catch (error) {
    console.error("🚨 Gagal memproses aksi pemain:", error);
    throw error;
  }
};