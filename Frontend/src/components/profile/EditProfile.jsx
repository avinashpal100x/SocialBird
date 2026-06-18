import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useSelector } from 'react-redux'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { setAuthUser } from '@/redux/authSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'



const EditProfile = () => {

  const { user } = useSelector(store => store.auth)
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePhoto,
    name: user?.name,
    username: user?.username,
    bio: user?.bio,
    gender: user?.gender
  })
  const [previewPhoto, setPreviewPhoto] = useState(user?.profilePhoto)
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const changeInputHandler = (e) => {
    setInput({
      ...input, [e.target.name]: e.target.value
    })
  }

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setInput({ ...input, profilePhoto: file })
      setPreviewPhoto(URL.createObjectURL(file))
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", input.name)
    formData.append("username", input.username)
    formData.append("bio", input.bio)
    formData.append("gender", input.gender)
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto)
    }
    try {
      setLoading(true)
      const res = await axios.post("http://localhost:5000/api/v1/user/profile/edit", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      })
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          name: res.data.user?.name,
          username: res.data.user?.username,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePhoto: res.data.user?.profilePhoto,
        }
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`)
        toast.success(res.data.message)
      }
    }
    catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong"
      )
    }
    finally {
      setLoading(false)
    }
  }

  return (

    <div className='min-h-screen bg-[#fff8f5] flex items-center justify-center px-4 py-8'>

      <div className='w-full max-w-xl rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_10px_30px_rgba(26,22,20,0.04)] p-8'>

        {/* Header */}
        <div className='text-center mb-8'>

          <div className='mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-3xl shadow-lg shadow-orange-200'>
            👤
          </div>

          <h1 className='mt-4 text-3xl font-extrabold text-[#1f1b19]'>
            Edit Profile
          </h1>

          <p className='mt-2 text-sm text-[#8b7d76]'>
            Update your photo, bio and personal information
          </p>

        </div>

        {/* Profile Card */}
        <div className='mb-6 flex items-center justify-between rounded-[24px] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5'>

          <div className='flex items-center gap-4'>
            <Avatar className='h-20 w-20 ring-4 ring-orange-100 shadow-lg shadow-orange-100'>
              <AvatarImage src={previewPhoto} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h2 className='font-bold text-lg text-[#1f1b19]'>
                {user?.username}
              </h2>

              <p className='text-sm text-[#8b7d76]'>
                {user?.bio}
              </p>
            </div>
          </div>

          <Input
            type="file"
            ref={imageRef}
            onChange={changeFileHandler}
            className="hidden"
          />

          <Button
            onClick={() => imageRef?.current?.click()}
            className='rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white cursor-pointer'
          >
            Change Photo
          </Button>
        </div>

        {/* Form */}
        <div className='space-y-5'>

          <div>
            <label className='mb-2 block text-sm font-semibold text-[#1f1b19]'>
              Full Name
            </label>

            <Input
              type='text'
              name='name'
              value={input.name}
              onChange={changeInputHandler}
              className='h-12 rounded-2xl border-orange-100 bg-white'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-[#1f1b19]'>
              Username
            </label>

            <Input
              type='text'
              name='username'
              value={input.username}
              onChange={changeInputHandler}
              className='h-12 rounded-2xl border-orange-100 bg-white'
            />
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-[#1f1b19]'>
              Gender
            </label>

            <select
              name='gender'
              value={input.gender}
              onChange={changeInputHandler}
              className='w-full h-12 rounded-2xl border border-orange-100 bg-white px-4 outline-none focus:border-orange-300'>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className='mb-2 block text-sm font-semibold text-[#1f1b19]'>
              Bio
            </label>

            <textarea
              name='bio'
              value={input.bio}
              onChange={changeInputHandler}
              rows={2}
              className='w-full rounded-2xl border border-orange-100 bg-white p-4 outline-none resize-none focus:border-orange-300'
            />
          </div>

          {
            loading ? (
              <Button
                className='mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white font-semibold shadow-lg shadow-orange-200 transition hover:scale-[1.01] cursor-pointer'>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Please wait...
              </Button>
            ) : (
              <Button
                onClick={submitHandler}
                className='mt-2 h-12 w-full rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white font-semibold shadow-lg shadow-orange-200 transition hover:scale-[1.01] cursor-pointer'>
                Save Changes
              </Button>
            )
          }

        </div>

      </div>

    </div>
  )
}

export default EditProfile