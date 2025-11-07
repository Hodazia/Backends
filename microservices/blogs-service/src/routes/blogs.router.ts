import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../middlewares/validate.middleware";
import { upload } from "../middlewares/upload";
import { AuthMiddleware } from "../middlewares/blog.middleware";
import {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  Fetchuser
} from "../controllers/blog.controller";

const router = Router();

// Zod schemas
const createSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  slug: z.string().min(1)
});

const updateSchema = createSchema.partial();

// Protect all blog routes
router.use(AuthMiddleware);

// Create (multipart/form-data) - field 'hero' is optional file
router.post("/", upload.single("hero"), validateBody(createSchema), createBlog);

// Get all (protected as requested)
router.get("/all", getAllBlogs);

// Get one
router.get("/:id", getBlog);

// Update
router.put("/:id", upload.single("hero"), validateBody(updateSchema), updateBlog);

// Delete
router.delete("/:id", deleteBlog);


//Fetch the blogs of a particular user or the current user
router.get("/myblogs", Fetchuser);
export default router;
