
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

if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['name'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Name, email, and password are required']);
    exit();
}

// Include database connection
$conn = require '../../config/database.php';
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;

// Check if user already exists
$email = $conn->real_escape_string($data['email']);
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    http_response_code(409);
    echo json_encode(['error' => 'User with this email already exists']);
    exit();
}

// Hash password
$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

// Insert user into database
$name = $conn->real_escape_string($data['name']);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $passwordHash);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to create user']);
    exit();
}

$userId = $stmt->insert_id;

// Generate JWT token
$secret = getenv('JWT_SECRET') ?: 'your_default_jwt_secret';
$issuedAt = time();
$expirationTime = $issuedAt + 60 * 60 * 24; // 24 hours
$payload = [
    'iat' => $issuedAt,
    'exp' => $expirationTime,
    'user_id' => $userId
];

$jwt = JWT::encode($payload, $secret, 'HS256');

// Return user data and token
echo json_encode([
    'user' => [
        'id' => $userId,
        'name' => $data['name'],
        'email' => $data['email']
    ],
    'token' => $jwt
]);

$stmt->close();
$conn->close();
?>
