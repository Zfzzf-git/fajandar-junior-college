<#
================================================================================
  FAJANDAR JUNIOR COLLEGE, VAHOOR
  Zero-Dependency High-Performance Portable Web Server
  Designed for USB Pendrive & Offline Windows Usage
================================================================================
#>

param(
    [string]$TargetRoot = ""
)

# 1. Resolve Website Directory
$ScriptFolder = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not [string]::IsNullOrWhiteSpace($TargetRoot)) {
    $TargetRoot = $TargetRoot.Trim().Trim('"', "'")
    $TargetRoot = $TargetRoot.TrimEnd('\').TrimEnd('/')
}
if ([string]::IsNullOrWhiteSpace($TargetRoot)) {
    $TargetRoot = $ScriptFolder
}

if (-not (Test-Path (Join-Path $TargetRoot "index.html"))) {
    if (Test-Path (Join-Path $TargetRoot "FAJANDAR\index.html")) {
        $TargetRoot = Join-Path $TargetRoot "FAJANDAR"
    } elseif (Test-Path (Join-Path $ScriptFolder "FAJANDAR\index.html")) {
        $TargetRoot = Join-Path $ScriptFolder "FAJANDAR"
    }
}

$WebRoot = (Resolve-Path $TargetRoot).Path

if (-not (Test-Path (Join-Path $WebRoot "index.html"))) {
    Write-Host ""
    Write-Host " [ERROR] Could not find 'index.html' in:" -ForegroundColor Red
    Write-Host "         $WebRoot" -ForegroundColor Yellow
    Write-Host " Please make sure all website files are intact." -ForegroundColor Red
    Write-Host ""
    Write-Host " Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# 2. Check if server is already running on port 8080
function Test-ServerAlreadyRunning([int]$port) {
    try {
        $client = New-Object System.Net.Sockets.TcpClient
        $connect = $client.BeginConnect("127.0.0.1", $port, $null, $null)
        $success = $connect.AsyncWaitHandle.WaitOne(300, $false)
        if (-not $success) {
            $client.Close()
            return $false
        }
        $client.EndConnect($connect)
        $client.Close()

        # Port is open - verify if it's our Fajandar site
        $req = [System.Net.WebRequest]::Create("http://127.0.0.1:$port/")
        $req.Timeout = 1000
        $req.Method = "GET"
        $resp = $req.GetResponse()
        $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
        $content = $reader.ReadToEnd()
        $resp.Close()
        if ($content -match "FAJANDAR" -or $content -match "Fajandar") {
            return $true
        }
    } catch {
        return $false
    }
    return $false
}

if (Test-ServerAlreadyRunning 8080) {
    Write-Host ""
    Write-Host " ===========================================================================" -ForegroundColor Cyan
    Write-Host "   FAJANDAR JUNIOR COLLEGE, VAHOOR - WEBSITE ALREADY ACTIVE" -ForegroundColor Yellow
    Write-Host " ===========================================================================" -ForegroundColor Cyan
    Write-Host "   A server is already running at: http://localhost:8080/" -ForegroundColor Green
    Write-Host "   Opening website in your default browser..." -ForegroundColor White
    Write-Host " ===========================================================================" -ForegroundColor Cyan
    Start-Process "http://localhost:8080/"
    Start-Sleep -Seconds 2
    exit 0
}

# 3. Detect Available Port
function Get-AvailablePort([int[]]$preferredPorts) {
    $ipGlobalProps = [System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties()
    $tcpListeners = $ipGlobalProps.GetActiveTcpListeners()
    $usedPorts = @($tcpListeners | ForEach-Object { $_.Port })

    foreach ($p in $preferredPorts) {
        if ($usedPorts -notcontains $p) {
            return $p
        }
    }
    $temp = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, 0)
    $temp.Start()
    $p = ($temp.LocalEndpoint).Port
    $temp.Stop()
    return $p
}

$Port = Get-AvailablePort @(8080, 8000, 3000, 8081, 8082, 8888, 5000)

# 4. Multi-Threaded In-Memory C# Server
$ServerCode = @"
using System;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Collections.Generic;

public class FajandarPortableServer {
    private readonly HttpListener _listener;
    private readonly string _webRoot;
    private readonly int _port;
    private volatile bool _isRunning;

    private static readonly Dictionary<string, string> MimeTypes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase) {
        { ".html", "text/html; charset=utf-8" },
        { ".htm",  "text/html; charset=utf-8" },
        { ".css",  "text/css; charset=utf-8" },
        { ".js",   "application/javascript; charset=utf-8" },
        { ".json", "application/json; charset=utf-8" },
        { ".png",  "image/png" },
        { ".jpg",  "image/jpeg" },
        { ".jpeg", "image/jpeg" },
        { ".gif",  "image/gif" },
        { ".webp", "image/webp" },
        { ".svg",  "image/svg+xml" },
        { ".ico",  "image/x-icon" },
        { ".mp4",  "video/mp4" },
        { ".webm", "video/webm" },
        { ".woff", "font/woff" },
        { ".woff2","font/woff2" },
        { ".ttf",  "font/ttf" },
        { ".txt",  "text/plain; charset=utf-8" }
    };

    public FajandarPortableServer(string webRoot, int port) {
        _webRoot = Path.GetFullPath(webRoot);
        _port = port;
        _listener = new HttpListener();
        _listener.Prefixes.Add("http://127.0.0.1:" + port + "/");
        _listener.Prefixes.Add("http://localhost:" + port + "/");
    }

    public void Start() {
        _isRunning = true;
        _listener.Start();
        Task.Run(() => ListenLoop());
    }

    public void Stop() {
        _isRunning = false;
        try { _listener.Stop(); } catch {}
        try { _listener.Close(); } catch {}
    }

    private void ListenLoop() {
        while (_isRunning) {
            try {
                var context = _listener.GetContext();
                Task.Run(() => ProcessRequest(context));
            } catch (Exception) {
                if (!_isRunning) break;
            }
        }
    }

    private void ProcessRequest(HttpListenerContext context) {
        var req = context.Request;
        var resp = context.Response;

        try {
            string rawPath = req.Url.LocalPath;
            string decodedPath = Uri.UnescapeDataString(rawPath);
            if (string.IsNullOrEmpty(decodedPath) || decodedPath == "/") {
                decodedPath = "/index.html";
            }

            string relativePath = decodedPath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            string fullPath = Path.GetFullPath(Path.Combine(_webRoot, relativePath));

            // Prevent path traversal outside website root
            if (!fullPath.StartsWith(_webRoot, StringComparison.OrdinalIgnoreCase)) {
                resp.StatusCode = 403;
                byte[] forbiddenBytes = Encoding.UTF8.GetBytes("403 Forbidden");
                resp.ContentLength64 = forbiddenBytes.Length;
                resp.OutputStream.Write(forbiddenBytes, 0, forbiddenBytes.Length);
                resp.Close();
                return;
            }

            // Handle GitHub Pages project base path fallback (/fajandar-junior-college/...)
            if (!File.Exists(fullPath)) {
                if (decodedPath.Equals("/fajandar-junior-college", StringComparison.OrdinalIgnoreCase) ||
                    decodedPath.Equals("/fajandar-junior-college/", StringComparison.OrdinalIgnoreCase)) {
                    fullPath = Path.Combine(_webRoot, "index.html");
                } else if (decodedPath.StartsWith("/fajandar-junior-college/", StringComparison.OrdinalIgnoreCase)) {
                    string stripped = decodedPath.Substring("/fajandar-junior-college/".Length).Replace('/', Path.DirectorySeparatorChar);
                    string altPath = Path.GetFullPath(Path.Combine(_webRoot, stripped));
                    if (File.Exists(altPath) && altPath.StartsWith(_webRoot, StringComparison.OrdinalIgnoreCase)) {
                        fullPath = altPath;
                    }
                }
            }

            if (!File.Exists(fullPath)) {
                resp.StatusCode = 404;
                byte[] notFoundBytes = Encoding.UTF8.GetBytes("404 Not Found: " + decodedPath);
                resp.ContentLength64 = notFoundBytes.Length;
                resp.OutputStream.Write(notFoundBytes, 0, notFoundBytes.Length);
                resp.Close();
                return;
            }

            string ext = Path.GetExtension(fullPath);
            string mimeType;
            if (!MimeTypes.TryGetValue(ext, out mimeType)) {
                mimeType = "application/octet-stream";
            }

            resp.ContentType = mimeType;
            resp.AddHeader("Accept-Ranges", "bytes");
            resp.AddHeader("Access-Control-Allow-Origin", "*");

            var fi = new FileInfo(fullPath);
            long totalLen = fi.Length;

            string rangeHeader = req.Headers["Range"];
            if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes=")) {
                string[] parts = rangeHeader.Substring(6).Split('-');
                long start = 0;
                long end = totalLen - 1;
                long.TryParse(parts[0], out start);
                if (parts.Length > 1 && !string.IsNullOrEmpty(parts[1])) {
                    long.TryParse(parts[1], out end);
                }
                if (end >= totalLen) end = totalLen - 1;
                long chunkLen = end - start + 1;

                resp.StatusCode = 206;
                resp.AddHeader("Content-Range", string.Format("bytes {0}-{1}/{2}", start, end, totalLen));
                resp.ContentLength64 = chunkLen;

                if (!req.HttpMethod.Equals("HEAD", StringComparison.OrdinalIgnoreCase)) {
                    using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
                        fs.Seek(start, SeekOrigin.Begin);
                        byte[] buffer = new byte[65536];
                        long remaining = chunkLen;
                        while (remaining > 0) {
                            int toRead = (int)Math.Min(buffer.Length, remaining);
                            int read = fs.Read(buffer, 0, toRead);
                            if (read <= 0) break;
                            resp.OutputStream.Write(buffer, 0, read);
                            remaining -= read;
                        }
                    }
                }
            } else {
                resp.StatusCode = 200;
                resp.ContentLength64 = totalLen;

                if (!req.HttpMethod.Equals("HEAD", StringComparison.OrdinalIgnoreCase)) {
                    using (var fs = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)) {
                        fs.CopyTo(resp.OutputStream);
                    }
                }
            }
        } catch (Exception) {
            // Socket disconnected or aborted by client
        } finally {
            try { resp.Close(); } catch {}
        }
    }
}
"@

