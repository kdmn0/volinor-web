import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// ES Module ortamında __dirname hesaplama
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env dosyasını kök dizinden yükle
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// --- YAPILANDIRMA (.env'den ÇEKİLİYOR) ---
const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const MAX_RESULTS = 10; // Kaç video çekileceği

// Dosyanın kaydedileceği yer (Frontend'in okuması için public klasörü)
const OUTPUT_FILE = path.join(__dirname, "..", "public", "videolar.json");

// Kanalın "Yüklenenler" oynatma listesinin ID'sini bulma fonksiyonu
// Kural: Kanal ID'sinin başındaki "UC", "UU" ile değiştirilir.
const getUploadsPlaylistId = (channelId) => {
  if (channelId.startsWith("UC")) {
    return "UU" + channelId.slice(2);
  }
  return channelId;
};

async function fetchYoutubeVideos() {
  console.log(
    `[${new Date().toISOString()}] YouTube videoları güncelleniyor...`,
  );

  const playlistId = getUploadsPlaylistId(CHANNEL_ID);
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${MAX_RESULTS}&playlistId=${playlistId}&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "YouTube API bağlantı hatası");
    }

    // Sadece işimize yarayan verileri alıp filtreliyoruz
    const videos = data.items.map((item) => {
      const snippet = item.snippet;
      return {
        id: snippet.resourceId.videoId,
        title: snippet.title,
        description: snippet.description,
        // En yüksek çözünürlüklü kapak fotoğrafını alıyoruz, yoksa alt kaliteye düşüyoruz
        thumbnail:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url,
        publishedAt: snippet.publishedAt,
      };
    });

    // Veriyi public/videolar.json'a yaz
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(videos, null, 2), "utf-8");
    console.log(
      `✅ Başarılı: ${videos.length} video çekildi ve ${OUTPUT_FILE} konumuna kaydedildi.`,
    );
  } catch (error) {
    console.error("❌ Hata oluştu:", error.message);
    process.exit(1);
  }
}

fetchYoutubeVideos();
