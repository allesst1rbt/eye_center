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
        <h1 class="birthday-title">🎉 Olá, {{ $order->customer_name }}! 🎂</h1>
        
        <div class="birthday-message">
            <p> o Eye Center deseja a você um Feliz Aniversário e que você sempre possa
                ver o melhor da vida!
                Para comemorarmos essa data especial, durante o seu mês, aproveite 10% de desconto em
                nossos serviços.
                Atenciosamente,
                Eye Center.</p>
            
           
        </div>
    </div>
</body>
</html>