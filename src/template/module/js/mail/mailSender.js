import nodemailer from 'nodemailer'

/**
 * Send an email using Nodemailer just make sure that all credentailas are avaialable...
 *
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.template - HTML template with {{variables}}
 * @param {Object} options.context - Key-value data for template
 * 
 * @returns {Promise<void>} This will resolve when email is sent 
 * @throws {Error} When some goes exceptionally wrong in cofig or credentials are missing 
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

async function sendMail({ to, subject, template, context = {} }) {
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

  const html = compileTemplate(template, context)

  return transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html
  })
}

/**
 * Ultra-light template compiler
 * Replaces {{key}} with context values this make sure the consistency between the code and comment
 */
function compileTemplate(template, context) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
    return context[key] ?? ''
  })
}

export default sendMail
