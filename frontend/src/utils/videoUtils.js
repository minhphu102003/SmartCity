export const getYoutubeThumbnail = (url) => {
    const videoId = url.split('v=')[1]?.split('&')[0]; // Lấy ID video từ URL
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };
  