
export const formatUser = (user) => ({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profilePhoto: user.profilePhoto,
    bio: user.bio,
    gender: user.gender,
    followers: user.followers,
    following: user.following,
    savedPosts: user.savedPosts
})