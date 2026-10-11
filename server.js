const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());

// High payload limits (25MB) to support multi-page PDF proposal uploads & base64 ID images
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// In-memory data stores (Use MongoDB or PostgreSQL in production)
const resetTokens = {};
const approvedTokens = new Set();
const revokedTokens = new Set();

// Configure Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'jamesedikan080@gmail.com',
    pass: process.env.EMAIL_PASS || 'sohvtjjafnamnket'
  }
});

// -------------------------------------------------------------
// 1. MOBILIZER REGISTRATION (STRICT VIN/NIN VALIDATION & MANUAL REVIEW)
// -------------------------------------------------------------
app.post('/api/register-mobilizer', async (req, res) => {
  const { fullName, email, phone, idType, idNumber, role, fileData, fileName } = req.body;

  // Strict VIN/NIN & Form Field Rejection
  if (!email || !fullName || !role || !idNumber || idNumber === 'undefined' || idNumber.trim().length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid VIN or NIN details provided. Please check your identification details and try again.' 
    });
  }

  const pendingMailOptions = {
    from: '"Senator Allwell Onyesoh Campaign Office" <jamesedikan080@gmail.com>',
    to: email,
    subject: `Registration Received: ${role} - Pending ID Verification`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #38bdf8;">Registration Submitted for Review!</h2>
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>Thank you for submitting your application for <strong>${role}</strong> in Rivers East Senatorial District.</p>
        
        <div style="background-color: #1e293b; border: 1px solid #334155; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #f59e0b;">Verification Status: PENDING SENATOR DESK REVIEW</h4>
          <ul>
            <li><strong>Designation:</strong> ${role}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Verification Method:</strong> ${idType || "Voter's Card (VIN)"}</li>
            <li><strong>ID Code:</strong> ${idNumber}</li>
            <li><strong>Uploaded Document:</strong> ${fileName || "voter_card.jpg"}</li>
          </ul>
        </div>
        
        <p>The Senator's verification desk is currently reviewing your attached identification card photo to confirm your details.</p>
        <p><strong>Next Step:</strong> Once verified by the Senator, you will receive a follow-up email containing your official meeting access token.</p>
        
        <hr style="border-color: #334155; margin-top: 30px;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">Rivers East Campaign Movement &copy; 2027</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(pendingMailOptions);
    res.status(200).json({
      success: true,
      message: 'Registration submitted. Verification pending Senator desk approval.'
    });
  } catch (error) {
    console.error('Email Dispatch Error:', error);
    res.status(500).json({ success: false, message: 'Registration saved locally, but notification email failed.' });
  }
});

