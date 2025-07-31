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
$id = trim($data['id'] ?? '');
$nombre = trim($data['nombre'] ?? '');
$estado = trim($data['estado'] ?? 'activa');
$parametro = trim($data['parametro'] ?? '');

if ($id === '' || $nombre === '') {
    http_response_code(400);
    echo json_encode(['error' => 'ID y nombre son obligatorios']);
    exit;
}

$sql = "UPDATE redes SET nombre = ?, estado = ?, parametro = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
if ($stmt) {
    $stmt->bind_param('ssss', $nombre, $estado, $parametro, $id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar la red']);
    }
    $stmt->close();
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error en la consulta']);
}
$conn->close();
