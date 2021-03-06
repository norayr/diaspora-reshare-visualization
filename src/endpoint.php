<?php

require_once('DiasporaWalker.php');
require_once('ResultTree.php');

// Set correct json headers and disable caching
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

$url =  empty($_GET['startUrl']) ? null : $_GET['startUrl'] ;

// $url = 'https://joindiaspora.com/posts/2772581';
if (strpos($url, "/posts/") ===  false | $url === "startUrl=" ) { echo ("=====> $url is Not a valid post URL
"); $url = null; } else { $url = trim($url . ".json") ; } ;
if ($url !== null) {
    // create Result Object for DI
    $results = new ResultTree();
// var_dump ( $results ) ;
    // Creating the recursive walker
    $dispatcher = new DiasporaWalker($results, $url, DiasporaWalker::MODE_TOROOT);
// var_dump ( $results ) ;
    $dispatcher->start();
// var_dump ( $results ) ;
    // return our json-encoded array
    echo $dispatcher->getResults();
// var_dump ( $dispatcher ) ;
}
else {
    return json_encode(array('error' => true));
}


?>