chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if( request.message === "friendly" ) {
        usabilityCheck();
    }
  }
);

function printElement(element) {
    var rect = element.getBoundingClientRect();

    console.log(element.tagName + " : " + element.classList);
    console.log("width: " + rect.width + " x: " + rect.left);
    console.log(element);
}

function backWalkForParentWithOverflow(element) {
    var parent = element.parentElement,
        computedStyle, overflow, overflowX, found = false;
    
    while(parent && !found) {
        computedStyle = window.getComputedStyle(parent),
        overflow = computedStyle.overflow;
        overflowX = computedStyle.overflowX;

        if(parent.tagName != 'HTML' && parent.tagName != 'BODY' && 
           (overflow.indexOf("hidden")>=0 || 
            overflow.indexOf("scroll")>=0 || 
            overflowX.indexOf("hidden")>=0 || 
            overflowX.indexOf("scroll")>=0))
            found = true;
        else
            parent = parent.parentElement;
    }

    return found;
}

function usabilityCheck() {
    var rootnode = document.querySelector('.mrf-column.mrf-current');
    var element, style, width, rect, hasParentWithScrollOrHidden, items = 0;
    var walker = document.createTreeWalker(rootnode, 1, null, false);
    var MAX_WIDTH = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);

    console.log("AMiGAble - Walking the tree...");

    while (walker.nextNode()) {
        element = walker.currentNode;
        style = window.getComputedStyle(element);

        if(style.getPropertyValue('visibility') != 'hidden') {
            width = style.getPropertyValue('width');
            rect = element.getBoundingClientRect();
            hasParentWithScrollOrHidden = backWalkForParentWithOverflow(element);

            if((element.offsetWidth > MAX_WIDTH || width > MAX_WIDTH || rect.width > MAX_WIDTH) && 
               !hasParentWithScrollOrHidden) {
                items++;
                console.log("xWIDTH: ");
                printElement(element);
            }

            if(((rect.left + rect.width > MAX_WIDTH) || (rect.left < 0)) && !hasParentWithScrollOrHidden) {
                items++;
                console.log("xPOSICION: ");
                printElement(element);
                console.log(style.getPropertyValue('transform'));
            }
        }
    }

    console.log("Found " + items + " items");
}