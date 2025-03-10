
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
        // Get all invoices for the user
        $stmt = $conn->prepare("
            SELECT i.*, c.name as customer_name, c.gst_no as customer_gst 
            FROM invoices i
            JOIN customers c ON i.customer_id = c.id
            WHERE i.user_id = ?
            ORDER BY i.created_at DESC
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $invoices = [];
        while ($row = $result->fetch_assoc()) {
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
                    'gstNo' => $row['customer_gst']
                ]
            ];
            
            // Get invoice items
            $itemsStmt = $conn->prepare("
                SELECT * FROM invoice_items 
                WHERE invoice_id = ?
            ");
            $itemsStmt->bind_param("i", $row['id']);
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
            $invoices[] = $invoice;
            $itemsStmt->close();
        }
        
        echo json_encode($invoices);
        
    } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Create a new invoice
        $data = json_decode(file_get_contents('php://input'), true);
        
        // Start transaction
        $conn->begin_transaction();
        
        try {
            // Insert invoice
            $stmt = $conn->prepare("
                INSERT INTO invoices (
                    user_id, customer_id, invoice_number, date, due_date, 
                    status, subtotal, cgst_rate, cgst_total, sgst_rate, 
                    sgst_total, grand_total, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            $date = date('Y-m-d', strtotime($data['date']));
            $dueDate = !empty($data['dueDate']) ? date('Y-m-d', strtotime($data['dueDate'])) : null;
            $customerId = $data['customer']['id'];
            $invoiceNumber = $data['invoiceNumber'];
            $status = $data['status'];
            $subtotal = $data['subtotal'];
            $cgstRate = $data['cgstRate'];
            $cgstTotal = $data['cgstTotal'];
            $sgstRate = $data['sgstRate'];
            $sgstTotal = $data['sgstTotal'];
            $grandTotal = $data['grandTotal'];
            $notes = $data['notes'] ?? '';
            
            $stmt->bind_param(
                "iissssdddddds", 
                $userId, $customerId, $invoiceNumber, $date, $dueDate, 
                $status, $subtotal, $cgstRate, $cgstTotal, $sgstRate, 
                $sgstTotal, $grandTotal, $notes
            );
            $stmt->execute();
            $invoiceId = $stmt->insert_id;
            
            // Insert invoice items
            foreach ($data['items'] as $item) {
                $itemStmt = $conn->prepare("
                    INSERT INTO invoice_items (
                        invoice_id, description, quantity, unit, price, total
                    ) VALUES (?, ?, ?, ?, ?, ?)
                ");
                
                $description = $item['description'];
                $quantity = $item['quantity'];
                $unit = $item['unit'];
                $price = $item['price'];
                $total = $item['total'];
                
                $itemStmt->bind_param(
                    "isdsdd",
                    $invoiceId, $description, $quantity, $unit, $price, $total
                );
                $itemStmt->execute();
                $itemStmt->close();
            }
            
            // Commit transaction
            $conn->commit();
            
            echo json_encode(['id' => $invoiceId]);
            
        } catch (Exception $e) {
            // Rollback transaction on error
            $conn->rollback();
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create invoice: ' . $e->getMessage()]);
        }
    }
    
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid token']);
}

$conn->close();
?>
