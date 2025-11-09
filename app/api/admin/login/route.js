import { generateAdminToken } from '@/lib/auth/adminAuth';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return Response.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      );
    }

    const token = generateAdminToken(password);

    return Response.json({
      success: true,
      token,
      expiresIn: '24h'
    });
  } catch (error) {
    if (error.message === 'Senha inválida') {
      return Response.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      );
    }

    console.error('Erro no login de admin:', error);
    return Response.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    );
  }
}

