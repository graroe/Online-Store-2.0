<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

include 'connect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

//ORDERS TABLE
$sql = "CREATE TABLE `Orders` (
    `Order_Id` INT(6) NOT NULL AUTO_INCREMENT,
    `Date_Issued` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `Est_Delivery_Date` DATE,
    `Total_Price` DECIMAL(10,2) ,
    `Subtotal` DECIMAL(10,2) ,
    `Payment_Id` INT(6) UNIQUE,
    `User_Id` INT(6) NOT NULL,
    `Trip_Id` INT(6) UNIQUE,
    `Receipt_Id` INT(5) UNIQUE,
    `Submitted` BOOLEAN NOT NULL,
    PRIMARY KEY (`Order_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Orders created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//ITEM TABLE
$sql = "CREATE TABLE `Item` (
    `Item_Id` INT(6) NOT NULL UNIQUE,
    `Item_name` VARCHAR(255) NOT NULL,
    `Price` DECIMAL(10,2) NOT NULL,
    `Made_in` VARCHAR(255),
    `Department_Code` INT(6) NOT NULL,
    PRIMARY KEY (`Item_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Item created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//REVIEWS TABLE
$sql = "CREATE TABLE `Reviews` (
    `review_id` INT(6) NOT NULL UNIQUE AUTO_INCREMENT,
    `Item_Id` INT(6) NOT NULL,
    `star_rating` VARCHAR(255) NOT NULL,
    `review` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`review_id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Reviews created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}


//USER TABLE
$sql = "CREATE TABLE `User` (
    `User_Id` INT(6) NOT NULL UNIQUE AUTO_INCREMENT,
    `Name` VARCHAR(255) NOT NULL,
    `Tel_no` VARCHAR(20),
    `Email` VARCHAR(255) UNIQUE,
    `Address` VARCHAR(255),
    `City_Code` VARCHAR(10),
    `Login_Id` VARCHAR(50) NOT NULL UNIQUE,
    `Password` VARCHAR(255) NOT NULL,
    `Admin` BOOLEAN NOT NULL,
     PRIMARY KEY (`User_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table User created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//TRIP TABLE
$sql = "CREATE TABLE `Trip` (
    `Trip_Id` INT(6) NOT NULL UNIQUE AUTO_INCREMENT,
    `Destination_Code` VARCHAR(10) NOT NULL,
    `Branch` VARCHAR(20) NOT NULL,
    `Express` BOOLEAN NOT NULL,
    `Truck_Id` INT(3),
    PRIMARY KEY (`Trip_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Trip created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//TRUCK TABLE
$sql = "CREATE TABLE `Truck` (
    `Truck_Id` INT(2) NOT NULL UNIQUE,
    `Truck_Code` VARCHAR(20) NOT NULL,
    `Availability_Code` INT(1) NOT NULL,
    PRIMARY KEY (`Truck_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Truck created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

//PAYMENT TABLE
$sql = "CREATE TABLE `Payment` (
    `Payment_Id` INT(6) NOT NULL UNIQUE AUTO_INCREMENT,
    `Card_Number` VARCHAR(16) NOT NULL UNIQUE,
    `Expiry_Date` VARCHAR(10) NOT NULL,
    `Cvv` VARCHAR(3) NOT NULL,
    PRIMARY KEY (`Payment_Id`)
    );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Payment created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}


//I created a new table called Order_Item with 
//foreign keys to the Orders and Item tables, 
//allowing you to track which items were ordered as part of each order.
$sql = "CREATE TABLE `Order_Item` (
    `Order_Id` INT(6) NOT NULL,
    `Item_Id` INT(6) NOT NULL,
    `Quantity` INT(6) NOT NULL,
    PRIMARY KEY (`Order_Id`, `Item_Id`)
  );";

if ($conn->query($sql) === TRUE) {
    echo "<br>";
    echo "Table Order Item created successfully";
} else {
    echo "Error creating table: " . $conn->error;
}

