<?php

namespace App\Http\Controllers;

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

        $order = Order::create($request->all());
        Mail::to($order->customer_email)->send(new OrderCreatedMail($order));
        $this->sendMessage($order);

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
            "Olá {$order->customer_name},
                Agradecemos imensamente pela sua confiança em adaptar suas lentes de contato conosco.
                Estamos muito felizes por você ter escolhido a Clínica Eye Center!
                Preparamos algumas instruções simples para o seu uso
                ATENÇÃO AOS CUIDADOS COM SUA LENTE:
                1. Higiene das Mãos:
                - Lave e seque bem as mãos antes de manusear as lentes.
                2. Colocação das Lentes:
                - Verifique se a lente está limpa e sem danos.
                - Coloque a lente no dedo indicador, puxe as pálpebras e coloque-a sobre o olho.
                - Pisque suavemente para ajustar a lente.
                3. Remoção das Lentes:
                - Lave as mãos antes de remover as lentes.
                - Puxe a pálpebra inferior e use o polegar e o indicador para pinçar e retirar a lente.
                4. Armazenamento:
                - Para lentes GELATINOSAS (coloridas e incolores, mensais e anuais): use sempre solução
                recomendada para armazenamento, indicamos o uso da solução Renu.
                - Para lentes RÍGIDAS E ESCLERAIS: use sempre solução recomendada para armazenamento,
                indicamos o uso diário da solução Boston Simplus.
                - Troque a solução do estojo a cada remoção das lentes.
                5. Tempo de Uso:
                - Seguir as orientações do fabricante.
                - Respeite o prazo de validade das suas lentes, para evitar infecções.
                6. Cuidados Adicionais:
                - Evite dormir com lentes (a menos que orientado e discutido com seu médico).
                - Não use lentes danificadas ou mal higienizadas.
                - Evite nadar com as lentes.
                7. Sinais de Alerta:
                - Remova as lentes imediatamente e consulte-nos se você sentir:
                ▪ Dor, vermelhidão ou irritação nos olhos.
                ▪ Visão embaçada ou halos ao redor das luzes.
                ▪ Sensibilidade à luz.
                ▪ Secreção ou lacrimejamento excessivo.
                8. Consultas Regulares:
                - Agende consultas oftalmológicas regulares para monitorar a saúde dos seus olhos e garantir
                que suas lentes de contato continuem adequadas para você. A frequência das consultas será
                definida pelo seu oftalmologista
                Caso tenha qualquer dúvida ou precise de assistência, não hesite em nos contatar por aqui ou
                por nosso instagram https://www.instagram.com/eyecentermanaus?igsh=ajkwZTVsaG0xZnJt
                Desejamos que as lentes atendam suas expectativas e que você tenha uma excelente
                experiência com ele.
                Atenciosamente,
                EYE CENTER.
                "
        );
    }
}
