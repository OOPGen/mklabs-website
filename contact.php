<?php
// MKLabs DIRECT Inquiry Handler - Sends DIRECTLY to info@mklabs.co.zw, support@mklabs.co.zw, mklabs.techzw@gmail.com + WhatsApp 0786 233 766
// For cPanel - Bulawayo - Business Hours Mon-Fri 8am-5pm
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$to = "info@mklabs.co.zw, support@mklabs.co.zw, mklabs.techzw@gmail.com"; // DIRECT TO ALL OFFICIAL EMAILS
$to_single = "info@mklabs.co.zw";
$whatsapp_number = "263786233766";

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) $input = $_POST;

$name = trim($input['name'] ?? '');
$company = trim($input['company'] ?? '');
$email = trim($input['email'] ?? '');
$phone = trim($input['phone'] ?? '');
$service = trim($input['service'] ?? '');
$budget = trim($input['budget'] ?? '');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode(['success'=>false, 'error'=>'Name, email and message required']);
    exit;
}

$date = date('Y-m-d H:i:s');
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

$csvFile = __DIR__ . '/inquiries.csv';
$isNew = !file_exists($csvFile);
$fp = fopen($csvFile, 'a');
if ($isNew) {
    fputcsv($fp, ['Date','Time','Name','Company','Email','Phone','Service','Budget','Message','IP','Sent To']);
}
fputcsv($fp, [date('Y-m-d'), date('H:i:s'), $name, $company, $email, $phone, $service, $budget, $message, $ip, $to]);
fclose($fp);

$subject = "🚀 NEW MKLabs Inquiry - $service - $name - Bulawayo";

$body = "CONTACT MKLABS - New Inquiry\n".
        "We're here to help you build, deploy, and support your business software.\n\n".
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n".
        "FROM: https://mklabs.co.zw | $date | Bulawayo\n".
        "BUSINESS HOURS: Monday-Friday 8am-5pm (CAT)\n".
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n".
        "VISITOR DETAILS:\n".
        "Name: $name\n".
        "Company/School: $company\n".
        "Email: $email\n".
        "Phone/WhatsApp: $phone\n".
        "Service: $service\n".
        "Budget: $budget\n\n".
        "MESSAGE / DEMO REQUEST:\n".
        "$message\n\n".
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n".
        "REPLY OPTIONS:\n".
        "• Reply to Email: $email\n".
        "• Call/WhatsApp: $phone => https://wa.me/".preg_replace('/[^0-9]/','',$phone)."\n".
        "• General Enquiries: info@mklabs.co.zw\n".
        "• Technical Support: support@mklabs.co.zw\n".
        "• View all: /inquiries.csv + https://mklabs.co.zw/admin.html\n";

$headers = "From: MKLabs Website <noreply@mklabs.co.zw>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Cc: support@mklabs.co.zw, mklabs.techzw@gmail.com\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to_single, $subject, $body, $headers);
@mail("support@mklabs.co.zw", $subject, $body, $headers);
@mail("mklabs.techzw@gmail.com", $subject, $body, $headers);

echo json_encode([
    'success'=>true, 
    'message'=>'Inquiry received DIRECTLY!',
    'sent_to'=>"info@mklabs.co.zw, support@mklabs.co.zw, mklabs.techzw@gmail.com",
    'sent_to_whatsapp'=>$whatsapp_number,
    'business_hours'=>"Monday-Friday 8am-5pm",
    'whatsapp_draft_url'=>"https://wa.me/$whatsapp_number?text=".urlencode("New inquiry from $name ($phone) - $service: $message")
]);
?>
