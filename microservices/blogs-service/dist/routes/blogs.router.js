"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const upload_1 = require("../middlewares/upload");
const blog_middleware_1 = require("../middlewares/blog.middleware");
const blog_controller_1 = require("../controllers/blog.controller");
const router = (0, express_1.Router)();
// Zod schemas
const createSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    content: zod_1.z.string().min(1),
    slug: zod_1.z.string().min(1)
});
const updateSchema = createSchema.partial();
// Protect all blog routes
router.use(blog_middleware_1.AuthMiddleware);
// Create (multipart/form-data) - field 'hero' is optional file
router.post("/", upload_1.upload.single("hero"), (0, validate_middleware_1.validateBody)(createSchema), blog_controller_1.createBlog);
// Get all (protected as requested)
router.get("/all", blog_controller_1.getAllBlogs);
// Get one
router.get("/:id", blog_controller_1.getBlog);
// Update
router.put("/:id", upload_1.upload.single("hero"), (0, validate_middleware_1.validateBody)(updateSchema), blog_controller_1.updateBlog);
// Delete
router.delete("/:id", blog_controller_1.deleteBlog);
//Fetch the blogs of a particular user or the current user
router.get("/myblogs", blog_controller_1.Fetchuser);
exports.default = router;
