<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reposição de Lentes - Eye Center</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      color: #333;
      background-color: #f9f9f9;
      padding: 20px;
    }
    .container {
      background-color: #fff;
      border-radius: 8px;
      padding: 30px;
      max-width: 600px;
      margin: auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .emoji {
      font-size: 24px;
    }
    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #888;
    }
  </style>
</head>
<body>
  <div class="container">
    <p class="emoji">👁️</p>
    <p>Olá <strong>{{$order->customer_name}}</strong>, tudo bem?</p>

    <p>Já se passaram <strong>{{$order->Term->expire_date}}</strong> desde que você adquiriu suas lentes conosco e gostaríamos de saber se elas têm atendido suas necessidades.</p>

    <p>Se precisar de <strong>reposição</strong> ou quiser <strong>experimentar outro modelo</strong>, estamos à disposição para te ajudar! 😊</p>

    <p>Conte com a gente!</p>

    <p><strong>Eye Center</strong></p>

  </div>
</body>
</html>
