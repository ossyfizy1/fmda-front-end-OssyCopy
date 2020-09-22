import { Res_utils } from '../utils';

export default class Middlewares {
  static checkAdminLogin(req, res, next) {
    if (req.path === '/login') return next();
    if (req.session.capabilityIds) return next();
    return Res_utils.resRedirect(res, '/admin/login');
  }
}
