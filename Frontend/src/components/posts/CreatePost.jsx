import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'
import { getFileUrl } from '@/lib/utils.js'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useSelector, useDispatch } from 'react-redux'
import { setPosts } from '@/redux/postSlice.js'

const CreatePost = ({ open, setOpen }) => {

    const imageRef = useRef();

    const [file, setFile] = useState("");
    const [caption, setCaption] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(false);

    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)

    const dispatch = useDispatch();

    const fileHandler = async (e) => {
        const selectedFile = e.target.files?.[0];

        if (selectedFile) {
            const fileUrl = await getFileUrl(selectedFile);
            setFile(selectedFile);
            setImagePreview(fileUrl);
        }
    }

    const submitHandler = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("caption", caption);

            if (file) { formData.append("image", file); }
            const res = await axios.post(
                "https://socialbird-hi0p.onrender.com/api/v1/post/addpost",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                }
            );

            if (res.data.success) {

                dispatch(setPosts([res.data.post, ...posts]))
                toast.success(res.data.message);
                setOpen(false);
                setCaption("");
                setFile("");
                setImagePreview("");
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            )

        } finally {
            setLoading(false);
        }
    }

    return (
        <div>

            <Dialog open={open}>

                <DialogContent
                    aria-describedby={undefined}
                    onInteractOutside={() => setOpen(false)}
                    className='w-[80vw] max-w-6xl overflow-hidden rounded-[34px] border border-white/40 bg-white/70 p-0 shadow-[0_20px_80px_rgba(255,107,53,0.12)] backdrop-blur-3xl'
                >

                    <div className='relative bg-gradient-to-br from-[#fff7f3] via-[#fffdfc] to-[#fff4eb] p-7'>

                        {/* Glow Effects */}
                        <div className='absolute -top-20 -right-20 h-52 w-52 rounded-full bg-orange-200/30 blur-3xl'></div>

                        <div className='absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-amber-200/20 blur-3xl'></div>

                        {/* Main Layout */}
                        <div className='relative z-10 flex items-start gap-6'>

                            {/* Left Side Image */}
                            {
                                imagePreview && (
                                    <div className='w-[320px] flex-shrink-0'>

                                        <div className='overflow-hidden rounded-[26px] border border-orange-100 bg-white/70 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.06)]'>

                                            <div className='aspect-square w-full overflow-hidden rounded-[20px] bg-white'>

                                                <img
                                                    src={imagePreview}
                                                    alt="preview_image"
                                                    className='h-full w-full object-cover'
                                                />

                                            </div>

                                        </div>

                                    </div>
                                )
                            }

                            {/* Right Side */}
                            <div className='min-w-0 flex-1'>

                                {/* Header */}
                                <div className='mb-5 flex items-center gap-3'>

                                    <Avatar className='h-12 w-12 ring-4 ring-orange-100 shadow-lg shadow-orange-100'>
                                        <AvatarImage src={user?.profilePhoto} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>

                                    <div className='min-w-0'>
                                        <h1 className='truncate text-[17px] font-bold tracking-tight text-[#1b1b1b]'>
                                            {user?.username}
                                        </h1>

                                        <span className='block truncate text-sm font-medium text-[#8b7d76]'>
                                            {user?.bio}
                                        </span>
                                    </div>

                                </div>

                                {/* Caption */}
                                <div className='mb-5'>

                                    <Textarea
                                        value={caption}
                                        onChange={(e) => setCaption(e.target.value)}
                                        placeholder="Write your caption here...."
                                        className='h-[180px] w-full resize-none rounded-[24px] border border-orange-100/80 bg-white/85 px-5 py-4 text-[15px] leading-7 text-[#2b2b2b] placeholder:text-[#a79b95] shadow-[0_8px_30px_rgba(255,107,53,0.06)] transition-all duration-300 focus-visible:border-orange-300 focus-visible:ring-4 focus-visible:ring-orange-200/50'
                                    />

                                </div>

                                {/* Hidden File Input */}
                                <Input
                                    type="file"
                                    ref={imageRef}
                                    className='hidden'
                                    onChange={fileHandler}
                                />

                                {/* Buttons */}
                                <div className='mt-5 flex items-center justify-center gap-4'>

                                    {
                                        !imagePreview && (
                                            <Button
                                                onClick={() => imageRef.current.click()}
                                                className='cursor-pointer h-11 rounded-2xl border border-orange-200 bg-white/90 px-7 font-semibold text-[#ff6b35] shadow-[0_4px_18px_rgba(255,107,53,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:border-orange-300 hover:bg-orange-50 hover:shadow-[0_8px_24px_rgba(255,107,53,0.15)] active:scale-[0.98]'
                                            >
                                                Upload Image
                                            </Button>
                                        )
                                    }

                                    {
                                        imagePreview && (
                                            loading ? (

                                                <Button
                                                    disabled
                                                    className='h-11 min-w-[160px] rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#ff8a47] to-[#FFA94D] px-7 font-semibold text-white shadow-[0_10px_30px_rgba(255,107,53,0.35)]'
                                                >
                                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                                    Posting...
                                                </Button>

                                            ) : (

                                                <Button
                                                    onClick={submitHandler}
                                                    className='cursor-pointer h-11 min-w-[160px] rounded-2xl bg-gradient-to-r from-[#FF6B35] via-[#ff8a47] to-[#FFA94D] px-7 font-semibold text-white shadow-[0_10px_30px_rgba(255,107,53,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]'
                                                >
                                                    Create Post
                                                </Button>

                                            )
                                        )
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </DialogContent>

            </Dialog>

        </div>
    )
}

export default CreatePost