import { message } from "antd";
import { useCallback, useEffect, useState } from "react"

let logoutTimer;
export const useAuth = () => {
    const localToken = localStorage.getItem("token");
    const localExpire = localStorage.getItem("expire");
    const localPlatform = localStorage.getItem("platform");

    const [token, setToken] = useState(localToken);
    const [expire, setExpire] = useState(localExpire ? new Date(localExpire) : null);
    const [platform, setPlatform] = useState(localPlatform);

    const login = useCallback((token, platform) => {
        const expireDate = new Date(new Date().getTime() + 1000 * 60 * 60 * 20);
        setToken(token);
        setExpire(expireDate);
        setPlatform(platform);
        localStorage.setItem("token", token);
        localStorage.setItem("expire", expireDate);
        localStorage.setItem("platform", platform);
        sessionStorage.setItem("beatbangul", "login");
        message.success('로그인되었어요');
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setExpire(null);
        setPlatform(null);
        localStorage.removeItem("token");
        localStorage.removeItem("expire");
        localStorage.removeItem("platform");
        sessionStorage.removeItem("beatbangul");
        message.success('로그아웃되었어요');
    }, []);

    useEffect(() => {
        if(token && expire) {
            const remain = expire.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logoutNoMessage, remain);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, logoutNoMessage, expire]);

    return { token, platform, login, logout, logoutNoMessage, confirmLogin };
}