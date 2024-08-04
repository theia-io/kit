import { KIT_ENVS } from '@kitouch/ui-shared';
import { NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { environment } from '../environments/environment';

export const cookieConfig: NgcCookieConsentConfig = {
  cookie: {
    domain:
      environment.environment !== KIT_ENVS.localhost
        ? window.location.origin
        : 'localhost',
  },
  position: 'bottom',
  theme: 'edgeless',
  palette: {
    popup: {
      background: '#000000',
      text: '#ffffff',
      link: '#ffffff',
    },
    button: {
      background: '#f1d600',
      text: '#000000',
      border: 'transparent',
    },
  },
  type: 'info',
  content: {
    message:
      'We at Kitouch use cookies to ensure you get the best experience on our website.',
    dismiss: 'sure',
    deny: 'Refuse cookies',
    link: 'check it out',
    href: `${window.location.origin}/cookie`,
    policy: 'Cookie Policy',
  },
};
