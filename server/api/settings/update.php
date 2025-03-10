
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
    
    // Get request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid request data']);
        exit();
    }
    
    // Check if settings exist for this user
    $checkStmt = $conn->prepare("
        SELECT id FROM settings
        WHERE user_id = ?
    ");
    $checkStmt->bind_param("i", $userId);
    $checkStmt->execute();
    $checkResult = $checkStmt->get_result();
    
    // Get the section parameter from URL
    $section = isset($_GET['section']) ? $_GET['section'] : null;
    
    if ($checkResult->num_rows === 0) {
        // Create new settings
        $defaultSettings = [
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
        ];
        
        // If updating a specific section
        if ($section && isset($defaultSettings[$section])) {
            $defaultSettings[$section] = $data;
        } else {
            // Full update
            $defaultSettings = array_merge($defaultSettings, $data);
        }
        
        $settingsJson = json_encode($defaultSettings);
        
        $insertStmt = $conn->prepare("
            INSERT INTO settings (user_id, settings_json)
            VALUES (?, ?)
        ");
        $insertStmt->bind_param("is", $userId, $settingsJson);
        $insertStmt->execute();
        
        echo json_encode($defaultSettings);
        
    } else {
        // Update existing settings
        $row = $checkResult->fetch_assoc();
        $settingsId = $row['id'];
        
        // Get current settings
        $getStmt = $conn->prepare("
            SELECT settings_json FROM settings
            WHERE id = ?
        ");
        $getStmt->bind_param("i", $settingsId);
        $getStmt->execute();
        $getResult = $getStmt->get_result();
        $settingsRow = $getResult->fetch_assoc();
        
        $currentSettings = json_decode($settingsRow['settings_json'], true);
        
        // If updating a specific section
        if ($section && isset($currentSettings[$section])) {
            $currentSettings[$section] = $data;
        } else {
            // Full update
            $currentSettings = array_merge($currentSettings, $data);
        }
        
        $settingsJson = json_encode($currentSettings);
        
        $updateStmt = $conn->prepare("
            UPDATE settings
            SET settings_json = ?
            WHERE id = ?
        ");
        $updateStmt->bind_param("si", $settingsJson, $settingsId);
        $updateStmt->execute();
        
        echo json_encode($currentSettings);
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token: ' . $e->getMessage()]);
}

$conn->close();
?>
