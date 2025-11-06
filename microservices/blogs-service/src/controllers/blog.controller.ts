import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { uploadBuffer, deleteByPublicId } from "../utils/cloudinary";

/**
 Create blog
 expects req.user.email from auth middleware
 optional req.file (multer memory)
 */
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const authorEmail = req.user?.email!;
    let heroUrl: string | undefined = undefined;
    let heroPublicId: string | undefined = undefined;

    if (req.file && req.file.buffer) {
      const r = await uploadBuffer(req.file.buffer, "blogs");
      heroUrl = r.secure_url;
      heroPublicId = r.public_id;
    }

    const blog = await prisma.blog.create({
      data: {
        userid:authorEmail,
        title,
        content,
        heroUrl,
        heroPublicId
      }
    });

    res.status(201).json(blog);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Slug already exists" });
    }
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

export const getBlog = async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: Number(req.params.id) } });
    if (!blog) return res.status(404).json({ message: "Not found" });
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedid = Number(id);
    const existing = await prisma.blog.findUnique({ where: { id:parsedid } });
    if (!existing) return res.status(404).json({ message: "Not found" });

    // Optional: enforce ownership (only author can edit)
    if (existing.userid !== req.user?.email) {
      return res.status(403).json({ message: "Forbidden: not the blog author" });
    }

    let heroUrl = existing.heroUrl;
    let heroPublicId = existing.heroPublicId;

    if (req.file && req.file.buffer) {
      if (heroPublicId) {
        await deleteByPublicId(heroPublicId);
      }
      const r = await uploadBuffer(req.file.buffer, "blogs");
      heroUrl = r.secure_url;
      heroPublicId = r.public_id;
    }

    const updated = await prisma.blog.update({
      where: { id:parsedid },
      data: {
        title: req.body.title ?? existing.title,
        content: req.body.content ?? existing.content,
        heroUrl,
        heroPublicId
      }
    });

    res.json(updated);
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2002") return res.status(409).json({ message: "Slug already exists" });
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parsedid = Number(id);
    const existing = await prisma.blog.findUnique({ where: { id:parsedid } });
    if (!existing) return res.status(404).json({ message: "Not found" });

    // ownership check
    if (existing.userid !== req.user?.email) {
      return res.status(403).json({ message: "Forbidden: not the blog author" });
    }

    if (existing.heroPublicId) {
      await deleteByPublicId(existing.heroPublicId);
    }

    await prisma.blog.delete({ where: { id:parsedid } });
    res.json({ message: "Deleted" });
  } catch (err: any) {
    res.status(500).json({ message: "Internal server error", details: err.message });
  }
};
