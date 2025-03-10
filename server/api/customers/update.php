
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database connection and JWT utilities
$conn = require '../../config/database.php';
require_once '../../vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Get authorization header
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

// Get customer ID from URL
$customerId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($customerId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Customer ID is required']);
    exit();
}

$jwt = $matches[1];
$secret = getenv('JWT_SECRET') ?: 'your_default_jwt_secret';

try {
    // Decode token
    $decoded = JWT::decode($jwt, new Key($secret, 'HS256'));
    $userId = $decoded->user_id;
    
    // Get request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Customer name is required']);
        exit();
    }
    
    // Update customer
    $stmt = $conn->prepare("
        UPDATE customers
        SET name = ?, email = ?, phone = ?, address = ?, gst_no = ?
        WHERE id = ? AND user_id = ?
    ");
    
    $name = $data['name'];
    $email = $data['email'] ?? '';
    $phone = $data['phone'] ?? '';
    $address = $data['address'] ?? '';
    $gstNo = $data['gstNo'] ?? '';
    
    $stmt->bind_param(
        "sssssii", 
        $name, $email, $phone, $address, $gstNo, $customerId, $userId
    );
    
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Customer not found or no changes made']);
        exit();
    }
    
    echo json_encode([
        'id' => $customerId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'address' => $address,
        'gstNo' => $gstNo
    ]);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
