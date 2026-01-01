import pool from "@project/main-db";



export async function createYandexToken(user_id) {

  try {
    if (!user_id) {
      return {
        status: false,
        code: 400,
        data: "empty_user_id"
      };
    }

    const response = await pool.query("INSERT INTO yandex_tokens (user_id) VALUES ($1) RETURNING *", [user_id]);

    if (response.rowCount === 0) {
      return {
        status: false,
        code: 500,
        data: "server_error"
      };
    }

    return {
      status: true,
      code: 200,
      data: response.rows[0]
    }
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "server_error"
    };
  }

};

export async function getYandexToken(refresh_token) {

  try {
    if (!refresh_token) {
      return {
        status: false,
        code: 400,
        data: "empty_refresh_token"
      };
    }

    const response = await pool.query("SELECT * FROM yandex_tokens WHERE refresh_token=$1", [refresh_token]);

    if (response.rowCount === 0) {
      return {
        status: false,
        code: 400,
        data: "token_not_found"
      };
    }

    return {
      status: true,
      code: 200,
      data: response.rows[0]
    }
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "server_error"
    };
  }

};

export async function refreshYandexToken(refresh_token) {

  try {
    if (!refresh_token) {
      return {
        status: false,
        code: 400,
        data: "empty_refresh_token"
      };
    }

    const tokenData = await getYandexToken(refresh_token);

    if (!tokenData.status) {
      return tokenData;
    }

    const newTokenResponse = await createYandexToken(tokenData.data.user_id);

    if (newTokenResponse.status) {
      return newTokenResponse;
    }

    const response = await pool.query("DELETE FROM yandex_tokens WHERE refresh_token=$1", [refresh_token]);

    if (response.rowCount === 0) {
      return {
        status: false,
        code: 500,
        data: "server_error"
      };
    }

    return newTokenResponse;
  } catch (error) {
    return {
      status: false,
      code: 500,
      data: "server_error"
    };
  }

}