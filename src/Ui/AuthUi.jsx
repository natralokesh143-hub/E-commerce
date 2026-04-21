import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { loginApi } from '../Slices/AuthSlice'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi'
import './AuthUi.css'

const AuthUi = () => {
    const [username, setUsername] = useState("emilys")
    const [password, setPassword] = useState("emilyspass")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [errors, setErrors] = useState({})
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user, loading, error } = useSelector((state) => state.auth)

    const validateForm = () => {
        const newErrors = {}
        if (!username.trim()) {
            newErrors.username = "Username is required"
        }
        if (!password) {
            newErrors.password = "Password is required"
        }
        if (password && password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogin = (e) => {
        e.preventDefault()
        if (validateForm()) {
            dispatch(loginApi({ username, password }))
        }
    }

    useEffect(() => {
        if (user) {
            setTimeout(() => navigate("/products"), 500)
        }
    }, [user, navigate])

    return (
        <div className="auth-container">
            <div className="auth-background">
                <div className="gradient-circle gradient-1"></div>
                <div className="gradient-circle gradient-2"></div>
                <div className="gradient-circle gradient-3"></div>
            </div>

            <div className="auth-content">
                <div className="auth-header">
                    <div className="logo-badge">
                        <span className="logo-icon">⚡</span>
                    </div>
                    <h1 className="auth-heading">Welcome Back</h1>
                    <p className="auth-subtext">Sign in to your premium account</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin}>
                    {/* Username Field */}
                    <div className="form-group">
                        <label htmlFor="username" className="auth-label">
                            <FiMail className="label-icon" />
                            Username
                        </label>
                        <div className="input-wrapper">
                            <input 
                                id="username"
                                className={`auth-input ${errors.username ? 'input-error' : ''}`}
                                value={username} 
                                onChange={(e) => {
                                    setUsername(e.target.value)
                                    setErrors({...errors, username: ''})
                                }} 
                                type="text" 
                                placeholder="Enter your username"
                            />
                            {!errors.username && username && <FiCheckCircle className="input-icon success" />}
                        </div>
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label htmlFor="password" className="auth-label">
                            <FiLock className="label-icon" />
                            Password
                        </label>
                        <div className="input-wrapper">
                            <input 
                                id="password"
                                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrors({...errors, password: ''})
                                }} 
                                type={showPassword ? "text" : "password"} 
                                placeholder="Enter your password"
                            />
                            <button 
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </button>
                        </div>
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    {/* Remember Me */}
                    <div className="remember-me">
                        <input 
                            type="checkbox" 
                            id="remember"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="remember">Remember me</label>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="alert alert-error">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Demo Credentials */}
                    <div className="demo-info">
                        <p className="demo-label">Demo Credentials:</p>
                        <p className="demo-text">Username: <strong>emilys</strong></p>
                        <p className="demo-text">Password: <strong>emilyspass</strong></p>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="auth-button"
                        type="submit" 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="loading-spinner">Logging in...</span>
                        ) : (
                            <span>Sign In</span>
                        )}
                    </button>

                    {/* Footer */}
                    <div className="auth-footer">
                        <p>Don't have an account? <a href="#signup" className="signup-link">Sign up</a></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthUi


