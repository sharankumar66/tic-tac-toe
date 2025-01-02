"use strict";
var Mark;
(function (Mark) {
    Mark[Mark["UNDEFINED"] = 0] = "UNDEFINED";
    Mark[Mark["X"] = 1] = "X";
    Mark[Mark["O"] = 2] = "O";
})(Mark || (Mark = {}));
// The complete set of opcodes used for communication between clients and server.
var OpCode;
(function (OpCode) {
    // New game round starting.
    OpCode[OpCode["START"] = 1] = "START";
    // Update to the state of an ongoing round.
    OpCode[OpCode["UPDATE"] = 2] = "UPDATE";
    // A game round has just completed.
    OpCode[OpCode["DONE"] = 3] = "DONE";
    // A move the player wishes to make and sends to the server.
    OpCode[OpCode["MOVE"] = 4] = "MOVE";
    // Move was rejected.
    OpCode[OpCode["REJECTED"] = 5] = "REJECTED";
    // Opponent has left the game.
    OpCode[OpCode["OPPONENT_LEFT"] = 6] = "OPPONENT_LEFT";
    // Invite AI player to join instead of the opponent who left the game.
    OpCode[OpCode["INVITE_AI"] = 7] = "INVITE_AI";
})(OpCode || (OpCode = {}));
