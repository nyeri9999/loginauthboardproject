export async function refreshAccessToken() {

    const refreshToken = localStorage.getItem("refreshToken");
    // token이 존재하지 않으면 exception 발생
    if (!refreshToken) throw new Error("RefreshToken이 없습니다.");

    const response = await fetch(`${import.meta.env.VITE_BACKEND_API_BASE_URL}/jwt/refresh`, {
        method: 'POST',
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("AccessToken 갱신 실패");

    const data = await response.json();
    localStorage.setItem("accessoToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return data.accessToken;    
}

export async function fetchWithAccess(url, options = {}) {

    let accessToken = localStorage.getItem("accessToken");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = `Bearer ${accessToken}`;

    let response = await fetch(url, options);

    if (response.status === 401) {
        try {
            accessToken = await refreshAccessToken();
            options.headers['Authorization'] = `Bearer ${accessToken}`;

            response = await fetch(url, options);
        } catch (err) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            location.href = '/login';
        }

    }

    if (!response.ok) {
        throw new Error(`HTTP 오류 : ${response.status}`);
    }

    return response;
    
}
