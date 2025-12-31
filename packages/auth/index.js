import bcrypt from 'bcrypt';
import pool from "@project/main-db";



export async function login(email, password) {

  try {
    if (!email || !password) {
      return {
        status: false,
        code: 400,
        data: "empty_email_or_password"
      };
    }

    const response = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (response.rows.length === 0) {
      return {
        status: false,
        code: 400,
        data: "Неправильный логин или пароль."
      };
    }

    if (!await bcrypt.compare(password, response.rows[0].password)) {
      return {
        status: false,
        code: 400,
        data: "Неправильный логин или пароль."
      };
    }

    return {
      status: true,
      code: 200,
      data: response.rows[0],
    }
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "Ошибка на сервере, попробуйте снова.",
      error: error,
    };
  }

}