import jwt from 'jsonwebtoken';

function auth(
  req: { headers: { [x: string]: any }; accessTokenPayload: any },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { message: string }): any; new (): any };
    };
  },
  next: () => void
) {
  const accessToken = req.headers['x-access-token'];
  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, 'SECRET_KEY');
      // console.log(decoded);
      req.accessTokenPayload = decoded;
      next();
    } catch (err) {
      if (process.env.NODE_ENV === 'develop') console.log(err);

      return res.status(401).json({
        message: 'Invalid access token.',
      });
    }
  } else {
    return res.status(401).json({
      message: 'Access token not found.',
    });
  }
}

export default auth;
