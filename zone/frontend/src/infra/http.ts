import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:3000"
})
// add token    
http.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

export default http;