<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

// Series de visitas, clics y conversiones por día para el gráfico de líneas
$sql = "SELECT
  DATE(fecha_hora) as fecha,
  COUNT(*) as visitas,
  SUM(is_click) as clics,
  SUM(is_conversion) as conversiones,
  SUM(conversion_value) as ingresos
FROM eventos_tracking
GROUP BY DATE(fecha_hora)
ORDER BY fecha";

$result = $conn->query($sql);
$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    $result->free();
}
$conn->close();
echo json_encode($rows, JSON_UNESCAPED_UNICODE);
