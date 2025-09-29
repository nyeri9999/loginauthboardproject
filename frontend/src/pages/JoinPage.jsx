import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom' // import 과정에서 구문오류로 userNavigate라고 쓰고 아래서 객체 하나 써주는 부분도 잘못 써가지고 컴파일오류 나서 뭐가 문젠지 한참 찾았는데.. 별거 아닌거였다. 버그를 일으켜서 수정을 하는걸 감을 익혀야겠다.

// .env를 통해서 백엔드 url 불러오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL

// env파일에 localhost:8080을 지정한 이유는 뭘까?
// 내 추측으로는 oauth2 인증 시스템 구현때도 시크릿키를 따로 분리하고 그랬었는데 그거같은 느낌이지않을까. 보안적으로다가

//회원가입 페이지 구현
function JoinPage () {

    const navigate = useNavigate();
    
    //리액트가 데이터를 관리할 수 있는 환경을 구성해주기 위한 hook을 만들어주는데 이게 뭐지
    // 회원가입시 데이터를 관리하려고 useState 형태의 훅을 만들어줌.
    const [username, setUsername] = useState(""); // username => t실제로 데이터가 담겨있는 변수, setUsername은 이 데이터를 집어넣을 수 있는 메서드, 약간 setter같은거라고 생각하면 되나? 
    const [isUsernameValid, setIsUsernameValid] = useState(null);
    const [password, setPassword] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // username 입력창 변경 이벤트, useState의 username이 변경되면 이 이벤트가 실행된다.
    //useEffect는 뭐임?
    useEffect(() => {

        // username이 4자리 미만인 경우에는 검증절차 안거치도록 세팅. 어차피 실패할거라서
        const checkUsername = async() => {
            
            if (username.length < 4) {
                setIsUsernameValid(null);
                return;
            }

        try {
                const res = await fetch(`${BACKEND_API_BASE_URL}/user/exist`, {
                    method: "POST",
                    headers: { "Content-Type" : "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ username }),
            });

                const exists = await res.json();
                setIsUsernameValid(!exists);
            } catch {
                setIsUsernameValid(null);
            }
        };

        const delay = setTimeout(checkUsername, 300);
        return () => clearTimeout(delay);    

    }, [username]);

    // 데이터 받아서 바로 백엔드로 안보내고 프론트단에서 검증 한다음에 보내는듯.
    // async는 뭐고 이 로직은 어떤 로직이고 어떻게 작동하는가?
    const handleSignUp = async (e) => {
        e.preventDefault();
        setError("");

        if (
            username.length < 4 ||
            password.length < 4 ||
            nickname.trim() === "" ||
            email.trim() === ""
        ) {
            setError("입력값을 다시 확인해주세요(모든 항목 입력 필수. ID/PW는 4자 이상 입력");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_API_BASE_URL}/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password, nickname, email }),
            });
            // 회원가입 실패하면 실패처리 하고 성공하면 login으로 페이징한다.
            if (!res.ok) throw new Error("회원가입 실패");
            navigate("/login")

        } catch {
            setError("회원가입 중 오류가 발생했습니다.")
        }
    }

    // html 코드 작성
    return (
        <div>
            <h1>회원가입</h1>

            <form onSubmit={handleSignUp}>
                <label>아이디</label>
                <input
                    type = "text"
                    placeholder="아이디(4자 이상)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={4}
                />
                {username.length >= 4 && isUsernameValid === false && (
                    <p>이미 사용 중인 아이디입니다.</p>
                )}
                {username.length >= 4 && isUsernameValid === true && (
                    <p>사용 가능한 아이디입니다.</p>
                )}

                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="비밀번호(4자 이상)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={4}
                />
                
                <label>닉네임</label>
                <input
                    type="text"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                />
                
                <label>이메일</label>
                <input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button type="submit" disabled={isUsernameValid !== true}>회원가입</button>
            </form>
        </div>
    )
}

export default JoinPage;

//라우팅이 뭐지? 페이지만 만들어두면 프론트서버에 등록되지 않아서 라우팅을 등록한다고.