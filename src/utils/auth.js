// Simulating authentication logic with hardcoded users
const users = [
    { username: "manager1", password: "managerpass", role: "manager" },
    { username: "cleaner1", password: "cleanerpass", role: "cleaner" },
    { username: "user1", password: "userpass", role: "user" },
  ];
  
  export function authenticateUser(username, password) {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    return user ? user.role : null;
  }
  