import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

/**
 * Verifica se o token de admin é válido
 */
export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.role === 'admin';
  } catch (error) {
    return false;
  }
}

/**
 * Gera um token de admin
 */
export function generateAdminToken(password) {
  if (password !== ADMIN_PASSWORD) {
    throw new Error('Senha inválida');
  }

  return jwt.sign(
    { role: 'admin', timestamp: Date.now() },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Middleware para proteger rotas de admin
 */
export function withAdminAuth(handler) {
  return async (request, context) => {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { error: 'Não autorizado - Token não fornecido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    if (!verifyAdminToken(token)) {
      return Response.json(
        { error: 'Não autorizado - Token inválido' },
        { status: 401 }
      );
    }

    return handler(request, context);
  };
}

