// Function to update the badge with duplicate count
function updateBadge() {
    chrome.tabs.query({}, (tabs) => {
        const tabUrls = {};
        let duplicateCount = 0;

        tabs.forEach((tab) => {
            const fullUrl = tab.url; // Use full URL for comparison

            if (tabUrls[fullUrl]) {
                duplicateCount++;
            } else {
                tabUrls[fullUrl] = true;
            }
        });

        // Update badge with duplicate count
        if (duplicateCount > 0) {
            chrome.action.setBadgeText({ text: duplicateCount.toString() });
            chrome.action.setBadgeBackgroundColor({ color: '#FF0000' }); // Red badge for visibility
            console.log('Duplicates found:', duplicateCount);
        } else {
            chrome.action.setBadgeText({ text: '' }); // Clear badge if no duplicates
            console.log('No duplicates found.');
        }
    });
}

// Function to highlight all instances of duplicate tabs
function highlightDuplicateTabs() {
    chrome.tabs.query({}, (tabs) => {
        const tabUrls = {};
        let duplicateIndices = [];

        tabs.forEach((tab, index) => {
            const fullUrl = tab.url; // Use full URL for comparison

            // If the URL has already been seen, highlight all instances
            if (tabUrls[fullUrl]) {
                // Add current tab's index and previously seen duplicate indices
                duplicateIndices.push(index);
                if (tabUrls[fullUrl].length === 1) {
                    duplicateIndices.push(tabUrls[fullUrl][0]); // Add first occurrence if not already added
                }
                tabUrls[fullUrl].push(index); // Track current tab's index for this URL
                console.log(`Duplicate found: ${fullUrl} (Tab ID: ${tab.id}, Index: ${index})`);
            } else {
                tabUrls[fullUrl] = [index]; // Store the index of the first occurrence
            }
        });

        // Highlight all duplicate tabs using their indices
        if (duplicateIndices.length > 0) {
            chrome.tabs.highlight({ tabs: duplicateIndices }, () => {
                console.log('All instances of duplicate tabs highlighted:', duplicateIndices);
            });
        }
    });
}

// Event listeners for real-time tab updates
chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        updateBadge();
    }
});

// Update badge when the extension is loaded or installed
chrome.runtime.onStartup.addListener(updateBadge);
chrome.runtime.onInstalled.addListener(updateBadge);

// Listen for the extension icon click to highlight all duplicate tabs
chrome.action.onClicked.addListener(highlightDuplicateTabs);
