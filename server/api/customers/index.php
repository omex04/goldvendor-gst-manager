
<?php
// Allow cross-origin requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
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
    
    // Process based on request method
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get all customers for the user
        $stmt = $conn->prepare("
            SELECT * FROM customers
            WHERE user_id = ?
            ORDER BY name ASC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $customers = [];
        while ($row = $result->fetch_assoc()) {
            $customers[] = [
                'id' => $row['id'],
                'name' => $row['name'],
                'email' => $row['email'],
                'phone' => $row['phone'],
                'address' => $row['address'],
                'gstNo' => $row['gst_no']
            ];
        }
        
        echo json_encode($customers);
        
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new customer
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Customer name is required']);
            exit();
        }
        
        $stmt = $conn->prepare("
            INSERT INTO customers (
                user_id, name, email, phone, address, gst_no
            ) VALUES (?, ?, ?, ?, ?, ?)
        ");
        
        $name = $data['name'];
        $email = $data['email'] ?? '';
        $phone = $data['phone'] ?? '';
        $address = $data['address'] ?? '';
        $gstNo = $data['gstNo'] ?? '';
        
        $stmt->bind_param(
            "isssss", 
            $userId, $name, $email, $phone, $address, $gstNo
        );
        
        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create customer']);
            exit();
        }
        
        $customerId = $stmt->insert_id;
        
        echo json_encode([
            'id' => $customerId,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'address' => $address,
            'gstNo' => $gstNo
        ]);
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
