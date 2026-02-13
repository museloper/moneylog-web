import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email: string
      password: string
    }

    if (email === 'sample@sample.com' && password === 'sample') {
      return HttpResponse.json({
        accessToken: 'mock_access_token',
        user: {
          id: 'sample_user_id',
          email,
        },
      })
    }

    return new HttpResponse(JSON.stringify({ message: '이메일 또는 비밀번호 오류' }), {
      status: 401,
    })
  }),
]
