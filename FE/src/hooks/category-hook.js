import { message } from "antd";
import { useCallback, useState } from "react";

export const useCate = () => {
    const categories = window.sessionStorage.getItem("category");
    const [cateExist, setCateExist] = useState(categories != null);

    const getCategories = useCallback(async () => {
        if(!cateExist) {
            try {
                const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/manage/code/list?code=CATE', {method: 'GET'});
    
                if(!response.ok) {
                    throw new Error("response error");
                } else {
                    const data = await response.json();
                    window.sessionStorage.setItem("category", JSON.stringify(data));
                    setCateExist(true);
                }
            } catch(error) {
                message.warning('오류가 발생했어요');
            }
        }
    }, [categories]);

    return { getCategories }
}