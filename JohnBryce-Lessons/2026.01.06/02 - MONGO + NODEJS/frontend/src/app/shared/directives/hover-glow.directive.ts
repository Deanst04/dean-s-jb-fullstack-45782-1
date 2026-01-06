import { Directive, ElementRef, HostListener, Input, Renderer2, OnInit } from '@angular/core';

type GlowColor = 'primary' | 'accent' | 'white';

@Directive({
  selector: '[appHoverGlow]',
  standalone: true
})
export class HoverGlowDirective implements OnInit {
  @Input() glowColor: GlowColor = 'primary';
  @Input() glowIntensity: 'low' | 'medium' | 'high' = 'medium';

  private readonly colors: Record<GlowColor, string> = {
    primary: '14, 165, 233',
    accent: '217, 70, 239',
    white: '255, 255, 255',
  };

  private readonly intensities: Record<string, { blur: number; spread: number; opacity: number }> = {
    low: { blur: 10, spread: 5, opacity: 0.3 },
    medium: { blur: 20, spread: 10, opacity: 0.5 },
    high: { blur: 30, spread: 15, opacity: 0.7 },
  };

  constructor(
    private readonly el: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'box-shadow 0.3s ease-out, transform 0.3s ease-out');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const color = this.colors[this.glowColor];
    const intensity = this.intensities[this.glowIntensity];

    const glowShadow = `0 0 ${intensity.blur}px rgba(${color}, ${intensity.opacity}), 0 0 ${intensity.spread}px rgba(${color}, ${intensity.opacity * 0.5})`;

    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', glowShadow);
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.02)');
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
  }

  @HostListener('focus')
  onFocus(): void {
    this.onMouseEnter();
  }

  @HostListener('blur')
  onBlur(): void {
    this.onMouseLeave();
  }
}
