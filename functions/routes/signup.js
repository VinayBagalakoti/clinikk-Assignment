import { Router } from "express";
const router = Router();
import { auth, userRef } from "../firebase-admin.js"

router.post("/api/signup", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;

    if (!email || !password || !username) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: username,
        });
        await userRef.doc(userRecord.uid).set({
           
            email,
            username,
            createdAt: new Date(),
        })
        res.status(201).json({ message: "User created successfully!" });
    }catch (error) {
        res.status(500).json({ error: error.message });
      }
})

export default router