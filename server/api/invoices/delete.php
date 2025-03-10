
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

// Get invoice ID from URL
$invoiceId = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($invoiceId === 0) {
    http_response_code(400);
    echo json_encode(['error' => 'Invoice ID is required']);
    exit();
}

$jwt = $matches[1];
$secret = getenv('JWT_SECRET') ?: 'your_default_jwt_secret';

try {
    // Decode token
    $decoded = JWT::decode($jwt, new Key($secret, 'HS256'));
    $userId = $decoded->user_id;
    
    // Start transaction
    $conn->begin_transaction();
    
    try {
        // Delete invoice items first
        $itemsStmt = $conn->prepare("
            DELETE FROM invoice_items 
            WHERE invoice_id = ?
        ");
        $itemsStmt->bind_param("i", $invoiceId);
        $itemsStmt->execute();
        
        // Delete invoice
        $stmt = $conn->prepare("
            DELETE FROM invoices 
            WHERE id = ? AND user_id = ?
        ");
        $stmt->bind_param("ii", $invoiceId, $userId);
        $stmt->execute();
        
        if ($stmt->affected_rows === 0) {
            // Rollback if invoice not found
            $conn->rollback();
            http_response_code(404);
            echo json_encode(['error' => 'Invoice not found']);
            exit();
        }
        
        // Commit transaction
        $conn->commit();
        echo json_encode(['message' => 'Invoice deleted successfully']);
        
    } catch (Exception $e) {
        // Rollback on error
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete invoice']);
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
