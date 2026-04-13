using Application.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Service
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendOtpResetPasswordAsync(string toEmail, string firstName, string otp)
        {
            string htmlContent = $@"
                <html>
                    <body style='font-family: Arial, sans-serif; background-color: #f4f6f8; margin:0; padding:20px;'>
                        <div style='max-width:600px; margin:auto; background:#fff; padding:30px; border-radius:8px;'>

                            <h2 style='color:#333;'>Hello, {firstName}!</h2>

                            <p style='font-size:16px; color:#555;'>
                                You requested to reset your password. Please use the OTP code below to continue.
                            </p>

                            <div style='text-align:center; margin:30px 0;'>
                                <span style='display:inline-block; background:#f1f5f9; padding:15px 30px; font-size:24px; font-weight:bold; letter-spacing:4px; border-radius:6px; color:#198754;'>
                                {otp}
                                </span>
                            </div>

                            <p style='font-size:14px; color:#555;'>
                                This OTP will expire in <strong>5 minutes</strong>.
                            </p>

                            <p style='font-size:14px; color:#555;'>
                                If you did not request a password reset, please ignore this email.
                            </p>

                            <p style='font-size:12px; color:#999; margin-top:30px;'>
                                &copy; {DateTime.UtcNow.Year} Shoes Store. All rights reserved.

                        </div>
                    </body>
                </html>";

            await SendEmailAsync(toEmail, "Shoes Store - OTP Resetpassword", htmlContent, true);
        }

        private async Task SendEmailAsync(string toMail, string subject, string body, bool isBodyHtml = false)
        {
            try
            {
                var smtpServer = _configuration["EmailSettings:SmtpServer"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");

                var senderEmail = _configuration["EmailSettings:SenderEmail"];
                var senderName = _configuration["EmailSettings:SenderName"];
                var Password = _configuration["EmailSettings:Password"];

                using var message = new MailMessage
                {
                    From = new MailAddress(senderEmail!, senderName),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = isBodyHtml
                };
                message.To.Add(new MailAddress(toMail));

                using var smtpClient = new SmtpClient(smtpServer, smtpPort)
                {
                    Credentials = new NetworkCredential(senderEmail, Password),
                    EnableSsl = true
                };

                await smtpClient.SendMailAsync(message);
            }
            catch(Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.ToString()}");
            }
        }
    }
}
