import { useState } from "react";

// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL

function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();
        setError(""); // 에러 문구를 초기화 시켜놓음
        
        // 검증 로직으로 회원 아이디와 비밀번호 둘중 하나라도 공백인 경우에 setError에 해당 메시지를 반환해서 에러 처리.
        if (username === "" || password === "") {
            setError("아이디와 비밀번호를 입력하세요.")
            return;
        }

        // API 요청
        try {  
            const res = await fetch(`${BACKEND_API_BASE_URL}/login`, {
                method: "POST",
                headers: {"Content-Type":"application/json",},
                credentials: "include",
                body: JSON.stringify({username, password}),
            });

            if (!res.ok) throw new Error("로그인 실패");
            
            const data = await res.json();
            // localstorage란?
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

        } catch (err) {
            setError("아이디 또는 비밀번호가 틀렸습니다.");
        }     

    };

    return (
        <div>
            <h1>로그인</h1>

            <form onSubmit={handleLogin}>
            <label>아이디</label>
            <input
                type="text"
                placeholder="아이디"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <label>비밀번호</label>
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            {error && <p>{error}</p>}

            <button type="submit">계속</button>
            </form>
        </div>
        
    );
}

export default LoginPage;