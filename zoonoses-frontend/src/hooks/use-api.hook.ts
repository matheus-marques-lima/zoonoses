import axios, {AxiosError} from 'axios';
import {getCookie} from 'cookies-next';
import useSWR, {KeyedMutator, SWRConfiguration} from 'swr';

type UseAPIResult<T> = {
    data: T | undefined;
    error?: AxiosError;
    isLoading: boolean;
    mutate: KeyedMutator<T>;
};

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
});

api.interceptors.request.use((config) => {
    const token = getCookie('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const fetcher = <T>(url: string): Promise<T> =>
    api.get(url).then(({data}) => data);

const useAPI = <T>(
    url: string | null,
    options?: SWRConfiguration
): UseAPIResult<T> => {
    const {data, error, isLoading, mutate} = useSWR<T>(url, fetcher, {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        ...options,
    });

    return {data, error, isLoading, mutate};
};

export default useAPI;
