
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const data = req.body;
    const { name, email, phone, isContact } = data;

    // IMPORTANTE: Esta API Key se debe configurar en el panel de Vercel como variable de entorno
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'Resend API Key not configured' });
    }

    // Personalización según el tipo de mensaje
    const subject = isContact
        ? `Nuevo Mensaje de Contacto: ${data.subject} - ${name}`
        : `Nueva Postulación: ${data.vacancyTitle} - ${name}`;

    const htmlContent = isContact
        ? `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #3b82f6;">Nuevo Mensaje de Contacto</h2>
        <p><strong>De:</strong> ${name}</p>
        <p><strong>Asunto:</strong> ${data.subject}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap; color: #555;">${data.message}</p>
        <br />
        <p style="font-size: 11px; color: #999;">Enviado desde el formulario de contacto de FWSA.</p>
      </div>
    `
        : `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #f97316;">Nueva Postulación Recibida</h2>
        <p><strong>Candidato:</strong> ${name}</p>
        <p><strong>Vacante:</strong> ${data.vacancyTitle}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone}</p>
        <p><strong>Experiencia:</strong> ${data.experience}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p><strong>Motivación:</strong></p>
        <p style="font-style: italic; color: #666;">"${data.motivation}"</p>
        <br />
        <p style="font-size: 11px; color: #999;">Enviado desde el sistema de reclutamiento de FWSA.</p>
      </div>
    `;

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'FWSA Sistema <onboarding@resend.dev>',
                to: ['donaxjimenez00@gmail.com'], // Tu correo institucional
                subject: subject,
                html: htmlContent,
            }),
        });
        

        const result = await response.json();

        if (response.ok) {
            return res.status(200).json({ success: true, id: result.id });
        } else {
            return res.status(response.status).json({ error: result.message });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
