import { Pipe, PipeTransform } from '@angular/core';
import { Profile, ReTweety } from '@kitouch/shared-models';

@Pipe({
  pure: true,
  standalone: true,
  name: 'retweetWho',
})
export class RetweetWhoPipe implements PipeTransform {
  transform(
    currentProfileId: string | undefined,
    retweetProfile: Profile,
    tweetProfile: Profile | undefined
  ) {
    if (currentProfileId === retweetProfile.id) {
      return 'You';
    } else if (retweetProfile.id === tweetProfile?.id) {
      return retweetProfile.name;
      //   return `${retweetProfile.name} (Tweet owner)`;
    } else {
      return retweetProfile.name;
    }
  }
}

@Pipe({
  pure: true,
  standalone: true,
  name: 'retweetFromWhom',
})
export class RetweetFromWhomPipe implements PipeTransform {
  transform(
    currentProfileId: string | undefined,
    retweetProfile: Profile,
    tweetProfile: Profile | undefined
  ) {
    if (currentProfileId === tweetProfile?.id) {
      return 'your tweet';
    } else if (retweetProfile.id === tweetProfile?.id) {
      return 'own tweet';
    } else if (tweetProfile) {
      return `from ${tweetProfile.name}`;
    } else {
      return '';
    }
  }
}
