import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL

function CookiePage() {

    // navigate const로 변수 선언 안하면 인식 못함
    const navigate = useNavigate();
        
    useEffect (() => {
        const cookieToBody = async () => {
            try {

                const res = await fetch(`${BACKEND_API_BASE_URL}/jwt/exchange`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    credentials: "include" 
                });

                if (!res.ok) throw new Error("인증 실패");

                const data = await res.json();
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);

                navigate("/");

            } catch (err) { // 실패한 경우 다시 로그인 페이지로 리다이렉트.
                alert("소셜 로그인 실패")
                navigate("/login")
            }
        };
        cookieToBody();    


    }, [navigate]);

    return (
        <p>login 처리 중..</p>
    );
}

export default CookiePage;