document.addEventListener('DOMContentLoaded', function () {
    // Get the resizer element and the sidebar
    const resizer = document.getElementById('dragMe');
    const sidebar = document.getElementById('sidebar');

    // This function will be called when the mouse is moved
    const mouseMoveHandler = function (e) {
        // Calculate the new width based on the mouse's horizontal position
        const newWidth = e.clientX - sidebar.getBoundingClientRect().left;
        sidebar.style.width = `${newWidth}px`;
    };

    // This function will be called when the mouse button is released
    const mouseUpHandler = function () {
        // Stop listening for mouse movement
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // This function is called when the user first clicks on the resizer
    const mouseDownHandler = function () {
        // Start listening for mouse movement and release
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    // Attach the mousedown event listener to the resizer
    resizer.addEventListener('mousedown', mouseDownHandler);
});