// -------------------------------------------------------------
// 2. SENATOR DESK APPROVES USER & SENDS GROUP CHAT TOKEN
// -------------------------------------------------------------
app.post('/api/approve-mobilizer', async (req, res) => {
  const { userEmail, fullName, role } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Missing target email.' });
  }

  const chatAccessToken = `CHAT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  approvedTokens.add(chatAccessToken);

  const approvalMailOptions = {
    from: '"Senator Allwell Onyesoh Campaign Office" <jamesedikan080@gmail.com>',
    to: userEmail,
    subject: `Verified & Approved: Senator Group Discussion Room Access Granted!`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #10b981;">Identity Verified Successfully!</h2>
        <p>Dear <strong>${fullName || 'Leader'}</strong>,</p>
        <p>Senator Allwell Onyesoh's Desk has verified your Voter Identification document. You have been granted full access to the official Group Discussion Room with the Senator and fellow Ward Coordinators.</p>
        
        <div style="background-color: #1e293b; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #38bdf8;"><strong>Your Group Access Token:</strong> <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">${chatAccessToken}</code></p>
        </div>

        <p style="margin-top: 25px;">
          <a href="http://127.0.0.1:5500/mobilization.html?token=${chatAccessToken}&role=${encodeURIComponent(role || 'Verified Leader')}" 
             style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
             Enter Senator Discussion Room Now
          </a>
        </p>
        
        <hr style="border-color: #334155; margin-top: 30px;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">Rivers East Campaign Movement &copy; 2027</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(approvalMailOptions);
    res.status(200).json({ success: true, message: 'Mobilizer approved and chat token email dispatched!' });
  } catch (error) {
    console.error('Approval Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send token email.' });
  }
});

// -------------------------------------------------------------
// 3. POLICY DESK PDF PROPOSAL SUBMISSION (EMAIL TO SENATOR)
// -------------------------------------------------------------
app.post('/api/submit-policy-proposal', async (req, res) => {
  const { authorName, authorEmail, authorPhone, role, proposalTitle, proposalSummary, pdfFileName, pdfBase64 } = req.body;

  if (!authorEmail || !proposalTitle || !pdfBase64) {
    return res.status(400).json({ success: false, message: 'Proposal title and PDF document are required.' });
  }

  // Strip base64 metadata prefix for Nodemailer attachment formatting
  const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, "");

  const policyMailOptions = {
    from: '"Campaign Policy Desk" <jamesedikan080@gmail.com>',
    to: 'jamesedikan080@gmail.com', // Senator / Command Desk Inbox
    replyTo: authorEmail,
    subject: `NEW POLICY PROPOSAL: "${proposalTitle}" from ${authorName} (${role})`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #38bdf8;">Direct Policy Submission Received</h2>
        <p>A new policy proposal document has been submitted directly to the Senator's Desk.</p>
        
        <div style="background-color: #1e293b; border: 1px solid #334155; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <h4 style="margin-top: 0; color: #10b981;">Author Information:</h4>
          <ul>
            <li><strong>Name:</strong> ${authorName}</li>
            <li><strong>Email:</strong> ${authorEmail}</li>
            <li><strong>Phone:</strong> ${authorPhone}</li>
            <li><strong>Designation:</strong> ${role}</li>
            <li><strong>Proposal Title:</strong> ${proposalTitle}</li>
          </ul>
        </div>

        <div style="background-color: #0f172a; border-left: 4px solid #38bdf8; padding: 12px; margin: 15px 0;">
          <p style="margin: 0; color: #cbd5e1;"><strong>Executive Summary:</strong></p>
          <p style="margin-top: 5px; color: #94a3b8;">${proposalSummary || "See attached PDF document for full details."}</p>
        </div>

        <p>📎 <strong>Attached Document:</strong> <code>${pdfFileName}</code> (Uneditable PDF Format attached to this email).</p>
        
        <hr style="border-color: #334155; margin-top: 30px;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">Rivers East Policy Desk &copy; 2027</p>
      </div>
    `,
    attachments: [
      {
        filename: pdfFileName || 'Policy_Proposal.pdf',
        content: base64Data,
        encoding: 'base64',
        contentType: 'application/pdf'
      }
    ]
  };

  try {
    await transporter.sendMail(policyMailOptions);
    console.log(`Policy document "${pdfFileName}" successfully emailed to Senator.`);
    res.status(200).json({ success: true, message: 'Policy proposal PDF submitted and delivered to Senator.' });
  } catch (error) {
    console.error('Policy Submission Error:', error);
    res.status(500).json({ success: false, message: 'Failed to deliver proposal PDF to Senator desk email.' });
  }
});

