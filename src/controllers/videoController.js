import Video from "../models/Video";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
    // console.log(req.session);
    const videos = await Video.find({})
        .sort({ createdAt: "desc" })
        .populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id).populate("owner").populate("comments");
    console.log(video);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    return res.render("watch", { pageTitle: video.title, video, userId: _id });
};

export const getEdit = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        console.log("페이지접근에 대하 권한 가지고있는 유저가 아닙니다.");
        return res.status(403).redirect("/");
    }
    return res.render("edit", { pageTitle: `Edit: ${video.title}`, video});
};

export const postEdit = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const isExists = await Video.exists({ _id: id });
    if (!isExists) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }

    const video = await Video.findById({_id: id});

    if (String(video.owner) !== String(_id)) {
        console.log(`video.owner:${video.owner} , _id:${_id}`);

        console.log("비디오 정보 변경에 대한 권한 가지고있는 유저가 아닙니다.");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });
    console.log("정보가 변경되었습니다.");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
    const {
        user: { _id },
    } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production";
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbUrl: isHeroku ? thumb[0].location : video[0].path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    } catch (error) {
        console.log(error);
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
};

export const deleteVideo = async (req, res) => {
    const { id } = req.params;
    const {
        user: { _id },
    } = req.session;
    const video = await Video.findById(id);
    if (!video) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const {
        session: { user },
        body: { text },
        params: { id },
    } = req;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        username: user.username,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ newCommentId: comment._id, username: user.username });
};

export const deleteComment = async (req, res) => {
    const {params: {id}} = req;

    console.log(id);

    const comment = await Comment.findByIdAndDelete(id);
    console.log(comment._id);

    const video = await Video.findById(comment.video);
    console.log(video.comments);

    video.comments.remove(comment._id);
    video.save();

    return res.status(201);
}