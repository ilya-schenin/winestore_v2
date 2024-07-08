import { LoginForm } from "@/components/Auth/Login";
import { RegisterForm } from "@/components/Auth/Register";
import axios, {AxiosError, AxiosResponse} from "axios";
import { ResponseStatus, TokenInfo, User } from "./interfaces";
import Cookies from 'js-cookie';

const setJWTcookie = ({access_token, refresh_token, token_type}: TokenInfo): void => {
    const date = new Date();
    date.setTime(date.getTime() + (10 * 24 * 60 * 60 * 1000));
    const expires = date.toUTCString();
    document.cookie = `access_token=${token_type} ${access_token}; expires=${expires}; path=/`;
    document.cookie = `refresh_token=${token_type} ${refresh_token}; expires=${expires}; path=/`;
};

interface ErrorResponse {
    detail: string;
}

export async function loginUser(
    formData: LoginForm, 
    setState: React.Dispatch<React.SetStateAction<null | ResponseStatus>>): Promise<void> {

    await axios.post('http://localhost:8001/jwt/login/', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    .then((r: AxiosResponse<TokenInfo>) => {
        const response: ResponseStatus = {
            statusCode: 200,
             message: 'Вы успешно авторизовались'
        };
        setState(response);

        const tokenInfo: TokenInfo = {
            access_token: r.data.access_token,
            refresh_token: r.data.refresh_token,
            token_type: r.data.token_type
        };
        setJWTcookie(tokenInfo);        
    })
    .catch(        
        (e: AxiosError<ErrorResponse>) => {
        const response: ResponseStatus = {
            statusCode: e.status || 400,
            message: e.response?.data.detail || 'Возникла ошибка при авторизации'
        };
        setState(response);
    });
}


export async function registerUser(
    formData: RegisterForm,
    setState: React.Dispatch<React.SetStateAction<ResponseStatus | null>>): Promise<void> {
    
    await axios.post('http://localhost:8001/jwt/register/', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(
        () => {
            const response: ResponseStatus = {
                statusCode: 200,
                 message: 'Вы успешно зарегестрировались'
            };
            setState(response);
        }
    ).catch(
        (e: AxiosError<ErrorResponse>) => {
            const response: ResponseStatus = {
                statusCode: e.status || 400,
                message: e.response?.data.detail || 'Возникла ошибка при регистрации'
            };
            setState(response);
        });
}


const fetchUser = async (): Promise<AxiosResponse> => {
    const access_token = Cookies.get('access_token');
    return await axios.get('http://localhost:8001/jwt/current_user/', {
            withCredentials: true,
            headers: {
                'Authorization': access_token
            }
        });
};

export const refreshToken = async (): Promise<AxiosResponse> => {
    const refresh_token = Cookies.get('refresh_token');
    return axios.post('http://localhost:8001/jwt/refresh/', {}, {
        withCredentials: true,
        headers: {
            'Authorization': refresh_token,
        } 
    });
};

let isRefreshing = false;

export const getCurrentUser = async (setState: React.Dispatch<React.SetStateAction<User | null>>) => {
    await fetchUser()
        .then((r: AxiosResponse<User>) => {
            setState(r.data);
        })
        .catch(async () => {
            if (!isRefreshing) {
                isRefreshing = true;
                await refreshToken()
                    .then(async (r: AxiosResponse<TokenInfo>) => {
                        const tokenInfo: TokenInfo = {
                            access_token: r.data.access_token,
                            refresh_token: r.data.refresh_token,
                            token_type: r.data.token_type
                        };

                        setJWTcookie(tokenInfo);
                        await fetchUser()
                            .then((r: AxiosResponse<User>) => setState(r.data))
                            .catch((e: AxiosError<ErrorResponse>) => console.log(e.response?.data.detail));
                    })
                    .catch((e: AxiosError<ErrorResponse>) => {
                        console.log(e.response?.data.detail);
                        Cookies.remove('access_token');
                        Cookies.remove('refresh_token');
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            }
        });
};



export const logoutUser = () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    window.location.reload();
};