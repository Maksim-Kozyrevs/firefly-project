import pool from "@project/main-db";



export async function createTemporaryToken(data) {

  try {
    const response = await pool.query("INSERT INTO temporary_tokens (data) VALUES ($1) RETURNING *", [data]);

    if (response.rowCount === 0) {
      return {
        status: false,
        code: 500,
        data: "Ошибка на сервере, попробуйте снова.",
      };
    }

    return {
      status: true,
      code: 200,
      data: response.rows[0],
    };
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "Ошибка на сервере, попробуйте снова.",
    }
  }
 
};

export async function getTemporaryToken(token_id) {

  try {
    if (!token_id) {
      return {
        status: false,
        code: 400,
        data: "empty_token_id"
      };
    };

    const response = pool.query("SELECT * FROM temporary_tokens WHERE token_id=$1", [token_id]);

    if (response.rowCount === 0) {
      return {
        status: false,
        code: 400,
        data: "token_not_found"
      };
    };

    return {
      status: true,
      code: 200,
      data: response.rows[0],
    };
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "server_error",
      error: error
    };
  }

};