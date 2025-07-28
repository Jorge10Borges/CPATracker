<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $sql = "SELECT id, nombre, descripcion, fecha_inicio, fecha_fin, estado, id_oferta, id_fuente, id_flow, id_red, id_pagina_destino, presupuesto FROM campanias ORDER BY nombre";
        $result = $conn->query($sql);
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
            $result->free();
        }
        echo json_encode($rows, JSON_UNESCAPED_UNICODE);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
}
$conn->close();
