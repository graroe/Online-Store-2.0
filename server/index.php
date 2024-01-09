<?php
include 'connect.php';
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Origin:*');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$objDb = new DbConnect;
$conn = $objDb->connect();
$method = $_SERVER['REQUEST_METHOD'];

//get uri segments from api url "http://localhost/630-lab/Project/server/index.php/whatever"
$uriSegments = explode("/", parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

switch ($uriSegments[5]) {
    case "register":
        $userid = $_POST['userid'];
        $name = $_POST['name'];
        $phone = $_POST['phone'];
        $email = $_POST['email'];
        $address = $_POST['address'];
        $city = $_POST['city'];
        $password = $_POST['password'];

        $sql = "INSERT into `User` (`Name`, `Tel_no`, `Email`, `Address`, `City_Code`, `Login_Id`, `Password`) 
                values ('$name', '$phone', '$email', '$address', '$city', '$userid', '$password')";
        $res = mysqli_query($conn, $sql);

        if ($res) {
            echo "registered successfully";
        } else {
            echo "error: register unsuccessful";
        }
        break;

    case "login":
        $userid = $_POST['userid'];
        $password = $_POST['password'];

        $sql = "SELECT * FROM `User`
                WHERE `Login_Id`='$userid' AND `Password`='$password'";

        $res = mysqli_query($conn, $sql);

        if ($res->num_rows == 1) {
            while ($row = $res->fetch_assoc()) {
                $resArr[] = $row;
            }
            echo (json_encode($resArr));
        } else {
            echo "login unsuccessful (user not found)";
        }
        break;

    case "storefront":
        switch ($method) {
            case 'GET':
                $sql = "SELECT item_id, item_name, price FROM Item";
                break;
        }
        $result = mysqli_query($conn, $sql);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        print json_encode($rows);
        break;


    case "reviews":
        $item_id = $_POST['item_id'];
        $star_rating = $_POST['star_rating'];
        $review = $_POST['review'];

        $sql = "INSERT into `Reviews` (`Item_Id`, `star_rating`, `review`) 
        values ('$item_id', '$star_rating', '$review')";

        $res = mysqli_query($conn, $sql);

        if ($res) {
            echo "review added successfully";
        } else {
            echo "error: failure in adding review";
        }
        break;


    case "getReviews":
        switch ($method) {
            case 'GET':
                $sql = "SELECT Item_Id, star_rating, review FROM Reviews";
                break;
        }
        $result = mysqli_query($conn, $sql);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        print json_encode($rows);
        break;

        # add to trip table
    case "postTrip":
        $source_code = $_POST['source_code'];
        $destination_code = $_POST['destination_code'];
        $distance = $_POST['distance'];
        $truck_id = $_POST['truck_id'];
        $price = $_POST['price'];
        $express = $_POST['express'];


        $sql = "INSERT into `Trip` (`Source_Code`, `Destination_Code`, `Distance`, `Truck_Id`, `Price`, `Express`) 
        values ('$source_code', '$destination_code', '$distance', '$truck_id', '$price', '$express')";

        $res = mysqli_query($conn, $sql);

        if ($res) {
            echo "trip added to trip table successfully";
        } else {
            echo "error: failure in adding to trip table";
        }
        break;

    case "shipping":
        $dcode = mysqli_real_escape_string($conn, $_POST['dcode']);
        $exsh = mysqli_real_escape_string($conn, $_POST['exsh']);
        $user_id = mysqli_real_escape_string($conn, $_POST['User_Id']);

        // Get the truck id
        $sql = "SELECT `Truck_Id` FROM `Truck` WHERE `Availability_Code` = 1 LIMIT 1";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            echo "error: unable to get truck id";
            break;
        }
        $row = mysqli_fetch_assoc($res);
        $truck_id = $row['Truck_Id'];

        // Get the branch
        $branches = [
            1 => "Toronto Branch",
            2 => "Markham Branch",
            3 => "North York Branch"
        ];
        $branch = $branches[$dcode];

        // Add a new trip
        $sql1 = "INSERT INTO `Trip` (`Destination_Code`, `Branch`, `Express`, `Truck_Id`) 
                    VALUES ('$dcode', '$branch', '$exsh', '$truck_id')";
        $res1 = mysqli_query($conn, $sql1);
        if (!$res1) {
            echo "error: trip not added";
            break;
        }

        // Get the trip id
        $sql2 = "SELECT `Trip_Id` FROM `Trip` WHERE `Destination_Code` = '$dcode' AND `Branch`='$branch' AND `Express`='$exsh' AND `Truck_Id`='$truck_id'";
        $res2 = mysqli_query($conn, $sql2);
        if (!$res2) {
            echo "error: failed to get trip info";
            break;
        }
        $row = mysqli_fetch_assoc($res2);
        $trip_id = $row['Trip_Id'];

        // Update the orders table
        $sql3 = "UPDATE `orders` SET `Trip_Id` = '$trip_id'";
        if ($exsh == 1) {
            $sql3 .= ", `Est_Delivery_Date` = DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY)";
        } else {
            $sql3 .= ", `Est_Delivery_Date` = DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)";
        }
        $receipt_id = rand(10000, 99999);
        $sql3 .= ", `Receipt_Id` = '$receipt_id' WHERE User_Id = $user_id ORDER BY `Order_Id` DESC LIMIT 1";
        $res3 = mysqli_query($conn, $sql3);
        if (!$res3) {
            echo "error: failed to add trip info to order table";
            break;
        }

        // Update the truck availability code
        $sql4 = "UPDATE `Truck` SET `Availability_Code` = 0 WHERE `Truck_Id` = $truck_id";
        $res4 = mysqli_query($conn, $sql4);
        if (!$res4) {
            echo "error: failed to update truck availability";
            break;
        }

        echo "successfully added trip & truck info";
        break;

    case "getReviewsById":
        $item_id = $_POST['Item_Id'];
        $sql = "SELECT * FROM Reviews WHERE Item_Id = $item_id";
        $result = mysqli_query($conn, $sql);
        $rows = array();
        while ($r = mysqli_fetch_assoc($result)) {
            $rows[] = $r;
        }
        print json_encode($rows);
        break;


    case "getCart":
        $order_id = $_POST['Order_Id'];
        $sql = "SELECT Item_Id, Quantity FROM Order_Item WHERE Order_Id = $order_id";
        if ($result = mysqli_query($conn, $sql)) {
            $rows = array();
            while ($r = mysqli_fetch_assoc($result)) {
                $sqlMore = "SELECT Item_name, Price FROM item WHERE Item_Id =" . $r["Item_Id"];
                $q = mysqli_query($conn, $sqlMore);
                $finalR = array_merge($r, mysqli_fetch_assoc($q));
                $rows[] = $finalR;
            }
            print json_encode($rows);
        } else {
            echo "error: failure in retrieving cart";
        }
        break;

    case "updateCart":
        $order_id = $_POST['Order_Id'];
        $item_id = $_POST['Item_Id'];
        $quantity = $_POST['Quantity'];
        $sql = "UPDATE `order_item` SET `Quantity` = $quantity WHERE `Order_Id` = $order_id AND `Item_Id` = $item_id";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            echo "$res";
        } else {
            echo "error: failure in updating cart";
        }
        break;

    case "removeFromCart":
        $order_id = $_POST['Order_Id'];
        $item_id = $_POST['Item_Id'];
        $sql = "DELETE FROM `order_item` WHERE `Order_Id` = $order_id AND `Item_Id` = $item_id";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            echo "$res";
        } else {
            echo "error: failure in updating cart";
        }
        break;

    case "updateOrderSubtotal":
        $order_id = $_POST['Order_Id'];
        $subtotal = $_POST['Subtotal'];
        $sql = "UPDATE `orders` SET `Subtotal`= $subtotal WHERE `Order_Id` = $order_id";
        $res = mysqli_query($conn, $sql);
        if ($res) {
            echo "$res";
        } else {
            echo "error: failure in updating subtotal";
        }
        break;

    case "updateOrderTotal":
        $order_id = $_POST['Order_Id'];
        $exsh = $_POST['exsh'];

        //normal delivery
        if ($exsh == 0) {
            $sql = "SELECT `Subtotal` FROM `orders`
                    WHERE `Order_Id` = $order_id";
            $res = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($res);
            $total = $row['Subtotal'];
            if ($res) {
                $sql = "UPDATE `orders` SET `Total_Price`= $total WHERE `Order_Id` = $order_id";
                $res = mysqli_query($conn, $sql);
                if ($res) {
                    echo "success";
                } else {
                    echo "failure";
                }
            } else {
                echo "error: failure in updating total";
            }

            //express delivery
        } else if ($exsh == 1) {
            $sql = "SELECT `Subtotal` FROM `orders`
                    WHERE `Order_Id` = $order_id";
            $res = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($res);
            $total = $row['Subtotal'] + 10;
            if ($res) {
                $sql = "UPDATE `orders` SET `Total_Price`= $total WHERE `Order_Id` = $order_id";
                $res = mysqli_query($conn, $sql);
                if ($res) {
                    echo "success";
                } else {
                    echo "failure";
                }
            } else {
                echo "error: failure in updating total";
            }
        } else {
            echo "error: failure in updating total";
        }
        break;

    case "getActiveOrder":
        $user_id = $_POST['User_Id'];
        $sql = "SELECT `Order_Id` FROM `Orders`
                WHERE `User_Id` = $user_id AND `Submitted` = false 
                ORDER BY `Order_Id` DESC LIMIT 1";
        $result = mysqli_query($conn, $sql);

        if (mysqli_num_rows($result) === 1) {
            $row = mysqli_fetch_assoc($result);
            print json_encode($row);
        } else if (mysqli_num_rows($result) === 0) {
            $sqlNewCart = "INSERT INTO `orders`(`User_Id`, `Submitted`) VALUES ($user_id, false)";
            $r2 = mysqli_query($conn, $sqlNewCart);
            if ($r2) {
                $r3 = mysqli_query($conn, $sql);
                $sqlRetry = "SELECT `Order_Id` FROM `Orders`
                            WHERE `User_Id` = $user_id AND `Submitted` = false";
                while (mysqli_num_rows($r3) > 1){
                    $sqlDel = "DELETE FROM `Orders` WHERE User_Id = $user_id AND Submitted = false ORDER BY `Order_Id` DESC LIMIT 1";
                    mysqli_query($conn, $sqlDel);
                    $r3 = mysqli_query($conn, $sqlRetry);
                }
                if (mysqli_num_rows($r3) === 1) {
                    $row = mysqli_fetch_assoc($result);
                    print json_encode($row);
                }
                else {
                    echo "failure retrieving new cart";
                    break;
                }
            } else {
                echo "error: failure in creating new cart";
                break;
            }
        } else {
            echo "error: failure in updating cart";
        }
        break;

    case "postOrder":
        $order_id = $_POST['Order_Id'];
        $item_id = $_POST['Item_Id'];
        $user_id = $_POST['User_Id'];

        // Check if the order exists
        $order_query = "SELECT `Order_Id` FROM `orders` WHERE `Order_Id` = '$order_id'";
        $order_result = mysqli_query($conn, $order_query);

        if (!$order_result) {
            echo "error: failure in retreiving active order";
            break;
        }

        // Insert or update the order item
        $sql = "INSERT INTO `order_item` VALUES('$order_id', '$item_id', 1) ON DUPLICATE KEY UPDATE `Quantity` = `Quantity` + 1";
        echo $sql;
        $res = mysqli_query($conn, $sql);

        if ($res) {
            echo "cart added successfully";
        } else {
            echo "error: failure in adding cart";
        }
        break;


    case "getItemName":
        $item_id = $_POST['Item_Id'];
        $sql = "SELECT Item_name FROM Item WHERE Item_Id = $item_id";
        $result = mysqli_query($conn, $sql);
        $row = mysqli_fetch_assoc($result);
        print json_encode($row);
        break;

    case "getOrderTotal":
        $user_id = $_POST['User_Id'];

        $sql1 = "SELECT `Order_Id` FROM `Orders` ORDER BY `Order_Id` DESC LIMIT 1";
        $res1 = mysqli_query($conn, $sql1);

        if (!$res1) {
            echo "error: unable to get current order id for order total";
            break;
        }
        $row = mysqli_fetch_assoc($res1);
        $order_id = $row['Order_Id'];

        $sql2 = "SELECT `Total_Price` FROM `Orders` WHERE `Order_Id` = '$order_id'";
        $res2 = mysqli_query($conn, $sql2);
        if ($res2) {
            $row = mysqli_fetch_assoc($res2);
            $price = $row['Total_Price'];
            echo $price;
        } else {
            echo "error: unable to get order total";
        }
        break;

    case "payment":
        $userid = $_POST['userid'];
        $hashedCardNumber = $_POST['hashedCardNumber'];
        $expiryDate = $_POST['expiryDate'];
        $hashedCvv = $_POST['hashedCvv'];

        $sql = "INSERT INTO `Payment` (`Card_Number`, `Expiry_Date`, `Cvv`) VALUES ('$hashedCardNumber', '$expiryDate', '$hashedCvv')";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            echo "error: insert into payment unsuccessful";
            break;
        }

        $sql1 = "SELECT `Payment_Id` FROM `Payment` ORDER BY `Payment_Id` DESC LIMIT 1";
        $res1 = mysqli_query($conn, $sql1);
        if (!$res1) {
            echo "error: unable to get payment id";
            break;
        }
        $row = mysqli_fetch_assoc($res1);
        $payment_id = $row['Payment_Id'];

        $sql2 = "SELECT `Order_Id` FROM `Orders` ORDER BY `Order_Id` DESC LIMIT 1";
        $res2 = mysqli_query($conn, $sql2);
        if (!$res2) {
            echo "error: unable to get order number for current payment";
            break;
        }
        $row = mysqli_fetch_assoc($res2);
        $order_id = $row['Order_Id'];

        $sql3 = "UPDATE `orders` SET `Submitted` = true, `Payment_Id` = '$payment_id', `Date_Issued` = CURRENT_TIMESTAMP 
                WHERE `Order_Id` = $order_id";
        $res3 = mysqli_query($conn, $sql3);
        if ($res3) {
            echo "payment data inserted and updated successfully";
        } else {
            echo "error: order placement unsuccessful";
        }
        break;

    case "confirmed":
        $sql1 = "SELECT * FROM Orders 
                ORDER BY `Order_Id` DESC LIMIT 1";
        $res1 = mysqli_query($conn, $sql1);

        $sql2 = "SELECT * FROM Trip 
                ORDER BY `Trip_Id` DESC LIMIT 1";
        $res2 = mysqli_query($conn, $sql2);

        if ($res1 && $res2) {
            $rows1 = array();
            $rows2 = array();
            while ($r = mysqli_fetch_assoc($res1)) {
                $rows1[] = $r;
            }
            while ($r = mysqli_fetch_assoc($res2)) {
                $rows2[] = $r;
            }
            print json_encode(array_merge($rows1, $rows2));
        } else {
            echo "error: cannot get order & trip info";
            break;
        }
        break;

    case "confirmed2":
        $orderid = $_POST['Order_Id'];
        error_log("Received order ID: " . $orderid);
        $sql1 = "SELECT Item_Id, Quantity FROM order_item WHERE `Order_Id` = '$orderid'";
        $res1 = mysqli_query($conn, $sql1);
        if ($res1) {
            $itemIds = array();
            while ($row = mysqli_fetch_assoc($res1)) {
                $itemIds[] = array('Item_Id' => $row['Item_Id'], 'Quantity' => $row['Quantity']);
            }
            echo json_encode($itemIds);
        } else {
            echo "error: cannot get order & trip info";
        }
        break;

    case "getItemInfo":
        $itemIds = $_POST['Item_Id'];
        $itemInfo = array();

        foreach ($itemIds as $itemId) {
            $sql = "SELECT Item_name, Price FROM Item WHERE Item_Id = $itemId";
            $result = mysqli_query($conn, $sql);
            $row = mysqli_fetch_assoc($result);
            $itemInfo[] = $row;
        }

        echo json_encode($itemInfo);
        break;

    case "search":
        $orderid = $_POST['orderId'];
        $userid = $_POST['userId'];
        $sql = "SELECT * FROM `Orders`
                WHERE `User_Id`='$userid'
                AND `Order_Id`='$orderid'
                AND `Submitted` = true";
        $res = mysqli_query($conn, $sql);
        if ($res->num_rows >= 1) {
            while ($row = $res->fetch_assoc()) {
                $resArr[] = $row;
            }
            echo (json_encode($resArr));
        } else {
            echo "no records found";
        }
        break;

    case "manage":
        switch ($uriSegments[6]) {

            case "view":
                $columns = $_POST['columns'];
                $table = '`' . $_POST['table'] . '`';
                $conditions = $_POST['conditions'];

                if (empty($conditions)) {
                    $sql = "SELECT $columns FROM $table";
                } else {
                    $sql = "SELECT $columns FROM $table WHERE $conditions";
                }

                $res = mysqli_query($conn, $sql);

                if ($res->num_rows >= 1) {
                    while ($row = $res->fetch_assoc()) {
                        $resArr[] = $row;
                    }
                    echo (json_encode($resArr));
                } else {
                    echo "0 records found";
                }

                break;

            case "insert":
                $table = '`' . $_POST['table'] . '`';
                $values = '(' . $_POST['values'] . ')';
                $columns = $_POST['columns'];

                if (empty($columns)) {
                    $sql = "INSERT INTO $table VALUES $values";
                } else {
                    $columns = '(' . $_POST['columns'] . ')';
                    $sql = "INSERT INTO $table $columns VALUES $values";
                }
                echo $sql;
                $res = mysqli_query($conn, $sql);

                if ($res) {
                    echo "data inserted successfully";
                } else {
                    echo "insert unsuccessful";
                }
                break;

            case "update":
                $table = '`' . $_POST['table'] . '`';
                $values = $_POST['values'];
                $conditions = $_POST['conditions'];

                $sql = "UPDATE $table SET $values WHERE $conditions";

                $res = mysqli_query($conn, $sql);

                if ($res) {
                    echo "data updated successfully";
                } else {
                    echo "update unsuccessful";
                }
                break;

            case "delete":
                $table = '`' . $_POST['table'] . '`';
                $conditions = $_POST['conditions'];

                $sql = "DELETE FROM $table WHERE $conditions";
                $res = mysqli_query($conn, $sql);

                if ($res) {
                    echo "data deleted successfully";
                } else {
                    echo "delete unsuccessful";
                }
                break;
        }
}


$conn->close();
