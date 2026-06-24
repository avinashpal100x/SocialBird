import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const FollowersFollowing = ({
    open,
    onClose,
    title,
    users = [],
}) => {
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 transition-all duration-200 text-gray-600 hover:text-black flex items-center justify-center"
                    >
                        ×
                    </button>
                </div>

                <div className="max-h-[500px] overflow-y-auto">
                    {users?.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
                            >
                                <Avatar className="h-14 w-14 ring-2 ring-orange-100">
                                    <AvatarImage src={user.profilePhoto} />
                                    <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
                                        {user.username?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        {user.username}
                                    </h3>

                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {user.bio || "No bio available"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-14">
                            <p className="text-gray-500 text-sm">
                                No users found
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersFollowing;