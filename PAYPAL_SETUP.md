# PayPal Integration Setup Guide

## Why You're Not Receiving Money

Based on your code analysis, here are the most likely reasons you're not receiving money in your PayPal account:

### 1. **Missing Environment Variables** ⚠️

Your app requires these environment variables to be set:

```bash
# Create .env.local file in your project root
PP_BASE=https://api-m.sandbox.paypal.com  # For testing
# PP_BASE=https://api-m.paypal.com  # For production

PP_CLIENT_ID=your_paypal_client_id_here
PP_SECRET=your_paypal_secret_here

PAYPAL_RETURN_URL=http://localhost:3000/payment/success
PAYPAL_CANCEL_URL=http://localhost:3000/payment/cancel
```

### 2. **Using Sandbox vs Live Environment** 🔍

- **Sandbox**: For testing - money goes to your sandbox account
- **Live**: For production - money goes to your real PayPal account

### 3. **Incomplete Payment Flow** 🔄

The payment process requires both order creation AND capture:

1. Create order → User approves → Capture payment → Money received

## Setup Instructions

### Step 1: Create PayPal App

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new app
3. Choose "Sandbox" for testing or "Live" for production
4. Copy your Client ID and Secret

### Step 2: Set Environment Variables

Create `.env.local` file in your project root:

```bash
# For Sandbox (testing)
PP_BASE=https://api-m.sandbox.paypal.com
PP_CLIENT_ID=your_sandbox_client_id
PP_SECRET=your_sandbox_secret

# For Live (production) - uncomment these
# PP_BASE=https://api-m.paypal.com
# PP_CLIENT_ID=your_live_client_id
# PP_SECRET=your_live_secret

PAYPAL_RETURN_URL=http://localhost:3000/payment/success
PAYPAL_CANCEL_URL=http://localhost:3000/payment/cancel
```

### Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Enter an amount and click "Pay with PayPal"
4. Complete the payment in PayPal
5. Check your PayPal account (sandbox or live)

### Step 4: Check Logs

Monitor your console logs for:

- Environment variable errors
- PayPal API errors
- Payment capture success/failure

## Common Issues & Solutions

### Issue: "PayPal configuration missing"

**Solution**: Set all required environment variables

### Issue: "create_order_failed"

**Solution**: Check your PayPal credentials and app status

### Issue: Payment shows as "COMPLETED" but no money received

**Solution**:

- Verify you're checking the correct PayPal account (sandbox vs live)
- Check if the payment was actually captured (not just approved)
- Look for webhook notifications

### Issue: Money in sandbox account but not live account

**Solution**: Switch to live environment variables and test with real PayPal account

## Testing Checklist

- [ ] Environment variables set correctly
- [ ] PayPal app created and active
- [ ] Using correct environment (sandbox/live)
- [ ] Payment flow completes successfully
- [ ] Money appears in correct PayPal account
- [ ] Webhook notifications working (optional)

## Debugging Tips

1. **Check Console Logs**: Look for error messages in your terminal
2. **PayPal Dashboard**: Check your PayPal developer dashboard for transaction logs
3. **Network Tab**: Use browser dev tools to see API responses
4. **Test with Small Amounts**: Start with $1.00 to test

## Next Steps

1. Set up your environment variables
2. Test with sandbox first
3. Switch to live when ready for production
4. Monitor your PayPal account for incoming payments

If you're still not receiving money after following these steps, check the console logs for specific error messages and let me know what you see.
