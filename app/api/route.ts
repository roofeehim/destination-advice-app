import type { NextRequest } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;  // 環境変数からAPIキーを取得

async function fetchGPTResponse(prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-0125",
      messages: [{ role: "system", content: "おじさんが国内の行き先を横柄な命令口調で提案する。" },
                 { role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;  // GPT-4の返答を取得
}

export async function POST(request: NextRequest) {
  if (request.method === 'POST') {
    const body = await request.json();
    const hint = body.hint;
    const gptPrompt = `観光地やレストランについて提案してください。ヒント: ${hint}`;

    try {
      const gptResponse = await fetchGPTResponse(gptPrompt);
      return new Response(JSON.stringify({ message: gptResponse }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return new Response(JSON.stringify({ message: "サーバーエラーが発生しました。" }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } else {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'POST'
      }
    });
  }
}
