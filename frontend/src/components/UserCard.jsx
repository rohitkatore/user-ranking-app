/**
 * UserCard Component - Displays individual user information with claim points functionality
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing id, name, and totalPoints
 * @param {Function} props.onClaimPoints - Callback function for claiming points
 * @param {boolean} props.loading - Loading state indicator
 */
import React from "react";

const UserCard = ({ user, onClaimPoints, loading }) => {
  /**
   * Handles the claim points action for the user
   */
  const handleClaimPoints = () => {
    if (!loading && onClaimPoints) {
      onClaimPoints(user._id);
    }
  };

  return (
    <div className="user-card" data-testid={`user-card-${user._id}`}>
      {/* User Avatar with first letter of name */}
      <div className="user-avatar" aria-label={`${user.name}'s avatar`}>
        {user.name.charAt(0).toUpperCase()}
      </div>

      {/* User Information */}
      <h3 className="user-name" title={user.name}>
        {user.name}
      </h3>

      <p
        className="user-points"
        aria-label={`${user.name} has ${user.totalPoints} points`}
      >
        🏅 {user.totalPoints} points
      </p>

      {/* Claim Points Button */}
      <button
        onClick={handleClaimPoints}
        disabled={loading}
        className="claim-btn"
        aria-label={`Claim random points for ${user.name}`}
        type="button"
      >
        {loading ? "⏳ Claiming..." : "🎲 Claim Points"}
      </button>
    </div>
  );
};

export default React.memo(UserCard);
