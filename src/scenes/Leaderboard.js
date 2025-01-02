import Phaser from 'phaser';
import Nakama from "../nakama";

class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super("leaderboard");
    }

    preload() {
        // Preload any assets you may need for the leaderboard UI, like fonts or images
    }

    async create() {
        // Set up a simple background and text to display the leaderboard
        this.add.text(100, 50, 'Leaderboard', { font: '32px Arial', fill: '#ffffff' });

        // Fetch the leaderboard data from Nakama backend
        const leaderboardData = await Nakama.fetchLeaderboard();

        // Display leaderboard entries
        let yPosition = 100; // Starting y position to place leaderboard entries
        leaderboardData.forEach((entry, index) => {
            const text = `${index + 1}. ${entry.username} - Score: ${entry.score}`;
            this.add.text(100, yPosition, text, { font: '24px Arial', fill: '#ffffff' });
            yPosition += 30; // Move down for the next entry
        });

        // Button to go back to the main menu or game
        const backButton = this.add.text(100, yPosition + 50, 'Back to Game', { font: '24px Arial', fill: '#00ff00' })
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('MainScene'); // Replace 'MainScene' with your actual main scene key
            });
    }

    update() {
        // Any updates for leaderboard scene (if necessary)
    }
}

export default LeaderboardScene;
