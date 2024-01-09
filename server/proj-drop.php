<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include 'connect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$sql = "DROP TABLE `Order_Item`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Order_Item Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `Truck`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Truck Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `Trip`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Trip Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `Payment`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Payment Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `Reviews`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Reviews Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE Item";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Item Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `Orders`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table Orders Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$sql = "DROP TABLE `User`;";
if ($conn->query($sql) === TRUE) {
    echo "</br>";
    echo "Table User Dropped!";
} else {
    echo "Error dropping table: " . $conn->error;
}

$conn->close();
