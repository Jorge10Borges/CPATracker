<?php
// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Responder a preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config_db.php';


// Filtrado por rango de fechas si se reciben los parámetros start y end
$whereFecha = "";
if (isset($_GET['start']) && isset($_GET['end'])) {
    $start = $_GET['start'] . " 00:00:00";
    $end = $_GET['end'] . " 23:59:59";
    $whereFecha = " WHERE fecha_hora BETWEEN '" . $conn->real_escape_string($start) . "' AND '" . $conn->real_escape_string($end) . "'";
}

$sql = "SELECT
  DATE(fecha_hora) as fecha,
  COUNT(*) as visitas,
  SUM(is_click) as clics,
  SUM(is_conversion) as conversiones,
  SUM(conversion_value) as ingresos
FROM eventos_tracking
" . $whereFecha . "
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
