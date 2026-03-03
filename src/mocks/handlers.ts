import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('/api/login', async ({ request }) => {
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

  http.get('/api/dashboard/balance', () => {
    return HttpResponse.json({
      income: 4_000_000,
      expense: 3_500_000,
    })
  }),

  http.get('/api/dashboard/transactions', () => {
    return HttpResponse.json([
      {
        id: 1,
        title: '스타벅스',
        category: '식비',
        amount: 12000,
        type: 'expense',
        date: '2026-03-03',
      },
      {
        id: 2,
        title: '택시',
        category: '교통',
        amount: 8000,
        type: 'expense',
        date: '2026-03-02',
      },
      {
        id: 3,
        title: '급여',
        category: '월급',
        amount: 4000000,
        type: 'income',
        date: '2026-03-01',
      },
    ])
  }),
]
