
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email and password are required']);
    exit();
}

// Include database connection
$conn = require '../../config/database.php';
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;

// Get user from database
$email = $conn->real_escape_string($data['email']);
$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit();
}

$user = $result->fetch_assoc();

// Verify password
if (!password_verify($data['password'], $user['password'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid credentials']);
    exit();
}

// Generate JWT token
$secret = getenv('JWT_SECRET') ?: 'your_default_jwt_secret';
$issuedAt = time();
$expirationTime = $issuedAt + 60 * 60 * 24; // 24 hours
$payload = [
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'user_id' => $user['id']
];

$jwt = JWT::encode($payload, $secret, 'HS256');

// Remove password from user data
unset($user['password']);

// Return user data and token
echo json_encode([
    'user' => $user,
    'token' => $jwt
]);

$stmt->close();
$conn->close();
?>
