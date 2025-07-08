import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type AuthFormProps = {
  mode: 'login' | 'signup',
  onAuthSuccess?: () => void
}

export default function AuthForm({ mode, onAuthSuccess }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [showConfirmMsg, setShowConfirmMsg] = useState(false)

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { displayName }
      }
    })
    if (error) setError(error.message)
    else setShowConfirmMsg(true)
  }

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else if (onAuthSuccess) onAuthSuccess()
  }

  return (
    showConfirmMsg && mode === 'signup' ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div className="text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 text-center">
          Please check your email to confirm your account before signing in.
        </div>
        <button
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setShowConfirmMsg(false);
            if (onAuthSuccess) onAuthSuccess();
          }}
        >
          OK
        </button>
      </div>
    ) : (
      <form
        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
        onSubmit={e => {
          e.preventDefault();
          if (mode === 'signup') {
            handleSignUp();
          } else {
            handleSignIn();
          }
        }}
      >
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          className="border border-gray-300 rounded px-3 py-2"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="border border-gray-300 rounded px-3 py-2"
        />
        {mode === 'signup' && (
          <input
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="border border-gray-300 rounded px-3 py-2"
            maxLength={24}
          />
        )}
        {mode === 'signup' ? (
          <button type="submit">Sign Up</button>
        ) : (
          <button type="submit">Sign In</button>
        )}
        {error && <div>{error}</div>}
      </form>
    )
  )
}
