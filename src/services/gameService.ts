import { GameResponse } from '../types';

// MENGGUNAKAN JALUR AMAN (Environment Variable Vite)
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("🚨 API Key tidak ditemukan!");
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// ... (Sisa kode ke bawah tetap sama persis seperti yang Anda kirimkan) ...

// Instruksi Sistem (Diperbarui untuk memaksa OpenRouter mengeluarkan JSON murni)
const SYSTEM_INSTRUCTION = `
Bertindaklah sebagai "Birokrasi Engine", sebuah mesin game simulasi berbasis teks. Judul game ini adalah "Ajudan Manager 2026". 
Pemain berperan sebagai Asisten Pribadi (Ajudan/Staf Khusus) untuk seorang Menteri di Indonesia.

# FORMAT RESPONS (WAJIB JSON MURNI)
Anda WAJIB merespons HANYA dengan format JSON yang valid. Jangan tambahkan teks markdown seperti \`\`\`json di awal atau akhir.
Struktur JSON Anda harus persis seperti ini:
{
  "eventTitle": "Judul event (string)",
  "narrative": "Teks cerita/dialog format markdown (string)",
  "newsHeadlines": ["Berita 1", "Berita 2"],
  "tasks": [
    { "title": "Nama tugas", "description": "Detail", "progress": 50 }
  ],
  "options": [
    { "id": "A", "text": "Pilihan A", "riskText": "Risiko A" }
  ],
  "stats": {
    "hari": 1, "bulan": 1, "tahun": 1, "atasan": "Nama Atasan", 
    "reputasiPribadi": 50, "kepercayaanAtasan": 50, "tingkatStres": 50, 
    "politicalPower": 50, "opiniPublik": 50, "dukunganPartai": 50
  },
  "memories": [
    { "hari": 1, "text": "Menolak Suap", "impact": "Integritas +" }
  ],
  "notifications": []
}

# MEKANIK & SIKLUS HARIAN
1. Pagi: Berikan 2-3 tugas harian di \`tasks\`.
2. Siang: Berikan opsi tindakan di \`options\`.
3. Sore/Malam: Tampilkan hasil keputusan di \`narrative\`. Sesuaikan \`stats\`.

# AWAL PERMAINAN
Saat permainan dimulai, sapa pemain, minta mereka memasukkan Nama Karakter. KOSONGKAN array \`options\`. Set stat ke 50, Hari 1. Atasan: "Belum Ditugaskan".
Setelah mendapat nama, berikan narasi pengangkatan dan 3 pilihan instansi awal di \`options\`.
`;

// 1. Fungsi Inisialisasi: Membuat objek memori manual untuk OpenRouter
export const initGameSession = () => {
  return {
    messages: [
      { role: "system", content: SYSTEM_INSTRUCTION }
    ]
  };
};

// 2. Fungsi Pengirim Pesan
export const sendPlayerAction = async (chatSession: any, actionText: string): Promise<GameResponse> => {
  try {
    // Memasukkan input pemain ke dalam riwayat obrolan
    chatSession.messages.push({ role: "user", content: actionText });

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ajudan-manager.vercel.app",
        "X-Title": "Ajudan Manager 2026",
      },
      body: JSON.stringify({
        // Menggunakan Gemini 2.5 Flash via OpenRouter (Lebih stabil untuk JSON)
        model: "google/gemini-2.5-flash", 
        messages: chatSession.messages,
        temperature: 0.7,
        // Fitur OpenRouter untuk memaksa output JSON
        response_format: { type: "json_object" } 
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    let aiResponseText = data.choices[0].message.content;

    // Pelindung Ekstra: Membuang backticks markdown (```json) jika AI masih bandel
    aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/g, '').trim();

    // Mengubah string menjadi Object
    const parsedData: GameResponse = JSON.parse(aiResponseText);

    // Menyimpan respons AI ke riwayat agar AI ingat konteks sebelumnya (PENTING untuk Butterfly Effect)
    chatSession.messages.push({ role: "assistant", content: JSON.stringify(parsedData) });

    return parsedData;

  } catch (error) {
    console.error("🚨 Gagal menghubungi OpenRouter:", error);
    throw error;
  }
};