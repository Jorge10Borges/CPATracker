<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';


// Filtrado por rango de fechas si se reciben los parámetros start y end
$whereFecha = "";
if (isset($_GET['start']) && isset($_GET['end'])) {
    $start = $_GET['start'] . " 00:00:00";
    $end = $_GET['end'] . " 23:59:59";
    $whereFecha = " AND et.fecha_hora BETWEEN '" . $conn->real_escape_string($start) . "' AND '" . $conn->real_escape_string($end) . "'";
}

$sql = "
SELECT 
  r.id,
  r.nombre,
  r.descripcion,
  r.estado,
  r.parametro,
  COUNT(et.id) AS visitas,
  COUNT(DISTINCT et.ip) AS visitas_unicas,
  SUM(et.is_click) AS clics,
  SUM(et.is_conversion) AS conversiones,
  SUM(et.conversion_value) AS ingresos,
  SUM(0) AS costo,
  SUM(et.conversion_value) AS beneficio
FROM redes r
LEFT JOIN eventos_tracking et ON et.id_red = r.id
WHERE r.excluir = 0 
    " . ($whereFecha ? "AND 1=1 $whereFecha" : "") . "
GROUP BY r.id, r.nombre, r.descripcion, r.estado, r.parametro
ORDER BY r.nombre
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
