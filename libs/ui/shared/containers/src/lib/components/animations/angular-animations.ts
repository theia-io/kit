import {
  animate,
  group,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const slideInOutAnimation = [
  trigger('slideInOut', [
    state(
      'in',
      style({
        transform: 'translateY(-32px)',
      })
    ),
    state(
      'out',
      style({
        transform: 'translateY(0)',
      })
    ),
    transition('in => out', [
      group([
        animate(
          '2.5s ease-in-out'
          //   style({
          //     transform: 'translateY(-34px)',
          //   })
        ),
      ]),
    ]),
    transition('out => in', [
      group([
        animate(
          '2.5s ease-in-out'
          //   style({
          //     transform: 'translateY(0)',
          //   })
        ),
      ]),
    ]),
  ]),
];
