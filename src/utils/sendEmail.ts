import mailjet from 'node-mailjet';

export default async function sendEmail({ email, subject, otp }: { email: string, subject: string, otp: number }) {

    try {
        const apiKey = process.env.MAILJET_API_KEY as string;
        const apiSecret = process.env.MAILJET_SECRET_KEY as string;
        const client = mailjet.apiConnect(
            apiKey,
            apiSecret
        );

        const request = client
            .post('send')
            .request({
                FromEmail: 'shivamsahu2635@gmail.com',  
                FromName: 'QuickCapture',
                Subject: subject,
                'Html-part': `
                    <div class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 my-8">
                        <h2 class="text-xl font-bold text-center text-gray-700">Your OTP Code</h2>
                        <p class="text-center text-gray-600 mt-2">Use the OTP code below to verify your account:</p>
                        <div class="my-6">
                            <p class="text-center text-3xl font-semibold text-green-500">${otp}</p>
                        </div>
                        <p class="text-gray-600 text-sm text-center">This OTP is valid for the next 15 minutes. If you didn’t request this code, you can safely ignore this email.</p>
                        <div class="mt-6 text-center">
                            <a href="https://quickcapture.vercel.app" class="bg-green-500 text-white py-2 px-4 rounded-md font-medium inline-block">Visit our Website</a>
                        </div>
                        <p class="text-gray-400 text-xs text-center mt-6">&copy; 2024 Your Company. All rights reserved.</p>
                    </div>`,
                Recipients: [{ Email: email }]  // Ensure the recipient email is correct
            });

        const result = await request;
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
