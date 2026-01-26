import nodemailer from 'nodemailer'

/**
 * Send an email using Nodemailer just make sure that all credentailas are avaialable...
 *
 * @param {Object} options contain the email options
 * @param {string} options.to recipient email address
 * @param {string} options.subject email subject
 * @param {string} options.template email template string with placeholders
 * @param {Object} [options.context] context object to replace placeholders in the template
 * 
 * @returns {Promise} resolves when email is sent
 * @throws {Error} if required parameters are missing
 * 
 * @example
 * const template = "<h1>Hello {{name}}</h1><p>Your code is {{code}}</p>";
 * await sendMail({
 *  to: "",
 *  subject: "Test Email",
 * template,
 *  context: { name: "John", code: "123456" }
 * }); 
 */

interface mailOptions {
    to: string;
    subject: string;
    template: string;
    context?: Record<string, any>;
}
async function sendMail({ to, subject, template, context = {} } : mailOptions) : Promise<any> {
  if (!to || !subject || !template) {
    throw new Error('to, subject, and template are required')
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })

    const html = compileTemplate(template , context);
  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  })
}

/**
 * Ultra-light template compiler
 * Replaces {{key}} with context values
 */
function compileTemplate(template : string , context : Record<string , any>) : string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return context[key] ?? ''
  })
}

export default sendMail;
