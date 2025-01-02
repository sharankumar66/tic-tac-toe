<script>
	import MainMenu from "./scenes/MainMenu";
	import Matchmaking from "./scenes/Matchmaking";
	import InGame from "./scenes/InGame";

	import CONFIG from "./config";

	const config = {
		type: Phaser.AUTO,
		width: CONFIG.WIDTH,
		height: CONFIG.HEIGHT,
		backgroundColor: "#6b6858",
 		autoCenter: true,
		scene: [MainMenu, Matchmaking, InGame, ],
	};

	new Phaser.Game(config);
</script>
