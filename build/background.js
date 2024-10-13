// background.js

// Function to check for new messages
function checkForMessages() {
  // Mock data simulating an API call
  const messages = [
    {
      id: "msg123",
      content: "Team meeting at 3 PM today 🙂",
      priority: "high",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "msg124",
      content: "Project update due tomorrow.",
      priority: "normal",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "msg125",
      content: "Don't forget the team lunch this Friday.",
      priority: "low",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ];

  // Store messages in Chrome storage
  chrome.storage.local.set({ messages }, () => {
    const unreadCount = messages.filter((msg) => !msg.read).length;
    if (unreadCount > 0) {
      // Update the badge text with the number of unread messages
      chrome.action.setBadgeText({ text: unreadCount.toString() });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
    } else {
      chrome.action.setBadgeText({ text: "" });
    }
  });
}

// Create an alarm to check for messages every minute
chrome.alarms.create("checkMessages", { periodInMinutes: 1 });

// Listener for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkMessages") {
    checkForMessages();
  }
});

// Initial check for messages on startup
checkForMessages();
