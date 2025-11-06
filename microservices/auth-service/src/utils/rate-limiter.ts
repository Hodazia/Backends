// add rate limiting here

import rateLimit from "express-rate-limit"


const limiter = rateLimit({
	windowMs: 60 * 1000, // 1 minute
	limit: 10, // Limit each IP to 10 requests per `window` (here, per 1 minute).
	standardHeaders: 'draft-8', 
})

export default limiter