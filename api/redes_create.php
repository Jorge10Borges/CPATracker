<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$nombre = trim($data['nombre'] ?? '');
$estado = trim($data['estado'] ?? 'activa');
$parametro = trim($data['parametro'] ?? '');

if ($nombre === '') {
    http_response_code(400);
    echo json_encode(['error' => 'El nombre es obligatorio']);
    exit;
}

$id = uniqid('red_', true);
$sql = "INSERT INTO redes (id, nombre, estado, parametro) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param('ssss', $id, $nombre, $estado, $parametro);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'id' => $id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear la red']);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta']);
}
$conn->close();
