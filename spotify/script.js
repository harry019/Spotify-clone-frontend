// Select the elements
const rightContent = document.querySelector('.right');
const customScrollbar = document.createElement('div');
const customThumb = document.createElement('div');

// Set up custom scrollbar
customScrollbar.classList.add('custom-scrollbar');
customThumb.classList.add('custom-thumb');

// Append custom scrollbar and thumb to the right section
rightContent.appendChild(customScrollbar);
customScrollbar.appendChild(customThumb);

// Update thumb size and position
function updateThumbSize() {
    const contentHeight = rightContent.scrollHeight;
    const containerHeight = rightContent.clientHeight;
    const thumbHeight = (containerHeight / contentHeight) * containerHeight;
    customThumb.style.height = `${thumbHeight}px`;
}

// Sync thumb position with scroll
function syncThumbPosition() {
    const scrollTop = rightContent.scrollTop;
    const maxScrollTop = rightContent.scrollHeight - rightContent.clientHeight;
    const maxThumbTop = customScrollbar.offsetHeight - customThumb.offsetHeight;
    const thumbTop = (scrollTop / maxScrollTop) * maxThumbTop;
    customThumb.style.top = `${thumbTop}px`;
}

// Handle dragging the thumb
let isDragging = false;
let startY, startThumbTop;

customThumb.addEventListener('mousedown', (e) => {
    isDragging = true;
    startY = e.clientY;
    startThumbTop = parseInt(window.getComputedStyle(customThumb).top, 10);
    document.body.style.userSelect = 'none'; // Prevent text selection
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaY = e.clientY - startY;
    const maxThumbTop = customScrollbar.offsetHeight - customThumb.offsetHeight;
    const newThumbTop = Math.min(Math.max(startThumbTop + deltaY, 0), maxThumbTop);

    customThumb.style.top = `${newThumbTop}px`;

    // Sync content scroll with thumb position
    const maxScrollTop = rightContent.scrollHeight - rightContent.clientHeight;
    rightContent.scrollTop = (newThumbTop / maxThumbTop) * maxScrollTop;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.userSelect = ''; // Re-enable text selection
});

// Update thumb size and position on scroll and resize
rightContent.addEventListener('scroll', syncThumbPosition);
window.addEventListener('load', updateThumbSize);
window.addEventListener('resize', updateThumbSize);
