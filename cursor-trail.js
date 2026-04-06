/**
 * DEEP STUDIO - Organic Cursor Trail
 * A subtle 2D canvas simulation of dragged paint/ink.
 */

class CursorTrail {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;

        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };
        this.velocity = 0;
        this.isActive = false;
        
        this.init();
        
        // Export to window for reset functionality
        window.cursorTrail = this;
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        window.addEventListener('mousemove', (e) => {
            this.isActive = true;
            this.lastMouse.x = this.mouse.x;
            this.lastMouse.y = this.mouse.y;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Calculate velocity for variable thickness
            const dx = this.mouse.x - this.lastMouse.x;
            const dy = this.mouse.y - this.lastMouse.y;
            this.velocity = Math.sqrt(dx * dx + dy * dy);
            
            this.drawTrail();
        });

        // Start the fade loop
        this.render();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    drawTrail() {
        if (!this.isActive) return;

        // Configuration for the "viscous ink" look
        const maxThickness = 16;
        const minThickness = 4;
        // Thicker when moving slower (pooling), thinner when fast (stretching)
        const thickness = Math.max(minThickness, maxThickness - (this.velocity * 0.4));
        
        // Random irregularity for "organic" edges
        const wiggle = (Math.random() - 0.5) * 2;
        
        this.ctx.beginPath();
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineWidth = thickness + wiggle;
        
        // Subtle grey-ish ink - increased opacity for better visibility
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        
        // Draw segment
        this.ctx.moveTo(this.lastMouse.x, this.lastMouse.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();

        // Extra "ink drop" highlights occasionally
        if (this.velocity < 5 && Math.random() > 0.8) {
            this.ctx.beginPath();
            const dropSize = Math.random() * 6 + 3;
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x + wiggle, this.mouse.y + wiggle, 0,
                this.mouse.x + wiggle, this.mouse.y + wiggle, dropSize
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.arc(this.mouse.x + wiggle, this.mouse.y + wiggle, dropSize, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    render() {
        // Fade effect: Use destination-out to gradually erase the canvas
        // This is better than drawing black because it preserves transparency
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Control fade speed here
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Reset composite operation for next draw
        this.ctx.globalCompositeOperation = 'source-over';
        
        requestAnimationFrame(() => this.render());
    }

    clear() {
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CursorTrail('cursor-trail-canvas');
});
