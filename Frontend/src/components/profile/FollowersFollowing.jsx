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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="bg-white w-full max-w-md rounded-xl shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">{title}</h2>

                    <button
                        onClick={onClose}
                        className="text-xl font-bold"
                    >
                        ×
                    </button>
                </div>

                <div className="max-h-[450px] overflow-y-auto">
                    {users?.length > 0 ? (
                        users.map((user) => (
                            <div
                                key={user._id}
                                className="flex items-center gap-3 p-4 border-b"
                            >
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.profilePhoto} />
                                    <AvatarFallback>
                                        {user.username?.charAt(0)?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h3 className="font-medium">
                                        {user.username}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {user.bio || "No bio"}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-8 text-gray-500">
                            No users found
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowersFollowing;