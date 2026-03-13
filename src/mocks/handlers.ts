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
      { id: 1, title: '급여', category: '월급', amount: 4000000, type: 'income', date: '2026-03-01' },
      { id: 2, title: '스타벅스', category: '식비', amount: 12000, type: 'expense', date: '2026-03-03' },
      { id: 3, title: '택시', category: '교통', amount: 8000, type: 'expense', date: '2026-03-03' },
      { id: 4, title: '점심 식사', category: '식비', amount: 9500, type: 'expense', date: '2026-03-04' },
      { id: 5, title: '지하철', category: '교통', amount: 1400, type: 'expense', date: '2026-03-05' },
      { id: 6, title: '마트 장보기', category: '식비', amount: 43000, type: 'expense', date: '2026-03-06' },
      { id: 7, title: '넷플릭스', category: '문화', amount: 17000, type: 'expense', date: '2026-03-07' },
      { id: 8, title: '약국', category: '의료', amount: 12000, type: 'expense', date: '2026-03-08' },
      { id: 9, title: '옷 구매', category: '쇼핑', amount: 89000, type: 'expense', date: '2026-03-09' },
      { id: 10, title: '저녁 식사', category: '식비', amount: 35000, type: 'expense', date: '2026-03-10' },
      { id: 11, title: '버스', category: '교통', amount: 1400, type: 'expense', date: '2026-03-10' },
      { id: 12, title: '카페 방문', category: '식비', amount: 8500, type: 'expense', date: '2026-03-11' },
      { id: 13, title: '영화 관람', category: '문화', amount: 14000, type: 'expense', date: '2026-03-12' },
      { id: 14, title: '운동화', category: '쇼핑', amount: 120000, type: 'expense', date: '2026-03-12' },
      { id: 15, title: '병원 진료', category: '의료', amount: 15000, type: 'expense', date: '2026-03-13' },
    ])
  }),
]
