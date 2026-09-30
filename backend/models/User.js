const { query } = require('../db');

// Find user by email
const findByEmail = async (email) => {
  const users = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
  return users.length > 0 ? users[0] : null;
};

// Find user by ID
const findById = async (id) => {
  const users = await query('SELECT * FROM users WHERE id = ?', [id]);
  return users.length > 0 ? users[0] : null;
};

// Create new user
const createUser = async (name, email, password, role = 'patient') => {
  const result = await query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email.toLowerCase().trim(), password, role]
  );
  return result.insertId;
};

module.exports = {
  findByEmail,
  findById,
  createUser
};
