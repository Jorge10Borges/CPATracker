<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

// Recibe el nombre del token a agrupar (por defecto token1)
$token = isset($_GET['token']) ? $_GET['token'] : 'token1';
$token = preg_replace('/[^a-zA-Z0-9_]/', '', $token); // Sanitiza


// Filtrado por rango de fechas
$where = "";
if (isset($_GET['start']) && isset($_GET['end'])) {
    $start = $conn->real_escape_string($_GET['start'] . ' 00:00:00');
    $end = $conn->real_escape_string($_GET['end'] . ' 23:59:59');
    $where = "WHERE fecha_hora >= '$start' AND fecha_hora <= '$end'";
}

$sql = "
SELECT 
  COALESCE($token, 'empty') AS nombre,
  COUNT(id) AS visitas,
  COUNT(DISTINCT ip) AS visitas_unicas,
  SUM(is_click) AS clics,
  SUM(is_conversion) AS conversiones,
  SUM(conversion_value) AS ingresos,
  SUM(0) AS costo,
  SUM(conversion_value) AS beneficio
FROM eventos_tracking
$where
GROUP BY nombre
ORDER BY nombre
";

$result = $conn->query($sql);
$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Calcular métricas
        $row['CTR'] = ($row['visitas'] > 0) ? round($row['clics'] / $row['visitas'] * 100, 2) : 0;
        $row['CR'] = ($row['clics'] > 0) ? round($row['conversiones'] / $row['clics'] * 100, 2) : 0;
        $rows[] = $row;
    }
    $result->free();
}

echo json_encode($rows, JSON_UNESCAPED_UNICODE);
$conn->close();
