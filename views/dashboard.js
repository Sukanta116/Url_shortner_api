const userName = document.getElementById("userName");
const urlInput = document.getElementById("urlInput");
const errorMessage = document.getElementById("errorMessage");
const shortenBtn = document.getElementById("shortenBtn");
const outputCard = document.getElementById("outputCard");
const shortUrl = document.getElementById("shortUrl");
const originalUrl = document.getElementById("originalUrl");
const copyBtn = document.getElementById("copyBtn");
const urlList = document.getElementById("urlList");
const urlCount = document.getElementById("urlCount");
const noUrlMessage = document.getElementById("noUrlMessage");

// Load dashboard data
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Get logged-in user's name
    const meResponse = await fetch("/me");
    const meResult = await meResponse.json();

    if (!meResponse.ok) {
      console.log(meResult.message);
      return;
    }

    userName.textContent = `${meResult.firstName} ${meResult.lastName}`;

    // Get user's previous URLs
    const response = await fetch("/showAll");
    const result = await response.json();

    if (!response.ok) {
      console.log(result.message);
      return;
    }

    // Update URL count
    urlCount.textContent = `${result.length} ${
      result.length === 1 ? "link" : "links"
    }`;

    // No previous URLs
    if (result.data.length === 0) {
      noUrlMessage.style.display = "block";
      return;
    }

    // Previous URLs exist
    noUrlMessage.style.display = "none";

    result.data.forEach((url) => {
      addUrlToHistory(url.shortLink, url.longLink);
    });
  } catch (err) {
    console.log(err);
  }
});

// Shorten URL
shortenBtn.addEventListener("click", async () => {
  const longUrl = urlInput.value.trim();

  if (!longUrl) {
    urlInput.focus();
    errorMessage.textContent = "Please Enter a URL First";
    return;
  }

  try {
    const shortLinkResponse = await fetch("/shortner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ longUrl }),
    });

    const result = await shortLinkResponse.json();

    if (!shortLinkResponse.ok) {
      errorMessage.textContent = result.message;
      return;
    }

    // Show current shortened URL
    shortUrl.textContent = `http://localhost:4000/${result.data}`;
    originalUrl.textContent = longUrl;

    outputCard.classList.remove("hidden");

    // Remove "No URLs yet"
    noUrlMessage.style.display = "none";

    // Add new URL to history
    addUrlToHistory(result.data, longUrl);

    // Clear input
    urlInput.value = "";

    // Clear error message
    errorMessage.textContent = "";
  } catch (err) {
    console.log(err);
    errorMessage.textContent = "Something went wrong";
  }
});

// Press Enter to shorten
urlInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    shortenBtn.click();
  }
});

// Copy current shortened URL
copyBtn.addEventListener("click", async () => {
  const link = `${shortUrl.textContent}`;

  await navigator.clipboard.writeText(link);

  copyBtn.textContent = "Copied!";

  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 1500);
});

// Add URL to user's URL list
function addUrlToHistory(shortLink, longUrl) {
  const urlItem = document.createElement("div");

  urlItem.className = "url-item";

  urlItem.innerHTML = `
        <div class="url-details">
            <a href="http://localhost:4000/${shortLink}" target="_blank">
                http://localhost:4000/${shortLink}
            </a>

            <p>${longUrl}</p>
        </div>

        <button class="copy-history-btn">
            Copy
        </button>
    `;

  urlList.prepend(urlItem);

  // Copy history URL
  const historyCopyBtn = urlItem.querySelector(".copy-history-btn");

  historyCopyBtn.addEventListener("click", async () => {
    const link = `http://localhost:4000/${shortLink}`;

    await navigator.clipboard.writeText(link);

    historyCopyBtn.textContent = "Copied!";

    setTimeout(() => {
      historyCopyBtn.textContent = "Copy";
    }, 1500);
  });

  // Update URL count
  updateUrlCount();
}

// Update URL count
function updateUrlCount() {
  const count = urlList.querySelectorAll(".url-item").length;

  urlCount.textContent = `${count} ${count === 1 ? "link" : "links"}`;
}
