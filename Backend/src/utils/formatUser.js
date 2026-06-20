
export const formatUser = (user) => ({
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profilePhoto: user.profilePhoto,
    posts: user.posts,
    bio: user.bio,
    gender: user.gender,
    followers: user.followers,
    following: user.following,
    bookmarks: user.bookmarks,

})