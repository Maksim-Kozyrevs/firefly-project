import express from "express";
import { login } from "@project/auth";
import { createTemporaryToken, getTemporaryToken } from "@project/tokens-manage";
import { createYandexToken, getYandexToken, refreshYandexToken } from "./auth.services.js";



const router = express.Router();



router.get("/auth", async (req, res) => {

  res.redirect(`https://api.ai-firefly.ru/yandex/v1.0/check-auth?${new URLSearchParams(req.query).toString()}`);

});

router.use("/check-auth", async (req, res) => {

  try {
    //const { email, password, redirect_url, state, response_type, client_id } = req.body;
    const { redirect_url, state, response_type } = req.query;
    const email = "max.s.kozyrevkms@gmail.com";
    const password = "MaksimScience111!!!";

    let loginResponse = await login(email, password);

    if (!loginResponse.status) {
      res.status(loginResponse.code).json(loginResponse);
      return;
    }

    let response = await createTemporaryToken({user_id: loginResponse.data.user_id});

    if (!response.status) {
      res.status(response.code).json(response);
      return;
    }

    res.redirect(`${redirect_url}?state=${state}&${response_type}=${response.data.token_id}`);    
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "Ошибка на сервере, попробуйте снова.",
    });
  }

});

router.post("/token", async (req, res) => {

  try {
    const grant_type = req.body.grant_type;
    let response;

    switch (grant_type) {
      case "authorization_code":
        const code = req.body.code;

        const getTokenResponse = await getTemporaryToken(code);

        if (!getTokenResponse.status) {
          res.status(getTokenResponse.code).json(getTokenResponse)
          return;
        }

        response = await createYandexToken(getTokenResponse.data.data.user_id);

        if (!response.status) {
          res.status(response.code).json(response);
          return;
        }

        res.json({
          token_type: "Bearer",
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: 31536000,
        });
        return;
      case "refresh_token":
        const refresh_token = req.body.refresh_token;

        const response = await refreshYandexToken(refresh_token);

        if (!response.status) {
          res.status(response.code).json(response);
          return;
        }

        res.json({
          token_type: "Bearer",
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: 31536000,
        });
        return;
      default:
        res.status(400).json({
          status: false,
          data: "empty_grant_type"
        });
    } 
  } catch (error) {
    res.status(500).json({
      status: false,
      data: "server_error"
    });
  }

});



export default router;