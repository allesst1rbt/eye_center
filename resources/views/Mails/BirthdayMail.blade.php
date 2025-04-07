<!DOCTYPE html>
<html>
<head>
    <style>
        .birthday-card {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
            text-align: center;
        }
        .birthday-title {
            color: #ff69b4;
            font-size: 24px;
            margin-bottom: 20px;
        }
        .birthday-message {
            color: #333;
            font-size: 16px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="birthday-card">
        <h1 class="birthday-title">🎉 Happy Birthday, {{ $order->customer_name }}! 🎂</h1>
        
        <div class="birthday-message">
            <p>We hope your day is filled with joy, laughter, and wonderful moments!</p>
            
            <p>As a valued customer, we want to make your birthday special.</p>
            
            
            <p>Best wishes,<br>
        </div>
    </div>
</body>
</html>