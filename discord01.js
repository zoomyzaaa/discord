const Discord = require('discord.js');
const axios = require('axios');
const fs = require('fs');

const client = new Discord.Client();

// Event listener for when the bot is ready
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Event listener for when a message is sent
client.on('message', async (message) => {
    // Check if the message contains an Instagram reel or TikTok link
    if (message.content.includes('instagram.com/reel') || message.content.includes('tiktok.com')) {
        // Extract the video URL from the message
        const videoUrl = extractVideoUrl(message.content);

        // Download the video from the URL
        const videoData = await downloadVideo(videoUrl);

        // Upload the video to Discord
        uploadVideoToDiscord(videoData, message.channel);
    }
});

/**
 * Extracts the video URL from a message.
 *
 * @param {string} messageContent - The content of the message.
 * @returns {string} The video URL.
 */
function extractVideoUrl(messageContent) {
    // Extract the video URL using regular expressions
    const regex = /(https?:\/\/[^\s]+)/g;
    const matches = messageContent.match(regex);
    return matches[0];
}

/**
 * Downloads a video from a given URL.
 *
 * @param {string} videoUrl - The URL of the video.
 * @returns {Promise<Buffer>} The video data as a Buffer.
 */
async function downloadVideo(videoUrl) {
    const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

/**
 * Uploads a video to a Discord channel.
 *
 * @param {Buffer} videoData - The video data as a Buffer.
 * @param {Discord.TextChannel} channel - The Discord channel to upload the video to.
 */
function uploadVideoToDiscord(videoData, channel) {
    // Create a temporary file to store the video
    const tempFilePath = 'temp_video.mp4';
    fs.writeFileSync(tempFilePath, videoData);

    // Upload the video to the Discord channel
    channel.send({ files: [tempFilePath] });

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);
}

// Replace 'YOUR_DISCORD_BOT_TOKEN' with your actual Discord bot token
client.login('YOUR_DISCORD_BOT_TOKEN');