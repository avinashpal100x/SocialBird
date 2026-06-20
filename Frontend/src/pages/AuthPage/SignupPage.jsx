import React, { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


const Signup = () => {

  const [input, setInput] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  })

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(store => store.auth)

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/v1/auth/register", input, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      })
      if (res.data.success) {
        navigate("/login")
        toast.success(res.data.message)
        setInput({
          name: "",
          username: "",
          email: "",
          password: ""
        })
      }
    }
    catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) navigate("/")
  })

  return (
    <div className='min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 sm:px-6 py-6 overflow-hidden relative'>

      {/* Background Blur */}
      <div className='absolute -top-25 -left-25 w-55 sm:w-[320px] h-55 sm:h-80 rounded-full bg-orange-300/30 blur-[100px]'></div>

      <div className='absolute -bottom-30 -right-25 w-62.5 sm:w-87.5 h-62.5 sm:h-87.5 rounded-full bg-orange-400/20 blur-[100px]'></div>

      <form onSubmit={submitHandler}
        className='relative z-10 w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/20 shadow-[0_10px_30px_rgba(26,22,20,0.04)] rounded-3xl sm:rounded-4xl p-6 sm:p-8 md:p-10 space-y-5 sm:space-y-6'>

        {/* Heading */}
        <div className='space-y-2 text-center'>
          <h1 className='text-4xl sm:text-5xl font-extrabold text-[#ff6b35] tracking-tight'>
            Signup
          </h1>

          <p className='text-gray-500 text-sm sm:text-[15px]'>
            Signup to make new friends.
          </p>
        </div>

        {/* Name */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-[#1f1b19]'>
            Name
          </Label>

          <Input
            type="text"
            placeholder='Enter your name'
            name="name"
            value={input.name}
            onChange={changeEventHandler}
            className='h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-orange-100 bg-white px-4 text-sm sm:text-[15px] focus-visible:ring-4 focus-visible:ring-orange-100 focus-visible:border-[#FF6B35] transition-all duration-300'
          />
        </div>

        {/* Username */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-[#1f1b19]'>
            Username
          </Label>

          <Input
            type="text"
            placeholder='Choose username'
            name="username"
            value={input.username}
            onChange={changeEventHandler}
            className='h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-orange-100 bg-white px-4 text-sm sm:text-[15px] focus-visible:ring-4 focus-visible:ring-orange-100 focus-visible:border-[#FF6B35] transition-all duration-300'
          />
        </div>

        {/* Email */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-[#1f1b19]'>
            Email
          </Label>

          <Input
            type="email"
            placeholder='Enter your email'
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className='h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-orange-100 bg-white px-4 text-sm sm:text-[15px] focus-visible:ring-4 focus-visible:ring-orange-100 focus-visible:border-[#FF6B35] transition-all duration-300'
          />
        </div>

        {/* Password */}
        <div className='space-y-2'>
          <Label className='text-sm font-semibold text-[#1f1b19]'>
            Password
          </Label>

          <Input
            type="password"
            placeholder='Create password'
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className='h-12 sm:h-14 rounded-xl sm:rounded-2xl border border-orange-100 bg-white px-4 text-sm sm:text-[15px] focus-visible:ring-4 focus-visible:ring-orange-100 focus-visible:border-[#FF6B35] transition-all duration-300'
          />
        </div>

        {/* Button */}
        <Button
          disabled={loading}
          className='w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-r from-[#FF6B35] to-[#FFA94D] text-white font-semibold text-base sm:text-lg shadow-lg shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer'>
          {
            loading ? (
              <div className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin' />
                <span>Please wait...</span>
              </div>
            ) : (
              "Submit"
            )
          }
        </Button>

        {/* Login */}
        <p className='text-center text-sm text-gray-500 pt-1 sm:pt-2'>
          Already have an account?{' '}

          <span className='text-[#ab3500] font-semibold cursor-pointer hover:underline'>
            <Link to={"/login"}>Login</Link>
          </span>
        </p>

      </form>

    </div>
  )
}

export default Signup
