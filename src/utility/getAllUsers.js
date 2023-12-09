export const getAllUsers = async () => {
  try {
    const response = await fetch(
      "https://projects-server-api.onrender.com/users"
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    throw error;
  }
};
