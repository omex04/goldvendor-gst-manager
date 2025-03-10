
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
    
    // Get invoice for the user
    $stmt = $conn->prepare("
        SELECT i.*, c.name as customer_name, c.gst_no as customer_gst,
        c.address as customer_address, c.phone as customer_phone,
        c.email as customer_email
        FROM invoices i
        JOIN customers c ON i.customer_id = c.id
        WHERE i.id = ? AND i.user_id = ?
    ");
    $stmt->bind_param("ii", $invoiceId, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Invoice not found']);
        exit();
    }
    
    $row = $result->fetch_assoc();
    
    // Format invoice data
    $invoice = [
        'id' => $row['id'],
        'invoiceNumber' => $row['invoice_number'],
        'date' => $row['date'],
        'dueDate' => $row['due_date'],
        'paidDate' => $row['paid_date'],
        'status' => $row['status'],
        'subtotal' => (float)$row['subtotal'],
        'cgstRate' => (float)$row['cgst_rate'],
        'cgstTotal' => (float)$row['cgst_total'],
        'sgstRate' => (float)$row['sgst_rate'],
        'sgstTotal' => (float)$row['sgst_total'],
        'grandTotal' => (float)$row['grand_total'],
        'notes' => $row['notes'],
        'customer' => [
            'id' => $row['customer_id'],
            'name' => $row['customer_name'],
            'gstNo' => $row['customer_gst'],
            'address' => $row['customer_address'],
            'phone' => $row['customer_phone'],
            'email' => $row['customer_email']
        ]
    ];
    
    // Get invoice items
    $itemsStmt = $conn->prepare("
        SELECT * FROM invoice_items 
        WHERE invoice_id = ?
    ");
    $itemsStmt->bind_param("i", $invoiceId);
    $itemsStmt->execute();
    $itemsResult = $itemsStmt->get_result();
    
    $items = [];
    while ($item = $itemsResult->fetch_assoc()) {
        $items[] = [
            'id' => $item['id'],
            'description' => $item['description'],
            'quantity' => (float)$item['quantity'],
            'unit' => $item['unit'],
            'price' => (float)$item['price'],
            'total' => (float)$item['total']
        ];
    }
    $invoice['items'] = $items;
    
    echo json_encode($invoice);
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
