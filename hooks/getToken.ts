export const getUserToken = () => {
    const token = localStorage.getItem("authToken");

    return {
        token,
    };
};
