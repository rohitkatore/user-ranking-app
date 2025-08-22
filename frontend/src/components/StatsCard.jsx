/**
 * StatsCard Component - Displays statistical information in a card format
 * @param {Object} props - Component props
 * @param {string|number} props.value - The statistical value to display
 * @param {string} props.label - The label describing the statistic
 * @param {string} props.icon - Optional emoji icon for the statistic
 */
import React from "react";

const StatsCard = ({ value, label, icon }) => {
  return (
    <div
      className="stat-card"
      role="article"
      aria-labelledby={`stat-${label.replace(/\s+/g, "-").toLowerCase()}`}
    >
      {/* Statistical Value */}
      <div className="stat-value" aria-label={`${value} ${label}`}>
        {icon && (
          <span className="stat-icon" aria-hidden="true">
            {icon}
          </span>
        )}
        {value}
      </div>

      {/* Statistical Label */}
      <div
        className="stat-label"
        id={`stat-${label.replace(/\s+/g, "-").toLowerCase()}`}
      >
        {label}
      </div>
    </div>
  );
};

export default React.memo(StatsCard);
