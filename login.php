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
    'redirect' => ''
];

try {
    // Get POST data
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']) ? true : false;

    // Validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address';
        echo json_encode($response);
        exit;
    }

    if (empty($password)) {
        $response['message'] = 'Please enter your password';
        echo json_encode($response);
        exit;
    }

    if (!isset($_SESSION['registered_users'])) {
        $_SESSION['registered_users'] = [];
    }

    $userFound = false;
    $emailConfirmed = false;
    $passwordCorrect = false;

    foreach ($_SESSION['registered_users'] as $user) {
        if ($user['email'] === $email) {
            $userFound = true;
            $emailConfirmed = $user['email_confirmed'];
            // Simple password check (in real app, use password_verify)
            if ($user['password'] === $password) {
                $passwordCorrect = true;
            }
            break;
        }
    }

    // Error responses based on validation
    if (!$userFound) {
        $response['message'] = 'Account not found. Please register first.';
        echo json_encode($response);
        exit;
    }

    if (!$passwordCorrect) {
        $response['message'] = 'Incorrect password. Please try again.';
        echo json_encode($response);
        exit;
    }

    if (!$emailConfirmed) {
        $response['message'] = 'Email not verified. Please check your email and verify your account.';
        echo json_encode($response);
        exit;
    }

    // All checks passed - login successful
    $_SESSION['user_id'] = uniqid('user_', true);
    $_SESSION['user_name'] = explode('@', $email)[0];
    $_SESSION['user_email'] = $email;
    $_SESSION['logged_in'] = true;
    $_SESSION['login_at'] = date('Y-m-d H:i:s');

    if ($remember) {
        setcookie('remember_user', $email, time() + (86400 * 30), '/'); // 30 days
    }

    // Success response
    $response['success'] = true;
    $response['message'] = 'Login successful!';
    $response['redirect'] = './tickets.html';

    echo json_encode($response);

} catch (Exception $e) {
    $response['message'] = 'An unexpected error occurred. Please try again.';
    echo json_encode($response);
}
?>
