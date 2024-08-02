function isUserConnected() {
    const user = localStorage.getItem("token");
    return (user !== null);
}