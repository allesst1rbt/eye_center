<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrderRequest;
use App\Http\Requests\UpdateOrderRequest;
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

    public function store(StoreOrderRequest $request)
    {
        $order = Order::create($request->validated())->load('Term');

        if ($order->Term->expire_date === '2 dias') {
            $this->notificationService->notifyOrderExpiring($order);
        }

        $this->notificationService->notifyOrderCreated($order);

        return response()->json($order, 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['Lens', 'Term']));
    }

    public function update(UpdateOrderRequest $request, Order $order)
    {
        $order->update($request->validated());

        return response()->json($order);
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->json(null, 204);
    }
}
