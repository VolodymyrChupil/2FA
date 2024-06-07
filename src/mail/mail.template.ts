export const sendEmailConfirmationTMP = (code: string) => {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%;font-size: 16px; line-heigth:1.3">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0">
                  <p>
                     Thank you for registering on our website 2FA 
                     To confirm your email follow this <a href="${process.env.SERVER_URL}/register/${code}">link</a>
                  </p>
                  <p>
                     If you did not request this email confirmation disregard this email.
                  </p>
                  <p>
                     Sincerely, 2FA Team.
                  </p>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export const sendVerificationCodeTMP = (code: string) => {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%; font-size: 16px; line-heigth:1.3">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0">
                  <p>
                     Hi! Here is a temporary security code for your 2FA Account. It can only be used once within the next <b>5</b> minutes, after which it will expire:
                  </p>
                  <p style="margin:15px 0; font-weight:600">${code}</p>
                  <p>
                     Did you receive this email without having an active request from 2FA to enter a verification code? If so, the security of your 2FA account may be compromised. Please <b>change your password as soon as possible.</b><br>
                  </p>
                  <p>Sincerely, 2FA Team.</p>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export const sendPasswordChangeCodeTMP = (code: string) => {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%;font-size: 16px; line-heigth:1.3">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0">
                  <p>
                     Hi! Here is a temporary security code to change password to your 2FA Account. It can only be used once within the next <b>5</b> minutes, after which it will expire:
                  </p>
                  <p style="margin:15px 0; font-weight:600">${code}</p>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}

export const sendResetPasswordConfirmationTMP = (code: string) => {
  return `<html lang="en">
   <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
   </head>
   <body>
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;background-repeat:repeat;width:100%;font-size: 16px; line-heigth:1.3">
         <tr>
            <td align="center">
               <table width="600" cellpadding="0" cellspacing="0" border="0">
                  <p>
                     We received a request to reset the password for your account.  If you made this request, please follow the instructions below to reset your password. If you did not request a password reset, please disregard this email or contact our support team for assistance.
                  </p>
                  <p>
                     To reset your password, please click this <a href="${process.env.SERVER_URL}/auth/reset-pwd/${code}">link</a>
                  </p>
               </table>
            </td>
         </tr>
      </table>
   </body>
</html>`
}
