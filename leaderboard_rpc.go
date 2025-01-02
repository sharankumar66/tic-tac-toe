package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"github.com/heroiclabs/nakama-common/runtime"
)

const leaderboardID = "tictactoe_leaderboard"

// rpcLeaderboard retrieves and formats leaderboard records with pagination and dynamic data.
func rpcLeaderboard(ctx context.Context, logger runtime.Logger, db *sql.DB, nk runtime.NakamaModule, payload string) (string, error) {
	// Optional: Parse payload for pagination or other parameters
	var request map[string]interface{}
	if err := json.Unmarshal([]byte(payload), &request); err != nil {
		logger.Error("Error unmarshalling payload: %v", err)
		return "", errInternalError
	}

	// Default values
	limit := 10
	if request["limit"] != nil {
		limit = int(request["limit"].(float64))
	}
	cursor := ""
	if request["cursor"] != nil {
		cursor = request["cursor"].(string)
	}

	// Fetch leaderboard records with pagination support.
	records, nextCursor, prevCursor, totalCount, err := nk.LeaderboardRecordsList(ctx, leaderboardID, nil, int(limit), cursor, 0)
	if err != nil {
		logger.Error("Error fetching leaderboard records: %v", err)
		return "", errInternalError
	}

	// Format the leaderboard data.
	var result []map[string]interface{}
	for _, record := range records {
		result = append(result, map[string]interface{}{
			"rank":        record.Rank,
			"username":    record.Username,
			"score":       record.Score,
			"metadata":    record.Metadata, // Use metadata to store additional details like W/L/D.
			"update_time": record.UpdateTime, // Store or format the time when the record was updated.
		})
	}

	// Add pagination info to the response.
	leaderboardResponse := map[string]interface{}{
		"records":     result,
		"next_cursor": nextCursor,
		"prev_cursor": prevCursor,
		"total_count": totalCount,
	}

	// Convert result to JSON and return.
	resultJSON, err := json.Marshal(leaderboardResponse)
	if err != nil {
		logger.Error("Error marshalling leaderboard records: %v", err)
		return "", errMarshal
	}

	return string(resultJSON), nil
}

// registerLeaderboard ensures the leaderboard is created.
func registerLeaderboard(ctx context.Context, nk runtime.NakamaModule) error {
	// Create the leaderboard if it doesn't exist.
	err := nk.LeaderboardCreate(ctx, leaderboardID, true, "desc", "best", "", nil, false)
	if err != nil {
		return err
	}
	return nil
}

// Example of updating a leaderboard record with metadata (W/L/D, time consumed)
func updateLeaderboardRecord(ctx context.Context, logger runtime.Logger, nk runtime.NakamaModule, username string, score int, metadata map[string]interface{}) error {
	// Convert score and subscore to int64
	scoreInt64 := int64(score)
	subscoreInt64 := int64(0) // Set subscore to 0 if not used

	// Convert metadata to JSON string for storage
	metadataJSON, err := json.Marshal(metadata)
	if err != nil {
		logger.Error("Error marshalling metadata: %v", err)
		return errMarshal
	}

	// Prepare extra data as map[string]interface{}
	extraData := make(map[string]interface{})

	// No expiration (set to nil) if not needed
	var expiresAt *int

	// Save or update leaderboard record
	_, err = nk.LeaderboardRecordWrite(ctx, leaderboardID, username, string(metadataJSON), scoreInt64, subscoreInt64, extraData, expiresAt)
	if err != nil {
		logger.Error("Error updating leaderboard: %v", err)
		return errInternalError
	}
	return nil
}


// Example of updating the leaderboard when a game ends
func endGameAndUpdateLeaderboard(ctx context.Context, logger runtime.Logger, nk runtime.NakamaModule, playerUsername string, score int, gameResult string, timeConsumed int) error {
	// Create metadata for the leaderboard (W/L/D, time consumed)
	metadata := map[string]interface{}{
		"result":     gameResult,       // "Win", "Loss", "Draw"
		"time_spent": timeConsumed,     // Game duration in seconds or minutes
		"points":     score,            // Player score
	}

	// Update the leaderboard record for the player
	return updateLeaderboardRecord(ctx, logger, nk, playerUsername, score, metadata)
}
