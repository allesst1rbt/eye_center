<?php

namespace App\Http\Controllers;

use App\Mail\ExpireDateTerms;
use App\Mail\OrderCreatedMail;
use App\Models\Order;
use App\Services\MessageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::all();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $order = Order::create($request->all())->load('Term');
        if ($request->customer_email) {
            Mail::to($order->customer_email)->send(new OrderCreatedMail($order));
        }
        if ($order->Term->expire_date === "2 dias") {
                if ($request->customer_email) {
                    Mail::to(users: $order->customer_email)->send(new ExpireDateTerms($order));
                }
                $this->sendMessageRemember(order: $order);
                $order->order_remember = "true";
                $order->save();
                 
        }
        $this->sendMessage(order: $order);
        $order->order_confirmation = "true";
        $order->save();

        return response()->json($order, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        return response()->json($order->load(['lens', 'terms']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {

        $order->update($request->all());
        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json(null, 204);
    }

    private function sendMessage(Order $order)
    {
        $messageService = new MessageService();
        $result = $messageService->sendText(
            $order->customer_number,
              "Olá {$order->customer_name},\n\nAgradecemos imensamente pela sua compra e pela confiança em adaptar suas lentes de contato conosco. Estamos muito felizes por você ter escolhido a Clínica Eye Center!\n\nPreparamos algumas instruções simples para o seu uso\n\n*⚠️ ATENÇÃO AOS CUIDADOS COM SUA LENTE:*\n\n1. *Higiene das Mãos:*\n   - Lave e seque bem as mãos antes de manusear as lentes.\n\n2. *Colocação das Lentes:*\n   - Verifique se a lente está limpa e sem danos.\n   - Coloque a lente no dedo indicador, puxe as pálpebras e coloque-a sobre o olho.\n   - Pisque suavemente para ajustar a lente.\n\n3. *Remoção das Lentes:*\n   - Lave as mãos antes de remover as lentes.\n   - Puxe a pálpebra inferior e use o polegar e o indicador para pinçar e retirar a lente.\n\n4. *Armazenamento:*\n   - Para lentes *GELATINOSAS* (coloridas e incolores, mensais e anuais): use sempre solução recomendada para armazenamento, indicamos o uso da solução *Renu* ou *Opti Free*.\n   - Para lentes *RÍGIDAS E ESCLERAIS*: use sempre solução recomendada para armazenamento, indicamos o uso diário da solução *Boston Simplus*.\n   - Troque a solução do estojo a cada remoção das lentes.\n\n5. *Tempo de Uso:*\n   - Seguir as orientações do fabricante.\n   - Respeite o prazo de validade das suas lentes, para evitar infecções.\n\n6. *Cuidados Adicionais:*\n   - Evite dormir com lentes (a menos que indicado pelo fabricante escolhido).\n   - Não use lentes danificadas ou mal higienizadas.\n   - Evite nadar com as lentes.\n\n7. *Sinais de Alerta:*\n   - Remova as lentes imediatamente e consulte-nos se você sentir:\n     ▪️ Dor, vermelhidão ou irritação nos olhos.\n     ▪️ Visão embaçada ou halos ao redor das luzes.\n     ▪️ Sensibilidade à luz.\n     ▪️ Secreção ou lacrimejamento excessivo.\n\n8. *Consultas Regulares:*\n   - Agende consultas oftalmológicas regulares para monitorar a saúde dos seus olhos e garantir que suas lentes de contato continuem adequadas para você. A frequência das consultas será definida pelo seu oftalmologista.\n\nCaso tenha qualquer dúvida ou precise de assistência, não hesite em nos contatar. Estamos aqui para ajudar!\n\nDesejamos que o produto atenda às suas expectativas e que você tenha uma excelente experiência com ele.\n\n---\n\n*💬 Deixe seu feedback em nosso perfil, sua opinião é muito importante para todos nós do Eye Center!*\n\n🔗 https://g.page/r/CcbArEO4PyQYEAg/review\n\n*Atenciosamente,*\n*EYE CENTER.*"
        );
    }
    private function sendMessageRemember(Order $order)
    {
        $messageService = new MessageService();
        $result = $messageService->sendText(
            $order->customer_number,
         "👁️ Olá {$order->customer_name}, tudo bem?\n\nJá se passaram {$order->Term->expire_date} dias desde que você adquiriu suas lentes conosco e gostaríamos de saber se elas têm atendido suas necessidades.\n\nSe precisar de reposição ou quiser experimentar outro modelo, estamos à disposição para te ajudar! 😊\n\nConte com a gente!\nEye Center"

        );
    }
}
