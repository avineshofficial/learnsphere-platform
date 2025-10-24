/**
 * Converts a standard YouTube URL to an embeddable URL.
 * @param {string} url - The original YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)
 * @returns {string|null} - The embeddable URL or null if the URL is invalid.
 */
export const getYouTubeEmbedUrl = (url) => {
    if (!url) {
        return null;
    }

    let videoId = null;
    // Regular expression to find the YouTube video ID
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);

    if (match) {
        videoId = match[1];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};