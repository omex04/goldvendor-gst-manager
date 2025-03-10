
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
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

$jwt = $matches[1];
$secret = getenv('JWT_SECRET') ?: 'your_default_jwt_secret';

try {
    // Decode token
    $decoded = JWT::decode($jwt, new Key($secret, 'HS256'));
    $userId = $decoded->user_id;
    
    // Get settings for the user
    $stmt = $conn->prepare("
        SELECT * FROM settings
        WHERE user_id = ?
    ");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // Return default settings if none exist
        echo json_encode([
            'vendor' => [
                'name' => '',
                'address' => '',
                'phone' => '',
                'email' => '',
                'gstNo' => ''
            ],
            'bank' => [
                'name' => '',
                'accountNo' => '',
                'ifsc' => '',
                'branch' => ''
            ],
            'gst' => [
                'cgstRate' => 1.5,
                'sgstRate' => 1.5
            ],
            'preferences' => [
                'invoicePrefix' => 'INV-',
                'nextInvoiceNumber' => 1001
            ]
        ]);
        exit();
    }
    
    $row = $result->fetch_assoc();
    $settings = json_decode($row['settings_json'], true);
    
    echo json_encode($settings);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
