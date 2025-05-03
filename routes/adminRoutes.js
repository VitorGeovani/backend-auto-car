import express from 'express';
const router = express.Router();
import AdminController from '../controllers/AdminController.js';

router.get('/admins', AdminController.listar);
router.post('/login', AdminController.login);

// // Adicionar ao arquivo routes/adminRoutes.js
// router.get('/verify-auth', authMiddleware, AdminController.verifyAuth);

// // Adicionar ao AdminController.js
// exports.verifyAuth = async (req, res) => {
//   try {
//     // O middleware authMiddleware já verifica o token
//     // Se chegou até aqui, o token é válido
//     // Verifique se é realmente um admin
//     if (req.isAdmin) {
//       return res.status(200).json({ isValid: true, isAdmin: true });
//     } else {
//       return res.status(403).json({ isValid: true, isAdmin: false });
//     }
//   } catch (error) {
//     return res.status(401).json({ isValid: false, message: 'Token inválido' });
//   }
// };

export default router;