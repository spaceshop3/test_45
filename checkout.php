<?php
session_start();
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
http_response_code(200);

// Response array
$response = [
    'success' => false,
    'message' => '',
    'order_id' => null
];

try {
    // Check if user is logged in
    if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
        $response['message'] = 'Please login to complete your purchase';
        $response['redirect'] = 'login';
        echo json_encode($response);
        exit;
    }

    // Get POST data
    $cartData = $_POST['cart'] ?? '';
    $subtotal = floatval($_POST['subtotal'] ?? 0);
    $taxes = floatval($_POST['taxes'] ?? 0);
    $total = floatval($_POST['total'] ?? 0);

    // Validate cart data
    if (empty($cartData)) {
        $response['message'] = 'Your cart is empty';
        echo json_encode($response);
        exit;
    }

    // Decode cart data
    $cart = json_decode($cartData, true);
    
    if (!is_array($cart) || empty($cart)) {
        $response['message'] = 'Invalid cart data';
        echo json_encode($response);
        exit;
    }

    // Validate amounts
    if ($total <= 0) {
        $response['message'] = 'Invalid order total';
        echo json_encode($response);
        exit;
    }

    $orderId = uniqid('order_', true);
    
    if (!isset($_SESSION['orders'])) {
        $_SESSION['orders'] = [];
    }
    
    $_SESSION['orders'][$orderId] = [
        'order_id' => $orderId,
        'user_id' => $_SESSION['user_id'],
        'cart' => $cart,
        'subtotal' => $subtotal,
        'taxes' => $taxes,
        'total' => $total,
        'status' => 'pending',
        'created_at' => date('Y-m-d H:i:s')
    ];

    // Success response
    $response['success'] = true;
    $response['message'] = 'Order placed successfully!';
    $response['order_id'] = $orderId;
    $response['redirect'] = './tickets.html?success=1';

    echo json_encode($response);

} catch (Exception $e) {
    $response['message'] = 'An unexpected error occurred. Please try again.';
    echo json_encode($response);
}
?>
