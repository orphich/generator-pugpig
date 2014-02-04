<?php

  include_once(opds-vars.php);

?>

<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:opds="http://opds-spec.org/2010/catalog">

  <id>Hello!</id>
  <title>Hello!</title>
  <?php
  echo '  <updated>' . BUILD_DATE . '</updated>';
  ?>
  <author>
    <name>Kaldor Group</name>
  </author>


<?php

  $editionID = 0;
  $issuedDate = mb_substr(BUILD_DATE);

  for ($i=0; $i<5; $i++) {
    echo <<< ENTRIES
    <entry>
      <title>Sample Edition 1</title>
      <id>$editionID</id>
      <updated>BUILD_DATE</updated>
      <dcterms:issued>2013-09-01</dcterms:issued>
      <author>
        <name>Kaldor Group</name>
      </author>
      <summary>This is a short edition summary for sample edition 1</summary>
      <category scheme="http://schema.pugpig.com/download_size" term="30MB"/>
      <link rel="http://opds-spec.org/image" type="image/jpg" href="images/cover.jpg"/>
      <link rel="http://opds-spec.org/acquisition" type="application/atom+xml" href="static/atom.xml"/>
      <link rel="alternate" type="application/atom+xml" href="static/atom.xml"/>
    </entry>
ENTRIES;

    $editionID++;
  }