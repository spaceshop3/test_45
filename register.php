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
    'redirect' => '',
    'showEmailConfirm' => false
];

try {
    // Get POST data
    $name = trim($_POST['fullname'] ?? $_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Validation
    if (empty($name) || strlen($name) < 2) {
        $response['message'] = 'Please enter a valid name (at least 2 characters)';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address';
        echo json_encode($response);
        exit;
    }

    if (strlen($password) < 6) {
        $response['message'] = 'Password must be at least 6 characters long';
        echo json_encode($response);
        exit;
    }

    if (!isset($_SESSION['registered_users'])) {
        $_SESSION['registered_users'] = [];
    }

    // Check if email already exists
    foreach ($_SESSION['registered_users'] as $user) {
        if ($user['email'] === $email) {
            $response['message'] = 'Email already registered. Please login.';
            echo json_encode($response);
            exit;
        }
    }

    // Store new user
    $_SESSION['registered_users'][] = [
        'name' => $name,
        'email' => $email,
        'password' => $password, // In real app, use password_hash()
        'email_confirmed' => false, // User needs to confirm email
        'created_at' => date('Y-m-d H:i:s')
    ];

    // Success response with email confirmation popup trigger
    $response['success'] = true;
    $response['message'] = 'Account created successfully!';
    $response['showEmailConfirm'] = true;
    $response['redirect'] = './login.html';

    echo json_encode($response);

} catch (Exception $e) {
    $response['message'] = 'An unexpected error occurred. Please try again.';
    echo json_encode($response);
}
?>
