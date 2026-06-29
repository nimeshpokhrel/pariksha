import { Forum } from "../models/forum.model.js";

export const getAllForums = async (req, res) => {
  try {
    const forums = await Forum.find()
      .populate("createdBy")
      .populate("discussions.createdBy")
      .lean();

    res.status(200).json({
      message: "Forums fetched successfully",
      forums: forums,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getForumById = async (req, res) => {
  try {
    const forum = await Forum.findById(req.params.id)
      .populate("createdBy")
      .populate("discussions.createdBy")
      .lean();

    if (!forum) {
      return res.status(404).json({
        message: "Forum not found",
      });
    }

    res.status(200).json({
      message: "Forum fetched successfully",
      forum: forum,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const createForum = async (req, res) => {
  try {
    const { title, description } = req.body;
    const createdBy = req.user._id;

    const newForum = new Forum({
      title,
      description,
      createdBy,
    });

    await newForum.save();

    res.status(201).json({
      message: "Forum created successfully",
      forum: newForum,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addDiscussion = async (req, res) => {
  try {
    const { forumId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const forum = await Forum.findById(forumId);
    if (!forum) {
      return res.status(404).json({ message: "Forum not found" });
    }

    const newComment = {
      content,
      createdBy: req.user._id,
      replies: [],
    };

    forum.discussions.push(newComment);
    await forum.save();

    res.status(201).json({ message: "Comment added successfully", forum });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const addReply = async (req, res) => {
    try {
      const { forumId, commentId } = req.params;
      const { content } = req.body;
  
      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }
  
      const forum = await Forum.findById(forumId);
      if (!forum) {
        return res.status(404).json({ message: "Forum not found" });
      }
  
      const addReplyRecursive = (comments, commentId, reply) => {
        for (let comment of comments) {
          if (comment._id.toString() === commentId) {
            comment.replies.push(reply);
            return true;
          }
          if (comment.replies && comment.replies.length > 0) {
            const found = addReplyRecursive(comment.replies, commentId, reply);
            if (found) return true;
          }
        }
        return false;
      };
  
      const newReply = {
        content,
        createdBy: req.user._id,
        replies: [],
      };
  
      const added = addReplyRecursive(forum.discussions, commentId, newReply);
  
      if (!added) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      forum.markModified("discussions");
      await forum.save();
  
      res.status(201).json({ message: "Reply added successfully", forum });
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  