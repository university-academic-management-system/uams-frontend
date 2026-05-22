implemt these endpoint for the student verification process

1. Verify Student Endpoint
POST
/api/auth/activate
Verify a student by matric number (pre‑registered by admin)

Returns a short‑lived verification token and the student's public profile data. The token is required to update the student's login details.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "matricNumber": "MAT/2020/001"
}
Responses
Code	Description	Links
200	
Matric number verified successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "Matric number verified",
  "data": {
    "verificationToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "profile": {
      "firstName": "string",
      "surname": "string",
      "otherName": "string",
      "matricNumber": "string",
      "registrationNo": "string",
      "level": "L100",
      "admissionYear": 0,
      "currentSession": "5553/8758"
    }
  }
}



2.
PATCH
/api/auth/activate
Complete student registration by setting email, password, and optional info

Requires a valid verification token obtained from /verify-student. Updates the existing User record with the student's real email and password, and optionally updates otherName and phone in the StudentProfile. After this, the student can log in with the new credentials.

Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "token": "string",
  "email": "student@university.edu",
  "password": "NewSecurePass123!",
  "phone": "string"
}
Responses
Code	Description	Links
200	
Details updated successfully, returns login JWT

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "success": true,
  "message": "string",
  "data": {
    "token": "string",
    "expiresIn": "7d",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "STUDENT"
    }
  }
}



3. POST
/api/payments/initialize
Initialize a payment via Paystack


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "type": "ANNUAL_ACCESS_FEE_AND_DEPARTMENTAL_DUES",
  "session": "2024/2025",
  "level": "L100",
  "semester": "FIRST",
  "redirectUrl": "https://frontend.uams.com/payment/verify"
}
Responses
Code	Description	Links
200	
Payment initialized successfully

Media type

application/json
Controls Accept header.
Example Value
Schema
{
  "status": "success",
  "message": "string",
  "data": {
    "authorization_url": "https://checkout.paystack.com/...",
    "access_code": "abc123xyz",
    "reference": "UAMS-123456789"
  }
}