/**
 * User Ranking Leaderboard Application
 * A modern React application for managing user rankings with point claiming system
 *
 * Features:
 * - Add new users to the competition
 * - Claim random points (1-10 per claim)
 * - Real-time leaderboard with rankings
 * - Responsive design with pagination
 * - Statistics dashboard
 *
 * @author Your Name
 * @version 1.0.0
 */

import React, { useState } from "react";
import { useUserManagement } from "./hooks/useUserManagement";
import UserCard from "./components/UserCard";
import LeaderboardItem from "./components/LeaderboardItem";
import Pagination from "./components/Pagination";
import StatsCard from "./components/StatsCard";
import "./App.css";

/**
 * Main Application Component
 * Orchestrates the entire user ranking leaderboard functionality
 */
function App() {
  // Form state for adding new users
  const [newUserName, setNewUserName] = useState("");

  // Custom hook for user management operations
  const {
    users,
    leaderboard,
    loading,
    message,
    pagination,
    addUser,
    claimPoints,
    clearMessage,
    goToPage,
    isUserClaiming,
  } = useUserManagement();

  /**
   * Handles form submission for adding a new user
   * @param {Event} e - Form submission event
   */
  const handleAddUser = async (e) => {
    e.preventDefault();

    const success = await addUser(newUserName);
    if (success) {
      setNewUserName(""); // Clear form on success
    }
  };

  /**
   * Handles claiming points for a specific user
   * @param {string} userId - The ID of the user claiming points
   */
  const handleClaimPoints = async (userId) => {
    await claimPoints(userId);
  };

  /**
   * Calculates statistics for the dashboard
   * @returns {Object} Statistics object
   */
  const getStatistics = () => {
    const totalUsers = users.length;
    const highestScore =
      leaderboard.length > 0 ? leaderboard[0]?.totalPoints || 0 : 0;
    const averageScore =
      totalUsers > 0
        ? Math.round(
            users.reduce((sum, user) => sum + user.totalPoints, 0) / totalUsers
          )
        : 0;

    return { totalUsers, highestScore, averageScore };
  };

  const stats = getStatistics();

  return (
    <div className="app">
      {/* Gaming Background Elements */}
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="gaming-grid"></div>

      {/* Application Header */}
      <header className="app-header">
        <h1>🏆 User Ranking Leaderboard</h1>
        <p>
          Compete with friends, claim points, and climb to the top of the
          leaderboard!
        </p>
      </header>

      {/* Message Display */}
      {message && (
        <div
          className={`message ${
            message.includes("Error") || message.includes("Failed")
              ? "error"
              : "success"
          }`}
          role="alert"
          aria-live="polite"
        >
          <span>{message}</span>
          <button
            onClick={clearMessage}
            className="message-close"
            aria-label="Close message"
            type="button"
          >
            ×
          </button>
        </div>
      )}

      {/* Add User Section */}
      <section className="add-user-section" aria-labelledby="add-user-heading">
        <h2 id="add-user-heading">✨ Add New Player</h2>
        <form onSubmit={handleAddUser} className="add-user-form">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Enter your name to join the competition"
            disabled={loading}
            maxLength="50"
            required
            aria-label="Enter your name"
            autoComplete="name"
          />
          <button
            type="submit"
            disabled={loading || !newUserName.trim()}
            aria-label="Join the game"
          >
            {loading ? "Adding..." : "🚀 Join Game"}
          </button>
        </form>
      </section>

      {/* Statistics Section */}
      {users.length > 0 && (
        <section className="stats-section" aria-labelledby="stats-heading">
          <h2 id="stats-heading">📊 Game Statistics</h2>
          <div className="stats-grid" role="group" aria-label="Game statistics">
            <StatsCard
              value={stats.totalUsers}
              label="Total Players"
              icon="👥"
            />
            <StatsCard
              value={stats.highestScore}
              label="Highest Score"
              icon="🏆"
            />
            <StatsCard
              value={stats.averageScore}
              label="Average Score"
              icon="📊"
            />
          </div>
        </section>
      )}

      {/* Users List Section */}
      <section className="users-section" aria-labelledby="users-heading">
        <h2 id="users-heading">🎮 All Players</h2>

        {users.length === 0 ? (
          <div className="empty-state" role="img" aria-label="No players yet">
            <div className="empty-icon">🎯</div>
            <h3>No players yet!</h3>
            <p>
              Be the first to join the competition and start claiming points.
            </p>
          </div>
        ) : (
          <>
            {/* Users Grid */}
            <div className="users-grid" role="grid" aria-label="Player cards">
              {pagination.currentUsers.map((user) => (
                <UserCard
                  key={user._id}
                  user={user}
                  onClaimPoints={handleClaimPoints}
                  loading={isUserClaiming(user._id)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination pagination={pagination} onPageChange={goToPage} />
          </>
        )}
      </section>

      {/* Leaderboard Section */}
      <section
        className="leaderboard-section"
        aria-labelledby="leaderboard-heading"
      >
        <h2 id="leaderboard-heading">🏆 Champions Leaderboard</h2>

        {leaderboard.length === 0 ? (
          <div
            className="empty-state"
            role="img"
            aria-label="Empty leaderboard"
          >
            <div className="empty-icon">🏆</div>
            <h3>Leaderboard is empty!</h3>
            <p>Start claiming points to see rankings appear here.</p>
          </div>
        ) : (
          <div className="leaderboard" role="list" aria-label="User rankings">
            {leaderboard.map((user) => (
              <LeaderboardItem
                key={user._id}
                user={user}
                isTopThree={user.rank <= 3}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
