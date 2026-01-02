export const asyncAPI = (funct) => {
  Promise.resolve(funct(req, res, next)).catch(next);
};

export const bearerAuth = (req, res, next) => {

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      status: false,
      code: 401,
      data: "empty_bearer_token"
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: false,
      code: 401,
      data: "empty_bearer_token"
    });
  }

  req.bearer_token = token;

  next();

};