<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *"); // or use React origin
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$logFile = __DIR__ . "/php_debug.log";
file_put_contents($logFile, "[" . date("Y-m-d H:i:s") . "] Incoming request\n", FILE_APPEND);

// Get and log raw input
$rawInput = file_get_contents("php://input");
file_put_contents($logFile, "Raw Input: $rawInput\n", FILE_APPEND);

$input = json_decode($rawInput, true);
$employeeNo = $input['employeeNo'] ?? '';
$password = $input['password'] ?? '';

if (!$employeeNo || !$password) {
    file_put_contents($logFile, "Missing credentials\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Missing credentials']);
    exit;
}

// LDAP connection info
$ldap_host = '10.180.0.21';
$ldap_port = 389;
$ldap_dn = "uid=$employeeNo,ou=People,dc=bl,ou=User,dc=cdac,dc=in";

file_put_contents($logFile, "Connecting to $ldap_host:$ldap_port\n", FILE_APPEND);
$ldap_conn = ldap_connect($ldap_host, $ldap_port);

if (!$ldap_conn) {
    file_put_contents($logFile, "LDAP connection failed\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'LDAP connection failed']);
    exit;
}

ldap_set_option($ldap_conn, LDAP_OPT_PROTOCOL_VERSION, 3);
ldap_set_option($ldap_conn, LDAP_OPT_REFERRALS, 0);

// Try to bind
file_put_contents($logFile, "Binding with DN: $ldap_dn\n", FILE_APPEND);
if (@ldap_bind($ldap_conn, $ldap_dn, $password)) {
    file_put_contents($logFile, "LDAP bind successful\n", FILE_APPEND);

    $search = ldap_search($ldap_conn, $ldap_dn, "(uid=$employeeNo)", ['givenName', 'sn', 'mail']);
    $entries = ldap_get_entries($ldap_conn, $search);

    $firstName = $entries[0]['givenname'][0] ?? '';
    $lastName = $entries[0]['sn'][0] ?? '';
    $email = $entries[0]['mail'][0] ?? '';

    echo json_encode([
        'success' => true,
        'user' => [
            'employeeNo' => $employeeNo,
            'firstName'  => $firstName,
            'lastName'   => $lastName,
            'email'      => $email
        ]
    ]);
} else {
    file_put_contents($logFile, "LDAP bind failed\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
}

ldap_unbind($ldap_conn);
