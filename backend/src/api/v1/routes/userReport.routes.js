import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Headers",
        "X-access-token, Origin, Content-type, Accept"
    );
    next();
});

router.get('/')

export default router;
