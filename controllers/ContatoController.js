import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const ContatoController = {
  enviar: async (req, res) => {
    try {
      const { nome, email, cidade, depoimento } = req.body;
      
      // Validação básica
      if (!nome || !email || !depoimento) {
        return res.status(400).json({ 
          erro: 'Nome, e-mail e mensagem são obrigatórios.' 
        });
      }
      
      // Verificar se as variáveis de ambiente estão configuradas
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Configurações de e-mail ausentes. Verifique suas variáveis de ambiente.');
        return res.status(500).json({ 
          erro: 'Erro na configuração do servidor de e-mail.'
        });
      }
      
      // Configuração do nodemailer usando APENAS variáveis de ambiente
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      // Template do e-mail
      const mailOptions = {
        from: `"Site Auto Car" <${process.env.EMAIL_USER}>`,
        to: 'sincerev36@gmail.com', // Alterado para o e-mail de destino correto
        subject: `Nova mensagem de contato de ${nome}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 5px;">
            <h2 style="color: #d62828;">Nova Mensagem de Contato</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Bairro:</strong> ${cidade || 'Não informada'}</p>
            <p><strong>Mensagem:</strong></p>
            <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #d62828; margin: 15px 0;">
              ${depoimento.replace(/\n/g, '<br>')}
            </div>
            <p style="font-size: 12px; color: #777; margin-top: 30px;">
              Esta mensagem foi enviada através do formulário de contato do site Auto Car.
            </p>
          </div>
        `
      };
      
      // Enviar e-mail
      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ 
        mensagem: 'Mensagem enviada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao enviar mensagem de contato:', error);
      res.status(500).json({ erro: 'Erro interno ao enviar mensagem de contato.' });
    }
  }
};

export default ContatoController;