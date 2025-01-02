// Username.js
import Phaser from 'phaser';

export default class Username extends Phaser.Scene {
    constructor() {
        super({ key: 'Username' });
    }

    preload() {
        // Load any assets you need (for example, fonts, button images)
    }

    create() {
        // Add a title
        this.add.text(this.cameras.main.centerX, 100, 'Who are you?', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Create the input field for the nickname
        this.nicknameInput = this.add.dom(this.cameras.main.centerX, 200).createFromHTML(`
            <input type="text" placeholder="Nickname" style="font-size: 20px; padding: 5px; width: 200px;"/>
        `);

        // Create the "Continue" button
        const continueButton = this.add.text(this.cameras.main.centerX, 300, 'Continue', {
            fontSize: '24px',
            fill: '#0f0',
            backgroundColor: '#040',
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5);

        // Make the button interactive
        continueButton.setInteractive();
        continueButton.on('pointerdown', this.onContinueClick, this);
    }

    onContinueClick() {
        // Ensure the nickname input is properly retrieved
        const inputElement = this.nicknameInput.getChildByName('input');
        const nickname = inputElement ? inputElement.value : '';

        if (nickname.trim()) {
            // Send the nickname to Nakama server (replace with your server endpoint)
            fetch('http://localhost:7350/v2/identity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nickname,
                }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Optionally store the username in localStorage or a global variable
                    localStorage.setItem('nickname', nickname);

                    // Now, move to the next scene (MainMenu)
                    this.scene.start('MainMenu');
                } else {
                    // Handle errors, like username not valid
                    alert('Failed to set username');
                }
            })
            .catch(error => {
                console.error('Error setting username:', error);
                alert('Error setting username');
            });
        } else {
            // Alert user to provide a nickname
            alert('Please enter a valid nickname.');
        }
    }
}
