<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>벽돌깨기</title>
<link rel="stylesheet" type="text/css" href="css/swipe_set.css">
<link rel="stylesheet" type="text/css" href="css/swipe_score.css">

<audio id="break" src="./bgm/pong.mp3"></audio>
<audio id="clear" src="./bgm/clear.mp3"></audio>
<audio id="addball" src="./bgm/addball.mp3"></audio>
<audio id="shoot" src="./bgm/shoot.mp3"></audio>
<audio id="end" src="./bgm/end.MP3"></audio>
</head>
<body>
    <header>
    	<?php include "header.php";?>
    </header>
    <nav>
        <span>점수: <span class="score">1</span></span>&nbsp;&nbsp;&nbsp;<span class="ball">Ball: <span class="b">1</span></span>
    </nav>
	<section>
	    <div id="app">
            <canvas id="canvas" width="450" height="450" style="z-index: 1;"></canvas>
        </div>
        <script src="../js/script.js"></script>
        <div id="mypoint">
            <?php include "swipe_score.php";?>
        </div>
	</section>
	<footer>
    	<?php include "footer.php";?>
    </footer>
</body>
</html>
