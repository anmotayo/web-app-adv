/** Angular Imports */
import { Directive, ElementRef, HostListener, OnDestroy, Renderer2 } from '@angular/core';

/** rxjs Imports */
import { Subscription } from 'rxjs';

/** Custom Services */
import { ProgressBarService } from 'app/core/progress-bar/progress-bar.service';

/**
 * Adds duplicate-click protection and visible pending feedback to action buttons.
 */
@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'button[mat-raised-button], button[mat-flat-button], button[mat-stroked-button], button[type="submit"], a[mat-raised-button], a[mat-flat-button], a[mat-stroked-button]'
})
export class PendingActionDirective implements OnDestroy {

  /** Minimum time to keep busy feedback visible once a request starts. */
  private readonly minimumBusyDisplayTime = 600;
  /** Time to suppress accidental duplicate clicks when no request follows. */
  private readonly clickGuardTime = 350;

  /** Whether this action is currently guarded. */
  private pending = false;
  /** Timestamp for when visible busy feedback started. */
  private busyStartedAt = 0;
  /** Progress event subscription for the guarded action. */
  private progressSubscription: Subscription | null = null;
  /** Pending timeout handle. */
  private releaseTimeout: any;
  /** Request detection timeout handle. */
  private detectTimeout: any;

  /**
   * @param {ElementRef<HTMLElement>} elementRef Button element reference.
   * @param {Renderer2} renderer Renderer service.
   * @param {ProgressBarService} progressBarService Global HTTP progress service.
   */
  constructor(private elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private progressBarService: ProgressBarService) { }

  /**
   * Guards a button after the first click, then ties visible feedback to pending HTTP requests.
   */
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    if (this.pending) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    if (this.shouldSkip()) {
      return;
    }

    const baselineRequests = this.progressBarService.getRequestsRunning();
    this.pending = true;
    this.setGuardedState(true);
    this.watchForProgress(baselineRequests);

    this.detectTimeout = setTimeout(() => {
      if (this.progressBarService.getRequestsRunning() > baselineRequests) {
        this.setBusyState(true);
        this.waitForIdle();
      } else {
        this.scheduleRelease(this.clickGuardTime);
      }
    });
  }

  /**
   * Blocks keyboard activation while the action is already pending.
   */
  @HostListener('keydown.enter', ['$event'])
  @HostListener('keydown.space', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.pending) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }

  /**
   * Cleans up listeners and pending timers.
   */
  ngOnDestroy(): void {
    this.clearPendingWork();
  }

  /**
   * Returns true when the element should not be guarded.
   */
  private shouldSkip(): boolean {
    const element = this.elementRef.nativeElement;
    return element.hasAttribute('disabled')
      || element.getAttribute('aria-disabled') === 'true'
      || element.hasAttribute('mifosxSkipPendingAction')
      || element.hasAttribute('mat-dialog-close')
      || element.hasAttribute('matStepperNext')
      || element.hasAttribute('matStepperPrevious')
      || element.hasAttribute('href');
  }

  /**
   * Watches the global progress service in case the request starts after this directive handles the click.
   */
  private watchForProgress(baselineRequests: number): void {
    this.progressSubscription = this.progressBarService.updateProgressBar.subscribe((mode: string) => {
      if (mode === 'indeterminate' && this.progressBarService.getRequestsRunning() > baselineRequests) {
        if (this.releaseTimeout) {
          clearTimeout(this.releaseTimeout);
          this.releaseTimeout = null;
        }
        this.setBusyState(true);
      }
      if (mode === 'none' && this.isBusy()) {
        this.releaseWhenMinimumDisplayTimeHasElapsed();
      }
    });
  }

  /**
   * Releases the button once all currently tracked HTTP requests are done.
   */
  private waitForIdle(): void {
    if (this.progressBarService.getRequestsRunning() === 0) {
      this.releaseWhenMinimumDisplayTimeHasElapsed();
    }
  }

  /**
   * Applies pointer protection without fighting component-owned disabled bindings.
   */
  private setGuardedState(guarded: boolean): void {
    const element = this.elementRef.nativeElement;
    if (guarded) {
      this.renderer.addClass(element, 'mifosx-click-guard');
      this.renderer.setAttribute(element, 'aria-disabled', 'true');
    } else {
      this.renderer.removeClass(element, 'mifosx-click-guard');
      this.renderer.removeAttribute(element, 'aria-disabled');
    }
  }

  /**
   * Applies visible busy feedback.
   */
  private setBusyState(busy: boolean): void {
    const element = this.elementRef.nativeElement;
    if (busy && !this.isBusy()) {
      this.busyStartedAt = Date.now();
      this.renderer.addClass(element, 'mifosx-action-pending');
      return;
    }
    if (!busy) {
      this.renderer.removeClass(element, 'mifosx-action-pending');
    }
  }

  /**
   * Returns true when visible busy feedback is active.
   */
  private isBusy(): boolean {
    return this.elementRef.nativeElement.classList.contains('mifosx-action-pending');
  }

  /**
   * Keeps the busy indicator visible long enough to be noticed.
   */
  private releaseWhenMinimumDisplayTimeHasElapsed(): void {
    const elapsedTime = Date.now() - this.busyStartedAt;
    const remainingTime = Math.max(this.minimumBusyDisplayTime - elapsedTime, 0);
    this.scheduleRelease(remainingTime);
  }

  /**
   * Schedules action release.
   */
  private scheduleRelease(delay: number): void {
    if (this.releaseTimeout) {
      clearTimeout(this.releaseTimeout);
    }
    this.releaseTimeout = setTimeout(() => this.release(), delay);
  }

  /**
   * Releases the guarded action.
   */
  private release(): void {
    this.pending = false;
    this.setGuardedState(false);
    this.setBusyState(false);
    this.clearPendingWork();
  }

  /**
   * Clears timers and subscriptions.
   */
  private clearPendingWork(): void {
    if (this.detectTimeout) {
      clearTimeout(this.detectTimeout);
      this.detectTimeout = null;
    }
    if (this.releaseTimeout) {
      clearTimeout(this.releaseTimeout);
      this.releaseTimeout = null;
    }
    if (this.progressSubscription) {
      this.progressSubscription.unsubscribe();
      this.progressSubscription = null;
    }
  }

}
