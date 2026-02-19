import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    full_name: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    email_verified?: boolean;
}

export interface SignupResponse {
    message: string;
    requires_verification: boolean;
    email: string;
}

export interface OTPResponse {
    success: boolean;
    message: string;
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            return response.data;
        } catch (error: any) {
            const detail = error.response?.data?.detail;
            // Special case for unverified email
            if (detail === 'email_not_verified') {
                throw new Error('email_not_verified');
            }
            throw new Error(detail || 'Login failed');
        }
    },

    signup: async (data: SignupData): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/signup`, data);
            return response.data;
        } catch (error: any) {
            // Check for network errors
            if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
                throw new Error('Connection error. Please check your internet connection.');
            }
            // Check for backend connection issues
            const detail = error.response?.data?.detail || '';
            if (detail.includes('getaddrinfo') || detail.includes('ENOTFOUND')) {
                throw new Error('Server connection error. Please try again later.');
            }
            throw new Error(detail || 'Signup failed. Please try again.');
        }
    },

    verifyOTP: async (email: string, otp: string): Promise<AuthResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Verification failed');
        }
    },

    resendOTP: async (email: string): Promise<OTPResponse> => {
        try {
            const response = await axios.post(`${API_URL}/auth/resend-otp`, { email });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.detail || 'Failed to resend code');
        }
    },

    logout: async (): Promise<void> => {
        localStorage.removeItem('token');
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await axios.post(`${API_URL}/auth/logout`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
        } catch {
            // Ignore logout errors
        }
    }
};
