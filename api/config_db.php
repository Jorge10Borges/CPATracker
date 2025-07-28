<?php
// Configuración de la base de datos
$host = '192.168.0.200';
$db = 'cpatracker';
$user = 'jorge10borges';
$pass = 'Ve*11818946';

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Error de conexión a la base de datos']);
    exit;
}
// Recuerda cerrar la conexión con $conn->close() al final de cada script que lo incluya.
