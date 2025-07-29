<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

// Consulta agregada por campaña
$sql = "
SELECT 
  c.id,
  c.nombre,
  c.descripcion,
  c.estado,
  c.fecha_inicio,
  c.fecha_fin,
  COUNT(et.id) AS visitas,
  COUNT(DISTINCT et.ip) AS visitas_unicas,
  SUM(et.is_click) AS clics,
  SUM(et.is_conversion) AS conversiones,
  SUM(et.conversion_value) AS ingresos,
  SUM(0) AS costo,
  SUM(et.conversion_value) AS beneficio
FROM campanias c
LEFT JOIN eventos_tracking et ON et.id_campania = c.id
GROUP BY c.id, c.nombre, c.descripcion, c.estado, c.fecha_inicio, c.fecha_fin
ORDER BY c.nombre
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
