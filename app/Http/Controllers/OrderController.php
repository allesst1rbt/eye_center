<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Services\OrderNotificationService;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderNotificationService $notificationService) {}

    public function index(Request $request)
    {
        $orders = Order::orderBy('created_at', 'desc')
            ->paginate(perPage: $request->query('perPage', 15), page: $request->query('page', 1));

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all())->load('Term');

        if ($order->Term->expire_date === '2 dias') {
            $this->notificationService->notifyOrderExpiring($order);
        }

        $this->notificationService->notifyOrderCreated($order);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['lens', 'terms']));
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->all());

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }
}
