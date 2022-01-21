<h1 align="center"><strong>Still Alive</strong></h1>
<p align="center"><i>The <a href="https://web.archive.org/web/20210929222906/https://www.youtube.com/watch?v=Y6ljFaKRTrI">end credits</a> from the video game <a href="https://en.wikipedia.org/wiki/Portal_(video_game)">Portal</a><br>recreated with pure JavaScript, browser windows, and a lot of patience.</i></p>
<p align="center"><a href="https://victorwesterlund.github.io/still-alive/"><strong>Take me to the demo 🍰</strong></a></p>
<img src="https://user-images.githubusercontent.com/35688133/139586996-06eaa0cd-0c99-4e14-ba9d-2649e56c421f.png"/>
<h2>Known limitations</h2>
<ul>
  <li><a href="https://github.com/VictorWesterlund/still-alive/issues/2"><strong>Time drifting <i>(#2)</i></strong></a><br>The browser will throttle <code>setTimeout()</code> when it deems a page as low-priority (running in the background etc.). This will cause all visuals to fall behind the music and appear as delayed.</li>
  <li><a href="https://github.com/VictorWesterlund/still-alive/issues/2"><strong>Windows blocked <i>(#3)</i></strong></a><br>Pop-up blockers (built-in on most browsers) will prevent all- or some windows to open. You have to allow the page to "open multiple windows" in your browser for this demo to work.</li>
  <li><strong>Stacking windows on Chrome for Windows</strong><br>Due to a <a href="https://bugs.chromium.org/p/chromium/issues/detail?id=137681">bug in Chromium on Windows</a>, browser windows will stack if the play button is clicked from a non-primary display.</li>
</ul>