try {
    Add-Type -TypeDefinition $ServerCode -ErrorAction Stop
} catch {
    # If already added in current session, proceed
}

$Server = New-Object FajandarPortableServer ($WebRoot, $Port)
$Server.Start()

# 5. Launch Browser
$HomepageUrl = "http://localhost:$Port/"
Start-Sleep -Milliseconds 400
try {
    Start-Process $HomepageUrl
} catch {
    Write-Host " [!] Could not automatically open browser. Please open: $HomepageUrl" -ForegroundColor Yellow
}

# 6. Informative Console Dashboard
Clear-Host
Write-Host ""
Write-Host " ===========================================================================" -ForegroundColor DarkYellow
Write-Host "         FAJANDAR JUNIOR COLLEGE, VAHOOR - LOCAL WEB SERVER" -ForegroundColor Yellow
Write-Host " ===========================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "   [OK] Server Status : " -NoNewline -ForegroundColor Green
Write-Host "RUNNING" -ForegroundColor White
Write-Host "   [OK] Website URL   : " -NoNewline -ForegroundColor Green
Write-Host "$HomepageUrl" -ForegroundColor Cyan
Write-Host ("   [OK] Bound Port    : {0} (Localhost Only - Secure and Offline)" -f $Port) -ForegroundColor Green
Write-Host "   [OK] Website Folder: " -NoNewline -ForegroundColor Green
Write-Host "$WebRoot" -ForegroundColor Gray
Write-Host ""
Write-Host " ---------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "   Golden Glass-Ribbon 3D Animation : ENABLED (300 Frames Loaded)" -ForegroundColor Yellow
Write-Host "   Streams Represented              : ARTS | COMMERCE | SCIENCE" -ForegroundColor White
Write-Host " ---------------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "   * INSTRUCTIONS:" -ForegroundColor White
Write-Host "     1. Keep this window OPEN while browsing the website." -ForegroundColor Gray
Write-Host "     2. If your browser did not open automatically, copy and paste the URL:" -ForegroundColor Gray
Write-Host "        $HomepageUrl" -ForegroundColor Cyan
Write-Host "     3. To STOP the server cleanly, press Ctrl+C or simply close this window." -ForegroundColor Yellow
Write-Host ""
Write-Host " ===========================================================================" -ForegroundColor DarkYellow
Write-Host " [Server is active and listening for requests...]" -ForegroundColor DarkGreen
Write-Host ""

# 7. Keep Running Until User Closes or Presses Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "`n Stopping local server..." -ForegroundColor Yellow
    $Server.Stop()
    Write-Host " Server stopped cleanly. Goodbye!" -ForegroundColor Green
}
