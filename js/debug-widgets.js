// Debug helper for floating widgets
function debugFloatingWidgets() {
    console.log('[DEBUG] Floating Widgets Status:');
    console.log('Widget Manager:', window.widgetManager);
    console.log('Available elements:');
    console.log('- aiChatContainer:', document.getElementById('aiChatContainer'));
    console.log('- portfolioBridge:', document.getElementById('portfolioBridge'));
    
    // Try manual initialization
    if (window.initWidgetManager) {
        console.log('Triggering manual initialization...');
        window.initWidgetManager();
    }
    
    // Check if widgets are floating
    const floatingWidgets = document.querySelectorAll('.floating-widget');
    console.log('Floating widgets found:', floatingWidgets.length);
    floatingWidgets.forEach((widget, index) => {
        console.log(`Widget ${index + 1}:`, widget);
    });
}

// Add debug function to global scope
window.debugFloatingWidgets = debugFloatingWidgets;

// Auto-debug after 3 seconds
setTimeout(debugFloatingWidgets, 3000);
