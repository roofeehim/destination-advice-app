"use client"
import { useState } from 'react';

export default function Page() {
  const [hint, setHint] = useState('');       // ユーザーの入力を管理する状態
  const [response, setResponse] = useState(''); // APIからのレスポンスを管理する状態
  const [isLoading, setIsLoading] = useState(false); // ローディング状態を管理する状態

  const askDestination = async () => {
    setIsLoading(true); // APIリクエスト前にローディング状態をtrueに設定
    try {
      const res = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hint }),
      });
      const data = await res.json();
      setResponse(data.message);
    } catch (error) {
      setResponse('エラーが発生しました。'); // エラーが発生した場合の処理
    }
    setIsLoading(false); // APIリクエストが終了したらローディング状態をfalseに設定
  };

  return (
    <>
    <div className='container'>
      <p>
        <img src="/uncle.webp" alt="おじさんの画像" />
      </p>
      <input
        type="text"
        value={hint}
        onChange={(e) => setHint(e.target.value)}
        placeholder="どんな場所に行きたいんだ？"
        style={{ margin: '20px auto', padding: '10px', maxWidth: '500px', width: '100%' }}
      />
      <button onClick={askDestination} disabled={isLoading} style={{ padding: '10px 20px' }}>
        {isLoading ? '聞いています...' : '聞いてみる'}
      </button>
      <p>{response}</p>
    </div>
    </>
  );
}
