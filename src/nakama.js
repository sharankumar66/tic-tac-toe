import { Client } from "@heroiclabs/nakama-js";
import { v4 as uuidv4 } from "uuid";

class Nakama {
    constructor() {
        this.client;
        this.session;
        this.socket; // ep4
        this.matchID; // ep4
    }

    async authenticate() {
        this.client = new Client("defaultkey", "localhost", "7350");
        this.client.ssl = false;

        let deviceId = localStorage.getItem("deviceId");
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem("deviceId", deviceId);
        }

        this.session = await this.client.authenticateDevice(deviceId, true);
        localStorage.setItem("user_id", this.session.user_id);

        // ep4
        const trace = false;
        this.socket = this.client.createSocket(this.useSSL, trace);
        await this.socket.connect(this.session);
    }

    async findMatch(ai = false) { // ep4
        const rpcid = "find_match";
        const matches = await this.client.rpc(this.session, rpcid, { ai: ai });

        this.matchID = matches.payload.matchIds[0];
        await this.socket.joinMatch(this.matchID);
        console.log("Matched joined!");
    }

    async makeMove(index) { // ep4
        var data = { "position": index };
        await this.socket.sendMatchState(this.matchID, 4, JSON.stringify(data));
        console.log("Match data sent");
    }

    async inviteAI() {
        await this.socket.sendMatchState(this.matchID, 7, "");
        console.log("AI player invited");
    }

    // Submit Score to Leaderboard
    async submitLeaderboardScore(score) {
        const leaderboardId = "tictactoe_leaderboard"; // Use the appropriate leaderboard ID
        const metadata = JSON.stringify({ "wins": score.wins, "losses": score.losses }); // Example metadata

        try {
            await this.client.writeLeaderboardRecord(this.session, leaderboardId, score.score, metadata);
            console.log("Score submitted to leaderboard!");
        } catch (error) {
            console.error("Error submitting score to leaderboard:", error);
        }
    }

async fetchLeaderboard(limit = 10) {
    const leaderboardId = "tictactoe_leaderboard"; // Ensure this matches the leaderboard ID in Nakama backend
    try {
        const leaderboardRecords = await this.client.listLeaderboardRecords(this.session, leaderboardId, limit);
        console.log("Leaderboard data:", leaderboardRecords);
        return leaderboardRecords;
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
}

}

export default new Nakama();
