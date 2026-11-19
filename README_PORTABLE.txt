================================================================================
  FAJANDAR JUNIOR COLLEGE, VAHOOR - PORTABLE OFFLINE WEBSITE
  One-Click USB Pendrive & Windows PC Launcher Guide
================================================================================

OVERVIEW
--------
This project folder contains the complete, standalone official website of
FAJANDAR JUNIOR COLLEGE, VAHOOR (Raigad, Maharashtra), featuring:
- Full coverage of all 3 streams: ARTS, COMMERCE, and SCIENCE.
- The 300-frame golden glass-ribbon scroll-linked campus animation.
- All institutional pages: About, Academics, Staff, Facilities, Fees,
  Campus & Location, Gallery, Help/FAQs, and Contact.
- Zero external dependencies: completely offline, portable, and self-contained.


HOW TO COPY TO A USB PENDRIVE
------------------------------
1. Plug your USB pendrive into this computer.
2. Copy either:
   - The entire 'FAJANDAR' folder, OR
   - The entire 'FAJANDARBACKUP4' folder
   onto your USB pendrive.
3. Make sure all subfolders ('300frames', 'Photographs', 'assets') are
   copied completely. (Total size is approximately 650 MB to 750 MB due to
   high-resolution campus animation frames).
4. Safely eject the pendrive from Windows.


HOW TO RUN ON ANOTHER WINDOWS PC / LAPTOP
------------------------------------------
1. Insert the USB pendrive into any Windows PC or laptop (Windows 10, 11, or 8/7).
   - Option A: You can run it directly from the USB drive!
   - Option B: You can copy the folder to the target computer's Desktop
     or Documents folder for faster load speeds.
2. Open the folder and double-click:
   
      START_WEBSITE.bat

3. What happens next:
   - A black console window will open and display:
     "FAJANDAR JUNIOR COLLEGE, VAHOOR - LOCAL WEB SERVER [RUNNING]"
   - The server will automatically detect an available port (default 8080).
   - Your default web browser (Edge, Chrome, Firefox, Brave, etc.) will
     open automatically to:
     http://localhost:8080/
   - The website, styling, photography, navigation, and golden glass-ribbon
     scroll animation will immediately start working.


HOW TO STOP THE SERVER SAFELY
------------------------------
- When you are finished exploring the website:
  - Simply CLOSE the black command window, OR
  - Click into the black command window and press: Ctrl + C
- The server will immediately release the port and shut down cleanly.


SOFTWARE PREREQUISITES
----------------------
- Operating System : Any modern Windows PC or laptop (Windows 10, Windows 11,
                     Windows 8.1, or Windows 7 SP1).
- Google Antigravity: NOT REQUIRED. (Runs 100% independently).
- Node.js / npm     : NOT REQUIRED. (Runs without Node.js).
- Python            : NOT REQUIRED. (Windows built-in PowerShell & .NET are used).
- Database          : NOT REQUIRED. (Pure client-side static institutional site).
- Web Browser       : Any standard web browser already installed on Windows
                     (Microsoft Edge, Google Chrome, Mozilla Firefox, Brave, etc.).


IS INTERNET ACCESS REQUIRED?
----------------------------
- NO. Internet access is NOT required.
- The website is completely offline and self-contained.
- All styles (style.css), interactive logic (script.js), 300 canvas animation
  frames (300frames/), and campus photographs (Photographs/) are stored
  locally inside the project folder.


SECURITY & LOCALHOST PRIVACY
----------------------------
- The server binds EXCLUSIVELY to loopback addresses:
    http://127.0.0.1:8080/  and  http://localhost:8080/
- The server does NOT broadcast to the local Wi-Fi / LAN network and does NOT
  expose any files to the public internet.
- Built-in path traversal safeguards prevent requests outside the website folder.


TROUBLESHOOTING COMMON QUESTIONS
---------------------------------
Q1: The browser did not open automatically.
A1: Look at the black command window. It displays the active website address:
    http://localhost:8080/
    Simply copy that address, open your browser, paste it into the address bar,
    and press Enter.

Q2: Port 8080 is already used by another application on the computer.
A2: No action needed! The launcher automatically detects if port 8080 is busy
    and automatically shifts to port 8000, 3000, 8081, 8082, 8888, or an
    assigned free port. It displays the exact assigned port in the console.

Q3: I double-clicked START_WEBSITE.bat but a website was already open.
A3: The launcher detects if a server for Fajandar Junior College is already
    running. Instead of starting a duplicate server, it simply brings up the
    website in your browser and closes the extra launcher cleanly.

Q4: The window says "Could not locate index.html".
A4: Ensure that 'index.html', 'style.css', and 'script.js' are located in the
    same folder as START_WEBSITE.bat or in the 'FAJANDAR' subfolder. Do not
    move files outside their folders.

Q5: Windows Defender SmartScreen shows "Windows protected your PC".
A5: Because this BAT file was copied from a USB pendrive or another PC, Windows
    may display a generic SmartScreen prompt. Click "More info" and then click
    "Run anyway". The script contains only standard Windows batch and PowerShell
    commands.


SUMMARY OF FILES CREATED
------------------------
- START_WEBSITE.bat     : One-click launcher for Windows.
- portable_server.ps1   : Zero-dependency multi-threaded local web server engine.
- README_PORTABLE.txt   : This documentation guide.

Designed & configured for Fajandar Junior College, Vahoor.
================================================================================
