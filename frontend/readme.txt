How to Run:

Start the Backend: Run your Spring Boot application (ensure it's on http://localhost:8080 or update API_BASE_URL in script.js).

Serve the Frontend: Since the frontend uses Vanilla JS, you can't just open index.html directly via file:// because of CORS restrictions when making API calls. You need a simple HTTP server:

Using Python: If you have Python installed, navigate to the folder containing index.html, styles.css, and script.js in your terminal and run:
python -m http.server 8000
Then open http://localhost:8000 in your browser.

Using Node.js: If you have Node.js, install a simple server globally (npm install -g serve) and then run in the frontend folder:
serve . -l 8000
Then open http://localhost:8000.

Using VS Code Live Server: If using VS Code, the "Live Server" extension works perfectly. Right-click index.html and choose "Open with Live Server".
