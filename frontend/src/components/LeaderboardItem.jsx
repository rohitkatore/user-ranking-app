/**
 * LeaderboardItem Component - Displays a single leaderboard entry
 * @param {Object} props - Component props
 * @param {Object} props.user - User object with rank, name, and totalPoints
 * @param {boolean} props.isTopThree - Whether this user is in top 3
 */
import React from "react";

const LeaderboardItem = ({ user, isTopThree = false }) => {
  /**
   * Gets the appropriate rank display (medal for top 3, number for others)
   * @param {number} rank - User's rank position
   * @returns {string} - Display string for rank
   */
  const getRankDisplay = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  /**
   * Gets additional CSS class for styling based on rank
   * @param {number} rank - User's rank position
   * @returns {string} - CSS class name
   */
  const getRankClass = (rank) => {
    if (rank <= 3) return `rank-${rank}`;
    return "";
  };

  return (
    <div
      className={`leaderboard-item ${getRankClass(user.rank)}`}
      data-testid={`leaderboard-item-${user._id}`}
      role="listitem"
      aria-label={`Rank ${user.rank}: ${user.name} with ${user.totalPoints} points`}
    >
      {/* Rank Display */}
      <span
        className="rank"
        aria-label={`Rank ${user.rank}`}
        title={`Rank ${user.rank}`}
      >
        {getRankDisplay(user.rank)}
      </span>

      {/* User Name */}
      <span
        className="name"
        title={user.name}
        aria-label={`Player: ${user.name}`}
      >
        {user.name}
      </span>

      {/* Points Display */}
      <span
        className="points"
        aria-label={`${user.totalPoints} points`}
        title={`${user.totalPoints} points`}
      >
        {user.totalPoints} pts
      </span>
    </div>
  );
};

export default React.memo(LeaderboardItem);
