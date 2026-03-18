import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const { messageId, recipientEmail, recipientName, replyText, originalMessage } = await request.json();

    if (!messageId || !recipientEmail || !recipientName || !replyText) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    // Configuration Gmail SMTP
    const gmailUser = process.env.GMAIL_USER;
    const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailAppPassword) {
      return NextResponse.json({
        error: "Configuration email non complète."
      }, { status: 500 });
    }

    // Créer le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    console.log('Transporteur Nodemailer créé');

    // Préparation de l'email
    const mailOptions = {
      from: `"EDPST - Église" <${gmailUser}>`,
      to: recipientEmail,
      subject: 'Re: Votre message',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .original-message { background-color: #fff; border-left: 4px solid #d4af37; padding: 15px; margin-top: 20px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>EDPST - Église</h1>
              <p>Réponse à votre message</p>
            </div>

            <div class="content">
              <p>Cher/Chère ${recipientName},</p>

              <p>${replyText.replace(/\n/g, '<br>')}</p>

              <div class="original-message">
                <h3>Votre message original :</h3>
                <p>${originalMessage.replace(/\n/g, '<br>')}</p>
              </div>
            </div>

            <div class="footer">
              <p>Cet email a été envoyé automatiquement depuis le site de l'EDPST.</p>
              <p>Pour nous contacter : ${gmailUser}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
Cher/Chère ${recipientName},

${replyText}

--- Votre message original ---
${originalMessage}

--
Cet email a été envoyé automatiquement depuis le site de l'EDPST.
Pour nous contacter : ${gmailUser}
      `.trim()
    };

    // Envoi de l'email
    try {
      const info = await transporter.sendMail(mailOptions);
      return NextResponse.json({
        success: true,
        message: "Réponse envoyée avec succès"
      });
    } catch (emailError) {
      console.error('Erreur Nodemailer:', emailError.message);
      return NextResponse.json({
        error: `Erreur d'envoi: ${emailError.message || 'Erreur inconnue'}`
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur générale dans l\'API:', error);
    return NextResponse.json({
      error: "Erreur lors de l'envoi de la réponse"
    }, { status: 500 });
  }
}