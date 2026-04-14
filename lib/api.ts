export type User = {
  id: number;
  name: string;
  email: string;
};

const USERS_KEY = "crud_users";

const defaultUsers: User[] = [
  { id: 1, name: "Sagar", email: "sagarrana8266@gmail.com" },
];

const readUsers = (): User[] => {
  if (typeof window === "undefined") {
    return defaultUsers;
  }

  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    const parsed = JSON.parse(raw) as User[];
    return Array.isArray(parsed) ? parsed : defaultUsers;
  } catch {
    return defaultUsers;
  }
};

const writeUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): User[] => readUsers();

export const addUser = (user: Omit<User, "id">): User[] => {
  const users = readUsers();
  users.push({ id: Date.now(), ...user });
  writeUsers(users);
  return users;
};

export const updateUser = (id: number, user: Omit<User, "id">): User[] => {
  const users = readUsers().map((existing) =>
    existing.id === id ? { id, ...user } : existing,
  );
  writeUsers(users);
  return users;
};

export const deleteUser = (id: number): User[] => {
  const users = readUsers().filter((user) => user.id !== id);
  writeUsers(users);
  return users;
};
