// UI Elements
const app = document.getElementById('main-relevant-bookmarks-app')
const checkboxShowUrls = document.getElementById('checkbox-show-urls')
const increaseFontSize = document.getElementById('increase-font-size')
const decreaseFontSize = document.getElementById('decrease-font-size')
const selectBoxMaxBms = document.getElementById('selectbox-max-bms')

const fontSizes = [12, 14, 16, 20, 24, 30];
let settingsFontSize = 1;
let settingsShowURLs = false;
let settingsMaxBms = 10;
let currentURL, bookmarks;

// UI Updaters
const updateFontSize = () => app.style.fontSize = `${fontSizes[settingsFontSize]}px`
const updateBookmarksUI = () => {
  app.innerHTML = ''
  if (!bookmarks || !bookmarks.length)
    app.innerHTML = 'No relevant bookmarks for this page yet. Add more bookmarks to get relevant suggestions. <a href="https://support.google.com/chrome/answer/188842" target="_blank">Learn how to bookmark a page.</a>'
  bookmarks.map(bm => {
    app.innerHTML += `<a class="bookmark" href=${bm.url} target="_blank">${settingsShowURLs ? bm.url : bm.title}</a>`
  })
}

const createBookmark = () => {
  browser.bookmarks.create({
    title: "bookmarks.create() on MDN",
    url: "https://developer.mozilla.org/Add-ons/WebExtensions/API/bookmarks/create"
  });

}
// First Load
chrome.storage.sync.get(["settingsFontSize", "settingsShowURLs", "settingsMaxBms"], function (item) {
  console.log("item", item)
  if (item.settingsFontSize) settingsFontSize = item.settingsFontSize
  if (item.settingsShowURLs) settingsShowURLs = item.settingsShowURLs
  if (item.settingsMaxBms != undefined) {
    settingsMaxBms = item.settingsMaxBms;
  }
  main()
  updateFontSize()
  checkboxShowUrls.checked = settingsShowURLs
  selectBoxMaxBms.value = settingsMaxBms
});


// UI Event listeners
checkboxShowUrls.addEventListener('change', (event) => {
  settingsShowURLs = event.target.checked
  chrome.storage.sync.set({ settingsShowURLs }, updateBookmarksUI);
})

increaseFontSize.addEventListener('click', () => {
  if (settingsFontSize !== settingsFontSize.length)
    settingsFontSize++;
  chrome.storage.sync.set({ settingsFontSize }, updateFontSize);
})

decreaseFontSize.addEventListener('click', () => {
  if (settingsFontSize !== 0)
    settingsFontSize--;
  chrome.storage.sync.set({ settingsFontSize }, updateFontSize);
})

selectBoxMaxBms.addEventListener('change', (event) => {
  settingsMaxBms = parseInt(event.target.value)
  settingsMaxBms = isNaN(settingsMaxBms) ? 0 : settingsMaxBms
  chrome.storage.sync.set({ settingsMaxBms }, main);
})

// Bookmarks Generation logic
const generateRelevantBms = (currentURL, bms) => {
  const eligibleURLS = []
  for (let a = 0; a < bms.length; a++) {
    if (bms[a].url.startsWith(currentURL.protocol + '//' + currentURL.host)) {
      eligibleURLS.push(bms.splice(a, 1)[0]);
      a--;
    }
  }

  const pathNameLength = currentURL.pathname.split('/').length;

  const eligibleSortedURLS = []
  for (let a = 0; a < pathNameLength; a++) {
    for (let b = 0; b < eligibleURLS.length; b++) {
      let eligibleURLPathname = new URL(eligibleURLS[b].url).pathname

      let matcher = currentURL.pathname.split('/');
      matcher.splice(-a, a)
      matcher = matcher.toString().replace(/,/g, '/')
      if (matcher && eligibleURLPathname.includes(matcher)) {
        eligibleSortedURLS.push(eligibleURLS.splice(b, 1)[0]);
        b--
      }
    }
  }
  bookmarks = eligibleSortedURLS
  if (settingsMaxBms)
    bookmarks = bookmarks.splice(0, settingsMaxBms)
  updateBookmarksUI()
}

const bookmarkSearch = () => {
  chrome.bookmarks.search(currentURL.host, bms => generateRelevantBms(currentURL, bms))
}

const main = () => {
  if (currentURL) bookmarkSearch()
  else
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      currentURL = new URL(tabs[0].url);
      bookmarkSearch()
    });
}
