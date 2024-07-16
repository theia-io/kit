import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { profilePicture } from '@kitouch/features/kit/data';
import { Profile } from '@kitouch/shared/models';
import { FollowButtonComponent } from '@kitouch/ui/components';

@Component({
    standalone: true,
    selector: 'feat-follow-profile-card',
    templateUrl: './profile-card.component.html',
    imports: [
        CommonModule,
        //
        //
        FollowButtonComponent,
    ]
})
export class FeatFollowProfileCardComponent {
    profile = input.required<Profile>()
    followed = input<boolean>(false);

    @Output()
    followProfile = new EventEmitter<Profile>();

    @Output()
    stopFollowProfile = new EventEmitter<Profile>();

    profilePic = computed(() => profilePicture(this.profile()));
}