$sql = "ALTER TABLE `Orders`
        ADD FOREIGN KEY (`User_Id`) REFERENCES `User` (`User_Id`),
        ADD FOREIGN KEY (`Trip_Id`) REFERENCES `Trip` (`Trip_Id`),
        ADD FOREIGN KEY (`Payment_Id`) REFERENCES `Payment` (`Payment_Id`)";

try {
    $conn->query($sql);
    echo "<br>";
    echo "Orders table foreign keys added!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "ALTER TABLE `Order_Item`
        ADD FOREIGN KEY (`Order_Id`) REFERENCES `Orders` (`Order_Id`);";

try {
    $conn->query($sql);
    echo "<br>";
    echo "Order_Item table foreign keys added!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "ALTER TABLE `Reviews`
        ADD FOREIGN KEY (`Item_Id`) REFERENCES Item(`Item_Id`);";

try {
    $conn->query($sql);
    echo "<br>";
    echo "Reviews table foreign keys added!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "ALTER TABLE `Trip`
        ADD FOREIGN KEY (`Truck_Id`) REFERENCES `Truck` (`Truck_Id`)";
try {
    $conn->query($sql);
    echo "<br>";
    echo "Trip table foreign keys added!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}


//INSERT DUMMY VALUES

$sql = "INSERT INTO `item` (`Item_Id`, `Item_name`, `Price`, `Made_in`, `Department_Code`) 
        VALUES ('1', 'Iphone 14 Pro Max', '1549.00', 'Canada', '1'), 
        ('2', 'Macbook pro (M2 Pro)', '2999.00', 'Canada', '1'),
        ('3', 'Canon Camera', '699.00', 'Canada', '1'),
        ('4', 'Samsung 24-Inch Monitor', '139.99', 'Canada', '1'),
        ('5', 'Song Wireless Noise Cancelling Headphones', '399.99', 'Canada', '1'),
        ('6', 'Canon Imageclass Laser Printer', '149.98', 'Canada', '1'),
        ('7', 'Fujifilm Instax Mini 7', '89.98', 'Canada', '1'),
        ('8', 'Applewatch SE', '295.00', 'Canada', '1');";

try {
    $conn->query($sql);
    echo "<br>";
    echo "Item Table Populated!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "INSERT INTO `truck` (`Truck_Id`, `Truck_Code`, `Availability_Code`) 
        VALUES ('01', 'Toronto', '1'), 
        ('02', 'Markham', '1'),
        ('03', 'North York', '1'),
        ('04', 'Toronto', '1'),
        ('05', 'Markham', '1'),
        ('06', 'North York', '1'),
        ('07', 'Toronto', '1'),
        ('08', 'Markham', '1'),
        ('09', 'North York', '1');";

try {
    $conn->query($sql);
    echo "<br>";
    echo "Truck Table Populated!";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "INSERT INTO `user` (`Name`, `Tel_no`, `Email`, `Address`, `City_Code`, `Login_Id`, `Password`, `Admin`) 
        VALUES ('administrator1', '188-888-8888', 'admin1@hotmail.ca', '810 St Clair Ave W', 'Toronto', 'admin1', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '1'), 
        ('administrator2', '288-888-8888', 'admin2@hotmail.ca', '3148 St Clair Ave E', 'Scarborough', 'admin2', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '1');";
// admin1 = 1234 admin2 = 12345
try {
    $conn->query($sql);
    echo "<br>";
    echo "User Table Populated! w/ admins";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$sql = "INSERT INTO `user` (`Name`, `Tel_no`, `Email`, `Address`, `City_Code`, `Login_Id`, `Password`, `Admin`) 
        VALUES ('Timmy', '158-888-8888', 'timmy@hotmail.ca', '1250 College St', 'Toronto', 'user1', '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4', '0'), 
        ('Ron', '286-888-8888', 'ron@hotmail.ca', '67 Simcoe St N', 'Oshawa', 'user2', '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5', '0');";
// user1 = 1234 user2 = 12345
try {
    $conn->query($sql);
    echo "<br>";
    echo "User Table Populated! w/ users";
} catch (exception $e) {
    echo "<br>";
    echo "Error creating table: " . mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
}

$conn->close();
