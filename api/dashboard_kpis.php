<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/config_db.php';

// KPIs globales para el dashboard
$sql = "SELECT
  COUNT(*) AS visitas,
  SUM(is_click) AS clics,
  SUM(is_conversion) AS conversiones,
  SUM(conversion_value) AS ingresos,
  SUM(CASE WHEN is_click=1 THEN 1 ELSE 0 END) AS total_clics,
  SUM(CASE WHEN is_conversion=1 THEN 1 ELSE 0 END) AS total_conversiones,
  SUM(0) AS costo, -- Ajusta si tienes campo de costo
  SUM(conversion_value) - SUM(0) AS beneficio, -- Ajusta si tienes campo de costo
  CASE WHEN SUM(0) > 0 THEN CONCAT(ROUND((SUM(conversion_value) - SUM(0)) / SUM(0) * 100, 2), '%') ELSE 'N/A' END AS roi
FROM eventos_tracking";

$result = $conn->query($sql);
$data = $result ? $result->fetch_assoc() : [];
if ($result) $result->free();
$conn->close();
echo json_encode($data, JSON_UNESCAPED_UNICODE);
