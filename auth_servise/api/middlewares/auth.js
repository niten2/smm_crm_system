import { verifyJwt } from 'api/services/jwt'
import { User } from 'api/models'

const JwtTokenCreateQuery = `
  mutation JwtTokenCreate($email: String!, $password: String!) {
    JwtTokenCreate(email: $email, password: $password) {
      token
      __typename
    }
  }
`

export default (params) => ([

  (req, res, next) => {
    let token;

    if (req.body) {
      const query = req.body.query.replace("\n", "").replace(/\s/g, '')
      const jwtTokenCreateString = JwtTokenCreateQuery.replace("\n", "").replace(/\s/g, '')
      if (query === jwtTokenCreateString) {
        return next()
      }
    }

    if (req.header('Authorization') || req.header('authorization')) {
      const parts = req.header('Authorization').split(' ');

      if (parts.length === 2) {
        const scheme = parts[0];
        const credentials = parts[1];

        if (/^Bearer$/.test(scheme) && credentials !== "null") {
          token = credentials;
        } else {
          return res.status(401).json({
            data: 'Format for Authorization: Bearer [token]',
            error: 'No Authorization was found',
          })
        }
      } else {
        return res.status(401).json({
          data: 'Format for Authorization: Bearer [token]',
          error: 'No Authorization was found',
        })
      }

    } else if (req.body.token) {
      token = req.body.token
      delete req.query.token

    } else {
      return res.status(401).json({
        data: 'No Authorization was found',
        error: 'No Authorization was found',
      })
    }

    return verifyJwt(token, async (err, payload) => {
      if (err) {
        return res.status(401).json({ data: err, error: err })
      }

      const user = await User.findById(payload.id)
      req.user = user
      return next()
    })
  }

])
