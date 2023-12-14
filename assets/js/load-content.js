// Function to load content into the .content div using fetch
function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
        })
        .catch(error => {
            console.error("Error loading content:", error);
        });
}

// Function to replace content with content from a new HTML page
function replaceContent(url) {
    document.getElementById("content").innerHTML = "";
    loadContent(url);
}
