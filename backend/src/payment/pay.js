import Razorpay from 'razorpay';
import Student from '../schemas/student.js'

const razorpay = new Razorpay({
    key_id: "currently_not_available" ,
    key_secret: process.env.KEY_SECRET
})

const createOrder = async (amount, currency, accountID, description) => {
    try {
        const options = {
            amount: amount * 100, // razor pay config expects paise for INR
            currency: currency, 
            receipt: 'receipt_' + Date.now(),
            payment_capture: 1,
            notes: {
                accountID: accountID,
                description: description
            }
        };

        const order = await razorpay.orders.create(options);
        return order;
    } catch (error) {
        throw error;
    }
};

const verifyPayment = async (req, res) => {
    const { orderId, paymentId, signature } = req.body;

    try {
        const isValidSignature = razorpay.webhooks.validateWebhookSignature(JSON.stringify(req.body), signature, process.env.WEBHOOK_SECRET);
        if (!isValidSignature) {
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }

        const order = await razorpay.orders.fetch(orderId);

        if (order && order.status === 'paid' && order.amount_paid === order.amount) {
            const receipt = {
                orderId: orderId,
                paymentId: paymentId,
                amount: order.amount / 100,
                currency: order.currency,
                timestamp: new Date()
            };

            const student = await Student.findOne({ roll: req.user.roll }).populate('washerman');
            if (!student) {
                return res.status(404).json({ success: false, message: 'Student not found' });
            }

            student.receipts.push(receipt);

            student.lastCleared = new Date();

            await student.save();

            // Transfering Payment to washerman after verification
            await transferPayment(student.dueAmount, 'INR', student.washerman.accountID, 'Clothes Due clearance');

            return res.status(200).json({ success: true, message: 'Payment verified successfully', receipt });
        } else {
            return res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const transferPayment = async (amount, currency, accountID, description) => {
    try {
        // Create a payout order to transfer payment to washerman
        const options = {
            amount: amount * 100,
            currency: currency,
            account: accountID,
            notes: {
                description: description
            }
        };

        const payout = await razorpay.payouts.create(options);
        return payout;
    } catch (error) {
        throw error;
    }
};

const pay = { createOrder, verifyPayment }

export default pay;