<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order Status Changed</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, sans-serif; background-color:#f6f6f6;">
    <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f6f6f6;">
        <tr>
            <td align="center" style="padding:20px;">
                <!-- Email container -->
                <table role="presentation" style="width:600px; border-collapse:collapse; border:1px solid #ddd; border-radius:8px; overflow:hidden; background-color:#ffffff;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background:#d4a017; padding:20px;">
                            <h1 style="margin:0; font-size:24px; color:#fff;">Flat Logic</h1>
                            <p style="margin:0; color:#fff;">Buy everything</p>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px; color:#333;">
                            <h2 style="color:#2e7d32; margin-top:0;">Order Update</h2>

                            <p>Hello <strong>{{ $order->first_name }}</strong>,</p>

                            {{-- Status-based message --}}
                            @if($order->status === 'completed')
                                <p>Great news! 🎉 Your order <strong>#{{ $order->id }}</strong> has been <strong>completed</strong> and is on its way to you.</p>
                            @elseif($order->status === 'canceled')
                                <p>We’re sorry 😞. Your order <strong>#{{ $order->id }}</strong> has been <strong>canceled</strong>. If this was unexpected, please contact our support team.</p>
                            @elseif($order->status === 'processing')
                                <p>Good news! Your order <strong>#{{ $order->id }}</strong> is now being <strong>processed</strong>. We’ll notify you once it ships.</p>
                            @else
                                <p>Your order <strong>#{{ $order->id }}</strong> is now <strong>{{ ucfirst($order->status) }}</strong>.</p>
                            @endif

                            <!-- Order Details -->
                            <table role="presentation" style="width:100%; border:1px solid #ddd; border-radius:5px; margin-top:20px; padding:15px; background-color:#fafafa;">
                                <tr>
                                    <td style="padding:10px;">
                                        <p style="margin:0; font-weight:bold;">Order Details</p>
                                        <p style="margin:5px 0;">Order ID: #{{ $order->id }}</p>
                                        <p style="margin:5px 0;">Order Date: {{ $order->created_at->format('F d, Y h:i A') }}</p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Order Items -->
                            <h3 style="margin-top:20px;">Items in Your Order</h3>
                            <table role="presentation" style="width:100%; border-collapse:collapse; margin-top:10px;">
                                <thead>
                                    <tr style="background:#f0f0f0;">
                                        <th align="left" style="padding:10px; border:1px solid #ddd;">Product</th>
                                        <th align="center" style="padding:10px; border:1px solid #ddd;">Quantity</th>
                                        <th align="right" style="padding:10px; border:1px solid #ddd;">Price</th>
                                        <th align="right" style="padding:10px; border:1px solid #ddd;">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    @foreach($order->orderDetails as $detail)
                                        <tr>
                                            <td style="padding:10px; border:1px solid #ddd;">{{ $detail->product_name }}</td>
                                            <td align="center" style="padding:10px; border:1px solid #ddd;">{{ $detail->quantity }}</td>
                                            <td align="right" style="padding:10px; border:1px solid #ddd;">${{ number_format($detail->product_price, 2) }}</td>
                                            <td align="right" style="padding:10px; border:1px solid #ddd;">${{ number_format($detail->product_price * $detail->quantity, 2) }}</td>
                                        </tr>
                                    @endforeach
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" align="right" style="padding:10px; border:1px solid #ddd; font-weight:bold;">Total</td>
                                        <td align="right" style="padding:10px; border:1px solid #ddd; font-weight:bold;">${{ number_format($order->total_amount, 2) }}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <p style="margin-top:20px;">Thank you for shopping with us!</p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background:#f0f0f0; padding:15px; font-size:12px; color:#777;">
                            &copy; {{ date('Y') }} Flat Logic. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
