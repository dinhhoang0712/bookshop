import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPassword, resetPasswordOTPEmail, verifyOTP } from 'services/api';

const ResetPasswordPage = () => {
    const [step, setStep] = useState<'email' | 'otp' | 'newpass' | 'success'>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email && email.includes('@')) {
                const data = await resetPasswordOTPEmail(email);
                if (data.statusCode === 200) {
                    console.log('Valid email:', email);
                    setMessage(data.message);
                    setStep('otp');
                } else {
                    console.log('Valid email:', email);
                    setMessage(data.message);
                }
        }
        else {
            setMessage('Vui lòng nhập email hợp lệ.');
        }
    };

    const handleOtpSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        
            
        }
        if (otp.length === 6) {
            const res = await verifyOTP(email, otp);
            if (res.statusCode === 200) {
                setMessage("Xác thực thành công");
                setStep('newpass');
            } else {
                setMessage(res.message);
            }
        } else {
            setMessage('Vui lòng nhập đủ 6 ký tự OTP.');
        }
    };

    const handleNewPassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const handleResetPassword = async () => {
            const res = await resetPassword(email, password);
            if (res.statusCode === 200) {
                setMessage('Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...');
                setStep('success');
            }
        }
        if (password !== confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp.');
            return;
        }

        handleResetPassword();
    };

    return (
        <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
            <h1>Quên mật khẩu</h1>
            {step === 'email' && (
                <form onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Nhập email của bạn"
                        style={{ width: '100%', padding: 8, fontSize: 18, marginBottom: 16 }}
                    />
                    <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
                        Gửi mã xác thực
                    </button>
                </form>
            )}
            {step === 'otp' && (
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        maxLength={6}
                        placeholder="Nhập mã OTP"
                        style={{ width: '100%', padding: 8, fontSize: 18, marginBottom: 16, letterSpacing: 8, textAlign: 'center' }}
                    />
                    <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
                        Xác nhận OTP
                    </button>
                </form>
            )}
            {step === 'newpass' && (
                <form onSubmit={handleNewPassSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới"
                        style={{ width: '100%', padding: 8, fontSize: 18, marginBottom: 12 }}
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu mới"
                        style={{ width: '100%', padding: 8, fontSize: 18, marginBottom: 16 }}
                    />
                    <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4 }}>
                        Đổi mật khẩu
                    </button>
                </form>
            )}
            {step === 'success' && (
                <div style={{ color: '#388e3c', fontSize: 18, textAlign: 'center', marginTop: 24 }}>
                    Đổi mật khẩu thành công!<br />Đang chuyển về trang đăng nhập...
                </div>
            )}
            {message && step !== 'success' && <div style={{ marginTop: 16, color: '#d32f2f' }}>{message}</div>}
        </div>
    );
}

export default ResetPasswordPage;