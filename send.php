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
    'message' => ''
];

try {
    // Get POST data
    $name = trim($_POST['name'] ?? '');
    $phone = trim($_POST['phone'] ?? ''); // Used as last name
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Validation
    if (empty($name) || strlen($name) < 2) {
        $response['message'] = 'Please enter a valid first name';
        echo json_encode($response);
        exit;
    }

    if (empty($phone) || strlen($phone) < 2) {
        $response['message'] = 'Please enter a valid last name';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address';
        echo json_encode($response);
        exit;
    }

    if (empty($message) || strlen($message) < 10) {
        $response['message'] = 'Message must be at least 10 characters long';
        echo json_encode($response);
        exit;
    }

    // Store in session (simulate sending)
    if (!isset($_SESSION['contact_messages'])) {
        $_SESSION['contact_messages'] = [];
    }

    $_SESSION['contact_messages'][] = [
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'message' => $message,
        'created_at' => date('Y-m-d H:i:s')
    ];

    // Success response
    $response['success'] = true;
    $response['message'] = 'Message sent successfully!';

    echo json_encode($response);

} catch (Exception $e) {
    $response['message'] = 'An unexpected error occurred. Please try again.';
    echo json_encode($response);
}
?>
