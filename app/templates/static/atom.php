<feed xmlns="http://www.w3.org/2005/Atom" xmlns:app="http://www.w3.org/2007/app">

<?php
include_once('atom-vars.php');
include_once('opds-vars.php');

$pageID = 0;
$fullDate = BUILD_DATE;
$shortDate = mb_substr(BUILD_DATE, 0, 10);
?>

  <id>publication-id</id>
  <title>Publication Title</title>
  <?php
    echo '<updated>' . $fullDate . '</updated>';
  ?>

  <author>
    <name>Kaldor Group</name>
  </author>

<?php
foreach($pages as $name => $fileName) {
  $entry = <<<FEED
  <entry>
    <title>$name</title>
    <id>$pageID</id>
    <section>Section</section>
    <updated>$fullDate</updated>
    <published>$fullDate</published>
    <summary>This is a short page summary for the $name page</summary>
    <category scheme="http://schema.pugpig.com/section" term="$name"/>
    <link rel="alternate" type="text/html" href="$fileName.html"/>
    <link rel="related" type="text/cache-manifest" href="$fileName.manifest"/>
  </entry>


FEED;
  echo $entry;

  $pageID++;

}
?>

</feed>