/**
 * Custom hook for managing API calls and data fetching
 * Provides centralized state management for user operations
 */
import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export const useUserManagement = () => {
  // State management for user data
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6); // Show 6 users per page

  /**
   * Fetches all users from the API
   * @returns {Promise<void>}
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users");
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMessage("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches the leaderboard data from the API
   * @returns {Promise<void>}
   */
  const fetchLeaderboard = useCallback(async () => {
    try {
      const response = await axios.get("/api/leaderboard");
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setMessage("Failed to load leaderboard. Please try again.");
    }
  }, []);

  /**
   * Adds a new user to the system
   * @param {string} userName - The name of the user to add
   * @returns {Promise<boolean>} - Success status
   */
  const addUser = useCallback(
    async (userName) => {
      if (!userName.trim()) {
        setMessage("Please enter a valid name");
        return false;
      }

      setLoading(true);
      try {
        const response = await axios.post("/api/users", {
          name: userName.trim(),
        });
        setMessage(`Welcome ${userName}! ${response.data.message}`);

        // Refresh data
        await Promise.all([fetchUsers(), fetchLeaderboard()]);
        return true;
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to add user";
        setMessage(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers, fetchLeaderboard]
  );

  /**
   * Claims random points for a specific user
   * @param {string} userId - The ID of the user claiming points
   * @returns {Promise<boolean>} - Success status
   */
  const claimPoints = useCallback(
    async (userId) => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/users/${userId}/claim`);
        setMessage(
          `🎉 ${response.data.message} Points awarded: ${response.data.pointsAwarded}`
        );

        // Refresh data
        await Promise.all([fetchUsers(), fetchLeaderboard()]);
        return true;
      } catch (error) {
        const errorMessage =
          error.response?.data?.error || "Failed to claim points";
        setMessage(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchUsers, fetchLeaderboard]
  );

  /**
   * Clears the current message
   */
  const clearMessage = useCallback(() => {
    setMessage("");
  }, []);

  /**
   * Calculate pagination data
   */
  const getPaginatedUsers = useCallback(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return {
      currentUsers,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [users, currentPage, usersPerPage]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(() => {
    const { totalPages } = getPaginatedUsers();
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, getPaginatedUsers]);

  /**
   * Navigate to previous page
   */
  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  /**
   * Go to specific page
   * @param {number} page - Page number to navigate to
   */
  const goToPage = useCallback(
    (page) => {
      const { totalPages } = getPaginatedUsers();
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [getPaginatedUsers]
  );

  // Load initial data on mount
  useEffect(() => {
    fetchUsers();
    fetchLeaderboard();
  }, [fetchUsers, fetchLeaderboard]);

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(clearMessage, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return {
    // Data
    users,
    leaderboard,
    loading,
    message,

    // Pagination
    pagination: getPaginatedUsers(),
    nextPage,
    prevPage,
    goToPage,

    // Actions
    addUser,
    claimPoints,
    clearMessage,
    refreshData: () => Promise.all([fetchUsers(), fetchLeaderboard()]),
  };
};
