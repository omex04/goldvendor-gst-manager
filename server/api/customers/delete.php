
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
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
    
    // Check if customer has invoices
    $checkStmt = $conn->prepare("
        SELECT COUNT(*) as count FROM invoices
        WHERE customer_id = ?
    ");
    $checkStmt->bind_param("i", $customerId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    $row = $checkResult->fetch_assoc();
    
    if ($row['count'] > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Cannot delete customer with invoices']);
        exit();
    }
    
    // Delete customer
    $stmt = $conn->prepare("
        DELETE FROM customers
        WHERE id = ? AND user_id = ?
    ");
    $stmt->bind_param("ii", $customerId, $userId);
    $stmt->execute();
    
    if ($stmt->affected_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Customer not found']);
        exit();
    }
    
    echo json_encode(['message' => 'Customer deleted successfully']);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
