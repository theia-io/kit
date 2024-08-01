import {
  trigger,
  transition,
  style,
  animate,
  state,
} from '@angular/animations';

export const fadeInUpAnimation = trigger('fadeInUp', [
  state(
    'hidden',
    style({
      opacity: 0,
      transform: 'translateY(20px)',
      display: 'none', // Hide the element initially
    })
  ),
  state(
    'shown',
    style({
      opacity: 1,
      transform: 'translateY(0)',
    })
  ),
  transition('hidden => shown', [
    // Transition from hidden to visible
    style({ display: 'block' }), // Display the element before the animation starts
    animate('1s ease-out'), // 1 second animation with ease-out timing
  ]),
]);
