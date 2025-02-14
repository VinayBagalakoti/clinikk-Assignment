// import { Router } from "express";
// const router = Router();
// import { auth, userRef } from "../firebase-admin.js"


// router.post("/api/login", async(req,res)=>{
//     const { token } = req.body;

//   if (!token) {
//     return res.status(401).json( "Unauthorized - No token provided" );
//   }
//   try {
   
//     const decodedToken = await auth.verifyIdToken(token);

//     res.status(200).json(
//       "Login successful"
   
//     );
//   } catch (error) {
//     res.status(403).json({ error: "Invalid or expired token" });
//   }
// })

// export default router;





import { Router } from "express";
const router = Router();
import { auth, userRef } from "../firebase-admin.js";

router.post("/api/login", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    // ✅ Verify Firebase ID Token
    const decodedToken = await auth.verifyIdToken(token);

    // ✅ Fetch user info from Firestore
    const userDoc = await userRef.doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : { email: decodedToken.email };

    res.status(200).json({
      message: "Login successful",
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: userData.name || "User",
        profilePic: userData.profilePic || null,
      },
    });
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

export default router;
