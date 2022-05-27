# Relevant Bookmarks

A [Chrome extension](https://chrome.google.com/webstore/detail/relevant-bookmarks/jjdfcopklimoeoneklaopogaghhhlmed) that gives you a list of relevant bookmarks specific to the URL you are in. This extension works on any website and uses the list of bookmarks you already have in your browser and thus does not save any data. Relevant bookmarks are generated in runtime.

### Run locally

- Clone this repo
- [Load unpacked extension](https://developer.chrome.com/extensions/getstarted) in chrome

### Use cases

- You are on a github issues page for a project - you can see all the relevant issues you have bookmarked.
- You are on profile of a Medium user - you can see all the relavent articles by that user.
- You are on stackoverflow - you can see all the relavent questions you had bookmarked.
- [Youtube](https://youtube.com) videos, [dev.to](https://dev.to) articles etc.

### Permissions required

As mentioned in the [manifest.json](https://github.com/kunalpanchal/relevant-bookmarks/blob/main/manifest.json) this extensions requires the following permissions:
- bookmarks
- tabs
- storage

### Settings availble

- Change font size
- Show URLs for Bookmarks
- Maximum bookmarks to show.


Visit [Chrome WebStore](https://chrome.google.com/webstore/detail/relevant-bookmarks/jjdfcopklimoeoneklaopogaghhhlmed) to downlaod this extension. To know more about how the bookmarks are categorized as relevant, read the [main logic](https://github.com/kunalpanchal/relevant-bookmarks/blob/main/src/browser_action/browser_action.js#L72-L101) for this extension.