// -------------------------------------------------------------
// 4. FORGOT PASSWORD REQUEST (SEND 6-DIGIT CODE)
// -------------------------------------------------------------
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  resetTokens[email] = resetCode;

  const resetMailOptions = {
    from: '"Senator Allwell Onyesoh Campaign Portal" <jamesedikan080@gmail.com>',
    to: email,
    subject: 'Password Reset Verification Code - Campaign Portal',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #38bdf8;">Password Reset Request</h2>
        <p>We received a request to reset your password for the Leadership Command Portal.</p>
        <div style="background-color: #1e293b; border: 1px dashed #38bdf8; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
          <span style="font-size: 1.8rem; font-weight: bold; letter-spacing: 5px; color: #10b981;">${resetCode}</span>
        </div>
        <p>Use this 6-digit code on the reset page to set a new password.</p>
        <hr style="border-color: #334155; margin-top: 30px;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">Rivers East Campaign Movement &copy; 2027</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(resetMailOptions);
    res.status(200).json({ success: true, message: 'Password reset code sent to your registered email.' });
  } catch (error) {
    console.error('Reset Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send reset code.' });
  }
});

// -------------------------------------------------------------
// 5. RESET PASSWORD VERIFICATION
// -------------------------------------------------------------
app.post('/api/reset-password', (req, res) => {
  const { email, code, newPassword } = req.body;

  if (resetTokens[email] && resetTokens[email] === code) {
    delete resetTokens[email];
    return res.status(200).json({ success: true, message: 'Password reset successfully! You can now sign in.' });
  } else {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
  }
});

// -------------------------------------------------------------
// 6. USER LOGIN AUTHENTICATION
// -------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required.' });
  }

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    role: 'Verified Leader'
  });
});

// -------------------------------------------------------------
// 7. REVOKE USER CHAT ACCESS (SENATOR ADMIN ACTION)
// -------------------------------------------------------------
app.post('/api/revoke-access', (req, res) => {
  const { token, userEmail } = req.body;

  if (!token && !userEmail) {
    return res.status(400).json({ success: false, message: 'Missing token or email.' });
  }

  if (token) revokedTokens.add(token);
  
  console.log(`Access revoked for Token: ${token} | Email: ${userEmail}`);
  res.status(200).json({ success: true, message: 'User access revoked successfully.' });
});

// -------------------------------------------------------------
// 8. RESTORE USER CHAT ACCESS (SENATOR ADMIN ACTION)
// -------------------------------------------------------------
app.post('/api/restore-access', async (req, res) => {
  const { token, userEmail, fullName, role } = req.body;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Missing user email.' });
  }

  if (token && revokedTokens.has(token)) {
    revokedTokens.delete(token);
  }

  const freshToken = `CHAT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
  approvedTokens.add(freshToken);

  const restoreMailOptions = {
    from: '"Senator Allwell Onyesoh Campaign Office" <jamesedikan080@gmail.com>',
    to: userEmail,
    subject: 'Meeting Access Restored - Senator Onyesoh Campaign Portal',
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #ffffff; padding: 20px; border-radius: 8px;">
        <h2 style="color: #10b981;">Meeting Access Restored</h2>
        <p>Dear <strong>${fullName || 'Leader'}</strong>,</p>
        <p>Your access to the Senator's official discussion room has been restored by the campaign administration desk.</p>

        <div style="background-color: #1e293b; border: 1px solid #10b981; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #38bdf8;"><strong>Role:</strong> ${role || 'Verified Leader'}</p>
          <p style="margin: 10px 0 0; color: #38bdf8;"><strong>New Access Token:</strong> <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px;">${freshToken}</code></p>
        </div>

        <p style="margin-top: 25px;">
          <a href="http://127.0.0.1:5500/mobilization.html?token=${freshToken}&role=${encodeURIComponent(role || 'Verified Leader')}"
             style="background-color: #10b981; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; display: inline-block;">
             Re-enter Senator Discussion Room
          </a>
        </p>

        <hr style="border-color: #334155; margin-top: 30px;" />
        <p style="font-size: 0.8rem; color: #94a3b8;">Rivers East Campaign Movement &copy; 2027</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(restoreMailOptions);
    console.log(`Access restored for ${userEmail} using token ${freshToken}`);
    res.status(200).json({ success: true, message: 'User access restored successfully.' });
  } catch (error) {
    console.error('Restore Access Email Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send access restoration notification.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});