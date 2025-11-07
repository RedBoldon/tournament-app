// src/components/LoginForm.tsx
'use client'  // Only if using Next.js App Router

import { useState } from 'react'
import { supabaseClient } from '@/lib/supabase/client'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(`Error: ${error.message}`)
        } else {
            setMessage(`Logged in as ${data.user?.email}`)
            // Optional: redirect
            // window.location.href = '/dashboard'
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto p-6 bg-white rounded shadow">
    <h2 className="text-xl font-bold">Login to Tournament</h2>

    <input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full p-2 border rounded"
    />

    <input
        type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="w-full p-2 border rounded"
    />

    <button
        type="submit"
    disabled={loading}
    className="w-full p-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
        {loading ? 'Logging in...' : 'Login'}
        </button>

    {message && <p className="mt-2 text-sm text-center">{message}</p>}
        </form>
    )
    }