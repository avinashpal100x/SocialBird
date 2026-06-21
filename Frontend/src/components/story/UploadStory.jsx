import React, { useRef, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogDescription
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { ImageIcon } from 'lucide-react'
import { getFileUrl } from '@/lib/utils.js'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setStories } from '@/redux/storySlice.js'
import { toast } from 'sonner'



const UploadStory = ({ open, setOpen }) => {

    const fileInputRef = useRef(null)

    const [media, setMedia] = useState(null)
    const [mediaPreview, setMediaPreview] = useState(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const { stories } = useSelector(store => store.story)

    const fileHandler = async (e) => {
        const selectedFile = e.target.files?.[0]

        if (selectedFile) {
            const fileUrl = await getFileUrl(selectedFile)
            setMedia(selectedFile)
            setMediaPreview(fileUrl)
        }
    }

    const submitHandler = async () => {
        const formData = new FormData()

        if (media) {
            formData.append("media", media)
        }

        try {
            setLoading(true)

            const res = await axios.post(
                "https://socialbird-hi0p.onrender.com/api/v1/story/addstory",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            )

            if (res.data.success) {
                dispatch(setStories([res.data.story, ...stories]))
                toast.success(res.data.message)
                setOpen(false)
                setMedia(null)
                setMediaPreview(null)
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            )
        } finally {
            setLoading(false)
        }
    }


    return (
        <div>
            <Dialog open={open}>
                <DialogContent
                    aria-describedby={undefined}
                    onInteractOutside={() => setOpen(false)}
                    className="max-w-5xl p-0 overflow-hidden rounded-[36px] border border-white/20 bg-[#fff8f5]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(26,22,20,0.08)]"
                >

                    <DialogHeader className="hidden">
                        <DialogTitle>Upload Story</DialogTitle>
                        <DialogDescription>
                            Share your thoughts with everyone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="p-10 md:p-12 flex flex-col justify-center">

                        <h2 className="text-4xl text-center font-extrabold text-[#ab3500] mb-3">
                            Upload Story
                        </h2>

                        <p className="text-gray-500 text-center mb-8 text-lg">
                            Choose an image or video to share with your audience.
                        </p>

                        {
                            mediaPreview ? (
                                <div className="rounded-[28px] border border-orange-100 bg-white shadow-[0_10px_30px_rgba(26,22,20,0.04)] p-4 overflow-hidden">

                                    <div className="flex justify-center">

                                        {
                                            media?.type?.startsWith("video") ? (
                                                <video
                                                    src={mediaPreview}
                                                    controls
                                                    className="w-72 h-72 rounded-3xl object-cover"
                                                />
                                            ) : (
                                                <img
                                                    src={mediaPreview}
                                                    alt="story"
                                                    className="w-72 h-72 rounded-3xl object-cover"
                                                />
                                            )
                                        }

                                    </div>

                                </div>
                            ) : (
                                <div className="rounded-[32px] border border-orange-100 bg-white shadow-[0_10px_30px_rgba(26,22,20,0.04)] p-12">

                                    <div className="flex flex-col items-center">

                                        <div className="w-36 h-36 rounded-full bg-orange-100 flex items-center justify-center mb-8">
                                            <ImageIcon
                                                size={80}
                                                className="text-[#ff6b35]"
                                            />
                                        </div>

                                        <Input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*,video/*"
                                            onChange={fileHandler}
                                            className="hidden"
                                        />

                                        <Button
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white font-semibold text-base shadow-lg shadow-orange-200 hover:scale-[1.02] transition-all cursor-pointer"
                                        >
                                            <ImageIcon size={20} />
                                            Select Image / Video
                                        </Button>

                                    </div>

                                </div>
                            )
                        }

                        <Button
                            onClick={submitHandler}
                            disabled={!media || loading}
                            className="mt-8 h-16 rounded-3xl bg-gradient-to-r from-[#FF6B35] to-[#FFA94D] text-white font-bold text-lg shadow-xl shadow-orange-200 hover:scale-[1.02] transition-all cursor-pointer"
                        >
                            {
                                loading
                                    ? "Uploading..."
                                    : "Upload Story"
                            }
                        </Button>

                    </div>

                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UploadStory